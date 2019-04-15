// Copyright 2018-2019, University of Colorado Boulder

/**
 * The view for the 'Diffusion' screen.
 * 
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const DataAccordionBox = require( 'GAS_PROPERTIES/diffusion/view/DataAccordionBox' );
  const DiffusionContainerNode = require( 'GAS_PROPERTIES/diffusion/view/DiffusionContainerNode' );
  const DiffusionControlPanel = require( 'GAS_PROPERTIES/diffusion/view/DiffusionControlPanel' );
  const DiffusionTimeControls = require( 'GAS_PROPERTIES/diffusion/view/DiffusionTimeControls' );
  const DiffusionViewProperties = require( 'GAS_PROPERTIES/diffusion/view/DiffusionViewProperties' );
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const GasPropertiesConstants = require( 'GAS_PROPERTIES/common/GasPropertiesConstants' );
  const ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  const ScreenView = require( 'JOIST/ScreenView' );
  const StopwatchNode = require( 'GAS_PROPERTIES/common/view/StopwatchNode' );

  class DiffusionScreenView extends ScreenView {

    /**
     * @param {DiffusionModel} model
     */
    constructor( model ) {

      super();

      const viewProperties = new DiffusionViewProperties();

      // Data accordion box
      const dataAccordionBox = new DataAccordionBox( model, {
        expandedProperty: viewProperties.dataExpandedProperty,
        left: this.layoutBounds.left + 200, //TODO
        top: this.layoutBounds.top + GasPropertiesConstants.SCREEN_VIEW_Y_MARGIN
      } );

      // Control panel at right side of screen
      const controlPanel = new DiffusionControlPanel( model,
        model.hasDividerProperty,
        viewProperties.particleFlowRateVisibleProperty,
        viewProperties.centerOfMassVisibleProperty,
        model.stopwatch.visibleProperty, {
          fixedWidth: 300,
          right: this.layoutBounds.right - GasPropertiesConstants.SCREEN_VIEW_X_MARGIN,
          top: this.layoutBounds.top + GasPropertiesConstants.SCREEN_VIEW_Y_MARGIN
        } );

      // Container
      const containerNode = new DiffusionContainerNode( model.hasDividerProperty, {
        left: this.layoutBounds.left + 2 * GasPropertiesConstants.SCREEN_VIEW_X_MARGIN,
        centerY: this.layoutBounds.centerY + 25
      } );

      // Stopwatch
      const stopwatchNode = new StopwatchNode( model.stopwatch, {
        dragBoundsProperty: this.visibleBoundsProperty
      } );

      // Reset All button
      const resetAllButton = new ResetAllButton( {
        listener: () => {
          this.interruptSubtreeInput(); // cancel interactions that are in progress
          model.reset();
          viewProperties.reset();
        },
        right: this.layoutBounds.maxX - GasPropertiesConstants.SCREEN_VIEW_X_MARGIN,
        bottom: this.layoutBounds.maxY - GasPropertiesConstants.SCREEN_VIEW_Y_MARGIN
      } );

      const timeControls = new DiffusionTimeControls( model, {
        right: resetAllButton.left - 65,
        bottom: this.layoutBounds.bottom - GasPropertiesConstants.SCREEN_VIEW_Y_MARGIN
      } );

      // Rendering order
      this.addChild( dataAccordionBox );
      this.addChild( controlPanel );
      this.addChild( containerNode );
      this.addChild( timeControls );
      this.addChild( resetAllButton );
      this.addChild( stopwatchNode );

      // @private
      this.model = model;
    }

    /**
     * Called on each step of the simulation's timer.
     * @param {number} dt - time delta, in seconds
     */
    step( dt ) {

      // convert s to ps
      //TODO

      // step elements that are specific to the view
      //TODO
    }
  }

  return gasProperties.register( 'DiffusionScreenView', DiffusionScreenView );
} );