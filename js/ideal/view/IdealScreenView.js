// Copyright 2018, University of Colorado Boulder

/**
 * The view for the 'Ideal' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const BicyclePumpNode = require( 'GAS_PROPERTIES/common/view/BicyclePumpNode' );
  const CollisionCounterNode = require( 'GAS_PROPERTIES/common/view/CollisionCounterNode' );
  const ContainerNode = require( 'GAS_PROPERTIES/common/view/ContainerNode' );
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const GasPropertiesColorProfile = require( 'GAS_PROPERTIES/common/GasPropertiesColorProfile' );
  const GasPropertiesConstants = require( 'GAS_PROPERTIES/common/GasPropertiesConstants' );
  const GasPropertiesThermometerNode = require( 'GAS_PROPERTIES/common/view/GasPropertiesThermometerNode' );
  const HeaterCoolerNode = require( 'SCENERY_PHET/HeaterCoolerNode' );
  const IdealControlPanel = require( 'GAS_PROPERTIES/ideal/view/IdealControlPanel' );
  const IdealViewProperties = require( 'GAS_PROPERTIES/ideal/view/IdealViewProperties' );
  const Node = require( 'SCENERY/nodes/Node' );
  const ParticleCountsAccordionBox = require( 'GAS_PROPERTIES/common/view/ParticleCountsAccordionBox' );
  const ParticleTypeEnum = require( 'GAS_PROPERTIES/common/model/ParticleTypeEnum' );
  const ParticleTypeRadioButtonGroup = require( 'GAS_PROPERTIES/common/view/ParticleTypeRadioButtonGroup' );
  const PressureGaugeNode = require( 'GAS_PROPERTIES/common/view/PressureGaugeNode' );
  const ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  const ScreenView = require( 'JOIST/ScreenView' );
  const StopwatchNode = require( 'GAS_PROPERTIES/common/view/StopwatchNode' );
  const TimeControls = require( 'GAS_PROPERTIES/common/view/TimeControls' );
  const ToggleNode = require( 'SUN/ToggleNode' );
  const VBox = require( 'SCENERY/nodes/VBox' );

  // constants
  const PANEL_WIDTH = 225; // determined empirically

  class IdealScreenView extends ScreenView {

    /**
     * @param {IdealModel} model
     */
    constructor( model ) {

      super();

      // view-specific Properties
      const viewProperties = new IdealViewProperties();

      // Parent for combo box popup lists
      const comboBoxListParent = new Node();
      this.addChild( comboBoxListParent );

      // Control panel at upper right
      const controlPanel = new IdealControlPanel(
        model.holdConstantProperty,
        viewProperties.sizeVisibleProperty,
        model.stopwatch.visibleProperty,
        model.collisionCounter.visibleProperty, {
          fixedWidth: PANEL_WIDTH,
          right: this.layoutBounds.right - GasPropertiesConstants.SCREEN_VIEW_X_MARGIN,
          top: this.layoutBounds.top + GasPropertiesConstants.SCREEN_VIEW_Y_MARGIN
        } );
      this.addChild( controlPanel );

      // Particle Counts accordion box
      const particleCountsAccordionBox = new ParticleCountsAccordionBox(
        model.numberOfHeavyParticlesProperty, model.numberOfLightParticlesProperty, {
          fixedWidth: PANEL_WIDTH,
          expandedProperty: viewProperties.particleCountsExpandedProperty,
          right: controlPanel.right,
          top: controlPanel.bottom + 15
        } );
      this.addChild( particleCountsAccordionBox );

      // Bicycle pumps, one of which is visible depending on the selected particle type
      const bicyclePumpsToggleNode = new ToggleNode( viewProperties.particleTypeProperty, [

        // Bicycle pump for heavy particles
        {
          value: ParticleTypeEnum.HEAVY,
          node: new BicyclePumpNode( model.numberOfHeavyParticlesProperty, {
            color: GasPropertiesColorProfile.heavyParticleColorProperty
          } )
        },

        // Bicycle pump for light particles
        {
          value: ParticleTypeEnum.LIGHT,
          node: new BicyclePumpNode( model.numberOfLightParticlesProperty, {
            color: GasPropertiesColorProfile.lightParticleColorProperty
          } )
        }
      ] );

      // Radio buttons for selecting particle type
      const particleTypeRadioButtonGroup = new ParticleTypeRadioButtonGroup( viewProperties.particleTypeProperty );

      // Pumps + radio buttons
      const pumpBox = new VBox( {
        align: 'center',
        spacing: 15,
        children: [
          bicyclePumpsToggleNode,
          particleTypeRadioButtonGroup
        ],
        right: controlPanel.left - 40,
        bottom: this.layoutBounds.bottom - GasPropertiesConstants.SCREEN_VIEW_Y_MARGIN
      } );
      this.addChild( pumpBox );

      // Container
      const containerNode = new ContainerNode( model.container, {
        right: pumpBox.left - 40,
        centerY: this.layoutBounds.centerY - 40
      } );
      this.addChild( containerNode );

      //TODO HeaterCoolerNode is a mess, see https://github.com/phetsims/scenery-phet/issues/423
      // Device to heat/cool the contents of the container
      const heaterCoolerNode = new HeaterCoolerNode( {
        heatCoolAmountProperty: model.heatCoolAmountProperty,
        centerX: containerNode.centerX,
        bottom: this.layoutBounds.bottom - GasPropertiesConstants.SCREEN_VIEW_Y_MARGIN,
        scale: 0.9
      } );
      this.addChild( heaterCoolerNode );

      // Time controls
      const timeControls = new TimeControls( model, {
        left: this.layoutBounds.left + GasPropertiesConstants.SCREEN_VIEW_X_MARGIN,
        bottom: this.layoutBounds.bottom - GasPropertiesConstants.SCREEN_VIEW_Y_MARGIN
      } );
      this.addChild( timeControls );

      // Thermometer
      const thermometerNode = new GasPropertiesThermometerNode( model.thermometer, comboBoxListParent, {
        right: containerNode.right - 50,
        centerY: containerNode.top
      } );
      this.addChild( thermometerNode );

      const pressureGaugeNode = new PressureGaugeNode( model.pressureGauge, comboBoxListParent, {
        left: containerNode.right - 2,
        centerY: containerNode.top + 30
      } );
      this.addChild( pressureGaugeNode );
      pressureGaugeNode.moveToBack(); // to hide overlap with container

      // Reset All button
      const resetAllButton = new ResetAllButton( {
        listener: () => {
          model.reset();
          viewProperties.reset();
        },
        right: this.layoutBounds.maxX - GasPropertiesConstants.SCREEN_VIEW_X_MARGIN,
        bottom: this.layoutBounds.maxY - GasPropertiesConstants.SCREEN_VIEW_Y_MARGIN
      } );
      this.addChild( resetAllButton );

      // Collision Counter
      const collisionCounterNode = new CollisionCounterNode( model.collisionCounter, this.visibleBoundsProperty,
        comboBoxListParent );
      this.addChild( collisionCounterNode );

      // Stopwatch
      const stopwatchNode = new StopwatchNode( model.stopwatch, this.visibleBoundsProperty );
      this.addChild( stopwatchNode );

      // This should be in front of everything else.
      comboBoxListParent.moveToFront();
    }
  }

  return gasProperties.register( 'IdealScreenView', IdealScreenView );
} );