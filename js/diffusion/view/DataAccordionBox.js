// Copyright 2019, University of Colorado Boulder

/**
 * The 'Data' accordion box in the 'Diffusion' screen.
 * 
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const AccordionBox = require( 'SUN/AccordionBox' );
  const DataNode = require( 'GAS_PROPERTIES/diffusion/view/DataNode' );
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const GasPropertiesColorProfile = require( 'GAS_PROPERTIES/common/GasPropertiesColorProfile' );
  const GasPropertiesConstants = require( 'GAS_PROPERTIES/common/GasPropertiesConstants' );
  const HBox = require( 'SCENERY/nodes/HBox' );
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

      options = _.extend( {}, GasPropertiesConstants.ACCORDION_BOX_OPTIONS, {

        fixedWidth: 100,

        // AccordionBox options
        titleNode: new Text( dataString, {
          font: GasPropertiesConstants.TITLE_FONT,
          fill: GasPropertiesColorProfile.textFillProperty
        } )

      }, options );

      const leftDataNode = new DataNode(
        model.modelViewTransform,
        model.leftNumberOfParticles1Property,
        model.leftNumberOfParticles2Property,
        model.leftAverageTemperatureProperty
      );

      const rightDataNode = new DataNode(
        model.modelViewTransform,
        model.rightNumberOfParticles1Property,
        model.rightNumberOfParticles2Property,
        model.rightAverageTemperatureProperty
      );

      //TODO should this separator be a bit more pronounced, since it corresponds to the container divider?
      const separator = new VSeparator( 75, {
        stroke: GasPropertiesColorProfile.separatorColorProperty
      } );

      const contentNode = new HBox( {
        children: [ leftDataNode, separator, rightDataNode ],
        spacing: 25
      } );

      super( contentNode, options );
    }
  }

  return gasProperties.register( 'DataAccordionBox', DataAccordionBox );
} );