// Copyright 2019, University of Colorado Boulder

/**
 * Factory methods for creating the various icons that appear in the sim.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const ArrowNode = require( 'SCENERY_PHET/ArrowNode' );
  const Bounds2 = require( 'DOT/Bounds2' );
  const DiffusionParticle1 = require( 'GAS_PROPERTIES/diffusion/model/DiffusionParticle1' );
  const DiffusionParticle2 = require( 'GAS_PROPERTIES/diffusion/model/DiffusionParticle2' );
  const DimensionalArrowsNode = require( 'GAS_PROPERTIES/common/view/DimensionalArrowsNode' );
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const GasPropertiesConstants = require( 'GAS_PROPERTIES/common/GasPropertiesConstants' );
  const GasPropertiesColorProfile = require( 'GAS_PROPERTIES/common/GasPropertiesColorProfile' );
  const HBox = require( 'SCENERY/nodes/HBox' );
  const HeavyParticle = require( 'GAS_PROPERTIES/common/model/HeavyParticle' );
  const LightParticle = require( 'GAS_PROPERTIES/common/model/LightParticle' );
  const Matrix3 = require( 'DOT/Matrix3' );
  const Node = require( 'SCENERY/nodes/Node' );
  const NumberProperty = require( 'AXON/NumberProperty' );
  const Path = require( 'SCENERY/nodes/Path' );
  const ParticleNode = require( 'GAS_PROPERTIES/common/view/ParticleNode' );
  const Rectangle = require( 'SCENERY/nodes/Rectangle' );
  const ShadedRectangle = require( 'SCENERY_PHET/ShadedRectangle' );
  const Shape = require( 'KITE/Shape' );

  const GasPropertiesIconFactory = {

    /**
     * Creates an icon for a heavy particle.
     * @param {ModelViewTransform2} modelViewTransform
     * @returns {Node}
     * @public
     * @static
     */
    createHeavyParticleIcon( modelViewTransform ) {
      return createParticleIcon( new HeavyParticle(), modelViewTransform );
    },

    /**
     * Creates an icon for a light particle.
     * @param {ModelViewTransform2} modelViewTransform
     * @returns {Node}
     * @public
     * @static
     */
    createLightParticleIcon( modelViewTransform ) {
      return createParticleIcon( new LightParticle(), modelViewTransform );
    },

    /**
     * Creates an icon for particle type 1 in the Diffusion screen.
     * @param {ModelViewTransform2} modelViewTransform
     * @returns {Node}
     * @public
     * @static
     */
    createDiffusionParticle1Icon( modelViewTransform ) {
      return createParticleIcon( new DiffusionParticle1( {
        radius: GasPropertiesConstants.RADIUS_RANGE.defaultValue
      } ), modelViewTransform );
    },

    /**
     * Creates an icon for particle type 2 in the Diffusion screen.
     * @param {ModelViewTransform2} modelViewTransform
     * @returns {Node}
     * @public
     * @static
     */
    createDiffusionParticle2Icon( modelViewTransform ) {
      return createParticleIcon( new DiffusionParticle2( {
        radius: GasPropertiesConstants.RADIUS_RANGE.defaultValue
      } ), modelViewTransform );
    },

    /**
     * Creates a simplified icon for the stopwatch.
     * @returns {Node}
     * @public
     * @static
     */
    createStopwatchIcon() {
      return createToolIcon( 'rgb( 80, 130, 230 )' );
    },

    /**
     * Creates a simplified icon for the collision counter.
     * @returns {Node}
     * @public
     * @static
     */
    createCollisionCounterIcon() {
      return createToolIcon( GasPropertiesColorProfile.collisionCounterBackgroundColorProperty );
    },

    /**
     * Creates an icon for a histogram shape, used for the checkboxes on the Speed histogram.
     * @param {Property.<ColorDef>} strokeProperty
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
     * Creates the icon used on the 'Width' checkbox.
     * @returns {Node}
     * @public
     * @static
     */
    createContainerWidthIcon() {
      return new DimensionalArrowsNode( new NumberProperty( 44 ), {
        color: GasPropertiesColorProfile.sizeArrowColorProperty,
        pickable: false
      } );
    },

    /**
     * Creates the icon used on the 'Center of Mass' checkbox.
     * @returns {Node}
     * @public
     * @static
     */
    createCenterOfMassIcon() {

      const width = 4;
      const height = 15;

      return new HBox( {
        spacing: 12,
        children: [
          new Rectangle( 0, 0, width, height, {
            fill: GasPropertiesColorProfile.particle1ColorProperty,
            stroke: GasPropertiesColorProfile.centerOfMassStrokeProperty
          } ),
          new Rectangle( 0, 0, width, height, {
            fill: GasPropertiesColorProfile.particle2ColorProperty,
            stroke: GasPropertiesColorProfile.centerOfMassStrokeProperty
          } )
        ]
      } );
    },

    /**
     * Creates the icon used on the 'Particle Flow Rate' checkbox.
     * @returns {Node}
     * @public
     * @static
     */
    createParticleFlowRateIcon() {

      const arrowOptions = {
        fill: GasPropertiesColorProfile.particle1ColorProperty,
        stroke: 'black',
        headHeight: 12,
        headWidth: 12,
        tailWidth: 6
      };

      return new HBox( {
        spacing: 3,
        children: [
          new ArrowNode( 0, 0, -18, 0, arrowOptions ),
          new ArrowNode( 0, 0, 24, 0, arrowOptions )
        ]
      } );
    }
  };

  /**
   * Creates the icon for a particle.
   * @param {Particle} particle
   * @param {ModelViewTransform2} modelViewTransform
   * @returns {Node}
   * @public
   * @static
   */
  function createParticleIcon( particle, modelViewTransform ) {
    return new ParticleNode( particle, modelViewTransform );
  }

  /**
   * Creates a simplified icons for a tool like the stopwatch or collision counter.
   * @param {ColorDef} color
   * @returns {Node}
   * @public
   * @static
   */
  function createToolIcon( color ) {

    const background = new ShadedRectangle( new Bounds2( 0, 0, 25, 20 ), {
      baseColor: color,
      cornerRadius: 4
    } );

    const display = new Rectangle( 0, 0, 0.75 * background.width, 0.35 * background.height, {
      fill: 'white',
      stroke: 'black',
      lineWidth: 0.5,
      cornerRadius: 1.5,
      centerX: background.centerX,
      top: background.top + 0.25 * background.height
    } );

    return new Node( {
      children: [ background, display ]
    } );
  }

  return gasProperties.register( 'GasPropertiesIconFactory', GasPropertiesIconFactory );
} );