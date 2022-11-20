// Copyright 2019-2022, University of Colorado Boulder

/**
 * KineticEnergyAccordionBox contains the 'Kinetic Energy' histogram and related controls.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import gasProperties from '../../gasProperties.js';
import GasPropertiesStrings from '../../GasPropertiesStrings.js';
import HistogramsModel from '../model/HistogramsModel.js';
import EnergyAccordionBox, { EnergyAccordionBoxOptions } from './EnergyAccordionBox.js';
import KineticEnergyHistogramNode from './KineticEnergyHistogramNode.js';

type SelfOptions = EmptySelfOptions;

type KineticEnergyAccordionBoxOptions = SelfOptions & EnergyAccordionBoxOptions;

export default class KineticEnergyAccordionBox extends EnergyAccordionBox {

  public constructor( histogramsModel: HistogramsModel, modelViewTransform: ModelViewTransform2,
                      providedOptions: KineticEnergyAccordionBoxOptions ) {

    const createHistogramNode = ( tandem: Tandem ) => new KineticEnergyHistogramNode( histogramsModel, {
      tandem: tandem
    } );

    super( GasPropertiesStrings.kineticEnergyStringProperty, modelViewTransform, createHistogramNode, providedOptions );
  }
}

gasProperties.register( 'KineticEnergyAccordionBox', KineticEnergyAccordionBox );