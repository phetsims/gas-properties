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
  const HandleNode = require( 'SCENERY_PHET/HandleNode' );
  const HBox = require( 'SCENERY/nodes/HBox' );
  const HeavyParticle = require( 'GAS_PROPERTIES/common/model/HeavyParticle' );
  const LightParticle = require( 'GAS_PROPERTIES/common/model/LightParticle' );
  const Matrix3 = require( 'DOT/Matrix3' );
  const ModelViewTransform2 = require( 'PHETCOMMON/view/ModelViewTransform2' );
  const Line = require( 'SCENERY/nodes/Line' );
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

  // constants
  const SCREEN_ICONS_TRANSFORM = ModelViewTransform2.createIdentity();

  const GasPropertiesIconFactory = {

    /**
     * Creates the icon for the Ideal screen.
     * @returns {Node}
     * @public
     */
    createIdealScreenIcon() {

      // Container
      const containerNode = new Rectangle( 0, 0, 275, 200, {
        stroke: GasPropertiesColorProfile.containerBoundsStrokeProperty,
        lineWidth: 5
      } );

      // Thermometer
      const thermometerNode = new ThermometerNode( 0, 100, new NumberProperty( 40 ), {
        backgroundFill: 'white',
        glassThickness: 5,
        centerX: containerNode.right - 0.25 * containerNode.width,
        centerY: containerNode.top - 3
      } );

      // Gauge
      const gaugeNode = new GaugeNode( new NumberProperty( 30 ), '', new Range( 0, 100 ), {
        radius: 0.25 * containerNode.height,
        needleLineWidth: 6,
        numberOfTicks: 15,
        majorTickStroke: 'black',
        minorTickStroke: 'black',
        left: containerNode.right + 15,
        top: containerNode.top
      } );

      // Post that connects the gauge to the container
      const postWidth = gaugeNode.centerX - containerNode.right;
      const postHeight = 0.3 * gaugeNode.height;
      const postNode = new Rectangle( 0, 0, postWidth, postHeight, {
        fill: PressureGaugeNode.createPostGradient( postHeight ),
        stroke: 'black',
        left: containerNode.right - 1, // overlap
        centerY: gaugeNode.centerY
      } );

      // Particles, locations determined empirically in view coordinates
      const particleLocations = [ new Vector2( 0, 300 ), new Vector2( 250, 0 ), new Vector2( 575, 225 ) ];
      const particleNodes = [];
      for ( let i = 0; i < particleLocations.length; i++ ) {
        particleNodes.push( GasPropertiesIconFactory.createHeavyParticleIcon( SCREEN_ICONS_TRANSFORM, {
          center: particleLocations[ i ]
        } ) );
      }
      const particlesParent = new Node( {
        scale: 0.2,
        center: containerNode.center,
        children: particleNodes
      } );

      const iconNode = new Node( {
        children: [ postNode, containerNode, gaugeNode, particlesParent, thermometerNode ]
      } );

      return new ScreenIcon( iconNode, {
        fill: GasPropertiesColorProfile.screenBackgroundColorProperty
      } );
    },

    /**
     * Creates the icon for the Explore screen.
     * @returns {Node}
     * @public
     */
    createExploreScreenIcon() {

      // Vertical section of container wall
      const wallNode = new Line( 0, 0, 0, 300, {
        stroke: GasPropertiesColorProfile.containerBoundsStrokeProperty,
        lineWidth: 10
      } );

      // Handle, attached to the left of the wall
      const handleNode = new HandleNode( {
        gripBaseColor: GasPropertiesColorProfile.resizeGripColorProperty,
        rotation: -Math.PI / 2,
        right: wallNode.left + 3, // overlap
        centerY: wallNode.centerY
      } );

      // Particles, locations determined empirically, relative to rightCenter of wall
      const particlesNode = new Node( {
        scale: 0.25,
        translation: wallNode.rightCenter,
        children: [

          // 2 particles against the wall
          GasPropertiesIconFactory.createHeavyParticleIcon( SCREEN_ICONS_TRANSFORM, {
            left: 0,
            bottom: 0
          } ),
          GasPropertiesIconFactory.createHeavyParticleIcon( SCREEN_ICONS_TRANSFORM, {
            left: 0,
            top: 0
          } ),

          // 2 particles away from the wall
          GasPropertiesIconFactory.createHeavyParticleIcon( SCREEN_ICONS_TRANSFORM, {
            left: 800,
            centerY: 340
          } ),
          GasPropertiesIconFactory.createHeavyParticleIcon( SCREEN_ICONS_TRANSFORM, {
            left: 600,
            centerY: -200
          } )
        ]
      } );

      const iconNode = new Node( {
        children: [ handleNode, wallNode, particlesNode ]
      } );

      return new ScreenIcon( iconNode, {
        maxIconWidthProportion: 1,
        maxIconHeightProportion: 1,
        fill: GasPropertiesColorProfile.screenBackgroundColorProperty
      } );
    },

    /**
     * Creates the icon for the Energy screen.
     * @returns {Node}
     * @public
     */
    createEnergyScreenIcon() {

      // histogram shape
      const iconWidth = 300;
      const iconHeight = 200;
      const binCounts= [ 0.8, 1.0, 0.85, 0.53, 0.33, 0.21, 0.13, 0.08, 0.05, 0.03 ];
      const deltaX = iconWidth / binCounts.length;
      let x = 0;
      let y = 0;
      const iconShape = new Shape().moveTo( x, y );
      for ( let i = 0; i < binCounts.length; i++ ) {
        x = i * deltaX;
        y = -iconHeight * binCounts[ i ];
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
     * Creates the icon for the Diffusion screen.
     * @returns {Node}
     * @public
     */
    createDiffusionScreenIcon() {

      // Invisible container, so that divider is centered
      const containerNode = new Rectangle( 0, 0, 425, 300, {
        stroke: phet.chipper.queryParameters.dev ? 'red' : null
      } );

      const dividerNode = new Line( 0, 0, 0, containerNode.height, {
        stroke: GasPropertiesColorProfile.dividerColorProperty,
        lineWidth: 12,
        center: containerNode.center
      } );

      // Particles, locations determined empirically, relative to centerX of divider
      const particle1Locations = [
        new Vector2( -400, 300 ), new Vector2( -600, 600 ), new Vector2( -340, 800 )
      ];
      const particle2Locations = [
        new Vector2( 400, 300 ), new Vector2( 660, 740 )
      ];

      // Create particle icons, relative to centerTop of divider
      const particleNodes = [];
      for ( let i = 0; i < particle1Locations.length; i++ ) {
        particleNodes.push( GasPropertiesIconFactory.createDiffusionParticle1Icon( SCREEN_ICONS_TRANSFORM, {
          center: particle1Locations[ i ]
        } ) );
      }
      for ( let i = 0; i < particle2Locations.length; i++ ) {
        particleNodes.push( GasPropertiesIconFactory.createDiffusionParticle2Icon( SCREEN_ICONS_TRANSFORM, {
          center: particle2Locations[ i ]
        } ) );
      }

      const particlesParent = new Node( {
        scale: 0.25,
        translation: dividerNode.centerTop,
        children: particleNodes
      } );

      const iconNode = new Node( {
        children: [ containerNode, dividerNode, particlesParent ]
      } );

      return new ScreenIcon( iconNode, {
        maxIconWidthProportion: 1,
        maxIconHeightProportion: 1,
        fill: GasPropertiesColorProfile.screenBackgroundColorProperty
      } );
    },

    /**
     * Creates the icon for the Intro screen in the Gases Intro sim.
     * @returns {Node}
     * @public
     */
    createIntroScreenIcon() {

      // Invisible container
      const containerNode = new Rectangle( 0, 0, 800, 600, {
        stroke: phet.chipper.queryParameters.dev ? 'red' : null
      } );

      // Particles, locations determined empirically in view coordinates
      const heavyParticleLocations = [
        new Vector2( 0, 850 ), new Vector2( 110, 105 ), new Vector2( 555, 945 ),
        new Vector2( 670, 425 ), new Vector2( 1000, 125 ), new Vector2( 1220, 1050 ) ];
      const lightParticleLocations = [
        new Vector2( 278, 475 ), new Vector2( 1000, 680 ), new Vector2( 1450, 210 )
      ];

      // Create particle icons
      const particleNodes = [];
      for ( let i = 0; i < heavyParticleLocations.length; i++ ) {
        particleNodes.push( GasPropertiesIconFactory.createHeavyParticleIcon( SCREEN_ICONS_TRANSFORM, {
          center: heavyParticleLocations[ i ]
        } ) );
      }
      for ( let i = 0; i < lightParticleLocations.length; i++ ) {
        particleNodes.push( GasPropertiesIconFactory.createLightParticleIcon( SCREEN_ICONS_TRANSFORM, {
          center: lightParticleLocations[ i ]
        } ) );
      }

      const particlesParent = new Node( {
        scale: 0.45,
        center: containerNode.center,
        children: particleNodes
      } );

      const iconNode = new Node( {
        children: [ containerNode, particlesParent ]
      } );

      return new ScreenIcon( iconNode, {
        maxIconWidthProportion: 1,
        maxIconHeightProportion: 0.9,
        fill: GasPropertiesColorProfile.screenBackgroundColorProperty
      } );
    },

    /**
     * Creates an icon for a heavy particle.
     * @param {ModelViewTransform2} modelViewTransform
     * @param {Object} [options] - see ParticleNode options
     * @returns {Node}
     * @public
     */
    createHeavyParticleIcon( modelViewTransform, options ) {
      assert && assert( modelViewTransform instanceof ModelViewTransform2,
        `invalid modelViewTransform: ${modelViewTransform}` );
      return createParticleIcon( new HeavyParticle(), modelViewTransform, options );
    },

    /**
     * Creates an icon for a light particle.
     * @param {ModelViewTransform2} modelViewTransform
     * @param {Object} [options] - see ParticleNode options
     * @returns {Node}
     * @public
     */
    createLightParticleIcon( modelViewTransform, options ) {
      assert && assert( modelViewTransform instanceof ModelViewTransform2,
        `invalid modelViewTransform: ${modelViewTransform}` );
      return createParticleIcon( new LightParticle(), modelViewTransform, options );
    },

    /**
     * Creates an icon for particle type 1 in the Diffusion screen.
     * @param {ModelViewTransform2} modelViewTransform
     * @param {Object} [options] - see ParticleNode options
     * @returns {Node}
     * @public
     */
    createDiffusionParticle1Icon( modelViewTransform, options ) {
      assert && assert( modelViewTransform instanceof ModelViewTransform2,
        `invalid modelViewTransform: ${modelViewTransform}` );
      return createParticleIcon( new DiffusionParticle1(), modelViewTransform, options );
    },

    /**
     * Creates an icon for particle type 2 in the Diffusion screen.
     * @param {ModelViewTransform2} modelViewTransform
     * @param {Object} [options] - see ParticleNode options
     * @returns {Node}
     * @public
     */
    createDiffusionParticle2Icon( modelViewTransform, options ) {
      assert && assert( modelViewTransform instanceof ModelViewTransform2,
        `invalid modelViewTransform: ${modelViewTransform}` );
      return createParticleIcon( new DiffusionParticle2(), modelViewTransform, options );
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
    },

    /**
     * Creates the icon used for the 'Scale' checkbox.
     * @returns {Node}
     * @public
     */
    createScaleIcon() {

      const scaleLength = 30;
      const tickLength = 6;
      const numberOfTicks = 5;
      const tickInterval = scaleLength / ( numberOfTicks - 1 );

      const shape = new Shape().moveTo( 0, 0 ).lineTo( scaleLength, 0 );
      for ( let i = 0; i < numberOfTicks; i++ ) {
        shape.moveTo( i * tickInterval, 0 ).lineTo( i * tickInterval, tickLength );
      }

      return new Path( shape, {
        stroke: GasPropertiesColorProfile.scaleColorProperty,
        lineWidth: 1
      } );
    }
  };

  /**
   * Creates the icon for a particle.
   * @param {Particle} particle - a prototypical particle
   * @param {ModelViewTransform2} modelViewTransform
   * @param {Object} [options] - see ParticleNode options
   * @returns {Node}
   */
  function createParticleIcon( particle, modelViewTransform, options ) {
    assert && assert( particle instanceof Particle, `invalid particle: ${particle}` );
    assert && assert( modelViewTransform instanceof ModelViewTransform2,
      `invalid modelViewTransform: ${modelViewTransform}` );
    return new ParticleNode( particle, modelViewTransform, options );
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