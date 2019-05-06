// Copyright 2019, University of Colorado Boulder

/**
 * Kinetic Energy histogram, shows the distribution of kinetic energy of the particles in the container.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const EnergyHistogram = require( 'GAS_PROPERTIES/energy/view/EnergyHistogram' );
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const GasPropertiesConstants = require( 'GAS_PROPERTIES/common/GasPropertiesConstants' );
  const GasPropertiesQueryParameters = require( 'GAS_PROPERTIES/common/GasPropertiesQueryParameters' );
  const Text = require( 'SCENERY/nodes/Text' );

  // strings
  const numberOfParticlesString = require( 'string!GAS_PROPERTIES/numberOfParticles' );
  const kineticEnergyString = require( 'string!GAS_PROPERTIES/kineticEnergy' );

  // constants
  const NUMBER_OF_BINS = GasPropertiesQueryParameters.keBins;
  const BIN_WIDTH = GasPropertiesQueryParameters.keBinWidth; // AMU * pm^2 / ps^2

  class KineticEnergyHistogram extends EnergyHistogram {

    /**
     * @param {EnergyModel} model
     * @param {BooleanProperty} heavyVisibleProperty
     * @param {BooleanProperty} lightVisibleProperty
     * @param {Object} [options]
     */
    constructor( model, heavyVisibleProperty, lightVisibleProperty, options ) {
      super(
        NUMBER_OF_BINS, BIN_WIDTH,
        new Text( kineticEnergyString, GasPropertiesConstants.HISTOGRAM_AXIS_LABEL_OPTIONS ),
        new Text( numberOfParticlesString, GasPropertiesConstants.HISTOGRAM_AXIS_LABEL_OPTIONS ),
        heavyVisibleProperty,
        lightVisibleProperty,
        model.getHeavyParticleKineticEnergyValues.bind( model ),
        model.getLightParticleKineticEnergyValues.bind( model ),
        options
      );
    }
  }

  return gasProperties.register( 'KineticEnergyHistogram', KineticEnergyHistogram );
} );