// Copyright 2019-2022, University of Colorado Boulder

// @ts-nocheck
/**
 * DiffusionDataNode display data for one side of the container in the 'Data' accordion box.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Range from '../../../../dot/js/Range.js';
import merge from '../../../../phet-core/js/merge.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import NumberDisplay from '../../../../scenery-phet/js/NumberDisplay.js';
import { HBox, VBox } from '../../../../scenery/js/imports.js';
import GasPropertiesColors from '../../common/GasPropertiesColors.js';
import GasPropertiesConstants from '../../common/GasPropertiesConstants.js';
import GasPropertiesIconFactory from '../../common/view/GasPropertiesIconFactory.js';
import gasProperties from '../../gasProperties.js';
import GasPropertiesStrings from '../../GasPropertiesStrings.js';
import DiffusionData from '../model/DiffusionData.js';

// constants
const PARTICLE_COUNT_RANGE = new Range( 0, 1000 );
const AVERAGE_TEMPERATURE_RANGE = new Range( 0, 1000 );

export default class DiffusionDataNode extends VBox {

  /**
   * @param {DiffusionData} data
   * @param {ModelViewTransform2} modelViewTransform
   * @param {Object} [options]
   */
  constructor( data, modelViewTransform, options ) {
    assert && assert( data instanceof DiffusionData, `invalid data: ${data}` );
    assert && assert( modelViewTransform instanceof ModelViewTransform2,
      `invalid modelViewTransform: ${modelViewTransform}` );

    options = merge( {

      // superclass options
      spacing: 10,
      align: 'left'
    }, options );

    const numberDisplayOptions = {
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

    // number of DiffusionParticle1
    const particle1CountNode = new HBox( {
      spacing: 3,
      children: [
        GasPropertiesIconFactory.createDiffusionParticle1Icon( modelViewTransform ),
        new NumberDisplay( data.numberOfParticles1Property, PARTICLE_COUNT_RANGE, numberDisplayOptions )
      ]
    } );

    // number of DiffusionParticle2
    const particle2CountNode = new HBox( {
      spacing: 3,
      children: [
        GasPropertiesIconFactory.createDiffusionParticle2Icon( modelViewTransform ),
        new NumberDisplay( data.numberOfParticles2Property, PARTICLE_COUNT_RANGE, numberDisplayOptions )
      ]
    } );

    const averageTemperatureNode = new NumberDisplay( data.averageTemperatureProperty, AVERAGE_TEMPERATURE_RANGE,
      merge( {}, numberDisplayOptions, {
        align: 'left',
        valuePattern: GasPropertiesStrings.tAvgK,
        noValuePattern: GasPropertiesStrings.tAvg,
        useRichText: true,
        maxWidth: 100 // determined empirically
      } ) );

    assert && assert( !options.children, 'DiffusionDataNode sets children' );
    options = merge( {
      children: [ particle1CountNode, particle2CountNode, averageTemperatureNode ]
    }, options );

    super( options );
  }
}

gasProperties.register( 'DiffusionDataNode', DiffusionDataNode );