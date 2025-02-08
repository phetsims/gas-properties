// Copyright 2024-2025, University of Colorado Boulder

/**
 * ResizeHandleNode is the handle used to resize the container.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Property from '../../../../axon/js/Property.js';
import HandleNode from '../../../../scenery-phet/js/HandleNode.js';
import InteractiveHighlighting from '../../../../scenery/js/accessibility/voicing/InteractiveHighlighting.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import BooleanIO from '../../../../tandem/js/types/BooleanIO.js';
import gasProperties from '../../gasProperties.js';
import GasPropertiesColors from '../GasPropertiesColors.js';

export default class ResizeHandleNode extends InteractiveHighlighting( HandleNode ) {

  // The sim sets handleVisibleProperty, while the PhET-iO client can use hasHandleProperty to permanently hide the handle.
  private readonly handleVisibleProperty: Property<boolean>;

  public constructor( tandem: Tandem ) {

    const handleVisibleProperty = new BooleanProperty( true, {
      tandem: tandem.createTandem( 'handleVisibleProperty' ),
      phetioReadOnly: true, // Sim controls this.
      phetioDocumentation: 'This Property is used by the sim to control visibility of the container\'s resize handle.'
    } );

    const hasHandleProperty = new BooleanProperty( true, {
      tandem: tandem.createTandem( 'hasHandleProperty' ),
      phetioFeatured: true,
      phetioDocumentation: 'Use this Property to permanently hide the container\'s resize handle.'
    } );

    super( {

      // HandleNodeOptions
      gripBaseColor: GasPropertiesColors.resizeHandleColorProperty,
      attachmentLineWidth: 1,
      rotation: -Math.PI / 2,
      scale: 0.4,
      cursor: 'pointer',
      tagName: 'div',
      focusable: true,
      visibleProperty: DerivedProperty.and( [ handleVisibleProperty, hasHandleProperty ], {
        tandem: tandem.createTandem( 'visibleProperty' ),
        phetioValueType: BooleanIO
      } ),
      tandem: tandem,
      phetioInputEnabledPropertyInstrumented: true
    } );

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