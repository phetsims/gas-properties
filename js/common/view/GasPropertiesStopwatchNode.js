// Copyright 2018-2019, University of Colorado Boulder

/**
 * GasPropertiesStopwatchNode is a specialization of StopwatchNode for this sim, a digital stopwatch.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules

  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const GasPropertiesColorProfile = require( 'GAS_PROPERTIES/common/GasPropertiesColorProfile' );
  const merge = require( 'PHET_CORE/merge' );
  const Text = require( 'SCENERY/nodes/Text' );
  const StopwatchNode = require( 'SCENERY_PHET/StopwatchNode' );
  const StopwatchReadoutNode = require( 'SCENERY_PHET/StopwatchReadoutNode' );

  // strings
  const picosecondsString = require( 'string!GAS_PROPERTIES/picoseconds' );

  class GasPropertiesStopwatchNode extends StopwatchNode {

    /**
     * @param {Stopwatch} stopwatch
     * @param {Object} [options]
     */
    constructor( stopwatch, options ) {

      options = merge( {

        // Customizations for Gas Properties
        backgroundBaseColor: GasPropertiesColorProfile.stopwatchBackgroundColorProperty,
        maxValue: 999.99,
        stopwatchReadoutNodeOptions: {
          unitsNode: new Text( picosecondsString, {
            font: StopwatchReadoutNode.DEFAULT_SMALL_FONT,
            maxWidth: 30 // determined empirically
          } )
        }
      }, options );

      super( stopwatch, options );
    }
  }

  return gasProperties.register( 'GasPropertiesStopwatchNode', GasPropertiesStopwatchNode );
} );