// Copyright 2018-2024, University of Colorado Boulder

/**
 * ExploreModel is the top-level model for the 'Explore' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Tandem from '../../../../tandem/js/Tandem.js';
import IdealGasLawModel from '../../common/model/IdealGasLawModel.js';
import gasProperties from '../../gasProperties.js';

export default class ExploreModel extends IdealGasLawModel {

  public constructor( tandem: Tandem ) {

    super( {
      holdConstant: 'nothing',
      holdConstantValues: [ 'nothing' ],
      containerOptions: {
        leftWallDoesWork: true // moving the left wall does work on particles
      },
      tandem: tandem
    } );
  }
}

gasProperties.register( 'ExploreModel', ExploreModel );