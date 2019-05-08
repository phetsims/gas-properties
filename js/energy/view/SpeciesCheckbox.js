// Copyright 2019, University of Colorado Boulder

/**
 * Checkbox for a particle species, for a histogram in the 'Energy' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const GasPropertiesCheckbox = require( 'GAS_PROPERTIES/common/view/GasPropertiesCheckbox' );
  const GasPropertiesIconFactory = require( 'GAS_PROPERTIES/common/view/GasPropertiesIconFactory' );
  const HBox = require( 'SCENERY/nodes/HBox' );

  class SpeciesCheckbox extends GasPropertiesCheckbox {

    /**
     * @param {BooleanProperty} speciesVisibleProperty
     * @param {ModelViewTransform2} modelViewTransform
     * @param {Node} particleIcon
     * @param {ColorDef} particleColor
     * @param {Object} [options]
     */
    constructor( speciesVisibleProperty, modelViewTransform, particleIcon, particleColor, options ) {
      super( speciesVisibleProperty, {
        align: 'center',
        spacing: 5,
        icon: new HBox( {
          spacing: 3,
          children: [
            particleIcon,
            GasPropertiesIconFactory.createHistogramIcon( particleColor )
          ]
        } )
      } );
    }
  }

  return gasProperties.register( 'SpeciesCheckbox', SpeciesCheckbox );
} );