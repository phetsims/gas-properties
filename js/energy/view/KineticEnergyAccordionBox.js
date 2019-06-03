// Copyright 2019, University of Colorado Boulder

/**
 * KineticEnergyAccordionBox contains the kinetic energy histogram and related controls.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const AccordionBox = require( 'SUN/AccordionBox' );
  const BooleanProperty = require( 'AXON/BooleanProperty' );
  const FixedWidthNode = require( 'GAS_PROPERTIES/common/view/FixedWidthNode' );
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const GasPropertiesColorProfile = require( 'GAS_PROPERTIES/common/GasPropertiesColorProfile' );
  const GasPropertiesConstants = require( 'GAS_PROPERTIES/common/GasPropertiesConstants' );
  const HeavyParticlesCheckbox = require( 'GAS_PROPERTIES/energy/view/HeavyParticlesCheckbox' );
  const HBox = require( 'SCENERY/nodes/HBox' );
  const HistogramsModel = require( 'GAS_PROPERTIES/energy/model/HistogramsModel' );
  const LightParticlesCheckbox = require( 'GAS_PROPERTIES/energy/view/LightParticlesCheckbox' );
  const ModelViewTransform2 = require( 'PHETCOMMON/view/ModelViewTransform2' );
  const KineticEnergyHistogramNode = require( 'GAS_PROPERTIES/energy/view/KineticEnergyHistogramNode' );
  const Text = require( 'SCENERY/nodes/Text' );
  const VBox = require( 'SCENERY/nodes/VBox' );

  // strings
  const kineticEnergyString = require( 'string!GAS_PROPERTIES/kineticEnergy' );

  class KineticEnergyAccordionBox extends AccordionBox {

    /**
     * @param {HistogramsModel} histogramsModel
     * @param {ModelViewTransform2} modelViewTransform
     * @param {Object} [options]
     */
    constructor( histogramsModel, modelViewTransform, options ) {
      assert && assert( histogramsModel instanceof HistogramsModel, `invalid model: ${histogramsModel}` );
      assert && assert( modelViewTransform instanceof ModelViewTransform2, `invalid modelViewTransform: ${modelViewTransform}` );

      options = _.extend( {
        fixedWidth: 100,
        contentXMargin: 0
      }, GasPropertiesConstants.ACCORDION_BOX_OPTIONS, {

        // AccordionBox options
        contentYSpacing: 0,
        titleNode: new Text( kineticEnergyString, {
          font: GasPropertiesConstants.TITLE_FONT,
          fill: GasPropertiesColorProfile.textFillProperty
        } )

      }, options );

      // Limit width of title, multiplier determined empirically
      options.titleNode.maxWidth = 0.75 * options.fixedWidth;

      // Visibility of species-specific histograms
      const heavyVisibleProperty = new BooleanProperty( false );
      const lightVisibleProperty = new BooleanProperty( false );

      const histogramNode =
        new KineticEnergyHistogramNode( histogramsModel, heavyVisibleProperty, lightVisibleProperty );

      // Checkboxes
      const checkboxes = new HBox( {
        children: [
          new HeavyParticlesCheckbox( heavyVisibleProperty, modelViewTransform ),
          new LightParticlesCheckbox( lightVisibleProperty, modelViewTransform )
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

      // @private
      this.heavyVisibleProperty = heavyVisibleProperty;
      this.lightVisibleProperty = lightVisibleProperty;
    }

    // @public
    reset() {
      this.heavyVisibleProperty.reset();
      this.lightVisibleProperty.reset();
    }
  }

  return gasProperties.register( 'KineticEnergyAccordionBox', KineticEnergyAccordionBox );
} );