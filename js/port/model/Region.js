// Copyright 2018, University of Colorado Boulder

/**
 * TODO port of Java class
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );

  class Region {

    /**
     * @param {Bounds2} bounds
     */
    constructor( bounds ) {

      // @private
      this.bounds = bounds;
      this.bodies = [];
    }

    /**
     * Does the specified body belong in this Region?
     * @param {Body} body
     * @returns {boolean}
     * @public
     */
    belongsIn( body ) {
      return this.bounds.containsPoint( body.locationProperty.value );
    }

    /**
     * Is the specified body already in this Region?
     * @param {Body} body
     * @public
     */
    containsBody( body ) {
      return ( this.bodies.indexOf( body ) !== -1 );
    }

    /**
     * Add a body to this Region.
     * @param {Body} body
     * @public
     */
    addBody( body ) {
      assert && assert( !this.containsBody( body ), 'body is already in this Region' );
      this.bodies.push( body );
    }

    /**
     * Removes a body from this Region.
     * @param {Body} body
     * @public
     */
    removeBody( body ) {
      assert && assert( this.containsBody( body ), 'body is not in this Region' );
      this.bodies.splice( this.bodies.indexOf( body ), 1 );
    }

    /**
     * Gets the number of bodies in this Region.
     * @returns {number}
     * @public
     */
    getNumberOfBodies() {
      return this.bodies.length;
    }

    get numberOfBodies() { return this.getNumberOfBodies(); }

    /**
     * Removes all bodies from this Region.
     * @public
     */
    clear() {
      this.bodies.length = 0;
    }
  }

  return gasProperties.register( 'Region', Region );
} );