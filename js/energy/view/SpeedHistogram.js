// Copyright 2019, University of Colorado Boulder

/**
 * SpeedHistogram shows the distribution of the speeds of the particles in the container.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const BooleanProperty = require( 'AXON/BooleanProperty' );
  const EnergyHistogram = require( 'GAS_PROPERTIES/energy/view/EnergyHistogram' );
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const GasPropertiesColorProfile = require( 'GAS_PROPERTIES/common/GasPropertiesColorProfile' );
  const GasPropertiesConstants = require( 'GAS_PROPERTIES/common/GasPropertiesConstants' );
  const GasPropertiesQueryParameters = require( 'GAS_PROPERTIES/common/GasPropertiesQueryParameters' );
  const Text = require( 'SCENERY/nodes/Text' );

  // strings
  const numberOfParticlesString = require( 'string!GAS_PROPERTIES/numberOfParticles' );
  const speedString = require( 'string!GAS_PROPERTIES/speed' );

  class SpeedHistogram extends EnergyHistogram {

    /**
     * @param {BooleanProperty} heavyVisibleProperty
     * @param {BooleanProperty} lightVisibleProperty
     * @param {function:number[]} getHeavyValues
     * @param {function:number[]} getLightValues
     * @param {Object} [options]
     */
    constructor( heavyVisibleProperty, lightVisibleProperty, getHeavyValues, getLightValues, options ) {
      assert && assert( heavyVisibleProperty instanceof BooleanProperty, `invalid heavyVisibleProperty: ${heavyVisibleProperty}` );
      assert && assert( lightVisibleProperty instanceof BooleanProperty, `invalid lightVisibleProperty: ${lightVisibleProperty}` );
      assert && assert( typeof getHeavyValues === 'function', `invalid getHeavyValues: ${getHeavyValues}` );
      assert && assert( typeof getLightValues === 'function', `invalid getLightValues: ${getLightValues}` );

      super(
        GasPropertiesQueryParameters.bins,
        GasPropertiesQueryParameters.speedBinWidth, // pm/ps
        new Text( speedString, GasPropertiesConstants.HISTOGRAM_AXIS_LABEL_OPTIONS ),
        new Text( numberOfParticlesString, GasPropertiesConstants.HISTOGRAM_AXIS_LABEL_OPTIONS ),
        heavyVisibleProperty,
        lightVisibleProperty,
        getHeavyValues,
        getLightValues,
        GasPropertiesColorProfile.speedHistogramBarColorProperty,
        options
      );
    }
  }

  return gasProperties.register( 'SpeedHistogram', SpeedHistogram );
} );