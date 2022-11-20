// Copyright 2018-2022, University of Colorado Boulder

/**
 * ExploreViewProperties defines Properties that are specific to the view in the 'Explore' screen.
 * It adds no additional Properties to the base class, but is provided for symmetry in the model-view type hierarchy.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Tandem from '../../../../tandem/js/Tandem.js';
import IdealGasLawViewProperties from '../../common/view/IdealGasLawViewProperties.js';
import gasProperties from '../../gasProperties.js';

export default class ExploreViewProperties extends IdealGasLawViewProperties {

  public constructor( tandem: Tandem ) {
    super( tandem );
  }
}

gasProperties.register( 'ExploreViewProperties', ExploreViewProperties );