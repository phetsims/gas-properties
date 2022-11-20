// Copyright 2019-2022, University of Colorado Boulder

// @ts-nocheck
/**
 * KineticEnergyAccordionBox contains the 'Kinetic Energy' histogram and related controls.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../phet-core/js/merge.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import gasProperties from '../../gasProperties.js';
import GasPropertiesStrings from '../../GasPropertiesStrings.js';
import HistogramsModel from '../model/HistogramsModel.js';
import EnergyAccordionBox from './EnergyAccordionBox.js';
import KineticEnergyHistogramNode from './KineticEnergyHistogramNode.js';

export default class KineticEnergyAccordionBox extends EnergyAccordionBox {

  /**
   * @param {HistogramsModel} histogramsModel
   * @param {ModelViewTransform2} modelViewTransform
   * @param {Object} [options]
   */
  constructor( histogramsModel, modelViewTransform, options ) {
    assert && assert( histogramsModel instanceof HistogramsModel, `invalid model: ${histogramsModel}` );
    assert && assert( modelViewTransform instanceof ModelViewTransform2, `invalid modelViewTransform: ${modelViewTransform}` );

    options = merge( {

      // phet-io
      tandem: Tandem.REQUIRED
    }, options );

    const histogramNode = new KineticEnergyHistogramNode( histogramsModel, {
      tandem: options.tandem.createTandem( 'histogramNode' )
    } );

    super( GasPropertiesStrings.kineticEnergyStringProperty, modelViewTransform, histogramNode, options );
  }
}

gasProperties.register( 'KineticEnergyAccordionBox', KineticEnergyAccordionBox );