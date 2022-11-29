// Copyright 2018-2022, University of Colorado Boulder

/**
 * ParticleType is a string union for particle types in the 'Ideal', 'Explore', and 'Energy' screens.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

export const ParticleTypeValues = [ 'heavy', 'light' ] as const;
export type ParticleType = ( typeof ParticleTypeValues )[number];