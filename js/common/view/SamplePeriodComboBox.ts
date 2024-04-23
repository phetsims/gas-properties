// Copyright 2024, University of Colorado Boulder

/**
 * SamplePeriodComboBox is the combo box for selecting a sample period for the collision counter.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import ComboBox, { ComboBoxItem } from '../../../../sun/js/ComboBox.js';
import Property from '../../../../axon/js/Property.js';
import { Node, Text } from '../../../../scenery/js/imports.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import PatternStringProperty from '../../../../axon/js/PatternStringProperty.js';
import GasPropertiesStrings from '../../GasPropertiesStrings.js';
import gasProperties from '../../gasProperties.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';

export default class SamplePeriodComboBox extends ComboBox<number> {

  public constructor( samplePeriodProperty: Property<number>, samplePeriods: number[], listboxParent: Node, tandem: Tandem ) {

    const comboBoxItems: ComboBoxItem<number>[] = samplePeriods.map( samplePeriod => {
      return {
        value: samplePeriod,
        createNode: ( contentTandem: Tandem ) => {

          // e.g. '10 ps'
          const samplePeriodStringProperty = new PatternStringProperty( GasPropertiesStrings.valueUnitsStringProperty, {
            value: samplePeriod,
            units: GasPropertiesStrings.picosecondsStringProperty
          }, {
            tandem: contentTandem.createTandem( 'samplePeriodStringProperty' )
          } );
          return new Text( samplePeriodStringProperty, {
            font: new PhetFont( 14 ),
            maxWidth: 100 // determined empirically
          } );
        },
        tandemName: `samplePeriod${samplePeriod}Item`
      };
    } );

    super( samplePeriodProperty, comboBoxItems, listboxParent, {
      align: 'right',
      xMargin: 6,
      yMargin: 3,
      cornerRadius: 5,
      tandem: tandem
    } );
  }
}

gasProperties.register( 'SamplePeriodComboBox', SamplePeriodComboBox );