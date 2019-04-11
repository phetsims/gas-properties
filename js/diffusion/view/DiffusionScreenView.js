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
  const DiffusionControlPanel = require( 'GAS_PROPERTIES/diffusion/view/DiffusionControlPanel' );
  const DiffusionViewProperties = require( 'GAS_PROPERTIES/diffusion/view/DiffusionViewProperties' );
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const GasPropertiesConstants = require( 'GAS_PROPERTIES/common/GasPropertiesConstants' );
  const ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  const ScreenView = require( 'JOIST/ScreenView' );

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
        left: this.layoutBounds.left + GasPropertiesConstants.SCREEN_VIEW_X_MARGIN,
        top: this.layoutBounds.top + GasPropertiesConstants.SCREEN_VIEW_Y_MARGIN
      } );
      this.addChild( dataAccordionBox );

      // Control panel at right side of screen
      const controlPanel = new DiffusionControlPanel( model.stopwatch.visibleProperty, {
        fixedWidth: 300,
        right: this.layoutBounds.right - GasPropertiesConstants.SCREEN_VIEW_X_MARGIN,
        top: this.layoutBounds.top + GasPropertiesConstants.SCREEN_VIEW_Y_MARGIN
      } );
      this.addChild( controlPanel );

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
      this.addChild( resetAllButton );

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