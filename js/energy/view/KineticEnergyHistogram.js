// Copyright 2019, University of Colorado Boulder

/**
 * KineticEnergyHistogram shows the distribution of kinetic energy of the particles in the container.
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
  const kineticEnergyString = require( 'string!GAS_PROPERTIES/kineticEnergy' );

  class KineticEnergyHistogram extends EnergyHistogram {

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
        GasPropertiesQueryParameters.keBinWidth, // AMU * pm^2 / ps^2
        new Text( kineticEnergyString, GasPropertiesConstants.HISTOGRAM_AXIS_LABEL_OPTIONS ),
        new Text( numberOfParticlesString, GasPropertiesConstants.HISTOGRAM_AXIS_LABEL_OPTIONS ),
        heavyVisibleProperty,
        lightVisibleProperty,
        getHeavyValues,
        getLightValues,
        GasPropertiesColorProfile.kineticEnergyHistogramBarColorProperty,
        options
      );
    }
  }

  return gasProperties.register( 'KineticEnergyHistogram', KineticEnergyHistogram );
} );