// Copyright 2019-2022, University of Colorado Boulder

/**
 * CenterOfMassNode is an indicator at the bottom of the container that indicates where the centerX of mass is for
 * one particle species. The indicator is color-coded to the particle color.
 * Do not transform this Node! It's origin must be at the origin of the view coordinate frame.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import { Node, NodeOptions, Rectangle, TColor } from '../../../../scenery/js/imports.js';
import GasPropertiesColors from '../../common/GasPropertiesColors.js';
import gasProperties from '../../gasProperties.js';

type SelfOptions = EmptySelfOptions;

type CenterOfMassNodeOptions = SelfOptions & PickRequired<NodeOptions, 'tandem' | 'visibleProperty'>;

export default class CenterOfMassNode extends Node {

  /**
   * @param centerOfMassProperty - centerX of mass, in pm
   * @param centerY - centerY of the indicator, in pm
   * @param modelViewTransform
   * @param fill
   * @param providedOptions
   */
  public constructor( centerOfMassProperty: TReadOnlyProperty<number | null>,
                      centerY: number,
                      modelViewTransform: ModelViewTransform2,
                      fill: TColor,
                      providedOptions: CenterOfMassNodeOptions ) {

    const options = optionize<CenterOfMassNodeOptions, SelfOptions, NodeOptions>()( {
      // empty because we're setting options.children below
    }, providedOptions );

    const rectangle = new Rectangle( 0, 0, 5, 30, {
      fill: fill,
      stroke: GasPropertiesColors.centerOfMassStrokeProperty
    } );

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

  public override dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }
}

gasProperties.register( 'CenterOfMassNode', CenterOfMassNode );