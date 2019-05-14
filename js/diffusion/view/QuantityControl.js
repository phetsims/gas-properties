// Copyright 2019, University of Colorado Boulder

/**
 * Control for changing a quantity for for the left and right sides of the container.
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
     * @param {string} title
     * @param {ModelViewTransform2} modelViewTransform
     * @param {NumberProperty} leftProperty - quantity for the left side of the container
     * @param {NumberProperty} rightProperty - quantity for the right side of the container
     * @param {Object} [options]
     */
    constructor( title, modelViewTransform, leftProperty, rightProperty, options ) {

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
      const leftParticleIcon = GasPropertiesIconFactory.createDiffusionParticle1Icon( modelViewTransform );
      const rightParticleIcon = GasPropertiesIconFactory.createDiffusionParticle2Icon( modelViewTransform );

      // spinners
      const leftSpinner = new GasPropertiesSpinner( leftProperty, options.spinnerOptions );
      const rightSpinner = new GasPropertiesSpinner( rightProperty, options.spinnerOptions );

      // layout
      const leftBox = new HBox( {
        spacing: 10,
        children: [ leftParticleIcon, leftSpinner ]
      } );

      const rightBox = new HBox( {
        spacing: 10,
        children: [ rightParticleIcon, rightSpinner ]
      } );

      const hBox = new HBox( {
        spacing: 30,
        children: [ new HStrut( 1 ), leftBox, rightBox ]
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