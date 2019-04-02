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
  const GasPropertiesCheckbox = require( 'GAS_PROPERTIES/common/view/GasPropertiesCheckbox' );
  const GasPropertiesColorProfile = require( 'GAS_PROPERTIES/common/GasPropertiesColorProfile' );
  const GasPropertiesConstants = require( 'GAS_PROPERTIES/common/GasPropertiesConstants' );
  const GasPropertiesIconFactory = require( 'GAS_PROPERTIES/common/view/GasPropertiesIconFactory' );
  const GasPropertiesQueryParameters = require( 'GAS_PROPERTIES/common/GasPropertiesQueryParameters' );
  const HBox = require( 'SCENERY/nodes/HBox' );
  const SpeedHistogram = require( 'GAS_PROPERTIES/energy/view/SpeedHistogram' );
  const Text = require( 'SCENERY/nodes/Text' );
  const VBox = require( 'SCENERY/nodes/VBox' );

  // strings
  const speedString = require( 'string!GAS_PROPERTIES/speed' );

  class SpeedAccordionBox extends AccordionBox {

    /**
     * @param {IdealModel} model
     * @param {Object} [options]
     */
    constructor( model, options ) {

      options = _.extend( {

        fixedWidth: 100,

        // AccordionBox options
        buttonXMargin: 0,
        titleXSpacing: 0,
        contentXMargin: 0,
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

      const iconOptions = {
        align: 'center',
        spacing: 5
      };

      // Heavy particles checkbox
      const heavyCheckbox = new GasPropertiesCheckbox( heavyVisibleProperty, {
        icon: new HBox( _.extend( {
          children: [
            GasPropertiesIconFactory.createHeavyParticleIcon( model.modelViewTransform ),
            GasPropertiesIconFactory.createHistogramIcon( GasPropertiesColorProfile.heavyParticleColorProperty )
          ]
        }, iconOptions ) )
      } );

      // Light particles checkbox
      const lightCheckbox = new GasPropertiesCheckbox( lightVisibleProperty, {
        icon: new HBox( _.extend( {
          children: [
            GasPropertiesIconFactory.createLightParticleIcon( model.modelViewTransform ),
            GasPropertiesIconFactory.createHistogramIcon( GasPropertiesColorProfile.lightParticleColorProperty )
          ]
        }, iconOptions ) )
      } );

      const checkboxes = new HBox( {
        children: [ heavyCheckbox, lightCheckbox ],
        align: 'center',
        spacing: 25
      } );

      const vBox = new VBox( {
        align: 'center',
        spacing: 15,
        children: [ histogram, checkboxes ]
      } );

      const content = new FixedWidthNode( vBox, {
        fixedWidth: options.fixedWidth - ( 2 * options.contentXMargin )
      });

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

  return gasProperties.register( 'SpeedAccordionBox', SpeedAccordionBox );
} );