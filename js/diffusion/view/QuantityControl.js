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
  const GasPropertiesSpinner = require( 'GAS_PROPERTIES/diffusion/view/GasPropertiesSpinner' );
  const HBox = require( 'SCENERY/nodes/HBox' );
  const HStrut = require( 'SCENERY/nodes/HStrut' );
  const Text = require( 'SCENERY/nodes/Text' );
  const VBox = require( 'SCENERY/nodes/VBox' );

  class QuantityControl extends VBox {

    /**
     * @param {ModelViewTransform2} modelViewTransform
     * @param {string} title
     * @param {NumberProperty} particle1Property
     * @param {NumberProperty} particle2Property
     * @param {Object} [options]
     */
    constructor( modelViewTransform, title, particle1Property, particle2Property, options ) {

      options = _.extend( {
        spinnerOptions: null, // {*} see NumberSpinner

        // VBox options
        spacing: 12,
        align: 'left'
      }, options );

      // title
      const titleNode = new Text( title, {
        font: GasPropertiesConstants.CONTROL_FONT,
        fill: GasPropertiesColorProfile.textFillProperty,
        maxWidth: 200 // determined empirically
      } );

      // icons
      const particle1Icon = GasPropertiesIconFactory.createDiffusionParticle1Icon( modelViewTransform );
      const particle2Icon = GasPropertiesIconFactory.createDiffusionParticle2Icon( modelViewTransform );

      // spinners
      const particle1Spinner = new GasPropertiesSpinner( particle1Property, options.spinnerOptions );
      const particle2Spinner = new GasPropertiesSpinner( particle2Property, options.spinnerOptions );

      // layout
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