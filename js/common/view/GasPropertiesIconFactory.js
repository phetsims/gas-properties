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
  const GaugeNode = require( 'SCENERY_PHET/GaugeNode' );
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
  const PressureGaugeNode = require( 'GAS_PROPERTIES/common/view/PressureGaugeNode' );
  const Range = require( 'DOT/Range' );
  const Rectangle = require( 'SCENERY/nodes/Rectangle' );
  const ScreenIcon = require( 'JOIST/ScreenIcon' );
  const ShadedRectangle = require( 'SCENERY_PHET/ShadedRectangle' );
  const Shape = require( 'KITE/Shape' );
  const ThermometerNode = require( 'SCENERY_PHET/ThermometerNode' );
  const Vector2 = require( 'DOT/Vector2' );

  const GasPropertiesIconFactory = {

    /**
     * Creates the icon for the Ideal screen.
     * @returns {Node}
     */
    createIdealScreenIcon() {

      const containerNode = new Rectangle( 0, 0, 275, 200, {
        stroke: GasPropertiesColorProfile.containerBoundsStrokeProperty,
        lineWidth: 5
      } );

      const thermometerNode = new ThermometerNode( 0, 100, new NumberProperty( 40 ), {
        backgroundFill: 'white',
        glassThickness: 5,
        left: containerNode.right - 10,
        bottom: containerNode.top + 20
      } );

      const gaugeNode = new GaugeNode( new NumberProperty( 30 ), '', new Range( 0, 100 ), {
        needleLineWidth: 8,
        numberOfTicks: 15,
        majorTickStroke: 'black',
        minorTickStroke: 'black',
        majorTickLength: 16,
        minorTickLength: 8,
        majorTickLineWidth: 6,
        minorTickLineWidth: 4
      } );
      gaugeNode.setScaleMagnitude( 0.5 * containerNode.height / gaugeNode.height );

      const postWidth = 0.6 * gaugeNode.width;
      const postHeight = 0.3 * gaugeNode.height;
      const postNode = new Rectangle( 0, 0, postWidth, postHeight, {
        fill: PressureGaugeNode.createPostGradient( postHeight ),
        stroke: 'black'
      } );

      const particlesParent = new Node( { scale: 0.1 } );
      const particleLocations = [ new Vector2( 0, 0 ), new Vector2( 550, 450 ), new Vector2( -500, 600 ) ];
      const modelViewTransform = ModelViewTransform2.createOffsetScaleMapping( Vector2.ZERO, 2 );
      for ( let i = 0; i < particleLocations.length; i++ ) {
        const particle = GasPropertiesIconFactory.createHeavyParticleIcon( modelViewTransform );
        particlesParent.addChild( particle );
        particle.center = particleLocations[ i ];
      }

      // layout
      thermometerNode.centerX = containerNode.right - 0.25 * containerNode.width;
      thermometerNode.centerY = containerNode.top - 3;
      postNode.left = containerNode.right - 1;
      postNode.centerY = containerNode.centerY;
      gaugeNode.centerX = postNode.right;
      gaugeNode.centerY = postNode.centerY;
      particlesParent.center = containerNode.center;

      const iconNode = new Node( {
        children: [ postNode, containerNode, gaugeNode, particlesParent, thermometerNode ]
      } );

      return new ScreenIcon( iconNode, {
        fill: GasPropertiesColorProfile.screenBackgroundColorProperty
      } );
    },

    /**
     * Creates the icon for the Energy screen.
     * @returns {Node}
     */
    createEnergyScreenIcon() {

      // histogram shape
      const iconWidth = 250;
      const iconHeight = 200;
      const bins = [ 0.8, 1.0, 0.7, 0.5, 0.4, 0.25, 0.1 ];
      const deltaX = iconWidth / bins.length;
      let x = 0;
      let y = 0;
      const iconShape = new Shape().moveTo( x, y );
      for ( let i = 0; i < bins.length; i++ ) {
        x = i * deltaX;
        y = -iconHeight * bins[ i ];
        iconShape.lineTo( x, y );
        x = ( i + 1 ) * deltaX;
        iconShape.lineTo( x, y );
      }
      iconShape.lineTo( iconWidth, 0 ).lineTo( 0, 0 ).close();

      const iconNode = new Path( iconShape, {
        fill: GasPropertiesColorProfile.kineticEnergyHistogramBarColorProperty
      } );

      return new ScreenIcon( iconNode, {
        maxIconHeightProportion: 0.75,
        fill: GasPropertiesColorProfile.screenBackgroundColorProperty
      } );
    },

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
     * @param {Particle} particle - a prototypical particle
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
   * @param {Particle} particle - a prototypical particle
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
   * @param {ColorDef} stroke
   * @returns {Node}
   */
  function createHistogramIcon( stroke ) {

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
      stroke: stroke,
      lineWidth: 1.5
    } );
  }

  return gasProperties.register( 'GasPropertiesIconFactory', GasPropertiesIconFactory );
} );