// Copyright 2018-2022, University of Colorado Boulder

//TODO https://github.com/phetsims/gas-properties/issues/202 change ParticleType to string union
/**
 * ParticleType is an enumeration for particle types in the 'Ideal', 'Explore', and 'Energy' screens.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Enumeration from '../../../../phet-core/js/Enumeration.js';
import EnumerationValue from '../../../../phet-core/js/EnumerationValue.js';
import gasProperties from '../../gasProperties.js';

export default class ParticleType extends EnumerationValue {

  public static readonly HEAVY = new ParticleType();
  public static readonly LIGHT = new ParticleType();

  public static readonly enumeration = new Enumeration( ParticleType );
}

gasProperties.register( 'ParticleType', ParticleType );