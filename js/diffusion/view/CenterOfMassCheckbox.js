// Copyright 2019, University of Colorado Boulder

/**
 * Checkbox to show/hide the center-of-mass indicators on the container.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const GasPropertiesCheckbox = require( 'GAS_PROPERTIES/common/view/GasPropertiesCheckbox' );
  const GasPropertiesColorProfile = require( 'GAS_PROPERTIES/common/GasPropertiesColorProfile' );
  const HBox = require( 'SCENERY/nodes/HBox' );
  const Line = require( 'SCENERY/nodes/Line' );

  // strings
  const centerOfMassString = require( 'string!GAS_PROPERTIES/centerOfMass' );

  // constants
  const ICON_LINE_LENGTH = 15;
  const ICON_LINE_WIDTH = 2;

  class CenterOfMassCheckbox extends GasPropertiesCheckbox {

    /**
     * @param {BooleanProperty} centerOfMassVisibleProperty
     * @param {Object} [options]
     */
    constructor( centerOfMassVisibleProperty, options ) {

      options = _.extend( {
        textIconSpacing: 12
      }, options );

      const icon = new HBox( {
        spacing: 12,
        children: [
          new Line( 0, 0, 0, ICON_LINE_LENGTH, {
            stroke: GasPropertiesColorProfile.diffusionParticle1ColorProperty,
            lineWidth: ICON_LINE_WIDTH
          } ),
          new Line( 0, 0, 0, ICON_LINE_LENGTH, {
            stroke: GasPropertiesColorProfile.diffusionParticle2ColorProperty,
            lineWidth: ICON_LINE_WIDTH
          } )
        ]
      } );

      assert && assert( !options.text, 'CenterOfMassCheckbox sets text' );
      assert && assert( !options.icon, 'CenterOfMassCheckbox sets icon' );
      options = _.extend( {
        text: centerOfMassString,
        icon: icon
      }, options );

      super( centerOfMassVisibleProperty, options );
    }
  }

  return gasProperties.register( 'CenterOfMassCheckbox', CenterOfMassCheckbox );
} );