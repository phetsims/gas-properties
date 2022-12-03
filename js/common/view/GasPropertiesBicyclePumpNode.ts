// Copyright 2018-2022, University of Colorado Boulder

/**
 * GasPropertiesBicyclePumpNode is a specialization of BicyclePumpNode for this sim.
 * It is used to add particles to the container.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Property from '../../../../axon/js/Property.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import BicyclePumpNode, { BicyclePumpNodeOptions } from '../../../../scenery-phet/js/BicyclePumpNode.js';
import gasProperties from '../../gasProperties.js';

type SelfOptions = EmptySelfOptions;

export type GasPropertiesBicyclePumpNodeOptions = SelfOptions & BicyclePumpNodeOptions &
  PickRequired<BicyclePumpNodeOptions, 'tandem'>;

export default class GasPropertiesBicyclePumpNode extends BicyclePumpNode {

  public constructor( numberOfParticlesProperty: NumberProperty, providedOptions: GasPropertiesBicyclePumpNodeOptions ) {

    const options = optionize<GasPropertiesBicyclePumpNodeOptions, SelfOptions, BicyclePumpNodeOptions>()( {

      // BicyclePumpNodeOptions
      height: 230,
      bodyTopFill: 'white',
      hoseCurviness: 0.75,
      dragListenerOptions: {
        numberOfParticlesPerPumpAction: 50,
        addParticlesOneAtATime: false
      }
    }, providedOptions );

    super( numberOfParticlesProperty, new Property( numberOfParticlesProperty.range ), options );
  }

  public override dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }
}

gasProperties.register( 'GasPropertiesBicyclePumpNode', GasPropertiesBicyclePumpNode );