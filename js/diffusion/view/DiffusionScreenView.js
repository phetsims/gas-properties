// Copyright 2018-2019, University of Colorado Boulder

/**
 * The view for the 'Diffusion' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const CenterXOfMassNode = require( 'GAS_PROPERTIES/diffusion/view/CenterXOfMassNode' );
  const DataAccordionBox = require( 'GAS_PROPERTIES/diffusion/view/DataAccordionBox' );
  const DiffusionContainerNode = require( 'GAS_PROPERTIES/diffusion/view/DiffusionContainerNode' );
  const DiffusionControlPanel = require( 'GAS_PROPERTIES/diffusion/view/DiffusionControlPanel' );
  const DiffusionParticlesNode = require( 'GAS_PROPERTIES/diffusion/view/DiffusionParticlesNode' );
  const DiffusionTimeControls = require( 'GAS_PROPERTIES/diffusion/view/DiffusionTimeControls' );
  const DiffusionViewProperties = require( 'GAS_PROPERTIES/diffusion/view/DiffusionViewProperties' );
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const GasPropertiesColorProfile = require( 'GAS_PROPERTIES/common/GasPropertiesColorProfile' );
  const GasPropertiesConstants = require( 'GAS_PROPERTIES/common/GasPropertiesConstants' );
  const GasPropertiesQueryParameters = require( 'GAS_PROPERTIES/common/GasPropertiesQueryParameters' );
  const ParticleFlowRatesNode = require( 'GAS_PROPERTIES/diffusion/view/ParticleFlowRatesNode' );
  const RegionsNode = require( 'GAS_PROPERTIES/common/view/RegionsNode' );
  const ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  const ScreenView = require( 'JOIST/ScreenView' );
  const StopwatchNode = require( 'GAS_PROPERTIES/common/view/StopwatchNode' );

  class DiffusionScreenView extends ScreenView {

    /**
     * @param {DiffusionModel} model
     */
    constructor( model ) {

      super();

      //TODO duplicated in GasPropertiesScreenView
      // The model bounds are equivalent to the visible bounds of ScreenView, as fills the browser window.
      this.visibleBoundsProperty.link( visibleBounds => {
        model.modelBoundsProperty.value = model.modelViewTransform.viewToModelBounds( visibleBounds );
      } );

      const viewProperties = new DiffusionViewProperties();

      // Container
      const containerNode = new DiffusionContainerNode( model.container, model.modelViewTransform );

      // Show how the collision detection space is partitioned into regions
      let regionsNode = null;
      if ( GasPropertiesQueryParameters.regions ) {
        regionsNode = new RegionsNode( model.collisionDetector.regions, model.modelViewTransform );
      }

      // Center of Mass indicators
      const centerOfMassNode1 = new CenterXOfMassNode( model.centerXOfMass1Property, model.container.bottom,
        model.modelViewTransform, GasPropertiesColorProfile.particle1ColorProperty );
      const centerOfMassNode2 = new CenterXOfMassNode( model.centerXOfMass2Property, model.container.bottom,
        model.modelViewTransform, GasPropertiesColorProfile.particle2ColorProperty );

      viewProperties.centerOfMassVisibleProperty.link( visible => {
        centerOfMassNode1.visible = visible;
        centerOfMassNode2.visible = visible;
      } );

      // Particle Flow Rate vectors
      const particleFlowRatesNode = new ParticleFlowRatesNode( model.container.dividerX,
        model.particles1, model.particles2, {
          centerX: containerNode.centerX,
          top: containerNode.bottom + 25
        } );

      viewProperties.particleFlowRateVisibleProperty.link( visible => {
        particleFlowRatesNode.visible = visible;
      } );

      // Data accordion box
      const dataAccordionBox = new DataAccordionBox( model, {
        expandedProperty: viewProperties.dataExpandedProperty,
        centerX: containerNode.centerX,
        top: this.layoutBounds.top + GasPropertiesConstants.SCREEN_VIEW_Y_MARGIN
      } );

      // Control panel at right side of screen
      const controlPanel = new DiffusionControlPanel( model.experiment, model.modelViewTransform,
        model.container.hasDividerProperty,
        viewProperties.particleFlowRateVisibleProperty,
        viewProperties.centerOfMassVisibleProperty,
        model.stopwatch.visibleProperty, {
          fixedWidth: 300,
          right: this.layoutBounds.right - GasPropertiesConstants.SCREEN_VIEW_X_MARGIN,
          top: this.layoutBounds.top + GasPropertiesConstants.SCREEN_VIEW_Y_MARGIN
        } );

      // The complete system of particles
      const particlesNode = new DiffusionParticlesNode( model );

      // Stopwatch
      const stopwatchNode = new StopwatchNode( model.stopwatch, {
        dragBoundsProperty: this.visibleBoundsProperty
      } );

      // Reset All button
      const resetAllButton = new ResetAllButton( {
        listener: () => { this.reset(); },
        right: this.layoutBounds.maxX - GasPropertiesConstants.SCREEN_VIEW_X_MARGIN,
        bottom: this.layoutBounds.maxY - GasPropertiesConstants.SCREEN_VIEW_Y_MARGIN
      } );

      const timeControls = new DiffusionTimeControls( model, {
        right: resetAllButton.left - 65,
        bottom: this.layoutBounds.bottom - GasPropertiesConstants.SCREEN_VIEW_Y_MARGIN
      } );

      // Rendering order
      regionsNode && this.addChild( regionsNode );
      this.addChild( dataAccordionBox );
      this.addChild( controlPanel );
      this.addChild( containerNode );
      this.addChild( centerOfMassNode1 );
      this.addChild( centerOfMassNode2 );
      this.addChild( particleFlowRatesNode );
      this.addChild( timeControls );
      this.addChild( particlesNode );
      this.addChild( resetAllButton );
      this.addChild( stopwatchNode );

      // @private
      this.model = model;
      this.regionsNode = regionsNode;
      this.particlesNode = particlesNode;
      this.particleFlowRatesNode = particleFlowRatesNode;
      this.viewProperties = viewProperties;
    }

    /**
     * Resets things that are specific to the view.
     * @private
     */
    reset() {
      this.interruptSubtreeInput(); // cancel interactions that are in progress
      this.model.reset();
      this.viewProperties.reset();
    }

    /**
     * Called on each step of the simulation's timer. The view is stepped regardless of whether the model is
     * paused, because changes made while the model is paused should immediately be reflected in the view.
     * @param {number} dt - time delta, in seconds
     * @public
     */
    step( dt ) {

      // convert s to ps
      const ps = this.model.timeTransform( dt );

      // step elements that are specific to the view
      this.particlesNode.step( ps );
      this.particleFlowRatesNode.step( ps );
      this.regionsNode && this.regionsNode.step( ps );
    }
  }

  return gasProperties.register( 'DiffusionScreenView', DiffusionScreenView );
} );