// Copyright 2019-2024, University of Colorado Boulder

/**
 * DiffusionContainer is the container in the 'Diffusion' screen.
 * It has a fixed width, no lid, and a removable vertical divider.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import Property from '../../../../axon/js/Property.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import RangeWithValue from '../../../../dot/js/RangeWithValue.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import BaseContainer from '../../common/model/BaseContainer.js';
import gasProperties from '../../gasProperties.js';

const CONTAINER_WIDTH = 16000; // pm

export default class DiffusionContainer extends BaseContainer {

  public readonly dividerThickness: number; // divider thickness, in pm
  public readonly dividerX: number; // divider is horizontally centered, but no code assumes that

  // inside bounds for left and right sides of the container
  public readonly leftBounds: Bounds2;
  public readonly rightBounds: Bounds2;

  // whether the divider is in place
  public readonly isDividedProperty: Property<boolean>;

  public constructor( tandem: Tandem ) {

    super( {
      widthRange: new RangeWithValue( CONTAINER_WIDTH, CONTAINER_WIDTH, CONTAINER_WIDTH ),
      tandem: tandem
    } );

    this.dividerThickness = 100;

    this.dividerX = this.left + ( this.width / 2 );
    assert && assert(
    ( this.dividerX + this.dividerThickness / 2 > this.left ) &&
    ( this.dividerX - this.dividerThickness / 2 < this.right ),
      `dividerX is not in the container: ${this.dividerX}` );

    this.leftBounds = new Bounds2( this.left, this.bottom, this.dividerX, this.top );
    this.rightBounds = new Bounds2( this.dividerX, this.bottom, this.right, this.top );

    this.isDividedProperty = new BooleanProperty( true, {
      tandem: tandem.createTandem( 'isDividedProperty' ),
      phetioFeatured: true,
      phetioDocumentation: 'Whether the container\'s divider is in place.'
    } );

    // Adjust the bounds of the left and right sides of the container to account for divider thickness
    this.isDividedProperty.link( isDivided => {
      const dividerOffset = isDivided ? ( this.dividerThickness / 2 ) : 0;
      this.leftBounds.setMaxX( this.dividerX - dividerOffset );
      this.rightBounds.setMinX( this.dividerX + dividerOffset );
    } );
  }

  public override reset(): void {
    super.reset();
    this.isDividedProperty.reset();
  }
}

gasProperties.register( 'DiffusionContainer', DiffusionContainer );