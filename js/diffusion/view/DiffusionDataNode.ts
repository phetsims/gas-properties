// Copyright 2019-2025, University of Colorado Boulder

/**
 * DiffusionDataNode display data for one side of the container in the 'Data' accordion box.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import Range from '../../../../dot/js/Range.js';
import { combineOptions } from '../../../../phet-core/js/optionize.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import NumberDisplay, { NumberDisplayOptions } from '../../../../scenery-phet/js/NumberDisplay.js';
import HBox from '../../../../scenery/js/layout/nodes/HBox.js';
import VBox from '../../../../scenery/js/layout/nodes/VBox.js';
import GasPropertiesColors from '../../common/GasPropertiesColors.js';
import GasPropertiesConstants from '../../common/GasPropertiesConstants.js';
import GasPropertiesIconFactory from '../../common/view/GasPropertiesIconFactory.js';
import gasProperties from '../../gasProperties.js';
import GasPropertiesStrings from '../../GasPropertiesStrings.js';
import DiffusionData from '../model/DiffusionData.js';

const PARTICLE_COUNT_RANGE = new Range( 0, 1000 );
const AVERAGE_TEMPERATURE_RANGE = new Range( 0, 1000 );

const NUMBER_DISPLAY_OPTIONS: NumberDisplayOptions = {
  align: 'right',
  textOptions: {
    fill: GasPropertiesColors.textFillProperty,
    font: GasPropertiesConstants.CONTROL_FONT
  },
  backgroundFill: null,
  backgroundStroke: null,
  xMargin: 0,
  yMargin: 0
};

export default class DiffusionDataNode extends VBox {

  public constructor( data: DiffusionData,
                      modelViewTransform: ModelViewTransform2,
                      numberOfParticleTypesProperty: TReadOnlyProperty<number> ) {

    // number of DiffusionParticle1
    const particle1CountNode = new HBox( {
      spacing: 3,
      children: [
        GasPropertiesIconFactory.createDiffusionParticle1Icon( modelViewTransform ),
        new NumberDisplay( data.numberOfParticles1Property, PARTICLE_COUNT_RANGE, NUMBER_DISPLAY_OPTIONS )
      ]
    } );

    // number of DiffusionParticle2
    const particle2CountNode = new HBox( {
      spacing: 3,
      children: [
        GasPropertiesIconFactory.createDiffusionParticle2Icon( modelViewTransform ),
        new NumberDisplay( data.numberOfParticles2Property, PARTICLE_COUNT_RANGE, NUMBER_DISPLAY_OPTIONS )
      ],
      visibleProperty: new DerivedProperty( [ numberOfParticleTypesProperty ], n => n === 2 )
    } );

    const averageTemperatureNode = new NumberDisplay( data.averageTemperatureProperty, AVERAGE_TEMPERATURE_RANGE,
      combineOptions<NumberDisplayOptions>( {}, NUMBER_DISPLAY_OPTIONS, {
        align: 'left',
        valuePattern: GasPropertiesStrings.tAvgKStringProperty,
        noValuePattern: GasPropertiesStrings.tAvgStringProperty,
        useRichText: true,
        maxWidth: 100 // determined empirically
      } ) );

    super( {
      isDisposable: false,
      children: [ particle1CountNode, particle2CountNode, averageTemperatureNode ],
      spacing: 10,
      align: 'left'
    } );
  }
}

gasProperties.register( 'DiffusionDataNode', DiffusionDataNode );