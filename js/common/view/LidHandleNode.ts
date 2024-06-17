// Copyright 2024, University of Colorado Boulder

/**
 * LidHandleNode is the handle used to open and close the container's lid.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import optionize from '../../../../phet-core/js/optionize.js';
import HandleNode from '../../../../scenery-phet/js/HandleNode.js';
import { InteractiveHighlighting, Node, NodeOptions, NodeTranslationOptions, TColor } from '../../../../scenery/js/imports.js';
import gasProperties from '../../gasProperties.js';
import GasPropertiesColors from '../GasPropertiesColors.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import BooleanIO from '../../../../tandem/js/types/BooleanIO.js';
import Property from '../../../../axon/js/Property.js';

const HANDLE_ATTACHMENT_LINE_WIDTH = 1;

type SelfOptions = {
  gripColor?: TColor;
};

export type LidHandleNodeOptions = SelfOptions & NodeTranslationOptions & PickRequired<NodeOptions, 'tandem'>;

export default class LidHandleNode extends InteractiveHighlighting( Node ) {

  // The sim sets handleVisibleProperty, while the PhET-iO client can use hasHandleProperty to permanently hide the handle.
  private readonly handleVisibleProperty: Property<boolean>;

  public constructor( providedOptions: LidHandleNodeOptions ) {

    const handleVisibleProperty = new BooleanProperty( true, {
      tandem: providedOptions.tandem.createTandem( 'handleVisibleProperty' ),
      phetioReadOnly: true, // Sim controls this.
      phetioDocumentation: 'This Property is used by the sim to control visibility of the container\'s lid handle.'
    } );

    const hasHandleProperty = new BooleanProperty( true, {
      tandem: providedOptions.tandem.createTandem( 'hasHandleProperty' ),
      phetioFeatured: true,
      phetioDocumentation: 'Use this Property to permanently hide the container\'s lid handle.'
    } );

    const options = optionize<LidHandleNodeOptions, SelfOptions, NodeOptions>()( {

      // SelfOptions
      gripColor: GasPropertiesColors.lidGripColorProperty,

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
      hasLeftAttachment: false,
      gripBaseColor: options.gripColor,
      attachmentLineWidth: HANDLE_ATTACHMENT_LINE_WIDTH,
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

gasProperties.register( 'LidHandleNode', LidHandleNode );