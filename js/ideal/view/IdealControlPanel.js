// Copyright 2018-2020, University of Colorado Boulder

/**
 * IdealControlPanel is the control panel that appears in the upper-right corner of the 'Ideal' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Property from '../../../../axon/js/Property.js';
import merge from '../../../../phet-core/js/merge.js';
import VBox from '../../../../scenery/js/nodes/VBox.js';
import HSeparator from '../../../../sun/js/HSeparator.js';
import Panel from '../../../../sun/js/Panel.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import GasPropertiesColors from '../../common/GasPropertiesColors.js';
import GasPropertiesConstants from '../../common/GasPropertiesConstants.js';
import CollisionCounterCheckbox from '../../common/view/CollisionCounterCheckbox.js';
import FixedWidthNode from '../../common/view/FixedWidthNode.js';
import StopwatchCheckbox from '../../common/view/StopwatchCheckbox.js';
import WidthCheckbox from '../../common/view/WidthCheckbox.js';
import gasProperties from '../../gasProperties.js';
import HoldConstantControl from './HoldConstantControl.js';

class IdealControlPanel extends Panel {

  /**
   * @param {EnumerationProperty} holdConstantProperty
   * @param {Property.<number>>} numberOfParticlesProperty
   * @param {NumberProperty} pressureProperty
   * @param {BooleanProperty} isContainerOpenProperty
   * @param {BooleanProperty} widthVisibleProperty
   * @param {BooleanProperty} stopwatchVisibleProperty
   * @param {BooleanProperty} collisionCounterVisibleProperty
   * @param {Object} [options]
   */
  constructor( holdConstantProperty, numberOfParticlesProperty, pressureProperty, isContainerOpenProperty,
               widthVisibleProperty, stopwatchVisibleProperty, collisionCounterVisibleProperty, options ) {
    assert && assert( holdConstantProperty instanceof EnumerationProperty,
      `invalid holdConstantProperty: ${holdConstantProperty}` );
    assert && assert( numberOfParticlesProperty instanceof Property,
      `invalid numberOfParticlesProperty: ${numberOfParticlesProperty}` );
    assert && assert( pressureProperty instanceof NumberProperty,
      `invalid pressureProperty: ${pressureProperty}` );
    assert && assert( isContainerOpenProperty instanceof Property,
      `invalid isContainerOpenProperty: ${isContainerOpenProperty}` );
    assert && assert( widthVisibleProperty instanceof BooleanProperty,
      `invalid widthVisibleProperty: ${widthVisibleProperty}` );
    assert && assert( stopwatchVisibleProperty instanceof BooleanProperty,
      `invalid stopwatchVisibleProperty: ${stopwatchVisibleProperty}` );
    assert && assert( collisionCounterVisibleProperty instanceof BooleanProperty,
      `invalid collisionCounterVisibleProperty: ${collisionCounterVisibleProperty}` );

    options = merge( {
      hasHoldConstantControls: true,
      fixedWidth: 100,
      xMargin: 0,

      // phet-io
      tandem: Tandem.REQUIRED
    }, GasPropertiesConstants.PANEL_OPTIONS, options );

    const contentWidth = options.fixedWidth - ( 2 * options.xMargin );

    const children = [];

    // Optional HoldConstantControl and separator
    if ( options.hasHoldConstantControls ) {
      children.push( new HoldConstantControl(
        holdConstantProperty, numberOfParticlesProperty, pressureProperty, isContainerOpenProperty, {
          maxWidth: contentWidth,
          tandem: options.tandem.createTandem( 'holdConstantControl' )
        } ) );
      children.push( new HSeparator( contentWidth, {
        stroke: GasPropertiesColors.separatorColorProperty,
        maxWidth: contentWidth
      } ) );
    }

    const checkboxOptions = {
      textMaxWidth: 110 // determined empirically
    };

    children.push( new WidthCheckbox( widthVisibleProperty, merge( {}, checkboxOptions, {
      tandem: options.tandem.createTandem( 'widthCheckbox' )
    } ) ) );
    children.push( new StopwatchCheckbox( stopwatchVisibleProperty, merge( {}, checkboxOptions, {
      tandem: options.tandem.createTandem( 'stopwatchCheckbox' )
    } ) ) );
    children.push( new CollisionCounterCheckbox( collisionCounterVisibleProperty, merge( {}, checkboxOptions, {
      tandem: options.tandem.createTandem( 'collisionCounterCheckbox' )
    } ) ) );

    const content = new FixedWidthNode( contentWidth, new VBox( {
      align: 'left',
      spacing: 12,
      children: children
    } ) );

    super( content, options );
  }
}

gasProperties.register( 'IdealControlPanel', IdealControlPanel );
export default IdealControlPanel;