// Copyright 2018-2019, University of Colorado Boulder

/**
 * ParticleType is an enumeration for particle types in the 'Ideal', 'Explore', and 'Energy' screens.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Enumeration from '../../../../phet-core/js/Enumeration.js';
import gasProperties from '../../gasProperties.js';

const ParticleType = Enumeration.byKeys( [ 'HEAVY', 'LIGHT' ] );

gasProperties.register( 'ParticleType', ParticleType );
export default ParticleType;