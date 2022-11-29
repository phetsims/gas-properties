// Copyright 2018-2022, University of Colorado Boulder

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

    super( model, viewProperties.particleTypeProperty, viewProperties.widthVisibleProperty, tandem );

    const collisionCounter = model.collisionCounter!;
    assert && assert( collisionCounter );

    // Panel at upper right
    const toolsPanel = new ExploreToolsPanel(
      viewProperties.widthVisibleProperty,
      model.stopwatch.isVisibleProperty,
      collisionCounter.visibleProperty, {
        fixedWidth: GasPropertiesConstants.RIGHT_PANEL_WIDTH,
        tandem: tandem.createTandem( 'toolsPanel' )
      } );

    // Particles accordion box
    const particlesAccordionBox = new ParticlesAccordionBox(
      model.particleSystem.numberOfHeavyParticlesProperty,
      model.particleSystem.numberOfLightParticlesProperty,
      model.modelViewTransform, {
        fixedWidth: GasPropertiesConstants.RIGHT_PANEL_WIDTH,
        expandedProperty: viewProperties.particlesExpandedProperty,
        tandem: tandem.createTandem( 'particlesAccordionBox' )
      } );

    // Rendering order. Everything we add should be behind what is created by super.
    const vBox = new VBox( {
      align: 'left',
      spacing: 15,
      children: [ toolsPanel, particlesAccordionBox ],
      right: this.layoutBounds.right - GasPropertiesConstants.SCREEN_VIEW_X_MARGIN,
      top: this.layoutBounds.top + GasPropertiesConstants.SCREEN_VIEW_Y_MARGIN
    } );
    this.addChild( vBox );
    vBox.moveToBack();

    this.viewProperties = viewProperties;
  }

  public override dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }

  protected override reset(): void {
    super.reset();
    this.viewProperties.reset();
  }
}

gasProperties.register( 'ExploreScreenView', ExploreScreenView );