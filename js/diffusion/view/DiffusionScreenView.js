// Copyright 2018-2020, University of Colorado Boulder

/**
 * DiffusionScreenView is the view for the 'Diffusion' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../phet-core/js/merge.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import GasPropertiesColorProfile from '../../common/GasPropertiesColorProfile.js';
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

class DiffusionScreenView extends BaseScreenView {

  /**
   * @param {DiffusionModel} model
   * @param {Tandem} tandem
   * @param {Object} [options]
   */
  constructor( model, tandem, options ) {
    assert && assert( model instanceof DiffusionModel, `invalid model: ${model}` );
    assert && assert( tandem instanceof Tandem, `invalid tandem: ${tandem}` );

    options = merge( {

      // superclass options
      hasSlowMotion: true // adds Normal/Slow radio buttons to the time controls
    }, options );

    super( model, tandem, options );

    const viewProperties = new DiffusionViewProperties( tandem.createTandem( 'viewProperties' ) );

    // Container
    const containerNode = new DiffusionContainerNode( model.container, model.modelViewTransform );

    // Scale below the container
    const scaleNode = new ScaleNode( model.container.widthProperty.value, model.modelViewTransform,
      viewProperties.scaleVisibleProperty, {
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
      model.modelViewTransform, GasPropertiesColorProfile.particle1ColorProperty, {
        tandem: tandem.createTandem( 'centerOfMassNode1' )
      } );
    const centerOfMassNode2 = new CenterOfMassNode( model.centerOfMass2Property, model.container.bottom,
      model.modelViewTransform, GasPropertiesColorProfile.particle2ColorProperty, {
        tandem: tandem.createTandem( 'centerOfMassNode2' )
      } );

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
      top: containerNode.bottom + 38,
      tandem: tandem.createTandem( 'particleFlowRateNode1' )
    } );
    const particleFlowRateNode2 = new ParticleFlowRateNode( model.particleFlowRate2, {
      arrowNodeOptions: {
        fill: GasPropertiesColorProfile.particle2ColorProperty
      },
      centerX: containerNode.centerX,
      top: particleFlowRateNode1.bottom + 5,
      tandem: tandem.createTandem( 'particleFlowRateNode2' )
    } );

    viewProperties.particleFlowRateVisibleProperty.link( visible => {
      particleFlowRateNode1.visible = visible;
      particleFlowRateNode2.visible = visible;
    } );

    // Data accordion box
    const dataAccordionBox = new DataAccordionBox( model.leftData, model.rightData, model.modelViewTransform, {
      expandedProperty: viewProperties.dataExpandedProperty,
      centerX: containerNode.centerX,
      top: this.layoutBounds.top + GasPropertiesConstants.SCREEN_VIEW_Y_MARGIN,
      tandem: tandem.createTandem( 'dataAccordionBox' )
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
      if ( !this.model.isPlayingProperty.value ) {
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

    // @private
    this.model = model;
    this.viewProperties = viewProperties;
    this.regionsNode = regionsNode;
    this.particleSystemNode = particleSystemNode;
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
    assert && assert( typeof dt === 'number' && dt >= 0, `invalid dt: ${dt}` );
    super.stepView( dt );
    this.particleSystemNode.update();
    this.regionsNode && this.regionsNode.update();
  }
}

gasProperties.register( 'DiffusionScreenView', DiffusionScreenView );
export default DiffusionScreenView;