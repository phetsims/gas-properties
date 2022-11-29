// Copyright 2019-2022, University of Colorado Boulder

/**
 * SpeedHistogramNode shows the distribution of particle speeds in the container.
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

type SpeedHistogramNodeOptions = SelfOptions & PickRequired<HistogramNodeOptions, 'tandem'>;

export default class SpeedHistogramNode extends HistogramNode {

  public constructor( histogramsModel: HistogramsModel, providedOptions: SpeedHistogramNodeOptions ) {

    const options = optionize<SpeedHistogramNodeOptions, SelfOptions, HistogramNodeOptions>()( {

      // HistogramNodeOptions
      barColor: GasPropertiesColors.speedHistogramBarColorProperty
    }, providedOptions );

    super(
      histogramsModel.numberOfBins,
      histogramsModel.speedBinWidth,
      histogramsModel.binCountsUpdatedEmitter,
      histogramsModel.allSpeedBinCountsProperty,
      histogramsModel.heavySpeedBinCountsProperty,
      histogramsModel.lightSpeedBinCountsProperty,
      histogramsModel.yScaleProperty,
      GasPropertiesStrings.speedStringProperty, // x-axis label
      GasPropertiesStrings.numberOfParticlesStringProperty, // y-axis label
      options
    );
  }
}

gasProperties.register( 'SpeedHistogramNode', SpeedHistogramNode );