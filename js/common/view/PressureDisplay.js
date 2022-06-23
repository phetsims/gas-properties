// Copyright 2018-2021, University of Colorado Boulder

/**
 * PressureDisplay displays the pressure value, with the ability to switch units via a combo box.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Range from '../../../../dot/js/Range.js';
import merge from '../../../../phet-core/js/merge.js';
import ComboBoxDisplay from '../../../../scenery-phet/js/ComboBoxDisplay.js';
import { Node } from '../../../../scenery/js/imports.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import gasProperties from '../../gasProperties.js';
import gasPropertiesStrings from '../../gasPropertiesStrings.js';
import GasPropertiesConstants from '../GasPropertiesConstants.js';
import GasPropertiesQueryParameters from '../GasPropertiesQueryParameters.js';
import PressureGauge from '../model/PressureGauge.js';

// constants
const NUMBER_DISPLAY_RANGE = new Range( 0, GasPropertiesQueryParameters.maxPressure );

class PressureDisplay extends ComboBoxDisplay {

  /**
   * @param {PressureGauge} pressureGauge
   * @param {Node} listParent - parent for ComboBox list
   * @param {Object} [options]
   */
  constructor( pressureGauge, listParent, options ) {
    assert && assert( pressureGauge instanceof PressureGauge, `invalid pressureGauge: ${pressureGauge}` );
    assert && assert( listParent instanceof Node, `invalid listParent: ${listParent}` );

    options = merge( {
      tandem: Tandem.REQUIRED
    }, GasPropertiesConstants.COMBO_BOX_DISPLAY_OPTIONS, options );

    const items = [
      {
        choice: PressureGauge.Units.ATMOSPHERES,
        tandemName: `${PressureGauge.Units.ATMOSPHERES.toString().toLowerCase()}Item`,
        numberProperty: pressureGauge.pressureAtmospheresProperty,
        range: NUMBER_DISPLAY_RANGE,
        units: gasPropertiesStrings.atmospheres,
        numberDisplayOptions: {
          decimalPlaces: 1
        }
      },
      {
        choice: PressureGauge.Units.KILOPASCALS,
        tandemName: `${PressureGauge.Units.KILOPASCALS.toString().toLowerCase()}Item`,
        numberProperty: pressureGauge.pressureKilopascalsProperty,
        range: NUMBER_DISPLAY_RANGE,
        units: gasPropertiesStrings.kilopascals,
        numberDisplayOptions: {
          decimalPlaces: 0
        }
      }
    ];

    super( pressureGauge.unitsProperty, items, listParent, options );
  }
}

gasProperties.register( 'PressureDisplay', PressureDisplay );
export default PressureDisplay;