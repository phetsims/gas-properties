// Copyright 2018-2024, University of Colorado Boulder

/**
 * EnergyScreenView is the view for the 'Energy' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import VBox from '../../../../scenery/js/layout/nodes/VBox.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import GasPropertiesConstants from '../../common/GasPropertiesConstants.js';
import IdealGasLawScreenView from '../../common/view/IdealGasLawScreenView.js';
import ParticlesAccordionBox from '../../common/view/ParticlesAccordionBox.js';
import gasProperties from '../../gasProperties.js';
import EnergyModel from '../model/EnergyModel.js';
import AverageSpeedAccordionBox from './AverageSpeedAccordionBox.js';
import EnergyToolsPanel from './EnergyToolsPanel.js';
import EnergyViewProperties from './EnergyViewProperties.js';
import InjectionTemperatureAccordionBox from './InjectionTemperatureAccordionBox.js';
import KineticEnergyAccordionBox from './KineticEnergyAccordionBox.js';
import SpeedAccordionBox from './SpeedAccordionBox.js';

const LEFT_PANEL_WIDTH = 205; // width of panels on the left side of the container, determined empirically

export default class EnergyScreenView extends IdealGasLawScreenView {

  private readonly viewProperties: EnergyViewProperties;
  private readonly speedAccordionBox: SpeedAccordionBox;
  private readonly kineticEnergyAccordionBox: KineticEnergyAccordionBox;

  public constructor( model: EnergyModel, tandem: Tandem ) {

    // view-specific Properties
    const viewProperties = new EnergyViewProperties( tandem.createTandem( 'viewProperties' ) );

    super( model, viewProperties.particleTypeProperty, viewProperties.widthVisibleProperty, {
      phetioResizeHandleInstrumented: false,
      tandem: tandem
    } );

    // Group panels and accordion boxes in the Studio tree.
    const panelsTandem = tandem.createTandem( 'panels' );

    // Average Speed
    const averageSpeedAccordionBox = new AverageSpeedAccordionBox(
      model.averageSpeedModel.heavyAverageSpeedProperty,
      model.averageSpeedModel.lightAverageSpeedProperty,
      model.modelViewTransform, {
        expandedProperty: viewProperties.averageSpeedExpandedProperty,
        tandem: panelsTandem.createTandem( 'averageSpeedAccordionBox' )
      } );

    // Speed accordion box with histogram and related controls
    const speedAccordionBox = new SpeedAccordionBox( model.histogramsModel, model.modelViewTransform, {
      expandedProperty: viewProperties.speedExpandedProperty,
      tandem: panelsTandem.createTandem( 'speedAccordionBox' )
    } );

    // Kinetic Energy accordion box with histogram
    const kineticEnergyAccordionBox = new KineticEnergyAccordionBox( model.histogramsModel, model.modelViewTransform, {
      expandedProperty: viewProperties.kineticEnergyExpandedProperty,
      tandem: panelsTandem.createTandem( 'kineticEnergyAccordionBox' )
    } );

    // Panels on the left side of the screen
    const leftPanels = new VBox( {
      children: [
        averageSpeedAccordionBox,
        speedAccordionBox,
        kineticEnergyAccordionBox
      ],
      align: 'left',
      spacing: GasPropertiesConstants.PANELS_Y_SPACING,
      maxHeight: this.layoutBounds.height - ( 2 * GasPropertiesConstants.SCREEN_VIEW_Y_MARGIN ),
      top: GasPropertiesConstants.SCREEN_VIEW_Y_MARGIN,
      left: this.layoutBounds.left + GasPropertiesConstants.SCREEN_VIEW_X_MARGIN,

      // All panels have the same fixed width.
      stretch: true,
      minContentWidth: LEFT_PANEL_WIDTH,
      maxWidth: LEFT_PANEL_WIDTH
    } );

    // Particles accordion box
    const particlesAccordionBox = new ParticlesAccordionBox(
      model.particleSystem.numberOfHeavyParticlesProperty,
      model.particleSystem.numberOfLightParticlesProperty,
      model.modelViewTransform, {
        collisionsEnabledProperty: model.particleSystem.collisionsEnabledProperty,
        expandedProperty: viewProperties.particlesExpandedProperty,
        tandem: panelsTandem.createTandem( 'particlesAccordionBox' )
      } );

    // Injection Temperature accordion box
    const injectionTemperatureAccordionBox = new InjectionTemperatureAccordionBox(
      model.temperatureModel.setInjectionTemperatureEnabledProperty,
      model.temperatureModel.injectionTemperatureProperty, {
        expandedProperty: viewProperties.injectionTemperatureExpandedProperty,
        tandem: panelsTandem.createTandem( 'injectionTemperatureAccordionBox' )
      }
    );

    // Tools panel
    const toolsPanel = new EnergyToolsPanel( viewProperties.widthVisibleProperty, model.stopwatch.isVisibleProperty,
      panelsTandem.createTandem( 'toolsPanel' ) );

    // Panels on the right side of the screen
    const rightPanels = new VBox( {
      children: [
        particlesAccordionBox,
        injectionTemperatureAccordionBox,
        toolsPanel
      ],
      align: 'left',
      spacing: GasPropertiesConstants.PANELS_Y_SPACING,
      right: this.layoutBounds.right - GasPropertiesConstants.SCREEN_VIEW_X_MARGIN,
      top: this.layoutBounds.top + GasPropertiesConstants.SCREEN_VIEW_Y_MARGIN,

      // All panels have the same fixed width.
      stretch: true,
      minContentWidth: GasPropertiesConstants.RIGHT_PANEL_WIDTH,
      maxWidth: GasPropertiesConstants.RIGHT_PANEL_WIDTH
    } );

    // Panels behind superclass UI components like the stopwatch
    this.addChild( leftPanels );
    leftPanels.moveToBack();
    this.addChild( rightPanels );
    rightPanels.moveToBack();

    this.viewProperties = viewProperties;
    this.speedAccordionBox = speedAccordionBox;
    this.kineticEnergyAccordionBox = kineticEnergyAccordionBox;

    // Play Area focus order, see https://github.com/phetsims/gas-properties/issues/213.
    this.pdomPlayAreaNode.pdomOrder = [
      particlesAccordionBox,
      injectionTemperatureAccordionBox,
      leftPanels,
      this.bicyclePumpControl,
      this.eraseParticlesButton,
      this.heaterCoolerNode,
      this.containerNode,
      this.returnLidButton,
      this.thermometerNode,
      this.pressureGaugeNode,
      this.stopwatchNode
    ];

    // Control Area focus order, see https://github.com/phetsims/gas-properties/issues/213.
    this.pdomControlAreaNode.pdomOrder = [
      toolsPanel,
      this.timeControlNode,
      this.resetAllButton
    ];
  }

  protected override reset(): void {
    this.viewProperties.reset();
    this.speedAccordionBox.reset();
    this.kineticEnergyAccordionBox.reset();
    super.reset();
  }
}

gasProperties.register( 'EnergyScreenView', EnergyScreenView );