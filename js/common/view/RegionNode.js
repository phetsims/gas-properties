// Copyright 2019-2022, University of Colorado Boulder

/**
 * RegionNode displays a region in the 2D grid that spatially partitions the collision detection space.
 * This is used for debugging, and is not visible to the user. See GasPropertiesQueryParameters.regions.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../phet-core/js/merge.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import { Node, Rectangle, Text } from '../../../../scenery/js/imports.js';
import gasProperties from '../../gasProperties.js';
import Region from '../model/Region.js';

// constants
const FONT = new PhetFont( 14 );

export default class RegionNode extends Node {

  /**
   * @param {Region} region
   * @param {ModelViewTransform2} modelViewTransform
   * @param {Object} [options]
   */
  constructor( region, modelViewTransform, options ) {
    assert && assert( region instanceof Region, `invalid region: ${region}` );
    assert && assert( modelViewTransform instanceof ModelViewTransform2,
      `invalid modelViewTransform: ${modelViewTransform}` );

    const viewBounds = modelViewTransform.modelToViewBounds( region.bounds );

    // Cell in the 2D grid
    const cellNode = new Rectangle( viewBounds.minX, viewBounds.minY, viewBounds.width, viewBounds.height, {
      fill: 'rgba( 0, 255, 0, 0.1 )',
      stroke: 'rgba( 0, 255, 0, 0.4 )',
      lineWidth: 0.25
    } );

    // Displays the number of particles in the Region
    const countNode = new Text( region.particles.length, {
      fill: 'green',
      font: FONT,
      center: cellNode.center
    } );

    assert && assert( !options || !options.children, 'RegionNode sets children' );
    options = merge( {
      children: [ cellNode, countNode ]
    }, options );

    super( options );

    // @private
    this.region = region;
    this.cellNode = cellNode;
    this.countNode = countNode;
  }

  /**
   * Displays the number of particles in the region.
   * @public
   */
  update() {
    this.countNode.text = this.region.particles.length;
    this.countNode.center = this.cellNode.center;
  }
}

gasProperties.register( 'RegionNode', RegionNode );