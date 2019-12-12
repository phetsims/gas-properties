// Copyright 2019, University of Colorado Boulder

/**
 * EnergyAccordionBox is the base class for the 'Speed' and 'Kinetic Energy' accordion boxes in the 'Energy' screen.
 * These accordion boxes are identical, except for their title and HistogramNode.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const AccordionBox = require( 'SUN/AccordionBox' );
  const FixedWidthNode = require( 'GAS_PROPERTIES/common/view/FixedWidthNode' );
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const GasPropertiesColorProfile = require( 'GAS_PROPERTIES/common/GasPropertiesColorProfile' );
  const GasPropertiesConstants = require( 'GAS_PROPERTIES/common/GasPropertiesConstants' );
  const HBox = require( 'SCENERY/nodes/HBox' );
  const HeavyParticlesCheckbox = require( 'GAS_PROPERTIES/energy/view/HeavyParticlesCheckbox' );
  const HistogramNode = require( 'GAS_PROPERTIES/energy/view/HistogramNode' );
  const LightParticlesCheckbox = require( 'GAS_PROPERTIES/energy/view/LightParticlesCheckbox' );
  const merge = require( 'PHET_CORE/merge' );
  const ModelViewTransform2 = require( 'PHETCOMMON/view/ModelViewTransform2' );
  const Tandem = require( 'TANDEM/Tandem' );
  const Text = require( 'SCENERY/nodes/Text' );
  const VBox = require( 'SCENERY/nodes/VBox' );

  class EnergyAccordionBox extends AccordionBox {

    /**
     * @param {string} titleString
     * @param {ModelViewTransform2} modelViewTransform
     * @param {HistogramNode} histogramNode
     * @param {Object} [options]
     */
    constructor( titleString, modelViewTransform, histogramNode, options ) {
      assert && assert( typeof titleString === 'string', `invalid titleString: ${titleString}` );
      assert && assert( modelViewTransform instanceof ModelViewTransform2, `invalid modelViewTransform: ${modelViewTransform}` );
      assert && assert( histogramNode instanceof HistogramNode, `invalid model: ${histogramNode}` );

      options = merge( {
        fixedWidth: 100,
        contentXMargin: 0
      }, GasPropertiesConstants.ACCORDION_BOX_OPTIONS, {

        // superclass options
        contentYSpacing: 0,
        titleNode: new Text( titleString, {
          font: GasPropertiesConstants.TITLE_FONT,
          fill: GasPropertiesColorProfile.textFillProperty
        } ),

        // phet-io
        tandem: Tandem.REQUIRED

      }, options );

      // Limit width of title, multiplier determined empirically
      options.titleNode.maxWidth = 0.75 * options.fixedWidth;

      // Checkboxes
      const checkboxes = new HBox( {
        children: [
          new HeavyParticlesCheckbox( histogramNode.heavyPlotVisibleProperty, modelViewTransform, {
            tandem: options.tandem.createTandem( 'heavyParticlesCheckbox' )
          } ),
          new LightParticlesCheckbox( histogramNode.lightPlotVisibleProperty, modelViewTransform, {
            tandem: options.tandem.createTandem( 'lightParticlesCheckbox' )
          } )
        ],
        align: 'center',
        spacing: 25
      } );

      const contentWidth = options.fixedWidth - ( 2 * options.contentXMargin );

      // Checkboxes centered below histogram
      const content = new FixedWidthNode( contentWidth, new VBox( {
        align: 'center',
        spacing: 10,
        children: [ histogramNode, checkboxes ]
      } ) );

      super( content, options );

      // Disable updates of the histogram when the accordion box is collapsed.
      this.expandedProperty.link( expanded => {
        histogramNode.updateEnabledProperty.value = expanded;
      } );

      // @private
      this.histogramNode = histogramNode;
    }

    // @public
    reset() {
      this.histogramNode.reset();
    }
  }

  return gasProperties.register( 'EnergyAccordionBox', EnergyAccordionBox );
} );