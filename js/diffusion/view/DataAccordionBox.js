// Copyright 2019, University of Colorado Boulder

/**
 * DataAccordionBox is the 'Data' accordion box in the 'Diffusion' screen.  It displays data for the left and right
 * sides of the container.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../phet-core/js/merge.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import HBox from '../../../../scenery/js/nodes/HBox.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import AccordionBox from '../../../../sun/js/AccordionBox.js';
import VSeparator from '../../../../sun/js/VSeparator.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import GasPropertiesColorProfile from '../../common/GasPropertiesColorProfile.js';
import GasPropertiesConstants from '../../common/GasPropertiesConstants.js';
import gasPropertiesStrings from '../../gas-properties-strings.js';
import gasProperties from '../../gasProperties.js';
import DiffusionData from '../model/DiffusionData.js';
import DiffusionDataNode from './DiffusionDataNode.js';

const dataString = gasPropertiesStrings.data;

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
      tandem: Tandem.REQUIRED

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

gasProperties.register( 'DataAccordionBox', DataAccordionBox );
export default DataAccordionBox;