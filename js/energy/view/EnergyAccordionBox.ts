// Copyright 2019-2025, University of Colorado Boulder

/**
 * EnergyAccordionBox is the base class for the 'Speed' and 'Kinetic Energy' accordion boxes in the 'Energy' screen.
 * These accordion boxes are identical, except for their title and HistogramNode.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';
import { EmptySelfOptions, optionize4 } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import PlusMinusZoomButtonGroup from '../../../../scenery-phet/js/PlusMinusZoomButtonGroup.js';
import HBox from '../../../../scenery/js/layout/nodes/HBox.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import AccordionBox, { AccordionBoxOptions } from '../../../../sun/js/AccordionBox.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import GasPropertiesColors from '../../common/GasPropertiesColors.js';
import GasPropertiesConstants from '../../common/GasPropertiesConstants.js';
import gasProperties from '../../gasProperties.js';
import HistogramNode from './HistogramNode.js';
import SpeciesHistogramCheckbox from './SpeciesHistogramCheckbox.js';

type SelfOptions = EmptySelfOptions;

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

        // AccordionBoxOptions
        isDisposable: false,
        contentXMargin: 5,
        contentYSpacing: 0,
        titleNode: new Text( titleStringProperty, {
          font: GasPropertiesConstants.TITLE_FONT,
          fill: GasPropertiesColors.textFillProperty,
          maxWidth: 170
        } )
      }, providedOptions );

    const histogramNode = createHistogramNode( options.tandem.createTandem( 'histogramNode' ) );

    const zoomButtonGroup = new PlusMinusZoomButtonGroup( yMaxProperty, {
      orientation: 'vertical',
      scale: 0.65,
      right: histogramNode.x - 5, // relative to the left edge of histogramNode's ChartRectangle
      top: histogramNode.bottom - 12,
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
      tandem: options.tandem.createTandem( 'zoomButtonGroup' )
    } );

    // Checkboxes
    const checkboxGroupTandem = options.tandem.createTandem( 'checkboxGroup' );
    const checkboxGroup = new HBox( {
      children: [
        SpeciesHistogramCheckbox.createHeavyParticlesCheckbox( histogramNode.heavyPlotVisibleProperty, modelViewTransform, {
          tandem: checkboxGroupTandem.createTandem( 'heavyParticlesCheckbox' )
        } ),
        SpeciesHistogramCheckbox.createLightParticlesCheckbox( histogramNode.lightPlotVisibleProperty, modelViewTransform, {
          tandem: checkboxGroupTandem.createTandem( 'lightParticlesCheckbox' )
        } )
      ],
      align: 'center',
      spacing: 25,
      right: histogramNode.right,
      bottom: zoomButtonGroup.bottom,
      tandem: checkboxGroupTandem,
      visiblePropertyOptions: {
        phetioFeatured: true // see https://github.com/phetsims/gas-properties/issues/254
      }
    } );

    const content = new Node( {
      excludeInvisibleChildrenFromBounds: true,
      children: [ histogramNode, zoomButtonGroup, checkboxGroup ]
    } );

    super( content, options );

    this.histogramNode = histogramNode;
  }

  public override reset(): void {
    super.reset();
    this.histogramNode.reset();
  }
}

gasProperties.register( 'EnergyAccordionBox', EnergyAccordionBox );