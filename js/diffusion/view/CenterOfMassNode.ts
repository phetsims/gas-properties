// Copyright 2019-2024, University of Colorado Boulder

/**
 * CenterOfMassNode is an indicator at the bottom of the container that indicates where the centerX of mass is for
 * one particle species. The indicator is color-coded to the particle color.
 * Do not transform this Node! It's origin must be at the origin of the view coordinate frame.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Multilink from '../../../../axon/js/Multilink.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import Node, { NodeOptions } from '../../../../scenery/js/nodes/Node.js';
import Rectangle from '../../../../scenery/js/nodes/Rectangle.js';
import TColor from '../../../../scenery/js/util/TColor.js';
import GasPropertiesColors from '../../common/GasPropertiesColors.js';
import gasProperties from '../../gasProperties.js';

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

    const rectangle = new Rectangle( 0, 0, 5, 30, {
      fill: fill,
      stroke: GasPropertiesColors.centerOfMassStrokeProperty,
      visibleProperty: new DerivedProperty( [ centerOfMassProperty ], centerOfMass => centerOfMass !== null )
    } );

    const options = optionize<CenterOfMassNodeOptions, SelfOptions, NodeOptions>()( {

      // NodeOptions
      isDisposable: false,
      children: [ rectangle ]
    }, providedOptions );

    super( options );

    Multilink.multilink( [ centerOfMassProperty, containerWidthProperty ],
      ( centerOfMass, containerWidth ) => {
        if ( centerOfMass !== null ) {
          this.center = modelViewTransform.modelToViewXY( centerOfMass - containerWidth / 2, centerY );
        }
      } );
  }
}

gasProperties.register( 'CenterOfMassNode', CenterOfMassNode );