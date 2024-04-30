// Copyright 2019-2023, University of Colorado Boulder

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
import Multilink from '../../../../axon/js/Multilink.js';

type SelfOptions = EmptySelfOptions;

type CenterOfMassNodeOptions = SelfOptions & PickRequired<NodeOptions, 'visibleProperty'>;

export default class CenterOfMassNode extends Node {

  /**
   * @param centerOfMassProperty - centerX of mass, in pm
   * @param centerY - centerY of the indicator, in pm
   * @param containerWidthProperty - in pm
   * @param modelViewTransform
   * @param fill
   * @param providedOptions
   */
  public constructor( centerOfMassProperty: TReadOnlyProperty<number | null>,
                      centerY: number,
                      containerWidthProperty: TReadOnlyProperty<number>,
                      modelViewTransform: ModelViewTransform2,
                      fill: TColor,
                      providedOptions: CenterOfMassNodeOptions ) {

    const options = optionize<CenterOfMassNodeOptions, SelfOptions, NodeOptions>()( {

      // NodeOptions
      isDisposable: false
    }, providedOptions );

    const rectangle = new Rectangle( 0, 0, 5, 30, {
      fill: fill,
      stroke: GasPropertiesColors.centerOfMassStrokeProperty
    } );

    options.children = [ rectangle ];

    super( options );

    Multilink.multilink( [ centerOfMassProperty, containerWidthProperty ],
      ( centerOfMass, containerWidth ) => {
        if ( centerOfMass === null ) {
          rectangle.visible = false;
        }
        else {
          rectangle.visible = true;
          this.center = modelViewTransform.modelToViewXY( centerOfMass - containerWidth / 2, centerY );
        }
      } );
  }
}

gasProperties.register( 'CenterOfMassNode', CenterOfMassNode );