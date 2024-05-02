// Copyright 2018-2024, University of Colorado Boulder

/**
 * EnergyModel is the top-level model for the 'Energy' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Tandem from '../../../../tandem/js/Tandem.js';
import IdealGasLawModel from '../../common/model/IdealGasLawModel.js';
import gasProperties from '../../gasProperties.js';
import AverageSpeedModel from './AverageSpeedModel.js';
import HistogramsModel from './HistogramsModel.js';
import RangeWithValue from '../../../../dot/js/RangeWithValue.js';

const SAMPLE_PERIOD = 1; // sample period for Average Speed and histograms, in ps
const CONTAINER_WIDTH = 10000; // pm

export default class EnergyModel extends IdealGasLawModel {

  public readonly histogramsModel: HistogramsModel;
  public readonly averageSpeedModel: AverageSpeedModel;

  public constructor( tandem: Tandem ) {

    super( {
      holdConstant: 'volume',
      holdConstantValues: [ 'volume' ],
      hasCollisionCounter: false,
      containerOptions: {
        widthRange: new RangeWithValue( CONTAINER_WIDTH, CONTAINER_WIDTH, CONTAINER_WIDTH )
      },
      phetioCollisionsEnabledPropertyInstrumented: true,
      hasInjectionTemperatureFeature: true,
      tandem: tandem
    } );

    this.histogramsModel = new HistogramsModel( this.particleSystem, this.isPlayingProperty, SAMPLE_PERIOD, {
      tandem: tandem.createTandem( 'histogramsModel' )
    } );

    this.averageSpeedModel = new AverageSpeedModel( this.particleSystem, this.isPlayingProperty, SAMPLE_PERIOD, {
      tandem: tandem.createTandem( 'averageSpeedModel' )
    } );
  }

  public override reset(): void {
    super.reset();
    this.averageSpeedModel.reset();
    this.histogramsModel.reset();
  }

  /**
   * Steps the model, using model time units.
   * @param dt - time delta, in ps
   */
  protected override stepModelTime( dt: number ): void {
    assert && assert( dt > 0, `invalid dt: ${dt}` );

    super.stepModelTime( dt );
    this.averageSpeedModel.step( dt );
    this.histogramsModel.step( dt );
  }
}

gasProperties.register( 'EnergyModel', EnergyModel );