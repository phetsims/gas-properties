// Copyright 2018-2022, University of Colorado Boulder

/**
 * ParticleType is an enumeration for particle types in the 'Ideal', 'Explore', and 'Energy' screens.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Enumeration from '../../../../phet-core/js/Enumeration.js';
import EnumerationValue from '../../../../phet-core/js/EnumerationValue.js';
import gasProperties from '../../gasProperties.js';

export default class ParticleType extends EnumerationValue {
  static HEAVY = new ParticleType();
  static LIGHT = new ParticleType();

  static enumeration = new Enumeration( ParticleType );
}

gasProperties.register( 'ParticleType', ParticleType );