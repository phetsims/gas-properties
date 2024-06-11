// Copyright 2018-2024, University of Colorado Boulder

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
import DiffusionToolsPanel from './DiffusionToolsPanel.js';
import DiffusionParticleSystemNode from './DiffusionParticleSystemNode.js';
import DiffusionViewProperties from './DiffusionViewProperties.js';
import ParticleFlowRateNode from './ParticleFlowRateNode.js';
import ScaleNode from './ScaleNode.js';
import DiffusionSettingsPanel from './DiffusionSettingsPanel.js';
import { VBox } from '../../../../scenery/js/imports.js';

const PANELS_WIDTH = 300;

export default class DiffusionScreenView extends BaseScreenView {

  private readonly viewProperties: DiffusionViewProperties;
  private readonly particleSystemNode: DiffusionParticleSystemNode;
  private readonly regionsNode: RegionsNode | null;

  public constructor( model: DiffusionModel, tandem: Tandem ) {

    super( model, {
      hasTimeSpeedFeature: true, // add Normal/Slow radio buttons to the time controls
      tandem: tandem
    } );

    const viewProperties = new DiffusionViewProperties( tandem.createTandem( 'viewProperties' ) );

    // Container
    const containerNode = new DiffusionContainerNode( model.container, model.modelViewTransform );

    // Scale below the container
    const scaleNode = new ScaleNode( model.container.widthProperty.value, model.modelViewTransform, {
      visibleProperty: viewProperties.scaleVisibleProperty,
      centerX: model.modelViewTransform.modelToViewX( model.container.dividerX ),
      top: model.modelViewTransform.modelToViewY( model.container.bottom - model.container.wallThickness )
      // Not PhET-iO instrumented, nothing interesting.
    } );

    // Show how the collision detection space is partitioned into regions
    let regionsNode = null;
    if ( GasPropertiesQueryParameters.regions ) {
      regionsNode = new RegionsNode( model.collisionDetector.regions, model.modelViewTransform );
    }

    // Center of Mass indicators
    const centerOfMassNode1 = new CenterOfMassNode( model.particleSystem.centerOfMass1Property, model.container.bottom,
      model.container.widthProperty, model.modelViewTransform, GasPropertiesColors.diffusionParticle1ColorProperty, {
        visibleProperty: viewProperties.centerOfMassVisibleProperty
      } );
    const centerOfMassNode2 = new CenterOfMassNode( model.particleSystem.centerOfMass2Property, model.container.bottom,
      model.container.widthProperty, model.modelViewTransform, GasPropertiesColors.diffusionParticle2ColorProperty, {
        visibleProperty: viewProperties.centerOfMassVisibleProperty
      } );

    // Particle Flow Rate vectors
    const particleFlowRateNode1 = new ParticleFlowRateNode( model.particleSystem.particle1FlowRateModel, {
      visibleProperty: viewProperties.particleFlowRateVisibleProperty,
      arrowNodeOptions: {
        fill: GasPropertiesColors.diffusionParticle1ColorProperty
      },
      centerX: containerNode.centerX,
      top: containerNode.bottom + 38
    } );
    const particleFlowRateNode2 = new ParticleFlowRateNode( model.particleSystem.particle2FlowRateModel, {
      visibleProperty: viewProperties.particleFlowRateVisibleProperty,
      arrowNodeOptions: {
        fill: GasPropertiesColors.diffusionParticle2ColorProperty
      },
      centerX: containerNode.centerX,
      top: particleFlowRateNode1.bottom + 5
    } );

    // Group panels and accordion boxes in the Studio tree.
    const panelsTandem = tandem.createTandem( 'panels' );

    // Data accordion box
    const dataAccordionBox = new DataAccordionBox( model.leftData, model.rightData, model.modelViewTransform,
      viewProperties.numberOfParticleTypesProperty, {
        expandedProperty: viewProperties.dataExpandedProperty,
        tandem: panelsTandem.createTandem( 'dataAccordionBox' )
      } );
    dataAccordionBox.boundsProperty.link( () => {
      dataAccordionBox.centerX = containerNode.centerX;
      dataAccordionBox.bottom = containerNode.top - 15;
    } );

    // Panel for setting initial conditions
    const settingsPanel = new DiffusionSettingsPanel(
      model.particleSystem.particle1Settings,
      model.particleSystem.particle2Settings,
      model.particleSystem.numberOfParticlesProperty,
      viewProperties.numberOfParticleTypesProperty,
      model.container.isDividedProperty,
      model.modelViewTransform,
      panelsTandem.createTandem( 'settingsPanel' ) );

    // Panel for controlling visibility of 'tools'
    const toolsPanel = new DiffusionToolsPanel( viewProperties, model.stopwatch.isVisibleProperty,
      viewProperties.numberOfParticleTypesProperty, panelsTandem.createTandem( 'toolsPanel' ) );

    const panels = new VBox( {
      children: [ settingsPanel, toolsPanel ],
      align: 'left',
      spacing: GasPropertiesConstants.PANELS_Y_SPACING,
      right: this.layoutBounds.right - GasPropertiesConstants.SCREEN_VIEW_X_MARGIN,
      top: this.layoutBounds.top + GasPropertiesConstants.SCREEN_VIEW_Y_MARGIN,

      // Both panels have the same fixed width.
      stretch: true,
      minContentWidth: PANELS_WIDTH,
      maxWidth: PANELS_WIDTH
    } );

    // The complete system of particles
    const particleSystemNode = new DiffusionParticleSystemNode( model );

    // Stopwatch
    const stopwatchNode = new GasPropertiesStopwatchNode( model.stopwatch, {
      dragBoundsProperty: this.visibleBoundsProperty,
      tandem: tandem.createTandem( 'stopwatchNode' )
    } );

    // Rendering order
    regionsNode && this.addChild( regionsNode );
    this.addChild( dataAccordionBox );
    this.addChild( panels );
    this.addChild( scaleNode );
    this.addChild( containerNode );
    this.addChild( particleSystemNode );
    this.addChild( centerOfMassNode1 );
    this.addChild( centerOfMassNode2 );
    this.addChild( particleFlowRateNode1 );
    this.addChild( particleFlowRateNode2 );
    this.addChild( stopwatchNode );

    // Position the time controls
    this.timeControlNode.left = panels.left;
    this.timeControlNode.bottom = this.layoutBounds.bottom - GasPropertiesConstants.SCREEN_VIEW_Y_MARGIN;

    // Move particle-flow rate indicators to the back, so they go behind time controls.
    particleFlowRateNode1.moveToBack();

    // Vertical space is tight. So set a maxHeight for the control panel, since font height does vary on some
    // platforms, and may make the control panel taller.  See https://github.com/phetsims/gas-properties/issues/130.
    panels.maxHeight = this.layoutBounds.height - this.timeControlNode.height -
                       ( 2 * GasPropertiesConstants.SCREEN_VIEW_Y_MARGIN ) - 25;

    this.viewProperties = viewProperties;
    this.particleSystemNode = particleSystemNode;
    this.regionsNode = regionsNode;

    // Play Area focus order, see https://github.com/phetsims/gas-properties/issues/213.
    this.pdomPlayAreaNode.pdomOrder = [
      stopwatchNode,
      dataAccordionBox,
      settingsPanel
    ];

    // Control Area focus order, see https://github.com/phetsims/gas-properties/issues/213.
    this.pdomControlAreaNode.pdomOrder = [
      toolsPanel,
      this.timeControlNode,
      this.resetAllButton
    ];
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