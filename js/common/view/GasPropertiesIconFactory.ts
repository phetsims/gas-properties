// Copyright 2019-2023, University of Colorado Boulder

/**
 * GasPropertiesIconFactory is a set of factory methods for creating the various icons that appear in the sim.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Property from '../../../../axon/js/Property.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import Matrix3 from '../../../../dot/js/Matrix3.js';
import Range from '../../../../dot/js/Range.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import ScreenIcon from '../../../../joist/js/ScreenIcon.js';
import { Shape } from '../../../../kite/js/imports.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import ArrowNode from '../../../../scenery-phet/js/ArrowNode.js';
import GaugeNode from '../../../../scenery-phet/js/GaugeNode.js';
import HandleNode from '../../../../scenery-phet/js/HandleNode.js';
import ShadedRectangle from '../../../../scenery-phet/js/ShadedRectangle.js';
import ThermometerNode from '../../../../scenery-phet/js/ThermometerNode.js';
import { HBox, Line, Node, Path, Rectangle, TColor } from '../../../../scenery/js/imports.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import DiffusionParticle1 from '../../diffusion/model/DiffusionParticle1.js';
import DiffusionParticle2 from '../../diffusion/model/DiffusionParticle2.js';
import gasProperties from '../../gasProperties.js';
import GasPropertiesColors from '../GasPropertiesColors.js';
import HeavyParticle from '../model/HeavyParticle.js';
import LightParticle from '../model/LightParticle.js';
import Particle from '../model/Particle.js';
import DimensionalArrowsNode from './DimensionalArrowsNode.js';
import ParticleNode, { ParticleNodeOptions } from './ParticleNode.js';
import PressureGaugeNode from './PressureGaugeNode.js';

// constants
const SCREEN_ICONS_TRANSFORM = ModelViewTransform2.createIdentity();

const GasPropertiesIconFactory = {

  /**
   * Creates the icon for the Ideal screen.
   */
  createIdealScreenIcon(): ScreenIcon {

    // Container
    const containerNode = new Rectangle( 0, 0, 275, 200, {
      stroke: GasPropertiesColors.containerBoundsStrokeProperty,
      lineWidth: 5
    } );

    // Thermometer
    const thermometerNode = new ThermometerNode( new NumberProperty( 40 ), 0, 100, {
      backgroundFill: 'white',
      glassThickness: 5,
      centerX: containerNode.right - 0.25 * containerNode.width,
      centerY: containerNode.top - 3
    } );

    // Gauge
    const gaugeNode = new GaugeNode( new NumberProperty( 30 ), new Property( '' ), new Range( 0, 100 ), {
      radius: 0.25 * containerNode.height,
      needleLineWidth: 6,
      numberOfTicks: 15,
      majorTickStroke: 'black',
      minorTickStroke: 'black',
      left: containerNode.right + 15,
      top: containerNode.top,
      tandem: Tandem.OPT_OUT
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

    // Particles, positions determined empirically in view coordinates, specified left to right
    const particlePositions = [ new Vector2( 0, 300 ), new Vector2( 250, 0 ), new Vector2( 575, 225 ) ];
    const particleNodes = [];
    for ( let i = 0; i < particlePositions.length; i++ ) {
      particleNodes.push( GasPropertiesIconFactory.createHeavyParticleIcon( SCREEN_ICONS_TRANSFORM, {
        center: particlePositions[ i ]
      } ) );
    }

    // Parent for particles, scale empirically
    const particlesParent = new Node( {
      scale: 0.2,
      center: containerNode.center,
      children: particleNodes
    } );

    const iconNode = new Node( {
      children: [ postNode, containerNode, gaugeNode, particlesParent, thermometerNode ]
    } );

    return new ScreenIcon( iconNode, {
      fill: GasPropertiesColors.screenBackgroundColorProperty
    } );
  },

  /**
   * Creates the icon for the Explore screen.
   */
  createExploreScreenIcon(): ScreenIcon {

    // Vertical section of container wall
    const wallNode = new Line( 0, 0, 0, 300, {
      stroke: GasPropertiesColors.containerBoundsStrokeProperty,
      lineWidth: 10
    } );

    // Handle, attached to the left of the wall
    const handleNode = new HandleNode( {
      gripBaseColor: GasPropertiesColors.resizeGripColorProperty,
      rotation: -Math.PI / 2,
      right: wallNode.left + 3, // overlap
      centerY: wallNode.centerY
    } );

    // Particles, positions determined empirically, relative to rightCenter of wall
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
      fill: GasPropertiesColors.screenBackgroundColorProperty
    } );
  },

  /**
   * Creates the icon for the Energy screen.
   */
  createEnergyScreenIcon(): ScreenIcon {

    // histogram shape
    const iconWidth = 300;
    const iconHeight = 200;
    const binCounts = [ 0.8, 1.0, 0.85, 0.53, 0.33, 0.21, 0.13, 0.08, 0.05, 0.03 ];
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
      fill: GasPropertiesColors.kineticEnergyHistogramBarColorProperty
    } );

    return new ScreenIcon( iconNode, {
      maxIconHeightProportion: 0.75,
      fill: GasPropertiesColors.screenBackgroundColorProperty
    } );
  },

  /**
   * Creates the icon for the Diffusion screen.
   */
  createDiffusionScreenIcon(): ScreenIcon {

    // Invisible container, so that divider is centered
    const containerNode = new Rectangle( 0, 0, 425, 300, {
      stroke: phet.chipper.queryParameters.dev ? 'red' : null
    } );

    const dividerNode = new Line( 0, 0, 0, containerNode.height, {
      stroke: GasPropertiesColors.dividerColorProperty,
      lineWidth: 12,
      center: containerNode.center
    } );

    // Particles, positions determined empirically, relative to centerX of divider, specified left to right
    const particle1Positions = [
      new Vector2( -400, 300 ), new Vector2( -600, 600 ), new Vector2( -340, 800 )
    ];
    const particle2Positions = [
      new Vector2( 400, 300 ), new Vector2( 660, 740 )
    ];

    // Create particle icons, relative to centerTop of divider
    const particleNodes = [];
    for ( let i = 0; i < particle1Positions.length; i++ ) {
      particleNodes.push( GasPropertiesIconFactory.createDiffusionParticle1Icon( SCREEN_ICONS_TRANSFORM, {
        center: particle1Positions[ i ]
      } ) );
    }
    for ( let i = 0; i < particle2Positions.length; i++ ) {
      particleNodes.push( GasPropertiesIconFactory.createDiffusionParticle2Icon( SCREEN_ICONS_TRANSFORM, {
        center: particle2Positions[ i ]
      } ) );
    }

    // Parent for particles, scale empirically
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
      fill: GasPropertiesColors.screenBackgroundColorProperty
    } );
  },

  /**
   * Creates the icon for the Intro screen in the Gases Intro sim.
   */
  createIntroScreenIcon(): ScreenIcon {

    // Invisible container
    const containerNode = new Rectangle( 0, 0, 800, 600, {
      stroke: phet.chipper.queryParameters.dev ? 'red' : null
    } );

    // Particles, positions determined empirically in view coordinates, specified left to right
    const heavyParticlePositions = [
      new Vector2( 0, 850 ), new Vector2( 110, 105 ), new Vector2( 555, 945 ),
      new Vector2( 670, 425 ), new Vector2( 1000, 125 ), new Vector2( 1220, 1050 ) ];
    const lightParticlePositions = [
      new Vector2( 278, 475 ), new Vector2( 1000, 680 ), new Vector2( 1450, 210 )
    ];

    // Create particle icons
    const particleNodes = [];
    for ( let i = 0; i < heavyParticlePositions.length; i++ ) {
      particleNodes.push( GasPropertiesIconFactory.createHeavyParticleIcon( SCREEN_ICONS_TRANSFORM, {
        center: heavyParticlePositions[ i ]
      } ) );
    }
    for ( let i = 0; i < lightParticlePositions.length; i++ ) {
      particleNodes.push( GasPropertiesIconFactory.createLightParticleIcon( SCREEN_ICONS_TRANSFORM, {
        center: lightParticlePositions[ i ]
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
      fill: GasPropertiesColors.screenBackgroundColorProperty
    } );
  },

  /**
   * Creates an icon for a heavy particle.
   */
  createHeavyParticleIcon( modelViewTransform: ModelViewTransform2, options?: ParticleNodeOptions ): Node {
    return createParticleIcon( new HeavyParticle(), modelViewTransform, options );
  },

  /**
   * Creates an icon for a light particle.
   */
  createLightParticleIcon( modelViewTransform: ModelViewTransform2, options?: ParticleNodeOptions ): Node {
    return createParticleIcon( new LightParticle(), modelViewTransform, options );
  },

  /**
   * Creates an icon for particle type 1 in the Diffusion screen.
   */
  createDiffusionParticle1Icon( modelViewTransform: ModelViewTransform2, options?: ParticleNodeOptions ): Node {
    return createParticleIcon( new DiffusionParticle1(), modelViewTransform, options );
  },

  /**
   * Creates an icon for particle type 2 in the Diffusion screen.
   */
  createDiffusionParticle2Icon( modelViewTransform: ModelViewTransform2, options?: ParticleNodeOptions ): Node {
    return createParticleIcon( new DiffusionParticle2(), modelViewTransform, options );
  },

  /**
   * Creates a simplified icon for the Stopwatch.
   */
  createStopwatchIcon(): Node {
    return createToolIcon( GasPropertiesColors.stopwatchBackgroundColorProperty );
  },

  /**
   * Creates a simplified icon for the Collision Counter.
   */
  createCollisionCounterIcon(): Node {
    return createToolIcon( GasPropertiesColors.collisionCounterBackgroundColorProperty );
  },

  /**
   * Creates the icon that represents the histogram for a species of particle.
   */
  createSpeciesHistogramIcon( particle: Particle, modelViewTransform: ModelViewTransform2 ): Node {
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
   */
  createContainerWidthIcon(): Node {
    return new DimensionalArrowsNode( new NumberProperty( 44 ), {
      color: GasPropertiesColors.widthIconColorProperty
    } );
  },

  /**
   * Creates the icon used on the 'Center of Mass' checkbox.
   */
  createCenterOfMassIcon(): Node {

    const width = 4;
    const height = 15;

    return new HBox( {
      spacing: 12,
      children: [
        new Rectangle( 0, 0, width, height, {
          fill: GasPropertiesColors.particle1ColorProperty,
          stroke: GasPropertiesColors.centerOfMassStrokeProperty
        } ),
        new Rectangle( 0, 0, width, height, {
          fill: GasPropertiesColors.particle2ColorProperty,
          stroke: GasPropertiesColors.centerOfMassStrokeProperty
        } )
      ]
    } );
  },

  /**
   * Creates the icon used on the 'Particle Flow Rate' checkbox.
   */
  createParticleFlowRateIcon(): Node {

    const arrowOptions = {
      fill: GasPropertiesColors.particle1ColorProperty,
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
   * Creates the icon used on the 'Scale' checkbox.
   */
  createScaleIcon(): Node {

    const scaleLength = 30;
    const tickLength = 6;
    const numberOfTicks = 5;
    const tickInterval = scaleLength / ( numberOfTicks - 1 );

    const shape = new Shape().moveTo( 0, 0 ).lineTo( scaleLength, 0 );
    for ( let i = 0; i < numberOfTicks; i++ ) {
      shape.moveTo( i * tickInterval, 0 ).lineTo( i * tickInterval, tickLength );
    }

    return new Path( shape, {
      stroke: GasPropertiesColors.scaleColorProperty,
      lineWidth: 1
    } );
  }
};

/**
 * Creates the icon for a particle.
 */
function createParticleIcon( particle: Particle, modelViewTransform: ModelViewTransform2,
                             options?: ParticleNodeOptions ): Node {
  return new ParticleNode( particle, modelViewTransform, options );
}

/**
 * Creates a simplified icon for a tool like the stopwatch or collision counter.
 */
function createToolIcon( color: TColor ): Node {

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
 */
function createHistogramIcon( stroke: TColor ): Node {

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

gasProperties.register( 'GasPropertiesIconFactory', GasPropertiesIconFactory );
export default GasPropertiesIconFactory;