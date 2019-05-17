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
  const DiffusionDataNode = require( 'GAS_PROPERTIES/diffusion/view/DiffusionDataNode' );
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
     * @param {DiffusionData} leftData
     * @param {DiffusionData} rightData
     * @param {ModelViewTransform2} modelViewTransform
     * @param {Object} [options]
     */
    constructor( leftData, rightData, modelViewTransform, options ) {

      options = _.extend( {}, GasPropertiesConstants.ACCORDION_BOX_OPTIONS, {

        // AccordionBox options
        titleNode: new Text( dataString, {
          font: GasPropertiesConstants.TITLE_FONT,
          fill: GasPropertiesColorProfile.textFillProperty,
          separatorLineWidth: 1,
          maxWidth: 200 // determined empirically
        } )

      }, options );

      // Data for left side of the container
      const leftDataNode = new DiffusionDataNode( leftData, modelViewTransform );

      // Data for right side of container
      const rightDataNode = new DiffusionDataNode( rightData, modelViewTransform );

      // Vertical separator, analogous to the container's divider
      const separator = new VSeparator( 75, {
        lineWidth: options.separatorLineWidth,
        stroke: GasPropertiesColorProfile.dividerColorProperty
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