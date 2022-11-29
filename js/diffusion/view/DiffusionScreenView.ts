// Copyright 2018-2022, University of Colorado Boulder

/**
 * DiffusionScreenView is the view for the 'Diffusion' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Tandem from '../../../../tandem/js/Tandem.js';
import GasPropertiesColors from '../../common/GasPropertiesColors.js';
import GasPropertiesConstants from '../../common/GasPropertiesConstants.js';
import GasPropertiesQueryParameters from '../../common/GasPropertiesQueryParameters.js';
import BaseScreenView from '../../common/view/BaseScreenView.js';
import GasPropertiesStopwatchNode from '../../common/view/GasPropertiesStopwatchNode.js';
import RegionsNode from '../../common/view/RegionsNode.js';
import gasProperties from '../../gasProperties.js';
import DiffusionModel from '../model/DiffusionModel.js';
import CenterOfMassNode from './CenterOfMassNode.js';
import DataAccordionBox from './DataAccordionBox.js';
import DiffusionContainerNode from './DiffusionContainerNode.js';
import DiffusionControlPanel from './DiffusionControlPanel.js';
import DiffusionParticleSystemNode from './DiffusionParticleSystemNode.js';
import DiffusionViewProperties from './DiffusionViewProperties.js';
import ParticleFlowRateNode from './ParticleFlowRateNode.js';
import ScaleNode from './ScaleNode.js';

export default class DiffusionScreenView extends BaseScreenView {

  private readonly viewProperties: DiffusionViewProperties;
  private readonly particleSystemNode: DiffusionParticleSystemNode;
  private readonly regionsNode: RegionsNode | null;

  public constructor( model: DiffusionModel, tandem: Tandem ) {

    super( model, tandem, {
      hasSlowMotion: true // adds Normal/Slow radio buttons to the time controls
    } );

    const viewProperties = new DiffusionViewProperties( tandem.createTandem( 'viewProperties' ) );

    // Container
    const containerNode = new DiffusionContainerNode( model.container, model.modelViewTransform, {
      tandem: tandem.createTandem( 'containerNode' )
    } );

    // Scale below the container
    const scaleNode = new ScaleNode( model.container.widthProperty.value, model.modelViewTransform, {
      visibleProperty: viewProperties.scaleVisibleProperty,
      centerX: model.modelViewTransform.modelToViewX( model.container.dividerX ),
      top: model.modelViewTransform.modelToViewY( model.container.bottom - model.container.wallThickness ),
      tandem: tandem.createTandem( 'scaleNode' )
    } );

    // Show how the collision detection space is partitioned into regions
    let regionsNode = null;
    if ( GasPropertiesQueryParameters.regions ) {
      regionsNode = new RegionsNode( model.collisionDetector.regions, model.modelViewTransform );
    }

    // Center of Mass indicators
    const centerOfMassNode1 = new CenterOfMassNode( model.centerOfMass1Property, model.container.bottom,
      model.modelViewTransform, GasPropertiesColors.particle1ColorProperty, {
        visibleProperty: viewProperties.centerOfMassVisibleProperty,
        tandem: tandem.createTandem( 'centerOfMassNode1' )
      } );
    const centerOfMassNode2 = new CenterOfMassNode( model.centerOfMass2Property, model.container.bottom,
      model.modelViewTransform, GasPropertiesColors.particle2ColorProperty, {
        visibleProperty: viewProperties.centerOfMassVisibleProperty,
        tandem: tandem.createTandem( 'centerOfMassNode2' )
      } );

    // Particle Flow Rate vectors
    const particleFlowRateNode1 = new ParticleFlowRateNode( model.particleFlowRate1, {
      visibleProperty: viewProperties.particleFlowRateVisibleProperty,
      arrowNodeOptions: {
        fill: GasPropertiesColors.particle1ColorProperty
      },
      centerX: containerNode.centerX,
      top: containerNode.bottom + 38,
      tandem: tandem.createTandem( 'particleFlowRateNode1' )
    } );
    const particleFlowRateNode2 = new ParticleFlowRateNode( model.particleFlowRate2, {
      visibleProperty: viewProperties.particleFlowRateVisibleProperty,
      arrowNodeOptions: {
        fill: GasPropertiesColors.particle2ColorProperty
      },
      centerX: containerNode.centerX,
      top: particleFlowRateNode1.bottom + 5,
      tandem: tandem.createTandem( 'particleFlowRateNode2' )
    } );

    // Data accordion box
    const dataAccordionBox = new DataAccordionBox( model.leftData, model.rightData, model.modelViewTransform, {
      expandedProperty: viewProperties.dataExpandedProperty,
      tandem: tandem.createTandem( 'dataAccordionBox' )
    } );
    dataAccordionBox.boundsProperty.link( bounds => {
      dataAccordionBox.centerX = containerNode.centerX;
      dataAccordionBox.bottom = containerNode.top - 15;
    } );

    // Control panel at right side of screen
    const controlPanel = new DiffusionControlPanel( model.leftSettings, model.rightSettings,
      model.modelViewTransform,
      model.container.hasDividerProperty,
      model.numberOfParticlesProperty,
      model.stopwatch.isVisibleProperty,
      viewProperties, {
        fixedWidth: 300,
        right: this.layoutBounds.right - GasPropertiesConstants.SCREEN_VIEW_X_MARGIN,
        top: this.layoutBounds.top + GasPropertiesConstants.SCREEN_VIEW_Y_MARGIN,
        tandem: tandem.createTandem( 'controlPanel' )
      } );

    // The complete system of particles
    const particleSystemNode = new DiffusionParticleSystemNode( model );

    // If the number of particles changes while the sim is paused, redraw the particle system.
    model.numberOfParticlesProperty.link( () => {
      if ( !model.isPlayingProperty.value ) {
        particleSystemNode.update();
      }
    } );

    // Stopwatch
    const stopwatchNode = new GasPropertiesStopwatchNode( model.stopwatch, {
      dragBoundsProperty: this.visibleBoundsProperty,
      tandem: tandem.createTandem( 'stopwatchNode' )
    } );

    // Rendering order
    regionsNode && this.addChild( regionsNode );
    this.addChild( dataAccordionBox );
    this.addChild( controlPanel );
    this.addChild( scaleNode );
    this.addChild( containerNode );
    this.addChild( particleSystemNode );
    this.addChild( centerOfMassNode1 );
    this.addChild( centerOfMassNode2 );
    this.addChild( particleFlowRateNode1 );
    this.addChild( particleFlowRateNode2 );
    this.addChild( stopwatchNode );

    // Position the time controls
    this.timeControlNode.mutate( {
      left: controlPanel.left,
      bottom: this.layoutBounds.bottom - GasPropertiesConstants.SCREEN_VIEW_Y_MARGIN
    } );

    // Move particle-flow rate indicators to the back, so they go behind time controls.
    particleFlowRateNode1.moveToBack();

    // Vertical space is tight. So set a maxHeight for the control panel, since font height does vary on some
    // platforms, and may make the control panel taller.  See https://github.com/phetsims/gas-properties/issues/130.
    controlPanel.maxHeight = this.layoutBounds.height - this.timeControlNode.height -
                             ( 2 * GasPropertiesConstants.SCREEN_VIEW_Y_MARGIN ) - 25;

    this.viewProperties = viewProperties;
    this.particleSystemNode = particleSystemNode;
    this.regionsNode = regionsNode;
  }

  public override dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }

  protected override reset(): void {
    super.reset();
    this.viewProperties.reset();
  }

  /**
   * Steps the view using real time units.
   * @param dt - time delta, in seconds
   */
  public override stepView( dt: number ): void {
    assert && assert( dt >= 0, `invalid dt: ${dt}` );
    this.particleSystemNode.update();
    this.regionsNode && this.regionsNode.update();
  }
}

gasProperties.register( 'DiffusionScreenView', DiffusionScreenView );