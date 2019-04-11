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
  const GasPropertiesColorProfile = require( 'GAS_PROPERTIES/common/GasPropertiesColorProfile' );
  const HBox = require( 'SCENERY/nodes/HBox' );
  const HeavyParticle = require( 'GAS_PROPERTIES/common/model/HeavyParticle' );
  const LightParticle = require( 'GAS_PROPERTIES/common/model/LightParticle' );
  const Line = require( 'SCENERY/nodes/Line' );
  const Matrix3 = require( 'DOT/Matrix3' );
  const Node = require( 'SCENERY/nodes/Node' );
  const Path = require( 'SCENERY/nodes/Path' );
  const ParticleNode = require( 'GAS_PROPERTIES/common/view/ParticleNode' );
  const Shape = require( 'KITE/Shape' );
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
    },

    /**
     * Creates an icon for a histogram shape, used for the checkboxes on the Speed histogram.
     * @param {Property.<Color|null>} strokeProperty
     * @public
     * @static
     */
    createHistogramIcon( strokeProperty ) {

      // unit shape
      const shape = new Shape()
        .moveTo( 0, 1 )
        .lineTo( 0, 0.25 )
        .lineTo( 0.25, 0.25 )
        .lineTo( 0.25, 0 )
        .lineTo( 0.5, 0 )
        .lineTo( 0.5, 0.5 )
        .lineTo( 0.75, 0.5 )
        .lineTo( 0.75, 0.75 )
        .lineTo( 1, 0.75 )
        .lineTo( 1, 1 )
        .transformed( Matrix3.scaling( 12, 12 ) );

      return new Path( shape, {
        stroke: strokeProperty,
        lineWidth: 1.5
      } );
    },

    /**
     * Creates the icon used on the 'Center of Mass' checkbox.
     * @returns {Node}
     * @public
     * @static
     */
    createCenterOfMassIcon() {

      const lineLength = 15;
      const lineWidth = 2;

      return new HBox( {
        spacing: 12,
        children: [
          new Line( 0, 0, 0, lineLength, {
            stroke: GasPropertiesColorProfile.diffusionParticle1ColorProperty,
            lineWidth: lineWidth
          } ),
          new Line( 0, 0, 0, lineLength, {
            stroke: GasPropertiesColorProfile.diffusionParticle2ColorProperty,
            lineWidth: lineWidth
          } )
        ]
      } );
    }
  };

  return gasProperties.register( 'GasPropertiesIconFactory', GasPropertiesIconFactory );
} );