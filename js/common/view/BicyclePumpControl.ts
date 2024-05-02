// Copyright 2024, University of Colorado Boulder

/**
 * BicyclePumpControl is control for adding particles using a bicycle pump.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import gasProperties from '../../gasProperties.js';
import { Node, NodeOptions, NodeTranslationOptions } from '../../../../scenery/js/imports.js';
import ParticleTypeRadioButtonGroup from './ParticleTypeRadioButtonGroup.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import StringUnionProperty from '../../../../axon/js/StringUnionProperty.js';
import { ParticleType } from '../model/ParticleType.js';
import GasPropertiesBicyclePumpNode, { GasPropertiesBicyclePumpNodeOptions } from './GasPropertiesBicyclePumpNode.js';
import optionize, { combineOptions, EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import GasPropertiesColors from '../GasPropertiesColors.js';
import ToggleNode from '../../../../sun/js/ToggleNode.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';

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
        bodyFill: GasPropertiesColors.heavyParticleColorProperty
      } ) );

    // Bicycle pump for light particles
    const lightBicyclePumpNode = new GasPropertiesBicyclePumpNode( numberOfLightParticlesProperty,
      combineOptions<GasPropertiesBicyclePumpNodeOptions>( {}, bicyclePumpOptions, {
        bodyFill: GasPropertiesColors.lightParticleColorProperty
      } ) );

    // Toggle button for switching between heavy and light bicycle pumps
    const toggleNode = new ToggleNode( particleTypeProperty, [
      { value: 'heavy', createNode: () => heavyBicyclePumpNode },
      { value: 'light', createNode: () => lightBicyclePumpNode }
    ] );

    // Radio buttons for selecting particle type
    const radioButtonGroup = new ParticleTypeRadioButtonGroup( particleTypeProperty, modelViewTransform, {
      centerX: toggleNode.x, // centered under the base of the pump
      top: toggleNode.bottom + 15,
      tandem: options.tandem.createTandem( 'radioButtonGroup' )
    } );

    options.children = [ toggleNode, radioButtonGroup ];

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