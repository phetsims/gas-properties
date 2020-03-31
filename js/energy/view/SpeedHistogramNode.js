// Copyright 2019-2020, University of Colorado Boulder

/**
 * SpeedHistogramNode shows the distribution of particle speeds in the container.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../phet-core/js/merge.js';
import GasPropertiesColorProfile from '../../common/GasPropertiesColorProfile.js';
import gasPropertiesStrings from '../../gasPropertiesStrings.js';
import gasProperties from '../../gasProperties.js';
import HistogramsModel from '../model/HistogramsModel.js';
import HistogramNode from './HistogramNode.js';

const numberOfParticlesString = gasPropertiesStrings.numberOfParticles;
const speedString = gasPropertiesStrings.speed;

class SpeedHistogramNode extends HistogramNode {

  /**
   * @param {HistogramsModel} histogramsModel
   * @param {Object} [options]
   */
  constructor( histogramsModel, options ) {
    assert && assert( histogramsModel instanceof HistogramsModel, `invalid histogramModel: ${histogramsModel}` );

    options = merge( {

      // superclass options
      barColor: GasPropertiesColorProfile.speedHistogramBarColorProperty
    }, options );

    super(
      histogramsModel.numberOfBins,
      histogramsModel.speedBinWidth,
      histogramsModel.binCountsUpdatedEmitter,
      histogramsModel.allSpeedBinCountsProperty,
      histogramsModel.heavySpeedBinCountsProperty,
      histogramsModel.lightSpeedBinCountsProperty,
      histogramsModel.yScaleProperty,
      speedString, // x-axis label
      numberOfParticlesString, // y-axis label
      options
    );
  }
}

gasProperties.register( 'SpeedHistogramNode', SpeedHistogramNode );
export default SpeedHistogramNode;