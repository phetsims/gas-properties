// Copyright 2019, University of Colorado Boulder

/**
 * Factory methods for creating the various icons that appear in the sim.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const CollisionCounter = require( 'GAS_PROPERTIES/common/model/CollisionCounter' );
  const CollisionCounterNode = require( 'GAS_PROPERTIES/common/view/CollisionCounterNode' );
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const HeavyParticle = require( 'GAS_PROPERTIES/common/model/HeavyParticle' );
  const LightParticle = require( 'GAS_PROPERTIES/common/model/LightParticle' );
  const Node = require( 'SCENERY/nodes/Node' );
  const ParticleNode = require( 'GAS_PROPERTIES/common/view/ParticleNode' );
  const Stopwatch = require( 'GAS_PROPERTIES/common/model/Stopwatch' );
  const StopwatchNode = require( 'GAS_PROPERTIES/common/view/StopwatchNode' );

  const GasPropertiesIconFactory = {

    /**
     * Creates an icon for a heavy particle.
     * @returns {Node}
     * @public
     * @static
     */
    createHeavyParticleIcon() {
      return new ParticleNode( new HeavyParticle() );
    },

    /**
     * Creates an icon for a light particle.
     * @returns {Node}
     * @public
     * @static
     */
    createLightParticleIcon() {
      return new ParticleNode( new LightParticle() );
    },

    //TODO DESIGN create a less detailed icon for the stopwatch
    /**
     * Creates an icon for the stopwatch.
     * @returns {Node}
     * @public
     * @static
     */
    createStopwatchIcon() {
      return new StopwatchNode( new Stopwatch( { visible: true } ), {
        scale: 0.25,
        pickable: false
      } );
    },

    //TODO DESIGN create a less detailed icon for the collision counter
    /**
     * Creates an icon for the collision counter.
     * @returns {Node}
     * @public
     * @static
     */
    createCollisionCounterIcon() {
      return new CollisionCounterNode( new CollisionCounter( { visible: true } ), new Node(), {
        scale: 0.2,
        pickable: false
      } );
    }
  };

  return gasProperties.register( 'GasPropertiesIconFactory', GasPropertiesIconFactory );
} );