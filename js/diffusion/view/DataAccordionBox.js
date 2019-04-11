// Copyright 2019, University of Colorado Boulder

/**
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const AccordionBox = require( 'SUN/AccordionBox' );
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const GasPropertiesColorProfile = require( 'GAS_PROPERTIES/common/GasPropertiesColorProfile' );
  const GasPropertiesConstants = require( 'GAS_PROPERTIES/common/GasPropertiesConstants' );
  const HBox = require( 'SCENERY/nodes/HBox' );
  const HStrut = require( 'SCENERY/nodes/HStrut' );
  const Text = require( 'SCENERY/nodes/Text' );
  const VSeparator = require( 'SUN/VSeparator' );

  // strings
  const dataString = require( 'string!GAS_PROPERTIES/data' );

  class DataAccordionBox extends AccordionBox {

    /**
     * @param {DiffusionModel} model
     * @param {Object} [options]
     */
    constructor( model, options ) {

      options = _.extend( {

        fixedWidth: 100,

        // AccordionBox options
        buttonXMargin: 0,
        titleXSpacing: 0,
        contentXMargin: 0,
        titleNode: new Text( dataString, {
          font: GasPropertiesConstants.TITLE_FONT,
          fill: GasPropertiesColorProfile.textFillProperty
        } )

      }, GasPropertiesConstants.ACCORDION_BOX_OPTIONS, options );

      //TODO placeholders
      const leftData = new HStrut( 175 );
      const rightData = new HStrut( 175 );

      const separator = new VSeparator( 75, {
        stroke: GasPropertiesColorProfile.separatorColorProperty
      } );

      const contentNode = new HBox( {
        children: [ leftData, separator, rightData ],
        spacing: 15
      } );

      super( contentNode, options );
    }
  }

  return gasProperties.register( 'DataAccordionBox', DataAccordionBox );
} );