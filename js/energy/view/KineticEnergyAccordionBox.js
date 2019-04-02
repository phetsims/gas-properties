// Copyright 2019, University of Colorado Boulder

/**
 * KineticEnergyAccordionBox contains the kinetic energy histogram.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const AccordionBox = require( 'SUN/AccordionBox' );
  const FixedWidthNode = require( 'GAS_PROPERTIES/common/view/FixedWidthNode' );
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const GasPropertiesColorProfile = require( 'GAS_PROPERTIES/common/GasPropertiesColorProfile' );
  const GasPropertiesConstants = require( 'GAS_PROPERTIES/common/GasPropertiesConstants' );
  const KineticEnergyHistogram = require( 'GAS_PROPERTIES/energy/view/KineticEnergyHistogram' );
  const Text = require( 'SCENERY/nodes/Text' );

  // strings
  const kineticEnergyString = require( 'string!GAS_PROPERTIES/kineticEnergy' );

  class KineticEnergyAccordionBox extends AccordionBox {

    /**
     * @param {GasPropertiesModel} model
     * @param {Object} [options]
     */
    constructor( model, options ) {

      options = _.extend( {

        fixedWidth: 100,

        // AccordionBox options
        buttonXMargin: 0,
        titleXSpacing: 0,
        contentXMargin: 0,
        titleNode: new Text( kineticEnergyString, {
          font: GasPropertiesConstants.TITLE_FONT,
          fill: GasPropertiesColorProfile.textFillProperty
        } )

      }, GasPropertiesConstants.ACCORDION_BOX_OPTIONS, options );

      // Limit width of title
      options.titleNode.maxWidth = options.fixedWidth - options.buttonXMargin - options.titleXSpacing;

      const histogram = new KineticEnergyHistogram( model );

      const content = new FixedWidthNode( histogram, {
        fixedWidth: options.fixedWidth - ( 2 * options.contentXMargin )
      } );

      super( content, options );
    }
  }

  return gasProperties.register( 'KineticEnergyAccordionBox', KineticEnergyAccordionBox );
} );