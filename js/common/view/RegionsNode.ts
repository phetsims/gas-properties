// Copyright 2019-2022, University of Colorado Boulder

/**
 * RegionsNode shows how the collision detection space is partitioned into a 2D grid of Regions.
 * A number in the center of each region indicates how many particles are in that region.
 * This is used for debugging, and is not visible to the user. See GasPropertiesQueryParameters.regions.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import { Node } from '../../../../scenery/js/imports.js';
import gasProperties from '../../gasProperties.js';
import Region from '../model/Region.js';
import RegionNode from './RegionNode.js';

export default class RegionsNode extends Node {

  private readonly regionNodes: RegionNode[];

  public constructor( regions: Region[], modelViewTransform: ModelViewTransform2 ) {

    const regionNodes: RegionNode[] = [];
    for ( let i = regions.length - 1; i >= 0; i-- ) {
      const regionNode = new RegionNode( regions[ i ], modelViewTransform );
      regionNodes.push( regionNode );
    }

    super( {
      children: regionNodes,
      pickable: false
    } );

    this.regionNodes = regionNodes;
  }

  public override dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }

  /**
   * Updates each RegionNode.
   */
  public update(): void {
    for ( let i = this.regionNodes.length - 1; i >= 0; i-- ) {
      this.regionNodes[ i ].update();
    }
  }
}

gasProperties.register( 'RegionsNode', RegionsNode );