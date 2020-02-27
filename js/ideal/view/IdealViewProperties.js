// Copyright 2018-2019, University of Colorado Boulder

/**
 * IdealViewProperties defines Properties that are specific to the view in the 'Ideal' screen.
 * It adds no additional Properties to the base class, but is provided for symmetry in the model-view type hierarchy.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import IdealGasLawViewProperties from '../../common/view/IdealGasLawViewProperties.js';
import gasProperties from '../../gasProperties.js';

class IdealViewProperties extends IdealGasLawViewProperties {

  /**
   * @param {Tandem} tandem
   */
  constructor( tandem ) {
    super( tandem );
  }
}

gasProperties.register( 'IdealViewProperties', IdealViewProperties );
export default IdealViewProperties;