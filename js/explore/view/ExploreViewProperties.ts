// Copyright 2018-2024, University of Colorado Boulder

/**
 * ExploreViewProperties defines Properties that are specific to the view in the 'Explore' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Tandem from '../../../../tandem/js/Tandem.js';
import IdealGasLawViewProperties from '../../common/view/IdealGasLawViewProperties.js';
import gasProperties from '../../gasProperties.js';
import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import Property from '../../../../axon/js/Property.js';

export default class ExploreViewProperties extends IdealGasLawViewProperties {

  public readonly wallVelocityVisibleProperty: Property<boolean>;

  public constructor( tandem: Tandem ) {
    super( tandem );

    this.wallVelocityVisibleProperty = new BooleanProperty( true, {
      tandem: tandem.createTandem( 'wallVelocityVisibleProperty' ),
      phetioFeatured: true,
      phetioDocumentation: 'Whether the velocity vector is visible when moving the container\'s left wall.'
    } );
  }

  public override reset(): void {
    super.reset();
    this.wallVelocityVisibleProperty.reset();
  }
}

gasProperties.register( 'ExploreViewProperties', ExploreViewProperties );