// Copyright 2022, University of Colorado Boulder

/**
 * Choice of pressure units that the gauge can display
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

export const PressureUnitsValues = [ 'kilopascals', 'atmospheres' ] as const;
export type PressureUnits = ( typeof PressureUnitsValues )[number];