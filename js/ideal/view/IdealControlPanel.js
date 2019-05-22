// Copyright 2018-2019, University of Colorado Boulder

/**
 * Control panel that appears in the upper-right corner of the 'Ideal' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const CollisionCounterCheckbox = require( 'GAS_PROPERTIES/common/view/CollisionCounterCheckbox' );
  const FixedWidthNode = require( 'GAS_PROPERTIES/common/view/FixedWidthNode' );
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const GasPropertiesColorProfile = require( 'GAS_PROPERTIES/common/GasPropertiesColorProfile' );
  const GasPropertiesConstants = require( 'GAS_PROPERTIES/common/GasPropertiesConstants' );
  const HoldConstantControl = require( 'GAS_PROPERTIES/ideal/view/HoldConstantControl' );
  const HSeparator = require( 'SUN/HSeparator' );
  const Panel = require( 'SUN/Panel' );
  const StopwatchCheckbox = require( 'GAS_PROPERTIES/common/view/StopwatchCheckbox' );
  const VBox = require( 'SCENERY/nodes/VBox' );
  const WidthCheckbox = require( 'GAS_PROPERTIES/common/view/WidthCheckbox' );

  class IdealControlPanel extends Panel {

    /**
     * @param {StringProperty} holdConstantProperty
     * @param {NumberProperty} totalNumberOfParticlesProperty
     * @param {NumberProperty} pressureProperty
     * @param {BooleanProperty} sizeVisibleProperty
     * @param {BooleanProperty} stopwatchVisibleProperty
     * @param {BooleanProperty} collisionCounterVisibleProperty
     * @param {Object} [options]
     */
    constructor( holdConstantProperty, totalNumberOfParticlesProperty, pressureProperty, sizeVisibleProperty,
                 stopwatchVisibleProperty, collisionCounterVisibleProperty, options ) {

      options = _.extend( {
        fixedWidth: 100,
        xMargin: 0
      }, GasPropertiesConstants.PANEL_OPTIONS, options );

      const contentWidth = options.fixedWidth - ( 2 * options.xMargin );

      const content = new FixedWidthNode( contentWidth, new VBox( {
        align: 'left',
        spacing: 12,
        children: [
          new HoldConstantControl( holdConstantProperty, totalNumberOfParticlesProperty, pressureProperty, {
            maxWidth: contentWidth
          } ),
          new HSeparator( contentWidth, {
            stroke: GasPropertiesColorProfile.separatorColorProperty,
            maxWidth: contentWidth
          } ),
          new WidthCheckbox( sizeVisibleProperty ),
          new StopwatchCheckbox( stopwatchVisibleProperty ),
          new CollisionCounterCheckbox( collisionCounterVisibleProperty )
        ]
      } ) );

      super( content, options );
    }
  }

  return gasProperties.register( 'IdealControlPanel', IdealControlPanel );
} );
 