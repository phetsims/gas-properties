// Copyright 2019-2022, University of Colorado Boulder

/**
 * GasPropertiesStopwatchNode is a specialization of StopwatchNode for this sim, a digital stopwatch.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

// modules
import Range from '../../../../dot/js/Range.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import Stopwatch from '../../../../scenery-phet/js/Stopwatch.js';
import StopwatchNode, { StopwatchNodeOptions } from '../../../../scenery-phet/js/StopwatchNode.js';
import gasProperties from '../../gasProperties.js';
import GasPropertiesStrings from '../../GasPropertiesStrings.js';
import GasPropertiesColors from '../GasPropertiesColors.js';
import GasPropertiesConstants from '../GasPropertiesConstants.js';

type SelfOptions = EmptySelfOptions;

type GasPropertiesStopwatchNodeOptions = SelfOptions & PickRequired<StopwatchNodeOptions, 'dragBoundsProperty' | 'tandem'>;

export default class GasPropertiesStopwatchNode extends StopwatchNode {

  public constructor( stopwatch: Stopwatch, providedOptions: GasPropertiesStopwatchNodeOptions ) {

    const options = optionize<GasPropertiesStopwatchNodeOptions, SelfOptions, StopwatchNodeOptions>()( {

      // StopwatchNodeOptions
      numberDisplayRange: new Range( 0, GasPropertiesConstants.MAX_TIME ),
      backgroundBaseColor: GasPropertiesColors.stopwatchBackgroundColorProperty,
      numberDisplayOptions: {
        numberFormatter: StopwatchNode.createRichTextNumberFormatter( {
          showAsMinutesAndSeconds: false,
          numberOfDecimalPlaces: 1,
          units: GasPropertiesStrings.picosecondsStringProperty
        } )
      },
      visiblePropertyOptions: {
        phetioReadOnly: true,
        phetioDocumentation: 'visibility is controlled by the model'
      }
    }, providedOptions );

    super( stopwatch, options );
  }

  public override dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }
}

gasProperties.register( 'GasPropertiesStopwatchNode', GasPropertiesStopwatchNode );