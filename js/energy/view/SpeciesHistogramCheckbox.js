// Copyright 2019, University of Colorado Boulder

/**
 * Checkbox for a particle species, for a histogram in the 'Energy' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const BooleanProperty = require( 'AXON/BooleanProperty' );
  const ColorDef = require( 'SCENERY/util/ColorDef' );
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const GasPropertiesCheckbox = require( 'GAS_PROPERTIES/common/view/GasPropertiesCheckbox' );
  const GasPropertiesIconFactory = require( 'GAS_PROPERTIES/common/view/GasPropertiesIconFactory' );
  const HBox = require( 'SCENERY/nodes/HBox' );
  const ModelViewTransform2 = require( 'PHETCOMMON/view/ModelViewTransform2' );
  const Node = require( 'SCENERY/nodes/Node' );

  class SpeciesHistogramCheckbox extends GasPropertiesCheckbox {

    /**
     * @param {BooleanProperty} speciesVisibleProperty
     * @param {ModelViewTransform2} modelViewTransform
     * @param {Node} particleIcon
     * @param {ColorDef} particleColor
     * @param {Object} [options]
     */
    constructor( speciesVisibleProperty, modelViewTransform, particleIcon, particleColor, options ) {
      assert && assert( speciesVisibleProperty instanceof BooleanProperty,
        `invalid speciesVisibleProperty: ${speciesVisibleProperty}` );
      assert && assert( modelViewTransform instanceof ModelViewTransform2,
        `invalid modelViewTransform: ${modelViewTransform}` );
      assert && assert( particleIcon instanceof Node, `invalid particleIcon: ${particleIcon}` );
      assert && assert( ColorDef.isColorDef( particleColor ), `invalid particleColor: ${particleColor}` );

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

  return gasProperties.register( 'SpeciesHistogramCheckbox', SpeciesHistogramCheckbox );
} );