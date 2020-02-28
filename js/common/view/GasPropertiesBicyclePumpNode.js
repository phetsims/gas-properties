// Copyright 2018-2020, University of Colorado Boulder

/**
 * GasPropertiesBicyclePumpNode is a specialization of BicyclePumpNode for this sim.
 * It is used to add particles to the container.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Property from '../../../../axon/js/Property.js';
import merge from '../../../../phet-core/js/merge.js';
import BicyclePumpNode from '../../../../scenery-phet/js/BicyclePumpNode.js';
import gasProperties from '../../gasProperties.js';

class GasPropertiesBicyclePumpNode extends BicyclePumpNode {

  /**
   * @param {NumberProperty} numberOfParticlesProperty
   * @param {Object} [options]
   * @constructor
   */
  constructor( numberOfParticlesProperty, options ) {
    assert && assert( numberOfParticlesProperty instanceof NumberProperty,
      `invalid numberOfParticlesProperty: ${numberOfParticlesProperty}` );
    assert && assert( numberOfParticlesProperty.range, 'missing numberOfParticlesProperty.range' );

    options = merge( {

      // superclass options
      height: 230,
      bodyTopFill: 'white',
      hoseCurviness: 0.75,
      dragListenerOptions: {
        numberOfParticlesPerPumpAction: 50,
        addParticlesOneAtATime: false
      }
    }, options );

    super( numberOfParticlesProperty, new Property( numberOfParticlesProperty.range ), options );
  }
}

gasProperties.register( 'GasPropertiesBicyclePumpNode', GasPropertiesBicyclePumpNode );
export default GasPropertiesBicyclePumpNode;