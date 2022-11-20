// Copyright 2019-2022, University of Colorado Boulder

/**
 * SpeedAccordionBox contains the 'Speed' histogram and related controls.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import gasProperties from '../../gasProperties.js';
import GasPropertiesStrings from '../../GasPropertiesStrings.js';
import HistogramsModel from '../model/HistogramsModel.js';
import EnergyAccordionBox, { EnergyAccordionBoxOptions } from './EnergyAccordionBox.js';
import SpeedHistogramNode from './SpeedHistogramNode.js';

type SelfOptions = EmptySelfOptions;

type SpeedAccordionBoxOptions = SelfOptions & PickRequired<EnergyAccordionBoxOptions, 'tandem'>;

export default class SpeedAccordionBox extends EnergyAccordionBox {

  public constructor( histogramsModel: HistogramsModel, modelViewTransform: ModelViewTransform2,
                      providedOptions: SpeedAccordionBoxOptions ) {

    const createHistogramNode = ( tandem: Tandem ) => new SpeedHistogramNode( histogramsModel, {
      tandem: tandem
    } );

    super( GasPropertiesStrings.speedStringProperty, modelViewTransform, createHistogramNode, providedOptions );
  }
}

gasProperties.register( 'SpeedAccordionBox', SpeedAccordionBox );