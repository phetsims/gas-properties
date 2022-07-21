// Copyright 2019-2022, University of Colorado Boulder

/**
 * CenterOfMassNode is an indicator at the bottom of the container that indicates where the centerX of mass is for
 * one particle species. The indicator is color-coded to the particle color.
 * Do not transform this Node! It's origin must be at the origin of the view coordinate frame.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import merge from '../../../../phet-core/js/merge.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import { ColorDef, Node, Rectangle } from '../../../../scenery/js/imports.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import GasPropertiesColors from '../../common/GasPropertiesColors.js';
import gasProperties from '../../gasProperties.js';

class CenterOfMassNode extends Node {

  /**
   * @param {Property.<number|null>} centerOfMassProperty - centerX of mass, in pm
   * @param {number} centerY - centerY of the indicator, in pm
   * @param {ModelViewTransform2} modelViewTransform
   * @param {ColorDef} fill
   * @param {Object} [options]
   */
  constructor( centerOfMassProperty, centerY, modelViewTransform, fill, options ) {
    assert && assert( centerOfMassProperty instanceof Property,
      `invalid centerOfMassProperty: ${centerOfMassProperty}` );
    assert && assert( typeof centerY === 'number', `invalid centerY: ${centerY}` );
    assert && assert( modelViewTransform instanceof ModelViewTransform2,
      `invalid modelViewTransform: ${modelViewTransform}` );
    assert && assert( ColorDef.isColorDef( fill ), `invalid fill: ${fill}` );

    options = merge( {

      // phet-io
      tandem: Tandem.REQUIRED
    }, options );

    const rectangle = new Rectangle( 0, 0, 5, 30, {
      fill: fill,
      stroke: GasPropertiesColors.centerOfMassStrokeProperty
    } );

    assert && assert( !options.children, 'CenterOfMassNode sets children' );
    options.children = [ rectangle ];

    super( options );

    centerOfMassProperty.link( centerX => {
      if ( centerX === null ) {
        rectangle.visible = false;
      }
      else {
        rectangle.visible = true;
        this.center = modelViewTransform.modelToViewXY( centerX, centerY );
      }
    } );
  }
}

gasProperties.register( 'CenterOfMassNode', CenterOfMassNode );
export default CenterOfMassNode;