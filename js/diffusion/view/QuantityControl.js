// Copyright 2019, University of Colorado Boulder

/**
 * Control for changing a quantity for 2 particle types.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const GasPropertiesColorProfile = require( 'GAS_PROPERTIES/common/GasPropertiesColorProfile' );
  const GasPropertiesConstants = require( 'GAS_PROPERTIES/common/GasPropertiesConstants' );
  const GasPropertiesIconFactory = require( 'GAS_PROPERTIES/common/view/GasPropertiesIconFactory' );
  const HBox = require( 'SCENERY/nodes/HBox' );
  const HStrut = require( 'SCENERY/nodes/HStrut' );
  const NumberSpinner = require( 'SUN/NumberSpinner' );
  const Text = require( 'SCENERY/nodes/Text' );
  const VBox = require( 'SCENERY/nodes/VBox' );

  class QuantityControl extends VBox {

    /**
     * @param {ModelViewTransform2} modelViewTransform
     * @param {string} title
     * @param {NumberProperty} particle1Property
     * @param {Property<Range>} particle1RangeProperty
     * @param {NumberProperty} particle2Property
     * @param {Property<Range>} particle2RangeProperty
     * @param {BooleanProperty} enabledProperty
     * @param {Object} [options]
     */
    constructor( modelViewTransform, title,
                 particle1Property, particle1RangeProperty,
                 particle2Property, particle2RangeProperty,
                 enabledProperty,
                 options ) {

      options = _.extend( {
        spacing: 12,
        align: 'left',
        deltaValue: 1  // {number} spinner delta
      }, options );

      const titleNode = new Text( title, {
        font: GasPropertiesConstants.CONTROL_FONT,
        fill: GasPropertiesColorProfile.textFillProperty
      } );

      const particle1Icon = GasPropertiesIconFactory.createDiffusionParticle1Icon( modelViewTransform );
      const particle2Icon = GasPropertiesIconFactory.createDiffusionParticle2Icon( modelViewTransform );

      const numberSpinnerOptions = {
        deltaValue: options.deltaValue,
        enabledProperty: enabledProperty,
        font: GasPropertiesConstants.CONTROL_FONT,
        xMargin: 8,
        yMargin: 6,
        valueAlign: 'right',
        touchAreaXDilation: 15,
        touchAreaYDilation: 15
      };

      const particle1Spinner = new NumberSpinner( particle1Property, particle1RangeProperty, numberSpinnerOptions );
      const particle2Spinner = new NumberSpinner( particle2Property, particle2RangeProperty, numberSpinnerOptions );

      const hBox1 = new HBox( {
        spacing: 10,
        children: [ particle1Icon, particle1Spinner ]
      } );

      const hBox2 = new HBox( {
        spacing: 10,
        children: [ particle2Icon, particle2Spinner ]
      } );

      const hBox = new HBox( {
        spacing: 30,
        children: [ new HStrut( 1 ), hBox1, hBox2 ]
      } );

      assert && assert( !options.children, 'DataNode sets children' );
      options = _.extend( {
        children: [ titleNode, hBox ]
      }, options );

      super( options );
    }
  }

  return gasProperties.register( 'QuantityControl', QuantityControl );
} );