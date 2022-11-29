// Copyright 2018-2022, University of Colorado Boulder

/**
 * EnergyScreenView is the view for the 'Energy' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import { VBox } from '../../../../scenery/js/imports.js';
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

// constants
const LEFT_PANEL_WIDTH = 205; // width of panels on the left side of the container, determined empirically
const VBOX_SPACING = 10;

export default class EnergyScreenView extends IdealGasLawScreenView {

  private readonly viewProperties: EnergyViewProperties;
  private readonly speedAccordionBox: SpeedAccordionBox;
  private readonly kineticEnergyAccordionBox: KineticEnergyAccordionBox;

  public constructor( model: EnergyModel, tandem: Tandem ) {

    // view-specific Properties
    const viewProperties = new EnergyViewProperties( tandem.createTandem( 'viewProperties' ) );

    super( model, viewProperties.particleTypeProperty, viewProperties.widthVisibleProperty, tandem );

    // Average Speed
    const averageSpeedAccordionBox = new AverageSpeedAccordionBox(
      model.averageSpeedModel.heavyAverageSpeedProperty,
      model.averageSpeedModel.lightAverageSpeedProperty,
      model.modelViewTransform, {
        expandedProperty: viewProperties.averageSpeedExpandedProperty,
        fixedWidth: LEFT_PANEL_WIDTH,
        tandem: tandem.createTandem( 'averageSpeedAccordionBox' )
      } );

    // Speed accordion box with histogram and related controls
    const speedAccordionBox = new SpeedAccordionBox( model.histogramsModel, model.modelViewTransform, {
      expandedProperty: viewProperties.speedExpandedProperty,
      fixedWidth: LEFT_PANEL_WIDTH,
      tandem: tandem.createTandem( 'speedAccordionBox' )
    } );

    // Kinetic Energy accordion box with histogram
    const kineticEnergyAccordionBox = new KineticEnergyAccordionBox( model.histogramsModel, model.modelViewTransform, {
      expandedProperty: viewProperties.kineticEnergyExpandedProperty,
      fixedWidth: LEFT_PANEL_WIDTH,
      tandem: tandem.createTandem( 'kineticEnergyAccordionBox' )
    } );

    // Panels on the left side of the screen
    const leftPanels = new VBox( {
      children: [
        averageSpeedAccordionBox,
        speedAccordionBox,
        kineticEnergyAccordionBox
      ],
      align: 'left',
      spacing: VBOX_SPACING,
      top: GasPropertiesConstants.SCREEN_VIEW_Y_MARGIN,
      left: this.layoutBounds.left + GasPropertiesConstants.SCREEN_VIEW_X_MARGIN
    } );

    // Tools panel
    const toolsPanel = new EnergyToolsPanel(
      viewProperties.widthVisibleProperty,
      model.stopwatch.isVisibleProperty, {
        fixedWidth: GasPropertiesConstants.RIGHT_PANEL_WIDTH,
        tandem: tandem.createTandem( 'toolsPanel' )
      } );

    // Particles accordion box
    const particlesAccordionBox = new ParticlesAccordionBox(
      model.particleSystem.numberOfHeavyParticlesProperty,
      model.particleSystem.numberOfLightParticlesProperty,
      model.modelViewTransform, {
        collisionsEnabledProperty: model.collisionDetector.particleParticleCollisionsEnabledProperty,
        expandedProperty: viewProperties.particlesExpandedProperty,
        fixedWidth: GasPropertiesConstants.RIGHT_PANEL_WIDTH,
        tandem: tandem.createTandem( 'particlesAccordionBox' )
      } );

    // Injection Temperature accordion box
    const injectionTemperatureAccordionBox = new InjectionTemperatureAccordionBox(
      model.temperatureModel.controlTemperatureEnabledProperty,
      model.temperatureModel.initialTemperatureProperty, {
        expandedProperty: viewProperties.injectionTemperatureExpandedProperty,
        fixedWidth: GasPropertiesConstants.RIGHT_PANEL_WIDTH,
        tandem: tandem.createTandem( 'injectionTemperatureAccordionBox' )
      }
    );

    // Panels on the right side of the screen
    const rightPanels = new VBox( {
      children: [
        toolsPanel,
        particlesAccordionBox,
        injectionTemperatureAccordionBox
      ],
      align: 'left',
      spacing: VBOX_SPACING,
      right: this.layoutBounds.right - GasPropertiesConstants.SCREEN_VIEW_X_MARGIN,
      top: this.layoutBounds.top + GasPropertiesConstants.SCREEN_VIEW_Y_MARGIN
    } );

    // Panels behind superclass UI components like the stopwatch
    this.addChild( leftPanels );
    leftPanels.moveToBack();
    this.addChild( rightPanels );
    rightPanels.moveToBack();

    this.viewProperties = viewProperties;
    this.speedAccordionBox = speedAccordionBox;
    this.kineticEnergyAccordionBox = kineticEnergyAccordionBox;
  }

  public override dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }

  protected override reset(): void {
    this.viewProperties.reset();
    this.speedAccordionBox.reset();
    this.kineticEnergyAccordionBox.reset();
    super.reset();
  }
}

gasProperties.register( 'EnergyScreenView', EnergyScreenView );