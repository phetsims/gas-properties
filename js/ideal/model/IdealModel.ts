// Copyright 2019-2024, University of Colorado Boulder

/**
 * IdealModel is the top-level model for the 'Ideal' screen.
 * It adds no additional functionality to the base class, but is provided for symmetry in the model-view type hierarchy.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import IdealGasLawModel, { IdealGasLawModelOptions } from '../../common/model/IdealGasLawModel.js';
import gasProperties from '../../gasProperties.js';

type SelfOptions = EmptySelfOptions;

type IdealModelOptions = SelfOptions & IdealGasLawModelOptions;

export default class IdealModel extends IdealGasLawModel {

  public constructor( providedOptions: IdealModelOptions ) {
    super( providedOptions );
  }
}

gasProperties.register( 'IdealModel', IdealModel );