// Copyright 2019, University of Colorado Boulder

/**
 * SpeedAccordionBox contains the speed histogram and related controls.
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
  const GasPropertiesQueryParameters = require( 'GAS_PROPERTIES/common/GasPropertiesQueryParameters' );
  const HeavyParticlesCheckbox = require( 'GAS_PROPERTIES/energy/view/HeavyParticlesCheckbox' );
  const HBox = require( 'SCENERY/nodes/HBox' );
  const LightParticlesCheckbox = require( 'GAS_PROPERTIES/energy/view/LightParticlesCheckbox' );
  const SpeedHistogram = require( 'GAS_PROPERTIES/energy/view/SpeedHistogram' );
  const Text = require( 'SCENERY/nodes/Text' );
  const VBox = require( 'SCENERY/nodes/VBox' );

  // strings
  const speedString = require( 'string!GAS_PROPERTIES/speed' );

  class SpeedAccordionBox extends AccordionBox {

    /**
     * @param {EnergyModel} model
     * @param {Object} [options]
     */
    constructor( model, options ) {

      options = _.extend( {

        fixedWidth: 100,

        // AccordionBox options
        buttonXMargin: 0,
        titleXSpacing: 0,
        contentXMargin: 0,
        contentYSpacing: 0,
        titleNode: new Text( speedString, {
          font: GasPropertiesConstants.TITLE_FONT,
          fill: GasPropertiesColorProfile.textFillProperty
        } )

      }, GasPropertiesConstants.ACCORDION_BOX_OPTIONS, options );

      // Limit width of title
      options.titleNode.maxWidth = options.fixedWidth - options.buttonXMargin - options.titleXSpacing;

      //TODO should these Properties live somewhere else?
      // @private
      const heavyVisibleProperty = new BooleanProperty( GasPropertiesQueryParameters.checked );
      const lightVisibleProperty = new BooleanProperty( GasPropertiesQueryParameters.checked );

      const histogram = new SpeedHistogram( model, heavyVisibleProperty, lightVisibleProperty );

      // Checkboxes
      const checkboxes = new HBox( {
        children: [
          new HeavyParticlesCheckbox( heavyVisibleProperty, model.modelViewTransform ),
          new LightParticlesCheckbox( lightVisibleProperty, model.modelViewTransform )
        ],
        align: 'center',
        spacing: 25
      } );

      // Checkboxes centered below histogram
      const vBox = new VBox( {
        align: 'center',
        spacing: 10,
        children: [ histogram, checkboxes ]
      } );

      const content = new FixedWidthNode( vBox, {
        fixedWidth: options.fixedWidth - ( 2 * options.contentXMargin )
      } );

      super( content, options );

      // @private
      this.histogram = histogram;
      this.heavyVisibleProperty = heavyVisibleProperty;
      this.lightVisibleProperty = lightVisibleProperty;
    }

    // @public
    reset() {
      this.heavyVisibleProperty.reset();
      this.lightVisibleProperty.reset();
    }

    /**
     * Steps the histogram.
     * @param {number} dt - time delta, in ps
     */
    step( dt ) {
      if ( this.expandedProperty.value ) {
        this.histogram.step( dt );
      }
    }
  }

  return gasProperties.register( 'SpeedAccordionBox', SpeedAccordionBox );
} );