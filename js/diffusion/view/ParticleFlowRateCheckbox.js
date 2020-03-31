// Copyright 2019-2020, University of Colorado Boulder

/**
 * ParticleFlowRateCheckbox is the checkbox used to show/hide the particle flow rate indicators on the container.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import merge from '../../../../phet-core/js/merge.js';
import GasPropertiesCheckbox from '../../common/view/GasPropertiesCheckbox.js';
import GasPropertiesIconFactory from '../../common/view/GasPropertiesIconFactory.js';
import gasPropertiesStrings from '../../gasPropertiesStrings.js';
import gasProperties from '../../gasProperties.js';

const particleFlowRateString = gasPropertiesStrings.particleFlowRate;

class ParticleFlowRateCheckbox extends GasPropertiesCheckbox {

  /**
   * @param {BooleanProperty} particleFlowRateVisibleProperty
   * @param {Object} [options]
   */
  constructor( particleFlowRateVisibleProperty, options ) {
    assert && assert( particleFlowRateVisibleProperty instanceof BooleanProperty,
      `invalid particleFlowRateVisibleProperty: ${particleFlowRateVisibleProperty}` );

    options = merge( {

      // superclass options
      textIconSpacing: 12
    }, options );

    assert && assert( !options.text, 'ParticleFlowRateCheckbox sets text' );
    assert && assert( !options.icon, 'ParticleFlowRateCheckbox sets icon' );
    options = merge( {
      text: particleFlowRateString,
      icon: GasPropertiesIconFactory.createParticleFlowRateIcon()
    }, options );

    super( particleFlowRateVisibleProperty, options );
  }
}

gasProperties.register( 'ParticleFlowRateCheckbox', ParticleFlowRateCheckbox );
export default ParticleFlowRateCheckbox;