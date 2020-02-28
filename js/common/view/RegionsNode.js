// Copyright 2019-2020, University of Colorado Boulder

/**
 * RegionsNode shows how the collision detection space is partitioned into a 2D grid of Regions.
 * A number in the center of each region indicates how many particles are in that region.
 * This is used for debugging, and is not visible to the user. See GasPropertiesQueryParameters.regions.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../phet-core/js/merge.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import gasProperties from '../../gasProperties.js';
import RegionNode from './RegionNode.js';

class RegionsNode extends Node {

  /**
   * @param {Region[]} regions
   * @param {ModelViewTransform2} modelViewTransform
   * @param {Object} [options]
   */
  constructor( regions, modelViewTransform, options ) {
    assert && assert( Array.isArray( regions ) && regions.length > 0, `invalid regions: ${regions}` );
    assert && assert( modelViewTransform instanceof ModelViewTransform2,
      `invalid modelViewTransform: ${modelViewTransform}` );

    options = merge( {

      // superclass options
      pickable: false
    }, options );

    // {RegionNode[]}
    const regionNodes = [];
    for ( let i = regions.length - 1; i >= 0; i-- ) {
      const regionNode = new RegionNode( regions[ i ], modelViewTransform );
      regionNodes.push( regionNode );
    }

    assert && assert( !options.children, 'RegionsNode sets children' );
    options = merge( {
      children: regionNodes
    }, options );

    super( options );

    // @private
    this.regionNodes = regionNodes;
  }

  /**
   * Updates each RegionNode.
   * @public
   */
  update() {
    for ( let i = this.regionNodes.length - 1; i >= 0; i-- ) {
      this.regionNodes[ i ].update();
    }
  }
}

gasProperties.register( 'RegionsNode', RegionsNode );
export default RegionsNode;