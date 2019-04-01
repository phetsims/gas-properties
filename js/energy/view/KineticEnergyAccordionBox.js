// Copyright 2019, University of Colorado Boulder

//TODO maintain fixed width
/**
 * KineticEnergyAccordionBox contains the kinetic energy histogram.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const AccordionBox = require( 'SUN/AccordionBox' );
  const BooleanProperty = require( 'AXON/BooleanProperty' );
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const GasPropertiesColorProfile = require( 'GAS_PROPERTIES/common/GasPropertiesColorProfile' );
  const GasPropertiesConstants = require( 'GAS_PROPERTIES/common/GasPropertiesConstants' );
  const KineticEnergyHistogram = require( 'GAS_PROPERTIES/energy/view/KineticEnergyHistogram' );
  const Text = require( 'SCENERY/nodes/Text' );

  // strings
  const kineticEnergyString = require( 'string!GAS_PROPERTIES/kineticEnergy' );

  class KineticEnergyAccordionBox extends AccordionBox {

    /**
     * @param {IdealModel} model
     * @param {Object} [options]
     */
    constructor( model, options ) {

      options = _.extend( {
        expandedProperty: new BooleanProperty( true ), //TODO default false
        titleNode: new Text( kineticEnergyString, {
          //TODO maxWidth
          font: GasPropertiesConstants.TITLE_FONT,
          fill: GasPropertiesColorProfile.titleTextFillProperty
        } )
      }, GasPropertiesConstants.ACCORDION_BOX_OPTIONS, options );

      const histogram = new KineticEnergyHistogram( model );

      super( histogram, options );

      // @private
      this.expandedProperty = options.expandedProperty;
    }

    // @public
    reset() {
      this.expandedProperty.reset();
    }
  }

  return gasProperties.register( 'KineticEnergyAccordionBox', KineticEnergyAccordionBox );
} );