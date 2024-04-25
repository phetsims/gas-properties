// Copyright 2019-2023, University of Colorado Boulder

/**
 * EnergyAccordionBox is the base class for the 'Speed' and 'Kinetic Energy' accordion boxes in the 'Energy' screen.
 * These accordion boxes are identical, except for their title and HistogramNode.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import { optionize4 } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import { HBox, Node, Text } from '../../../../scenery/js/imports.js';
import AccordionBox, { AccordionBoxOptions } from '../../../../sun/js/AccordionBox.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import GasPropertiesColors from '../../common/GasPropertiesColors.js';
import GasPropertiesConstants from '../../common/GasPropertiesConstants.js';
import gasProperties from '../../gasProperties.js';
import HistogramNode from './HistogramNode.js';
import SpeciesHistogramCheckbox from './SpeciesHistogramCheckbox.js';
import PlusMinusZoomButtonGroup from '../../../../scenery-phet/js/PlusMinusZoomButtonGroup.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';

type SelfOptions = {
  fixedWidth?: number;
};

export type EnergyAccordionBoxOptions = SelfOptions & PickRequired<AccordionBoxOptions, 'expandedProperty' | 'tandem'>;

export default class EnergyAccordionBox extends AccordionBox {

  private readonly histogramNode: HistogramNode;

  protected constructor( titleStringProperty: TReadOnlyProperty<string>,
                         modelViewTransform: ModelViewTransform2,
                         yMaxProperty: NumberProperty,
                         createHistogramNode: ( tandem: Tandem ) => HistogramNode,
                         providedOptions: EnergyAccordionBoxOptions ) {

    const options = optionize4<EnergyAccordionBoxOptions, SelfOptions, AccordionBoxOptions>()(
      {}, GasPropertiesConstants.ACCORDION_BOX_OPTIONS, {

        // SelfOptions
        fixedWidth: 100,

        // AccordionBoxOptions
        isDisposable: false,
        contentXMargin: GasPropertiesConstants.ACCORDION_BOX_OPTIONS.contentXMargin,
        contentYSpacing: 0,
        titleNode: new Text( titleStringProperty, {
          font: GasPropertiesConstants.TITLE_FONT,
          fill: GasPropertiesColors.textFillProperty
        } )
      }, providedOptions );

    // Limit width of title, multiplier determined empirically
    options.titleNode.maxWidth = 0.75 * options.fixedWidth;

    const histogramNode = createHistogramNode( options.tandem.createTandem( 'histogramNode' ) );

    const zoomButtonGroup = new PlusMinusZoomButtonGroup( yMaxProperty, {
      orientation: 'vertical',
      scale: 0.65,
      left: histogramNode.left,
      top: histogramNode.bottom - 5,
      touchAreaXDilation: 10,
      touchAreaYDilation: 10,
      iconOptions: {
        size: new Dimension2( 20, 3 )
      },
      buttonOptions: {
        baseColor: 'white',
        xMargin: 6,
        yMargin: 6
      },
      //TODO https://github.com/phetsims/gas-properties/issues/210 magic numbers
      applyZoomIn: yMax => yMax + ( yMax >= 200 ? 200 : 50 ),
      applyZoomOut: yMax => yMax - ( yMax > 200 ? 200 : 50 )
    } );

    // Checkboxes
    const checkboxes = new HBox( {
      children: [
        SpeciesHistogramCheckbox.createHeavyParticlesCheckbox( histogramNode.heavyPlotVisibleProperty, modelViewTransform, {
          tandem: options.tandem.createTandem( 'heavyParticlesCheckbox' )
        } ),
        SpeciesHistogramCheckbox.createLightParticlesCheckbox( histogramNode.lightPlotVisibleProperty, modelViewTransform, {
          tandem: options.tandem.createTandem( 'lightParticlesCheckbox' )
        } )
      ],
      align: 'center',
      spacing: 25,
      right: histogramNode.right,
      bottom: zoomButtonGroup.bottom
    } );

    //TODO https://github.com/phetsims/gas-properties/issues/210 content shifts around as yMax tick label changes.
    //TODO https://github.com/phetsims/gas-properties/issues/210 Kinetic Energy accordion box is outside layoutBounds.
    const content = new Node( {
      children: [ histogramNode, zoomButtonGroup, checkboxes ]
    } );

    super( content, options );

    this.histogramNode = histogramNode;

    // Disable updates of the histogram when the accordion box is collapsed.
    this.expandedProperty.link( expanded => {
      histogramNode.updateEnabledProperty.value = expanded;
    } );
  }

  public override reset(): void {
    this.histogramNode.reset();
    super.reset();
  }
}

gasProperties.register( 'EnergyAccordionBox', EnergyAccordionBox );