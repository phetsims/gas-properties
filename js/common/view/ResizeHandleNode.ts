// Copyright 2024, University of Colorado Boulder

/**
 * ResizeHandleNode is the handle used to resize the container.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import { InteractiveHighlighting, Node, NodeOptions, TColor } from '../../../../scenery/js/imports.js';
import optionize from '../../../../phet-core/js/optionize.js';
import HandleNode from '../../../../scenery-phet/js/HandleNode.js';
import gasProperties from '../../gasProperties.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import Property from '../../../../axon/js/Property.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import BooleanIO from '../../../../tandem/js/types/BooleanIO.js';

type ResizeHandleNodeSelfOptions = {
  gripColor: TColor;
};

type ResizeHandleNodeOptions = ResizeHandleNodeSelfOptions & PickRequired<NodeOptions, 'tandem'>;

export default class ResizeHandleNode extends InteractiveHighlighting( Node ) {

  // The sim sets handleVisibleProperty, while the PhET-iO client can use hasHandleProperty to permanently hide the handle.
  private readonly handleVisibleProperty: Property<boolean>;

  public constructor( providedOptions: ResizeHandleNodeOptions ) {

    const handleVisibleProperty = new BooleanProperty( true, {
      tandem: providedOptions.tandem.createTandem( 'handleVisibleProperty' ),
      phetioReadOnly: true, // Sim controls this.
      phetioDocumentation: 'This Property is used by the sim to control visibility of the container\'s resize handle.'
    } );

    const hasHandleProperty = new BooleanProperty( true, {
      tandem: providedOptions.tandem.createTandem( 'hasHandleProperty' ),
      phetioFeatured: true,
      phetioDocumentation: 'Use this Property to permanently hide the container\'s resize handle.'
    } );

    const options = optionize<ResizeHandleNodeOptions, ResizeHandleNodeSelfOptions, NodeOptions>()( {

      // NodeOptions
      cursor: 'pointer',
      tagName: 'div',
      focusable: true,
      visibleProperty: DerivedProperty.and( [ handleVisibleProperty, hasHandleProperty ], {
        tandem: providedOptions.tandem.createTandem( 'visibleProperty' ),
        phetioValueType: BooleanIO
      } ),
      phetioInputEnabledPropertyInstrumented: true
    }, providedOptions );

    const handleNode = new HandleNode( {
      gripBaseColor: options.gripColor,
      attachmentLineWidth: 1,
      rotation: -Math.PI / 2,
      scale: 0.4
    } );

    // Wrap HandleNode so that the focus highlight is not affected by scaling.
    options.children = [ handleNode ];

    super( options );

    this.handleVisibleProperty = handleVisibleProperty;
  }

  /**
   * Sets the visibility of the handle. Note that PhET-iO clients can override this via hasHandleProperty.
   */
  public setHandleVisible( visible: boolean ): void {
    this.handleVisibleProperty.value = visible;
  }
}

gasProperties.register( 'ResizeHandleNode', ResizeHandleNode );