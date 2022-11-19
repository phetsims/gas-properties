// Copyright 2019-2022, University of Colorado Boulder

// @ts-nocheck
/**
 * HeavyParticlesCheckbox is a checkbox used to show histogram data for heavy particles in the 'Energy' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import HeavyParticle from '../../common/model/HeavyParticle.js';
import gasProperties from '../../gasProperties.js';
import SpeciesHistogramCheckbox from './SpeciesHistogramCheckbox.js';

export default class HeavyParticlesCheckbox extends SpeciesHistogramCheckbox {

  /**
   * @param {BooleanProperty} heavyVisibleProperty
   * @param {ModelViewTransform2} modelViewTransform
   * @param {Object} [options]
   */
  constructor( heavyVisibleProperty, modelViewTransform, options ) {
    assert && assert( heavyVisibleProperty instanceof BooleanProperty,
      `invalid heavyVisibleProperty: ${heavyVisibleProperty}` );
    assert && assert( modelViewTransform instanceof ModelViewTransform2,
      `invalid modelViewTransform: ${modelViewTransform}` );

    super( heavyVisibleProperty, new HeavyParticle(), modelViewTransform, options );
  }
}

gasProperties.register( 'HeavyParticlesCheckbox', HeavyParticlesCheckbox );