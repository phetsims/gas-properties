// Copyright 2018-2020, University of Colorado Boulder

/**
 * ParticleType is an enumeration for particle types in the 'Ideal', 'Explore', and 'Energy' screens.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import EnumerationDeprecated from '../../../../phet-core/js/EnumerationDeprecated.js';
import gasProperties from '../../gasProperties.js';

const ParticleType = EnumerationDeprecated.byKeys( [ 'HEAVY', 'LIGHT' ] );

gasProperties.register( 'ParticleType', ParticleType );
export default ParticleType;