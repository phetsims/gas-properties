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
  const ColorDef = require( 'SCENERY/util/ColorDef' );
  const DiffusionParticle1 = require( 'GAS_PROPERTIES/diffusion/model/DiffusionParticle1' );
  const DiffusionParticle2 = require( 'GAS_PROPERTIES/diffusion/model/DiffusionParticle2' );
  const DimensionalArrowsNode = require( 'GAS_PROPERTIES/common/view/DimensionalArrowsNode' );
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const GasPropertiesColorProfile = require( 'GAS_PROPERTIES/common/GasPropertiesColorProfile' );
  const HBox = require( 'SCENERY/nodes/HBox' );
  const HeavyParticle = require( 'GAS_PROPERTIES/common/model/HeavyParticle' );
  const LightParticle = require( 'GAS_PROPERTIES/common/model/LightParticle' );
  const Matrix3 = require( 'DOT/Matrix3' );
  const ModelViewTransform2 = require( 'PHETCOMMON/view/ModelViewTransform2' );
  const Node = require( 'SCENERY/nodes/Node' );
  const NumberProperty = require( 'AXON/NumberProperty' );
  const Path = require( 'SCENERY/nodes/Path' );
  const Particle = require( 'GAS_PROPERTIES/common/model/Particle' );
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
     */
    createHeavyParticleIcon( modelViewTransform ) {
      assert && assert( modelViewTransform instanceof ModelViewTransform2,
        `invalid modelViewTransform: ${modelViewTransform}` );
      return createParticleIcon( new HeavyParticle(), modelViewTransform );
    },

    /**
     * Creates an icon for a light particle.
     * @param {ModelViewTransform2} modelViewTransform
     * @returns {Node}
     * @public
     */
    createLightParticleIcon( modelViewTransform ) {
      assert && assert( modelViewTransform instanceof ModelViewTransform2,
        `invalid modelViewTransform: ${modelViewTransform}` );
      return createParticleIcon( new LightParticle(), modelViewTransform );
    },

    /**
     * Creates an icon for particle type 1 in the Diffusion screen.
     * @param {ModelViewTransform2} modelViewTransform
     * @returns {Node}
     * @public
     */
    createDiffusionParticle1Icon( modelViewTransform ) {
      assert && assert( modelViewTransform instanceof ModelViewTransform2,
        `invalid modelViewTransform: ${modelViewTransform}` );
      return createParticleIcon( new DiffusionParticle1(), modelViewTransform );
    },

    /**
     * Creates an icon for particle type 2 in the Diffusion screen.
     * @param {ModelViewTransform2} modelViewTransform
     * @returns {Node}
     * @public
     */
    createDiffusionParticle2Icon( modelViewTransform ) {
      assert && assert( modelViewTransform instanceof ModelViewTransform2,
        `invalid modelViewTransform: ${modelViewTransform}` );
      return createParticleIcon( new DiffusionParticle2(), modelViewTransform );
    },

    /**
     * Creates a simplified icon for the Stopwatch.
     * @returns {Node}
     * @public
     */
    createStopwatchIcon() {
      return createToolIcon( GasPropertiesColorProfile.stopwatchBackgroundColorProperty );
    },

    /**
     * Creates a simplified icon for the Collision Counter.
     * @returns {Node}
     * @public
     */
    createCollisionCounterIcon() {
      return createToolIcon( GasPropertiesColorProfile.collisionCounterBackgroundColorProperty );
    },

    /**
     * Creates the icon that represents the histogram for a species of particle.
     * @param {Particle} particle
     * @param {ModelViewTransform2} modelViewTransform
     * @returns {Node}
     * @public
     */
    createSpeciesHistogramIcon( particle, modelViewTransform ) {
      assert && assert( modelViewTransform instanceof ModelViewTransform2,
        `invalid modelViewTransform: ${modelViewTransform}` );
      return new HBox( {
        spacing: 3,
        children: [
          createParticleIcon( particle, modelViewTransform ),
          createHistogramIcon( particle.colorProperty )
        ]
      } );
    },

    /**
     * Creates the icon used on the 'Width' checkbox.
     * @returns {Node}
     * @public
     */
    createContainerWidthIcon() {
      return new DimensionalArrowsNode( new NumberProperty( 44 ), {
        color: GasPropertiesColorProfile.widthIconColorProperty,
        pickable: false
      } );
    },

    /**
     * Creates the icon used on the 'Center of Mass' checkbox.
     * @returns {Node}
     * @public
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
   */
  function createParticleIcon( particle, modelViewTransform ) {
    assert && assert( particle instanceof Particle, `invalid particle: ${particle}` );
    assert && assert( modelViewTransform instanceof ModelViewTransform2,
      `invalid modelViewTransform: ${modelViewTransform}` );
    return new ParticleNode( particle, modelViewTransform );
  }

  /**
   * Creates a simplified icon for a tool like the stopwatch or collision counter.
   * @param {ColorDef} color
   * @returns {Node}
   */
  function createToolIcon( color ) {
    assert && assert( ColorDef.isColorDef( color ), `invalid color: ${color}` );

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

  /**
   * Creates an icon for a histogram shape, used for the checkboxes on the histograms.
   * @param {Property.<ColorDef>} strokeProperty
   * @returns {Node}
   */
  function createHistogramIcon( strokeProperty ) {

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
  }

  return gasProperties.register( 'GasPropertiesIconFactory', GasPropertiesIconFactory );
} );