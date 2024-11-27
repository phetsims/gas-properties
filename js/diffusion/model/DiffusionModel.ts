// Copyright 2018-2024, University of Colorado Boulder

/**
 * DiffusionModel is the top-level model for the 'Diffusion' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Multilink from '../../../../axon/js/Multilink.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import isSettingPhetioStateProperty from '../../../../tandem/js/isSettingPhetioStateProperty.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import BaseModel from '../../common/model/BaseModel.js';
import gasProperties from '../../gasProperties.js';
import DiffusionCollisionDetector from './DiffusionCollisionDetector.js';
import DiffusionContainer from './DiffusionContainer.js';
import DiffusionData from './DiffusionData.js';
import DiffusionParticleSystem from './DiffusionParticleSystem.js';

export default class DiffusionModel extends BaseModel {

  public readonly container: DiffusionContainer;
  public readonly particleSystem: DiffusionParticleSystem;
  public readonly collisionDetector: DiffusionCollisionDetector;

  // data for the left and right sides of the container, appears in Data accordion box
  public readonly leftData: DiffusionData;
  public readonly rightData: DiffusionData;

  public constructor( tandem: Tandem ) {

    super( {
      modelOriginOffset: new Vector2( 670, 520 ),
      stopwatchPosition: new Vector2( 60, 50 ),
      hasTimeSpeedFeature: true,
      tandem: tandem
    } );

    this.container = new DiffusionContainer( tandem.createTandem( 'container' ) );

    this.particleSystem = new DiffusionParticleSystem( this.container, this.isPlayingProperty, tandem.createTandem( 'particleSystem' ) );

    this.collisionDetector = new DiffusionCollisionDetector( this.container, this.particleSystem );

    const dataTandem = tandem.createTandem( 'data' );
    this.leftData = new DiffusionData( this.container.leftBounds, this.particleSystem, 'left', dataTandem.createTandem( 'leftData' ) );
    this.rightData = new DiffusionData( this.container.rightBounds, this.particleSystem, 'right', dataTandem.createTandem( 'rightData' ) );

    // Update data if these settings are changed while the sim is paused.
    Multilink.multilink( [
        this.particleSystem.particle1Settings.numberOfParticlesProperty,
        this.particleSystem.particle2Settings.numberOfParticlesProperty,
        this.particleSystem.particle1Settings.initialTemperatureProperty,
        this.particleSystem.particle2Settings.initialTemperatureProperty
      ],
      () => {
        if ( !this.isPlayingProperty.value && !isSettingPhetioStateProperty.value ) {
          this.updateData();
        }
      } );

    // When the divider is restored, create a new initial state (and new sets of particles) with same settings.
    this.container.isDividedProperty.link( isDivided => {
      if ( isDivided && !isSettingPhetioStateProperty.value ) {
        this.particleSystem.restart();
      }
    } );
  }

  public override reset(): void {
    super.reset();
    this.container.reset();
    this.particleSystem.reset();
  }

  /**
   * Steps the model using model time units. Order is very important here!
   * @param dt - time delta, in ps
   */
  protected override stepModelTime( dt: number ): void {
    assert && assert( dt > 0, `invalid dt: ${dt}` );

    super.stepModelTime( dt );

    // Particle system
    this.particleSystem.step( dt );

    // Collision detection and response
    this.collisionDetector.step();

    // Update other things that are based on the current state of the particle system.
    this.particleSystem.updateCenterOfMass();
    this.updateData();
  }

  /**
   * Updates the Data displayed for the left and right sides of the container.
   */
  private updateData(): void {
    this.leftData.update();
    this.rightData.update();
  }
}

gasProperties.register( 'DiffusionModel', DiffusionModel );