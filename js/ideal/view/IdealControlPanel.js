// Copyright 2018-2019, University of Colorado Boulder

/**
 * Control panel that appears in the upper-right corner of the 'Ideal' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const BooleanProperty = require( 'AXON/BooleanProperty' );
  const CollisionCounterCheckbox = require( 'GAS_PROPERTIES/common/view/CollisionCounterCheckbox' );
  const EnumerationProperty = require( 'AXON/EnumerationProperty' );
  const FixedWidthNode = require( 'GAS_PROPERTIES/common/view/FixedWidthNode' );
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const GasPropertiesColorProfile = require( 'GAS_PROPERTIES/common/GasPropertiesColorProfile' );
  const GasPropertiesConstants = require( 'GAS_PROPERTIES/common/GasPropertiesConstants' );
  const HoldConstantControl = require( 'GAS_PROPERTIES/ideal/view/HoldConstantControl' );
  const HSeparator = require( 'SUN/HSeparator' );
  const NumberProperty = require( 'AXON/NumberProperty' );
  const Panel = require( 'SUN/Panel' );
  const Property = require( 'AXON/Property' );
  const StopwatchCheckbox = require( 'GAS_PROPERTIES/common/view/StopwatchCheckbox' );
  const VBox = require( 'SCENERY/nodes/VBox' );
  const WidthCheckbox = require( 'GAS_PROPERTIES/common/view/WidthCheckbox' );

  class IdealControlPanel extends Panel {

    /**
     * @param {EnumerationProperty} holdConstantProperty
     * @param {Property.<number>>} numberOfParticlesProperty
     * @param {NumberProperty} pressureProperty
     * @param {BooleanProperty} sizeVisibleProperty
     * @param {BooleanProperty} stopwatchVisibleProperty
     * @param {BooleanProperty} collisionCounterVisibleProperty
     * @param {Object} [options]
     */
    constructor( holdConstantProperty, numberOfParticlesProperty, pressureProperty, sizeVisibleProperty,
                 stopwatchVisibleProperty, collisionCounterVisibleProperty, options ) {
      assert && assert( holdConstantProperty instanceof EnumerationProperty,
        `invalid holdConstantProperty: ${holdConstantProperty}` );
      assert && assert( numberOfParticlesProperty instanceof Property,
        `invalid numberOfParticlesProperty: ${numberOfParticlesProperty}` );
      assert && assert( pressureProperty instanceof NumberProperty,
        `invalid pressureProperty: ${pressureProperty}` );
      assert && assert( sizeVisibleProperty instanceof BooleanProperty,
        `invalid sizeVisibleProperty: ${sizeVisibleProperty}` );
      assert && assert( stopwatchVisibleProperty instanceof BooleanProperty,
        `invalid stopwatchVisibleProperty: ${stopwatchVisibleProperty}` );
      assert && assert( collisionCounterVisibleProperty instanceof BooleanProperty,
        `invalid collisionCounterVisibleProperty: ${collisionCounterVisibleProperty}` );

      options = _.extend( {
        hasHoldConstantControls: true,
        fixedWidth: 100,
        xMargin: 0
      }, GasPropertiesConstants.PANEL_OPTIONS, options );

      const contentWidth = options.fixedWidth - ( 2 * options.xMargin );

      const children = [];

      // Optional HoldConstantControl and separator
      if ( options.hasHoldConstantControls ) {
        children.push( new HoldConstantControl( holdConstantProperty, numberOfParticlesProperty, pressureProperty, {
          maxWidth: contentWidth
        } ) );
        children.push( new HSeparator( contentWidth, {
          stroke: GasPropertiesColorProfile.separatorColorProperty,
          maxWidth: contentWidth
        } ) );
      }

      const checkboxOptions = {
        textMaxWidth: 110 // determined empirically
      };

      children.push( new WidthCheckbox( sizeVisibleProperty, checkboxOptions ) );
      children.push( new StopwatchCheckbox( stopwatchVisibleProperty, checkboxOptions ) );
      children.push( new CollisionCounterCheckbox( collisionCounterVisibleProperty, checkboxOptions ) );

      const content = new FixedWidthNode( contentWidth, new VBox( {
        align: 'left',
        spacing: 12,
        children: children
      } ) );

      super( content, options );
    }
  }

  return gasProperties.register( 'IdealControlPanel', IdealControlPanel );
} );
