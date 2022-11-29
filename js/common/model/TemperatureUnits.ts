// Copyright 2022, University of Colorado Boulder

/**
 * Choice of temperature units that the thermometer can display
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

export const TemperatureUnitsValues = [ 'kelvin', 'celsius' ] as const;
export type TemperatureUnits = ( typeof TemperatureUnitsValues )[number];