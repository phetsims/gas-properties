// Copyright 2018-2019, University of Colorado Boulder

/**
 * The view for the 'Diffusion' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const BaseScreenView = require( 'GAS_PROPERTIES/common/view/BaseScreenView' );
  const CenterOfMassNode = require( 'GAS_PROPERTIES/diffusion/view/CenterOfMassNode' );
  const DataAccordionBox = require( 'GAS_PROPERTIES/diffusion/view/DataAccordionBox' );
  const DiffusionContainerNode = require( 'GAS_PROPERTIES/diffusion/view/DiffusionContainerNode' );
  const DiffusionControlPanel = require( 'GAS_PROPERTIES/diffusion/view/DiffusionControlPanel' );
  const DiffusionModel = require( 'GAS_PROPERTIES/diffusion/model/DiffusionModel' );
  const DiffusionParticlesNode = require( 'GAS_PROPERTIES/diffusion/view/DiffusionParticlesNode' );
  const DiffusionViewProperties = require( 'GAS_PROPERTIES/diffusion/view/DiffusionViewProperties' );
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const GasPropertiesColorProfile = require( 'GAS_PROPERTIES/common/GasPropertiesColorProfile' );
  const GasPropertiesConstants = require( 'GAS_PROPERTIES/common/GasPropertiesConstants' );
  const GasPropertiesQueryParameters = require( 'GAS_PROPERTIES/common/GasPropertiesQueryParameters' );
  const ParticleFlowRateNode = require( 'GAS_PROPERTIES/diffusion/view/ParticleFlowRateNode' );
  const RegionsNode = require( 'GAS_PROPERTIES/common/view/RegionsNode' );
  const ScaleNode = require( 'GAS_PROPERTIES/diffusion/view/ScaleNode' );
  const StopwatchNode = require( 'GAS_PROPERTIES/common/view/StopwatchNode' );
  const Tandem = require( 'TANDEM/Tandem' );

  class DiffusionScreenView extends BaseScreenView {

    /**
     * @param {DiffusionModel} model
     * @param {Tandem} tandem
     * @param {Object} [options]
     */
    constructor( model, tandem, options ) {
      assert && assert( model instanceof DiffusionModel, `invalid model: ${model}` );
      assert && assert( tandem instanceof Tandem, `invalid tandem: ${tandem}` );

      options = _.extend( {
        hasSlowMotion: true // adds Normal/Slow radio buttons to the time controls
      }, options );

      super( model, tandem, options );

      const viewProperties = new DiffusionViewProperties();

      // Container
      const containerNode = new DiffusionContainerNode( model.container, model.modelViewTransform );

      // Scale below the container
      const scaleNode = new ScaleNode( model.container.widthProperty.value, model.modelViewTransform,
        viewProperties.scaleVisibleProperty, {
          centerX: model.modelViewTransform.modelToViewX( model.container.dividerX ),
          top: model.modelViewTransform.modelToViewY( model.container.bottom - model.container.wallThickness )
        } );

      // Show how the collision detection space is partitioned into regions
      let regionsNode = null;
      if ( GasPropertiesQueryParameters.regions ) {
        regionsNode = new RegionsNode( model.collisionDetector.regions, model.modelViewTransform );
      }

      // Center of Mass indicators
      const centerOfMassNode1 = new CenterOfMassNode( model.centerOfMass1Property, model.container.bottom,
        model.modelViewTransform, GasPropertiesColorProfile.particle1ColorProperty );
      const centerOfMassNode2 = new CenterOfMassNode( model.centerOfMass2Property, model.container.bottom,
        model.modelViewTransform, GasPropertiesColorProfile.particle2ColorProperty );

      viewProperties.centerOfMassVisibleProperty.link( visible => {
        centerOfMassNode1.visible = visible;
        centerOfMassNode2.visible = visible;
      } );

      // Particle Flow Rate vectors
      const particleFlowRateNode1 = new ParticleFlowRateNode( model.particleFlowRate1, {
        arrowNodeOptions: {
          fill: GasPropertiesColorProfile.particle1ColorProperty
        },
        centerX: containerNode.centerX,
        top: containerNode.bottom + 38
      } );
      const particleFlowRateNode2 = new ParticleFlowRateNode( model.particleFlowRate2, {
        arrowNodeOptions: {
          fill: GasPropertiesColorProfile.particle2ColorProperty
        },
        centerX: containerNode.centerX,
        top: particleFlowRateNode1.bottom + 5
      } );

      viewProperties.particleFlowRateVisibleProperty.link( visible => {
        particleFlowRateNode1.visible = visible;
        particleFlowRateNode2.visible = visible;
      } );

      // Data accordion box
      const dataAccordionBox = new DataAccordionBox( model.leftData, model.rightData, model.modelViewTransform, {
        expandedProperty: viewProperties.dataExpandedProperty,
        centerX: containerNode.centerX,
        top: this.layoutBounds.top + GasPropertiesConstants.SCREEN_VIEW_Y_MARGIN
      } );

      // Control panel at right side of screen
      const controlPanel = new DiffusionControlPanel( model.leftSettings, model.rightSettings,
        model.modelViewTransform,
        model.container.hasDividerProperty,
        model.totalNumberOfParticlesProperty,
        model.stopwatch.visibleProperty,
        viewProperties, {
          fixedWidth: 300,
          right: this.layoutBounds.right - GasPropertiesConstants.SCREEN_VIEW_X_MARGIN,
          top: this.layoutBounds.top + GasPropertiesConstants.SCREEN_VIEW_Y_MARGIN
        } );

      // The complete system of particles
      const particlesNode = new DiffusionParticlesNode( model );

      // If the number of particles changes while the sim is paused, redraw the particle system.
      model.totalNumberOfParticlesProperty.link( totalNumberOfParticles => {
        if ( !this.model.isPlayingProperty.value ) {
          particlesNode.update();
        }
      } );

      // Stopwatch
      const stopwatchNode = new StopwatchNode( model.stopwatch, this.visibleBoundsProperty );

      // Rendering order
      regionsNode && this.addChild( regionsNode );
      this.addChild( dataAccordionBox );
      this.addChild( controlPanel );
      this.addChild( scaleNode );
      this.addChild( containerNode );
      this.addChild( particlesNode );
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

      // Move time controls to front, so that long particle-flow rate indicators go behind time controls.
      this.timeControlNode.moveToFront();

      // @private
      this.model = model;
      this.viewProperties = viewProperties;
      this.regionsNode = regionsNode;
      this.particlesNode = particlesNode;
    }

    /**
     * Resets the screen.
     * @protected
     * @override
     */
    reset() {
      super.reset();
      this.viewProperties.reset();
    }

    /**
     * Steps the view using real time units.
     * @param {number} dt - time delta, in seconds
     * @public
     * @override
     */
    stepView( dt ) {
      assert && assert( typeof dt === 'number' && dt > 0, `invalid dt: ${dt}` );
      super.stepView( dt );
      this.particlesNode.update();
      this.regionsNode && this.regionsNode.update();
    }
  }

  return gasProperties.register( 'DiffusionScreenView', DiffusionScreenView );
} );