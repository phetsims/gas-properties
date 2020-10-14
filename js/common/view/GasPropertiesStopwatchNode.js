// Copyright 2019-2020, University of Colorado Boulder

/**
 * GasPropertiesStopwatchNode is a specialization of StopwatchNode for this sim, a digital stopwatch.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

// modules
import Range from '../../../../dot/js/Range.js';
import merge from '../../../../phet-core/js/merge.js';
import StopwatchNode from '../../../../scenery-phet/js/StopwatchNode.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import gasProperties from '../../gasProperties.js';
import gasPropertiesStrings from '../../gasPropertiesStrings.js';
import GasPropertiesColorProfile from '../GasPropertiesColorProfile.js';
import GasPropertiesConstants from '../GasPropertiesConstants.js';

class GasPropertiesStopwatchNode extends StopwatchNode {

  /**
   * @param {Stopwatch} stopwatch
   * @param {Object} [options]
   */
  constructor( stopwatch, options ) {

    options = merge( {

      // For determining an appropriate size for the font
      numberDisplayRange: new Range( 0, GasPropertiesConstants.MAX_TIME ),

      // Customizations for Gas Properties
      backgroundBaseColor: GasPropertiesColorProfile.stopwatchBackgroundColorProperty,

      numberDisplayOptions: {
        numberFormatter: StopwatchNode.getRichNumberFormatter( {
          showAsDecimal: true,
          units: gasPropertiesStrings.picoseconds
        } )
      },

      // phet-io
      tandem: Tandem.REQUIRED,

      // model controls visibility
      visiblePropertyOptions: {
        phetioReadOnly: true,
        phetioDocumentation: 'visibility is controlled by the model'
      }
    }, options );

    super( stopwatch, options );
  }
}

gasProperties.register( 'GasPropertiesStopwatchNode', GasPropertiesStopwatchNode );
export default GasPropertiesStopwatchNode;