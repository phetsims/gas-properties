// Copyright 2019-2022, University of Colorado Boulder

/**
 * SpeedHistogramNode shows the distribution of particle speeds in the container.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../phet-core/js/merge.js';
import GasPropertiesColors from '../../common/GasPropertiesColors.js';
import gasProperties from '../../gasProperties.js';
import GasPropertiesStrings from '../../GasPropertiesStrings.js';
import HistogramsModel from '../model/HistogramsModel.js';
import HistogramNode from './HistogramNode.js';

export default class SpeedHistogramNode extends HistogramNode {

  /**
   * @param {HistogramsModel} histogramsModel
   * @param {Object} [options]
   */
  constructor( histogramsModel, options ) {
    assert && assert( histogramsModel instanceof HistogramsModel, `invalid histogramModel: ${histogramsModel}` );

    options = merge( {

      // superclass options
      barColor: GasPropertiesColors.speedHistogramBarColorProperty
    }, options );

    super(
      histogramsModel.numberOfBins,
      histogramsModel.speedBinWidth,
      histogramsModel.binCountsUpdatedEmitter,
      histogramsModel.allSpeedBinCountsProperty,
      histogramsModel.heavySpeedBinCountsProperty,
      histogramsModel.lightSpeedBinCountsProperty,
      histogramsModel.yScaleProperty,
      GasPropertiesStrings.speed, // x-axis label
      GasPropertiesStrings.numberOfParticles, // y-axis label
      options
    );
  }
}

gasProperties.register( 'SpeedHistogramNode', SpeedHistogramNode );