// Copyright 2019-2020, University of Colorado Boulder

/**
 * GasPropertiesStopwatchNode is a specialization of StopwatchNode for this sim, a digital stopwatch.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */


// modules

import merge from '../../../../phet-core/js/merge.js';
import StopwatchNode from '../../../../scenery-phet/js/StopwatchNode.js';
import StopwatchReadoutNode from '../../../../scenery-phet/js/StopwatchReadoutNode.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import gasProperties from '../../gasProperties.js';
import gasPropertiesStrings from '../../gasPropertiesStrings.js';
import GasPropertiesColorProfile from '../GasPropertiesColorProfile.js';

const picosecondsString = gasPropertiesStrings.picoseconds;

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
      },

      // phet-io
      tandem: Tandem.REQUIRED,
      phetioComponentOptions: {

        // model controls visibility
        visibleProperty: {
          phetioReadOnly: true,
          phetioDocumentation: 'visibility is controlled by the model'
        }
      }
    }, options );

    super( stopwatch, options );
  }
}

gasProperties.register( 'GasPropertiesStopwatchNode', GasPropertiesStopwatchNode );
export default GasPropertiesStopwatchNode;