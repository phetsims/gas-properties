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
  const HeavyParticlesCheckbox = require( 'GAS_PROPERTIES/energy/view/HeavyParticlesCheckbox' );
  const HBox = require( 'SCENERY/nodes/HBox' );
  const LightParticlesCheckbox = require( 'GAS_PROPERTIES/energy/view/LightParticlesCheckbox' );
  const ModelViewTransform2 = require( 'PHETCOMMON/view/ModelViewTransform2' );
  const SpeedHistogram = require( 'GAS_PROPERTIES/energy/view/SpeedHistogram' );
  const Text = require( 'SCENERY/nodes/Text' );
  const VBox = require( 'SCENERY/nodes/VBox' );

  // strings
  const speedString = require( 'string!GAS_PROPERTIES/speed' );

  class SpeedAccordionBox extends AccordionBox {

    /**
     * @param {function:number[]} getHeavyValues
     * @param {function:number[]} getLightValues
     * @param {ModelViewTransform2} modelViewTransform
     * @param {Object} [options]
     */
    constructor( getHeavyValues, getLightValues, modelViewTransform, options ) {
      assert && assert( typeof getHeavyValues === 'function', `invalid getHeavyValues: ${getHeavyValues}` );
      assert && assert( typeof getLightValues === 'function', `invalid getLightValues: ${getLightValues}` );
      assert && assert( modelViewTransform instanceof ModelViewTransform2, `invalid modelViewTransform: ${modelViewTransform}` );

      options = _.extend( {
        fixedWidth: 100,
        contentXMargin: 0
      }, GasPropertiesConstants.ACCORDION_BOX_OPTIONS, {

        // AccordionBox options
        contentYSpacing: 0,
        titleNode: new Text( speedString, {
          font: GasPropertiesConstants.TITLE_FONT,
          fill: GasPropertiesColorProfile.textFillProperty
        } )

      }, options );

      // Limit width of title
      options.titleNode.maxWidth = 0.75 * options.fixedWidth; // determined empirically

      //TODO should these Properties live somewhere else?
      const heavyVisibleProperty = new BooleanProperty( false );
      const lightVisibleProperty = new BooleanProperty( false );

      const histogram = new SpeedHistogram( heavyVisibleProperty, lightVisibleProperty,
        getHeavyValues, getLightValues );

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
        children: [ histogram, checkboxes ]
      } ) );

      super( content, options );

      // @private
      this.histogram = histogram;
      this.heavyVisibleProperty = heavyVisibleProperty;
      this.lightVisibleProperty = lightVisibleProperty;
    }

    // @public
    reset() {
      this.histogram.reset();
      this.heavyVisibleProperty.reset();
      this.lightVisibleProperty.reset();
    }

    /**
     * Steps the histogram if it's visible.
     * @param {number} dt - time delta, in ps
     */
    step( dt ) {
      assert && assert( typeof dt === 'number' && dt > 0, `invalid dt: ${dt}` );
      if ( this.expandedProperty.value ) {
        this.histogram.step( dt );
      }
    }
  }

  return gasProperties.register( 'SpeedAccordionBox', SpeedAccordionBox );
} );