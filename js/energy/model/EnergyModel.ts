// Copyright 2018-2022, University of Colorado Boulder

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

// constants
const SAMPLE_PERIOD = 1; // sample period for Average Speed and histograms, in ps

export default class EnergyModel extends IdealGasLawModel {

  public readonly histogramsModel: HistogramsModel;
  public readonly averageSpeedModel: AverageSpeedModel;

  public constructor( tandem: Tandem ) {

    super( tandem, {
      holdConstant: 'volume',
      hasCollisionCounter: false
    } );

    // In case clients attempt to use this feature of the base class
    this.holdConstantProperty.lazyLink( holdConstant => {
      throw new Error( 'holdConstant is fixed in the Energy screen' );
    } );

    // In case clients attempt to use this feature of the base class
    this.container.widthProperty.lazyLink( width => {
      throw new Error( 'container width is fixed in the Energy screen' );
    } );

    this.histogramsModel = new HistogramsModel( this.particleSystem, this.isPlayingProperty, SAMPLE_PERIOD, {
      tandem: tandem.createTandem( 'histogramsModel' )
    } );

    this.averageSpeedModel = new AverageSpeedModel( this.particleSystem, this.isPlayingProperty, SAMPLE_PERIOD, {
      tandem: tandem.createTandem( 'averageSpeedModel' )
    } );
  }

  public override dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
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