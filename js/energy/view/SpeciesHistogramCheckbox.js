// Copyright 2019-2020, University of Colorado Boulder

/**
 * SpeciesHistogramCheckbox is the base class for checkboxes that show histogram data for a specific particle species.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import merge from '../../../../phet-core/js/merge.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import Particle from '../../common/model/Particle.js';
import GasPropertiesCheckbox from '../../common/view/GasPropertiesCheckbox.js';
import GasPropertiesIconFactory from '../../common/view/GasPropertiesIconFactory.js';
import gasProperties from '../../gasProperties.js';

class SpeciesHistogramCheckbox extends GasPropertiesCheckbox {

  /**
   * @param {BooleanProperty} speciesVisibleProperty
   * @param {Particle} particle
   * @param {ModelViewTransform2} modelViewTransform
   * @param {Object} [options]
   */
  constructor( speciesVisibleProperty, particle, modelViewTransform, options ) {
    assert && assert( speciesVisibleProperty instanceof BooleanProperty,
      `invalid speciesVisibleProperty: ${speciesVisibleProperty}` );
    assert && assert( particle instanceof Particle, `invalid particle: ${particle}` );
    assert && assert( modelViewTransform instanceof ModelViewTransform2,
      `invalid modelViewTransform: ${modelViewTransform}` );

    options = merge( {
      align: 'center',
      spacing: 5,

      // phet-io
      tandem: Tandem.REQUIRED
    }, options );

    assert && assert( !options.icon, 'SpeciesHistogramCheckbox sets icon' );
    options.icon = GasPropertiesIconFactory.createSpeciesHistogramIcon( particle, modelViewTransform );

    super( speciesVisibleProperty, options );
  }
}

gasProperties.register( 'SpeciesHistogramCheckbox', SpeciesHistogramCheckbox );
export default SpeciesHistogramCheckbox;