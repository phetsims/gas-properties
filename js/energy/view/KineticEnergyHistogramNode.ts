// Copyright 2019-2022, University of Colorado Boulder

/**
 * KineticEnergyHistogramNode shows the distribution of the kinetic energy of particles in the container.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import GasPropertiesColors from '../../common/GasPropertiesColors.js';
import gasProperties from '../../gasProperties.js';
import GasPropertiesStrings from '../../GasPropertiesStrings.js';
import HistogramsModel from '../model/HistogramsModel.js';
import HistogramNode, { HistogramNodeOptions } from './HistogramNode.js';

type SelfOptions = EmptySelfOptions;

type KineticEnergyHistogramNodeOptions = SelfOptions & PickRequired<HistogramNodeOptions, 'tandem'>;

export default class KineticEnergyHistogramNode extends HistogramNode {

  public constructor( histogramsModel: HistogramsModel, providedOptions: KineticEnergyHistogramNodeOptions ) {

    const options = optionize<KineticEnergyHistogramNodeOptions, SelfOptions, HistogramNodeOptions>()( {

      // HistogramNodeOptions
      barColor: GasPropertiesColors.kineticEnergyHistogramBarColorProperty
    }, providedOptions );

    super(
      histogramsModel.numberOfBins,
      histogramsModel.kineticEnergyBinWidth,
      histogramsModel.binCountsUpdatedEmitter,
      histogramsModel.allKineticEnergyBinCountsProperty,
      histogramsModel.heavyKineticEnergyBinCountsProperty,
      histogramsModel.lightKineticEnergyBinCountsProperty,
      histogramsModel.yScaleProperty,
      GasPropertiesStrings.kineticEnergyStringProperty, // x-axis label
      GasPropertiesStrings.numberOfParticlesStringProperty, // y-axis label
      options
    );
  }
}

gasProperties.register( 'KineticEnergyHistogramNode', KineticEnergyHistogramNode );