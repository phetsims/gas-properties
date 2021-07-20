// Copyright 2019-2020, University of Colorado Boulder

/**
 * KineticEnergyHistogramNode shows the distribution of the kinetic energy of particles in the container.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../phet-core/js/merge.js';
import GasPropertiesColors from '../../common/GasPropertiesColors.js';
import gasProperties from '../../gasProperties.js';
import gasPropertiesStrings from '../../gasPropertiesStrings.js';
import HistogramsModel from '../model/HistogramsModel.js';
import HistogramNode from './HistogramNode.js';

class KineticEnergyHistogramNode extends HistogramNode {

  /**
   * @param {HistogramsModel} histogramsModel
   * @param {Object} [options]
   */
  constructor( histogramsModel, options ) {
    assert && assert( histogramsModel instanceof HistogramsModel, `invalid histogramModel: ${histogramsModel}` );

    options = merge( {

      // superclass options
      barColor: GasPropertiesColors.kineticEnergyHistogramBarColorProperty
    }, options );

    super(
      histogramsModel.numberOfBins,
      histogramsModel.kineticEnergyBinWidth,
      histogramsModel.binCountsUpdatedEmitter,
      histogramsModel.allKineticEnergyBinCountsProperty,
      histogramsModel.heavyKineticEnergyBinCountsProperty,
      histogramsModel.lightKineticEnergyBinCountsProperty,
      histogramsModel.yScaleProperty,
      gasPropertiesStrings.kineticEnergy, // x-axis label
      gasPropertiesStrings.numberOfParticles, // y-axis label
      options
    );
  }
}

gasProperties.register( 'KineticEnergyHistogramNode', KineticEnergyHistogramNode );
export default KineticEnergyHistogramNode;