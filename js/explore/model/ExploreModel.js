// Copyright 2018-2020, University of Colorado Boulder

/**
 * ExploreModel is the top-level model for the 'Explore' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Tandem from '../../../../tandem/js/Tandem.js';
import HoldConstant from '../../common/model/HoldConstant.js';
import IdealGasLawModel from '../../common/model/IdealGasLawModel.js';
import gasProperties from '../../gasProperties.js';

export default class ExploreModel extends IdealGasLawModel {

  /**
   * @param {Tandem} tandem
   */
  constructor( tandem ) {
    assert && assert( tandem instanceof Tandem, `invalid tandem: ${tandem}` );

    super( tandem, {
      holdConstant: HoldConstant.NOTHING,
      leftWallDoesWork: true // moving the left wall does work on particles
    } );

    // In case clients attempt to use this feature of the base class
    this.holdConstantProperty.lazyLink( holdConstant => {
      throw new Error( 'holdConstant is fixed in the Explore screen' );
    } );
  }
}

gasProperties.register( 'ExploreModel', ExploreModel );