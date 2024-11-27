// Copyright 2019-2024, University of Colorado Boulder

/**
 * KineticEnergyHistogramNode shows the distribution of the kinetic energy of particles in the container.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
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

  public constructor( histogramsModel: HistogramsModel,
                      accordionBoxExpandedProperty: TReadOnlyProperty<boolean>,
                      providedOptions: KineticEnergyHistogramNodeOptions ) {

    const options = optionize<KineticEnergyHistogramNodeOptions, SelfOptions, HistogramNodeOptions>()( {

      // HistogramNodeOptions
      barColor: GasPropertiesColors.kineticEnergyHistogramBarColorProperty
    }, providedOptions );

    super(
      histogramsModel.numberOfBins,
      histogramsModel.kineticEnergyBinWidth,
      histogramsModel.heavyKineticEnergyBinCountsProperty,
      histogramsModel.lightKineticEnergyBinCountsProperty,
      histogramsModel.totalKineticEnergyBinCountsProperty,
      histogramsModel.zoomLevelIndexProperty,
      GasPropertiesStrings.kineticEnergyStringProperty, // x-axis label
      GasPropertiesStrings.numberOfParticlesStringProperty, // y-axis label
      accordionBoxExpandedProperty,
      options
    );

    // See https://github.com/phetsims/gas-properties/issues/253
    this.addLinkedElement( histogramsModel );
  }
}

gasProperties.register( 'KineticEnergyHistogramNode', KineticEnergyHistogramNode );