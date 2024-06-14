// Copyright 2018-2024, University of Colorado Boulder

/**
 * ExploreScreenView is the view for the 'Explore' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import { VBox } from '../../../../scenery/js/imports.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import GasPropertiesConstants from '../../common/GasPropertiesConstants.js';
import IdealGasLawScreenView from '../../common/view/IdealGasLawScreenView.js';
import ParticlesAccordionBox from '../../common/view/ParticlesAccordionBox.js';
import gasProperties from '../../gasProperties.js';
import ExploreModel from '../model/ExploreModel.js';
import ExploreToolsPanel from './ExploreToolsPanel.js';
import ExploreViewProperties from './ExploreViewProperties.js';

export default class ExploreScreenView extends IdealGasLawScreenView {

  private readonly viewProperties: ExploreViewProperties;

  public constructor( model: ExploreModel, tandem: Tandem ) {

    // view-specific Properties
    const viewProperties = new ExploreViewProperties( tandem.createTandem( 'viewProperties' ) );

    super( model, viewProperties.particleTypeProperty, viewProperties.widthVisibleProperty, {
      wallVelocityVisibleProperty: viewProperties.wallVelocityVisibleProperty,
      tandem: tandem
    } );

    const collisionCounter = model.collisionCounter!;
    assert && assert( collisionCounter );

    // Group panels and accordion boxes in the Studio tree.
    const panelsTandem = tandem.createTandem( 'panels' );

    // Particles accordion box
    const particlesAccordionBox = new ParticlesAccordionBox(
      model.particleSystem.numberOfHeavyParticlesProperty,
      model.particleSystem.numberOfLightParticlesProperty,
      model.modelViewTransform, {
        expandedProperty: viewProperties.particlesExpandedProperty,
        tandem: panelsTandem.createTandem( 'particlesAccordionBox' )
      } );

    // Panel at upper right
    const toolsPanel = new ExploreToolsPanel( viewProperties.wallVelocityVisibleProperty,
      viewProperties.widthVisibleProperty, model.stopwatch.isVisibleProperty,
      collisionCounter.visibleProperty, panelsTandem.createTandem( 'toolsPanel' ) );

    // Rendering order. Everything we add should be behind what is created by super.
    const vBox = new VBox( {
      align: 'left',
      spacing: GasPropertiesConstants.PANELS_Y_SPACING,
      children: [ particlesAccordionBox, toolsPanel ],
      right: this.layoutBounds.right - GasPropertiesConstants.SCREEN_VIEW_X_MARGIN,
      top: this.layoutBounds.top + GasPropertiesConstants.SCREEN_VIEW_Y_MARGIN,

      // Both panels have the same fixed width.
      stretch: true,
      minContentWidth: GasPropertiesConstants.RIGHT_PANEL_WIDTH,
      maxWidth: GasPropertiesConstants.RIGHT_PANEL_WIDTH
    } );
    this.addChild( vBox );
    vBox.moveToBack();

    this.viewProperties = viewProperties;

    // Play Area focus order, see https://github.com/phetsims/gas-properties/issues/213.
    assert && assert( this.collisionCounterNode );
    this.pdomPlayAreaNode.pdomOrder = [
      particlesAccordionBox,
      this.bicyclePumpControl,
      this.eraseParticlesButton,
      this.heaterCoolerNode,
      this.containerNode,
      this.returnLidButton,
      this.thermometerNode,
      this.pressureGaugeNode,
      this.stopwatchNode,
      this.collisionCounterNode!
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
}

gasProperties.register( 'ExploreScreenView', ExploreScreenView );