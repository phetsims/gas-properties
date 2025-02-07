// Copyright 2019-2024, University of Colorado Boulder

/**
 * DataAccordionBox is the 'Data' accordion box in the 'Diffusion' screen.  It displays data for the left and right
 * sides of the container.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import { EmptySelfOptions, optionize4 } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import HBox from '../../../../scenery/js/layout/nodes/HBox.js';
import VSeparator from '../../../../scenery/js/layout/nodes/VSeparator.js';
import Text from '../../../../scenery/js/nodes/Text.js';
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
                      numberOfParticleTypesProperty: TReadOnlyProperty<number>,
                      providedOptions: DataAccordionBoxOptions ) {

    const options = optionize4<DataAccordionBoxOptions, SelfOptions, AccordionBoxOptions>()(
      {}, GasPropertiesConstants.ACCORDION_BOX_OPTIONS, {

        // AccordionBoxOptions
        isDisposable: false,
        contentYSpacing: 0,
        titleNode: new Text( GasPropertiesStrings.dataStringProperty, {
          font: GasPropertiesConstants.TITLE_FONT,
          fill: GasPropertiesColors.textFillProperty,
          maxWidth: 200 // determined empirically
        } )
      }, providedOptions );

    // Data for left side of the container
    const leftDataNode = new DiffusionDataNode( leftData, modelViewTransform, numberOfParticleTypesProperty );

    // Data for right side of container
    const rightDataNode = new DiffusionDataNode( rightData, modelViewTransform, numberOfParticleTypesProperty );

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
}

gasProperties.register( 'DataAccordionBox', DataAccordionBox );