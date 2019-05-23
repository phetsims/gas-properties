// Copyright 2019, University of Colorado Boulder

/**
 * Indicator at the bottom of the container that indicates where the centerX of mass is for one particle species.
 * The indicator is color-coded to the particle color.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const ColorDef = require( 'SCENERY/util/ColorDef' );
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const GasPropertiesColorProfile = require( 'GAS_PROPERTIES/common/GasPropertiesColorProfile' );
  const Node = require( 'SCENERY/nodes/Node' );
  const ModelViewTransform2 = require( 'PHETCOMMON/view/ModelViewTransform2' );
  const Property = require( 'AXON/Property' );
  const Rectangle = require( 'SCENERY/nodes/Rectangle' );

  class CenterOfMassNode extends Node {

    /**
     * @param {Property.<number|null>} centerOfMassProperty - centerX of mass, in pm
     * @param {number} centerY - centerY of the indicator, in pm
     * @param {ModelViewTransform2} modelViewTransform
     * @param {ColorDef} fill
     */
    constructor( centerOfMassProperty, centerY, modelViewTransform, fill ) {
      assert && assert( centerOfMassProperty instanceof Property, `invalid centerOfMassProperty: ${centerOfMassProperty}` );
      assert && assert( typeof centerY === 'number', `invalid centerY: ${centerY}` );
      assert && assert( modelViewTransform instanceof ModelViewTransform2, `invalid modelViewTransform: ${modelViewTransform}` );
      assert && assert( ColorDef.isColorDef( fill ), `invalid fill: ${fill}` );

      const rectangle = new Rectangle( 0, 0, 5, 30, {
        fill: fill,
        stroke: GasPropertiesColorProfile.centerOfMassStrokeProperty
      } );

      super( {
        children: [ rectangle ]
      } );

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

  return gasProperties.register( 'CenterOfMassNode', CenterOfMassNode );
} );