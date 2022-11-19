// Copyright 2019-2022, University of Colorado Boulder

/**
 * IdealModel is the top-level model for the 'Ideal' screen.
 * It adds no additional functionality to the base class, but is provided for symmetry in the model-view type hierarchy.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Tandem from '../../../../tandem/js/Tandem.js';
import IdealGasLawModel from '../../common/model/IdealGasLawModel.js';
import gasProperties from '../../gasProperties.js';

export default class IdealModel extends IdealGasLawModel {

  public constructor( tandem: Tandem ) {
    super( tandem );
  }
}

gasProperties.register( 'IdealModel', IdealModel );