// Copyright 2019, University of Colorado Boulder

/**
 * DataAccordionBox is the 'Data' accordion box in the 'Diffusion' screen.  It displays data for the left and right
 * sides of the container.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const AccordionBox = require( 'SUN/AccordionBox' );
  const DiffusionData = require( 'GAS_PROPERTIES/diffusion/model/DiffusionData' );
  const DiffusionDataNode = require( 'GAS_PROPERTIES/diffusion/view/DiffusionDataNode' );
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const GasPropertiesColorProfile = require( 'GAS_PROPERTIES/common/GasPropertiesColorProfile' );
  const GasPropertiesConstants = require( 'GAS_PROPERTIES/common/GasPropertiesConstants' );
  const HBox = require( 'SCENERY/nodes/HBox' );
  const merge = require( 'PHET_CORE/merge' );
  const ModelViewTransform2 = require( 'PHETCOMMON/view/ModelViewTransform2' );
  const Tandem = require( 'TANDEM/Tandem' );
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
      assert && assert( leftData instanceof DiffusionData, `invalid leftData: ${leftData}` );
      assert && assert( rightData instanceof DiffusionData, `invalid rightData: ${rightData}` );
      assert && assert( modelViewTransform instanceof ModelViewTransform2,
        `invalid modelViewTransform: ${modelViewTransform}` );


      options = merge( {}, GasPropertiesConstants.ACCORDION_BOX_OPTIONS, {

        // superclass options
        contentYSpacing: 0,
        titleNode: new Text( dataString, {
          font: GasPropertiesConstants.TITLE_FONT,
          fill: GasPropertiesColorProfile.textFillProperty,
          maxWidth: 200 // determined empirically
        } ),

        // phet-io
        tandem: Tandem.required

      }, options );

      // Data for left side of the container
      const leftDataNode = new DiffusionDataNode( leftData, modelViewTransform );

      // Data for right side of container
      const rightDataNode = new DiffusionDataNode( rightData, modelViewTransform );

      // Vertical separator, analogous to the container's divider
      const separator = new VSeparator( 75, {
        lineWidth: 2,
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