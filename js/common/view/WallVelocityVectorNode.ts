// Copyright 2024, University of Colorado Boulder

/**
 * WallVelocityVectorNode is the velocity vector for the container's left wall.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import { Node } from '../../../../scenery/js/imports.js';
import gasProperties from '../../gasProperties.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import ArrowNode from '../../../../scenery-phet/js/ArrowNode.js';
import GasPropertiesConstants from '../GasPropertiesConstants.js';
import Utils from '../../../../dot/js/Utils.js';
import IdealGasLawContainer from '../model/IdealGasLawContainer.js';

export default class WallVelocityVectorNode extends Node {

  public constructor( leftWallAverageVelocityXProperty: TReadOnlyProperty<number>,
                      wallVelocityVisibleProperty: TReadOnlyProperty<boolean> ) {

    const arrowNode = new ArrowNode( 0, 0, 100, 0, GasPropertiesConstants.VELOCITY_ARROW_NODE_OPTIONS );

    // Length of the arrow is linearly proportional to the average velocity.
    leftWallAverageVelocityXProperty.link( velocityX => {
      arrowNode.visible = ( velocityX !== 0 );
      const length = Utils.linear( 0, IdealGasLawContainer.WALL_SPEED_LIMIT, 35, 100, Math.abs( velocityX ) );
      arrowNode.setTip( length * Math.sign( velocityX ), 0 );
    } );

    super( {
      isDisposable: false,
      children: [ arrowNode ],
      visibleProperty: wallVelocityVisibleProperty
    } );
  }
}

gasProperties.register( 'WallVelocityVectorNode', WallVelocityVectorNode );