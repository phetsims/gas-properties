// Copyright 2019-2020, University of Colorado Boulder

/**
 * LightParticlesCheckbox is a checkbox used to show histogram data for light particles in the 'Energy' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import LightParticle from '../../common/model/LightParticle.js';
import gasProperties from '../../gasProperties.js';
import SpeciesHistogramCheckbox from './SpeciesHistogramCheckbox.js';

export default class LightParticlesCheckbox extends SpeciesHistogramCheckbox {

  /**
   * @param {BooleanProperty} lightVisibleProperty
   * @param {ModelViewTransform2} modelViewTransform
   * @param {Object} [options]
   */
  constructor( lightVisibleProperty, modelViewTransform, options ) {
    assert && assert( lightVisibleProperty instanceof BooleanProperty,
      `invalid lightVisibleProperty: ${lightVisibleProperty}` );
    assert && assert( modelViewTransform instanceof ModelViewTransform2,
      `invalid modelViewTransform: ${modelViewTransform}` );

    super( lightVisibleProperty, new LightParticle(), modelViewTransform, options );
  }
}

gasProperties.register( 'LightParticlesCheckbox', LightParticlesCheckbox );