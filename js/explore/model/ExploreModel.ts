// Copyright 2018-2023, University of Colorado Boulder

/**
 * ExploreModel is the top-level model for the 'Explore' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Disposable from '../../../../axon/js/Disposable.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import IdealGasLawModel from '../../common/model/IdealGasLawModel.js';
import gasProperties from '../../gasProperties.js';

export default class ExploreModel extends IdealGasLawModel {

  public constructor( tandem: Tandem ) {

    super( tandem, {
      holdConstant: 'nothing',
      leftWallDoesWork: true // moving the left wall does work on particles
    } );

    // In case clients attempt to use this feature of the base class
    this.holdConstantProperty.lazyLink( holdConstant => {
      throw new Error( 'holdConstant is fixed in the Explore screen' );
    } );
  }

  public override dispose(): void {
    Disposable.assertNotDisposable();
    super.dispose();
  }
}

gasProperties.register( 'ExploreModel', ExploreModel );