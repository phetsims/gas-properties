// Copyright 2018-2024, University of Colorado Boulder

/**
 * GasPropertiesBicyclePumpNode is a specialization of BicyclePumpNode for this sim.
 * It is used to add particles to the container.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Property from '../../../../axon/js/Property.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import BicyclePumpNode, { BicyclePumpNodeOptions } from '../../../../scenery-phet/js/BicyclePumpNode.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import gasProperties from '../../gasProperties.js';

type SelfOptions = EmptySelfOptions;

export type GasPropertiesBicyclePumpNodeOptions = SelfOptions & BicyclePumpNodeOptions;

export default class GasPropertiesBicyclePumpNode extends BicyclePumpNode {

  public constructor( numberOfParticlesProperty: NumberProperty, providedOptions: GasPropertiesBicyclePumpNodeOptions ) {

    const options = optionize<GasPropertiesBicyclePumpNodeOptions, SelfOptions, BicyclePumpNodeOptions>()( {

      // BicyclePumpNodeOptions
      isDisposable: false,
      height: 230,
      bodyTopFill: 'white',
      hoseCurviness: 0.75,
      handleTouchAreaXDilation: 35,
      handleTouchAreaYDilation: 35,
      numberOfParticlesPerPumpAction: 50,
      addParticlesOneAtATime: false,
      tandem: Tandem.OPT_OUT
    }, providedOptions );

    super( numberOfParticlesProperty, new Property( numberOfParticlesProperty.range ), options );

    this.addLinkedElement( numberOfParticlesProperty );
  }
}

gasProperties.register( 'GasPropertiesBicyclePumpNode', GasPropertiesBicyclePumpNode );