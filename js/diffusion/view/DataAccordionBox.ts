// Copyright 2019-2022, University of Colorado Boulder

/**
 * DataAccordionBox is the 'Data' accordion box in the 'Diffusion' screen.  It displays data for the left and right
 * sides of the container.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import { EmptySelfOptions, optionize4 } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import { HBox, Text, VSeparator } from '../../../../scenery/js/imports.js';
import AccordionBox, { AccordionBoxOptions } from '../../../../sun/js/AccordionBox.js';
import GasPropertiesColors from '../../common/GasPropertiesColors.js';
import GasPropertiesConstants from '../../common/GasPropertiesConstants.js';
import gasProperties from '../../gasProperties.js';
import GasPropertiesStrings from '../../GasPropertiesStrings.js';
import DiffusionData from '../model/DiffusionData.js';
import DiffusionDataNode from './DiffusionDataNode.js';

type SelfOptions = EmptySelfOptions;

type DataAccordionBoxOptions = SelfOptions & PickRequired<AccordionBoxOptions, 'tandem' | 'expandedProperty'>;

export default class DataAccordionBox extends AccordionBox {

  public constructor( leftData: DiffusionData, rightData: DiffusionData, modelViewTransform: ModelViewTransform2,
                      providedOptions: DataAccordionBoxOptions ) {

    const options = optionize4<DataAccordionBoxOptions, SelfOptions, AccordionBoxOptions>()(
      {}, GasPropertiesConstants.ACCORDION_BOX_OPTIONS, {

      // AccordionBoxOptions
      contentYSpacing: 0,
      titleNode: new Text( GasPropertiesStrings.dataStringProperty, {
        font: GasPropertiesConstants.TITLE_FONT,
        fill: GasPropertiesColors.textFillProperty,
        maxWidth: 200 // determined empirically
      } )
    }, providedOptions );

    // Data for left side of the container
    const leftDataNode = new DiffusionDataNode( leftData, modelViewTransform, {
      tandem: options.tandem.createTandem( 'leftDataNode' )
    } );

    // Data for right side of container
    const rightDataNode = new DiffusionDataNode( rightData, modelViewTransform, {
      tandem: options.tandem.createTandem( 'rightDataNode' )
    } );

    // Vertical separator, analogous to the container's divider
    const separator = new VSeparator( {
      lineWidth: 2,
      stroke: GasPropertiesColors.dividerColorProperty
    } );

    const contentNode = new HBox( {
      children: [ leftDataNode, separator, rightDataNode ],
      spacing: 25
    } );

    super( contentNode, options );
  }

  public override dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }
}

gasProperties.register( 'DataAccordionBox', DataAccordionBox );