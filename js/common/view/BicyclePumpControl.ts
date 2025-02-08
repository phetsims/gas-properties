// Copyright 2024-2025, University of Colorado Boulder

/**
 * BicyclePumpControl is control for adding particles using a bicycle pump.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import StringUnionProperty from '../../../../axon/js/StringUnionProperty.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import optionize, { combineOptions, EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import Node, { NodeOptions, NodeTranslationOptions } from '../../../../scenery/js/nodes/Node.js';
import gasProperties from '../../gasProperties.js';
import GasPropertiesColors from '../GasPropertiesColors.js';
import { ParticleType } from '../model/ParticleType.js';
import GasPropertiesBicyclePumpNode, { GasPropertiesBicyclePumpNodeOptions } from './GasPropertiesBicyclePumpNode.js';
import ParticleTypeRadioButtonGroup from './ParticleTypeRadioButtonGroup.js';

type SelfOptions = EmptySelfOptions;

type BicyclePumpControlOptions = SelfOptions & NodeTranslationOptions & PickRequired<NodeOptions, 'tandem'>;

export default class BicyclePumpControl extends Node {

  private readonly heavyBicyclePumpNode: GasPropertiesBicyclePumpNode;
  private readonly lightBicyclePumpNode: GasPropertiesBicyclePumpNode;

  public constructor( particleTypeProperty: StringUnionProperty<ParticleType>,
                      numberOfHeavyParticlesProperty: NumberProperty,
                      numberOfLightParticlesProperty: NumberProperty,
                      modelViewTransform: ModelViewTransform2,
                      providedOptions: BicyclePumpControlOptions ) {

    const options = optionize<BicyclePumpControlOptions, SelfOptions, NodeOptions>()( {

      // NodeOptions
      isDisposable: false,
      phetioFeatured: true
    }, providedOptions );

    const bicyclePumpOptions: StrictOmit<GasPropertiesBicyclePumpNodeOptions, 'tandem'> = {
      hoseAttachmentOffset: new Vector2( -67, -141 ) // Set empirically, from the bottom-center of the pump.
    };

    // Bicycle pump for heavy particles
    const heavyBicyclePumpNode = new GasPropertiesBicyclePumpNode( numberOfHeavyParticlesProperty,
      combineOptions<GasPropertiesBicyclePumpNodeOptions>( {}, bicyclePumpOptions, {
        bodyFill: GasPropertiesColors.heavyParticleColorProperty,
        visibleProperty: new DerivedProperty( [ particleTypeProperty ], particleType => particleType === 'heavy' )
      } ) );

    // Bicycle pump for light particles
    const lightBicyclePumpNode = new GasPropertiesBicyclePumpNode( numberOfLightParticlesProperty,
      combineOptions<GasPropertiesBicyclePumpNodeOptions>( {}, bicyclePumpOptions, {
        bodyFill: GasPropertiesColors.lightParticleColorProperty,
        visibleProperty: new DerivedProperty( [ particleTypeProperty ], particleType => particleType === 'light' )
      } ) );

    // Radio buttons for selecting particle type
    const radioButtonGroup = new ParticleTypeRadioButtonGroup( particleTypeProperty, modelViewTransform, {
      centerX: heavyBicyclePumpNode.x, // centered under the base of the pump
      top: heavyBicyclePumpNode.bottom + 15,
      tandem: options.tandem.createTandem( 'radioButtonGroup' )
    } );

    options.children = [ heavyBicyclePumpNode, lightBicyclePumpNode, radioButtonGroup ];

    super( options );

    this.heavyBicyclePumpNode = heavyBicyclePumpNode;
    this.lightBicyclePumpNode = lightBicyclePumpNode;

    this.addLinkedElement( numberOfHeavyParticlesProperty );
    this.addLinkedElement( numberOfLightParticlesProperty );

    particleTypeProperty.lazyLink( () => this.interruptSubtreeInput() );

    this.pdomOrder = [
      heavyBicyclePumpNode,
      lightBicyclePumpNode,
      radioButtonGroup
    ];
  }

  public reset(): void {
    this.heavyBicyclePumpNode.reset();
    this.lightBicyclePumpNode.reset();
  }
}

gasProperties.register( 'BicyclePumpControl', BicyclePumpControl );