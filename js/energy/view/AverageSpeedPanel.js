// Copyright 2019, University of Colorado Boulder

/**
 * Displays the average speed (in m/s) for each type of particle in the container.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const GasPropertiesCheckbox = require( 'GAS_PROPERTIES/common/view/GasPropertiesCheckbox' );
  const GasPropertiesColorProfile = require( 'GAS_PROPERTIES/common/GasPropertiesColorProfile' );
  const GasPropertiesConstants = require( 'GAS_PROPERTIES/common/GasPropertiesConstants' );
  const GasPropertiesIconFactory = require( 'GAS_PROPERTIES/common/view/GasPropertiesIconFactory' );
  const HBox = require( 'SCENERY/nodes/HBox' );
  const HStrut = require( 'SCENERY/nodes/HStrut' );
  const NumberDisplay = require( 'SCENERY_PHET/NumberDisplay' );
  const Panel = require( 'SUN/Panel' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const Property = require( 'AXON/Property' );
  const Range = require( 'DOT/Range' );
  const SunConstants = require( 'SUN/SunConstants' );
  const VBox = require( 'SCENERY/nodes/VBox' );

  // strings
  const averageSpeedString = require( 'string!GAS_PROPERTIES/averageSpeed' );
  const valueMetersPerSecondString = require( 'string!GAS_PROPERTIES/valueMetersPerSecond' );

  class AverageSpeedPanel extends Panel {

    /**
     * @param {BooleanProperty} averageSpeedVisibleProperty
     * @param {NumberProperty} heavyAverageSpeedProperty - average speed of heavy particles, in nm/ps
     * @param {NumberProperty} lightAverageSpeedProperty - average speed of light particles, in nm/ps
     * @param {ModelViewTransform2} modelViewTransform
     * @param {Object} [options]
     */
    constructor( averageSpeedVisibleProperty, heavyAverageSpeedProperty, lightAverageSpeedProperty, modelViewTransform, options ) {

      options = _.extend( {
        spacing: 10,
        align: 'center'
      }, GasPropertiesConstants.PANEL_OPTIONS, {

        // this is a disembodied panel
        fill: null,
        stroke: null
      }, options );

      const checkbox = new GasPropertiesCheckbox( averageSpeedVisibleProperty, {
        text: averageSpeedString
      } );

      // icons for the particles
      const heavyParticleNode = GasPropertiesIconFactory.createHeavyParticleIcon( modelViewTransform );
      const lightParticleNode = GasPropertiesIconFactory.createLightParticleIcon( modelViewTransform );

      // add a horizontal strut so that icons have the same effective width
      const maxWidth = Math.max( heavyParticleNode.width, lightParticleNode.width );
      heavyParticleNode.addChild( new HStrut( maxWidth, { center: heavyParticleNode.center } ) );
      lightParticleNode.addChild( new HStrut( maxWidth, { center: lightParticleNode.center } ) );

      // Adapter Properties, in m/s
      const heavyMetersPerSecondProperty = new Property( null );
      const lightMetersPerSecondProperty = new Property( null );

      // Update only when visible.
      Property.multilink(
        [ averageSpeedVisibleProperty, heavyAverageSpeedProperty ],
        ( averageSpeedVisible, heavyAverageSpeed ) => {
          if ( averageSpeedVisible ) {
            heavyMetersPerSecondProperty.value = convertAverageSpeed( heavyAverageSpeed );
          }
        } );
      Property.multilink(
        [ averageSpeedVisibleProperty, lightAverageSpeedProperty ],
        ( averageSpeedVisible, lightAverageSpeed ) => {
          if ( averageSpeedVisible ) {
            lightMetersPerSecondProperty.value = convertAverageSpeed( lightAverageSpeed );
          }
        } );

      const numberDisplayRange = new Range( 0, 9999 );
      const numberDisplayOptions = {
        valuePattern: valueMetersPerSecondString,
        noValuePattern: SunConstants.VALUE_NAMED_PLACEHOLDER,
        decimalPlaces: 1,
        align: 'right',
        noValueAlign: 'left',
        font: new PhetFont( 16 ),
        numberFill: GasPropertiesColorProfile.textFillProperty,
        backgroundFill: null,
        backgroundStroke: null
      };

      const heavyNumberDisplay = new NumberDisplay( heavyMetersPerSecondProperty, numberDisplayRange, numberDisplayOptions );
      const lightNumberDisplay = new NumberDisplay( lightMetersPerSecondProperty, numberDisplayRange, numberDisplayOptions );

      //TODO use GasPropertiesConstants.VBOX_OPTIONS ?
      // layout icons and NumberDisplays in a grid
      const vBox = new VBox( {
        children: [
          new HBox( { children: [ heavyParticleNode, heavyNumberDisplay ] } ),
          new HBox( { children: [ lightParticleNode, lightNumberDisplay ] } )
        ],
        align: 'left'
      } );

      //TODO use GasPropertiesConstants.VBOX_OPTIONS ?
      // panel content
      const contentNode = new VBox( {
        children: [ checkbox, vBox ]
      } );

      super( contentNode, options );

      averageSpeedVisibleProperty.link( averageSpeedSelected => { vBox.visible = averageSpeedSelected; } );
    }
  }

  /**
   * Converts from nm/ps to m/s.
   * @param {number|null} averageSpeed - in nm/ps
   * @returns {number|null}
   */
  const convertAverageSpeed = ( averageSpeed ) => {
    if ( typeof averageSpeed === 'number' ) {
      return 1000 * averageSpeed;
    }
    else {
      return null;
    }
  };

  return gasProperties.register( 'AverageSpeedPanel', AverageSpeedPanel );
} );