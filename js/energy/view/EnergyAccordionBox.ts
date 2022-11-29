// Copyright 2019-2022, University of Colorado Boulder

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
import { HBox, Text, VBox } from '../../../../scenery/js/imports.js';
import AccordionBox, { AccordionBoxOptions } from '../../../../sun/js/AccordionBox.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import GasPropertiesColors from '../../common/GasPropertiesColors.js';
import GasPropertiesConstants from '../../common/GasPropertiesConstants.js';
import gasProperties from '../../gasProperties.js';
import HistogramNode from './HistogramNode.js';
import SpeciesHistogramCheckbox from './SpeciesHistogramCheckbox.js';

type SelfOptions = {
  fixedWidth?: number;
};

export type EnergyAccordionBoxOptions = SelfOptions & PickRequired<AccordionBoxOptions, 'expandedProperty' | 'tandem'>;

export default class EnergyAccordionBox extends AccordionBox {

  private readonly histogramNode: HistogramNode;

  protected constructor( titleStringProperty: TReadOnlyProperty<string>,
                         modelViewTransform: ModelViewTransform2,
                         createHistogramNode: ( tandem: Tandem ) => HistogramNode,
                         providedOptions: EnergyAccordionBoxOptions ) {

    const options = optionize4<EnergyAccordionBoxOptions, SelfOptions, AccordionBoxOptions>()(
      {}, GasPropertiesConstants.ACCORDION_BOX_OPTIONS, {

        // SelfOptions
        fixedWidth: 100,

        // AccordionBoxOptions
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
      spacing: 25
    } );

    const contentWidth = options.fixedWidth - ( 2 * options.contentXMargin );

    // Checkboxes centered below histogram
    const content = new VBox( {
      preferredWidth: contentWidth,
      widthSizable: false, // so that width will remain preferredWidth
      align: 'center',
      spacing: 10,
      children: [ histogramNode, checkboxes ]
    } );

    super( content, options );

    this.histogramNode = histogramNode;

    // Disable updates of the histogram when the accordion box is collapsed.
    this.expandedProperty.link( expanded => {
      histogramNode.updateEnabledProperty.value = expanded;
    } );
  }

  public override dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }

  public override reset(): void {
    this.histogramNode.reset();
    super.reset();
  }
}

gasProperties.register( 'EnergyAccordionBox', EnergyAccordionBox );