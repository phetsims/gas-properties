// Copyright 2018-2022, University of Colorado Boulder

// @ts-nocheck
/**
 * PressureDisplay displays a pressure gauge, pressure value, and a control for selecting temperature units.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../phet-core/js/merge.js';
import GaugeNode from '../../../../scenery-phet/js/GaugeNode.js';
import { Circle, LinearGradient, Node, Rectangle } from '../../../../scenery/js/imports.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import gasProperties from '../../gasProperties.js';
import GasPropertiesStrings from '../../GasPropertiesStrings.js';
import GasPropertiesQueryParameters from '../GasPropertiesQueryParameters.js';
import PressureGauge from '../model/PressureGauge.js';
import PressureDisplay from './PressureDisplay.js';

// constants
const DIAL_RADIUS = 50;
const POST_HEIGHT = 0.6 * DIAL_RADIUS;

export default class PressureGaugeNode extends Node {

  /**
   * @param {PressureGauge} pressureGauge
   * @param {Node} listParent - parent for the combo box popup list
   * @param {Object} [options]
   */
  constructor( pressureGauge, listParent, options ) {
    assert && assert( pressureGauge instanceof PressureGauge, `invalid pressureGauge: ${pressureGauge}` );
    assert && assert( listParent instanceof Node, `invalid listParent: ${listParent}` );

    options = merge( {
      tandem: Tandem.REQUIRED
    }, options );

    // circular dial with needle
    const gaugeNode = new GaugeNode( pressureGauge.pressureKilopascalsProperty, GasPropertiesStrings.pressureStringProperty,
      pressureGauge.pressureRange, {
        radius: DIAL_RADIUS,
        tandem: Tandem.OPTIONAL
      } );

    // horizontal post the sticks out of the left side of the gauge
    const postNode = new Rectangle( 0, 0, DIAL_RADIUS + 15, POST_HEIGHT, {
      fill: PressureGaugeNode.createPostGradient( POST_HEIGHT ),
      right: gaugeNode.centerX,
      centerY: gaugeNode.centerY
    } );

    // combo box to display value and choose units
    const comboBox = new PressureDisplay( pressureGauge, listParent, {
      centerX: gaugeNode.centerX,
      bottom: gaugeNode.bottom,
      maxWidth: gaugeNode.width,
      tandem: options.tandem.createTandem( 'comboBox' )
    } );

    assert && assert( !options.children, 'PressureGaugeNode sets children' );
    options.children = [ postNode, gaugeNode, comboBox ];

    super( options );

    // Red dot at the origin, for debugging layout
    if ( GasPropertiesQueryParameters.origin ) {
      this.addChild( new Circle( 3, { fill: 'red' } ) );
    }
  }

  /**
   * Creates the vertical gradient for the post that connects the gauge to the container.
   * @param {number} postHeight
   * @returns {Gradient}
   * @public
   * @static
   */
  static createPostGradient( postHeight ) {
    assert && assert( typeof postHeight === 'number' && postHeight > 0, `invalid postHeight: ${postHeight}` );

    return new LinearGradient( 0, 0, 0, postHeight )
      .addColorStop( 0, 'rgb( 120, 120, 120 )' )
      .addColorStop( 0.3, 'rgb( 220, 220, 220 )' )
      .addColorStop( 0.5, 'rgb( 220, 220, 220 )' )
      .addColorStop( 1, 'rgb( 100, 100, 100 )' );
  }
}

gasProperties.register( 'PressureGaugeNode', PressureGaugeNode );