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
     * @param {ModelViewTransform2} modelViewTransform
     * @returns {Node}
     * @public
     * @static
     */
    createHeavyParticleIcon( modelViewTransform ) {
      return new ParticleNode( new HeavyParticle(), modelViewTransform );
    },

    /**
     * Creates an icon for a light particle.
     * @param {ModelViewTransform2} modelViewTransform
     * @returns {Node}
     * @public
     * @static
     */
    createLightParticleIcon( modelViewTransform ) {
      return new ParticleNode( new LightParticle(), modelViewTransform );
    },

    //TODO DESIGN create a less detailed icon for the stopwatch, that doesn't need stopwatch
    /**
     * Creates an icon for the stopwatch.
     * @returns {Node}
     * @public
     * @static
     */
    createStopwatchIcon() {
      const stopwatch = new Stopwatch( { visible: true } );
      return new StopwatchNode( stopwatch, {
        scale: 0.25,
        pickable: false
      } );
    },

    //TODO DESIGN create a less detailed icon for the collision counter, that doesn't need collisionCounter or comboBoxListParent
    /**
     * Creates an icon for the collision counter.
     * @returns {Node}
     * @public
     * @static
     */
    createCollisionCounterIcon() {
      const collisionCounter = new CollisionCounter( null /* CollisionDetector */, { visible: true } );
      const comboBoxListParent = new Node();
      return new CollisionCounterNode( collisionCounter, comboBoxListParent, {
        scale: 0.2,
        pickable: false
      } );
    }
  };

  return gasProperties.register( 'GasPropertiesIconFactory', GasPropertiesIconFactory );
} );