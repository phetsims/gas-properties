// Copyright 2019, University of Colorado Boulder

/**
 * EnergyAccordionBox is the base class for the 'Speed' and 'Kinetic Energy' accordion boxes in the 'Energy' screen.
 * These accordion boxes are identical, except for their title and HistogramNode.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../phet-core/js/merge.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import HBox from '../../../../scenery/js/nodes/HBox.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import VBox from '../../../../scenery/js/nodes/VBox.js';
import AccordionBox from '../../../../sun/js/AccordionBox.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import GasPropertiesColorProfile from '../../common/GasPropertiesColorProfile.js';
import GasPropertiesConstants from '../../common/GasPropertiesConstants.js';
import FixedWidthNode from '../../common/view/FixedWidthNode.js';
import gasProperties from '../../gasProperties.js';
import HeavyParticlesCheckbox from './HeavyParticlesCheckbox.js';
import HistogramNode from './HistogramNode.js';
import LightParticlesCheckbox from './LightParticlesCheckbox.js';

class EnergyAccordionBox extends AccordionBox {

  /**
   * @param {string} titleString
   * @param {ModelViewTransform2} modelViewTransform
   * @param {HistogramNode} histogramNode
   * @param {Object} [options]
   */
  constructor( titleString, modelViewTransform, histogramNode, options ) {
    assert && assert( typeof titleString === 'string', `invalid titleString: ${titleString}` );
    assert && assert( modelViewTransform instanceof ModelViewTransform2, `invalid modelViewTransform: ${modelViewTransform}` );
    assert && assert( histogramNode instanceof HistogramNode, `invalid model: ${histogramNode}` );

    options = merge( {
      fixedWidth: 100,
      contentXMargin: 0
    }, GasPropertiesConstants.ACCORDION_BOX_OPTIONS, {

      // superclass options
      contentYSpacing: 0,
      titleNode: new Text( titleString, {
        font: GasPropertiesConstants.TITLE_FONT,
        fill: GasPropertiesColorProfile.textFillProperty
      } ),

      // phet-io
      tandem: Tandem.REQUIRED

    }, options );

    // Limit width of title, multiplier determined empirically
    options.titleNode.maxWidth = 0.75 * options.fixedWidth;

    // Checkboxes
    const checkboxes = new HBox( {
      children: [
        new HeavyParticlesCheckbox( histogramNode.heavyPlotVisibleProperty, modelViewTransform, {
          tandem: options.tandem.createTandem( 'heavyParticlesCheckbox' )
        } ),
        new LightParticlesCheckbox( histogramNode.lightPlotVisibleProperty, modelViewTransform, {
          tandem: options.tandem.createTandem( 'lightParticlesCheckbox' )
        } )
      ],
      align: 'center',
      spacing: 25
    } );

    const contentWidth = options.fixedWidth - ( 2 * options.contentXMargin );

    // Checkboxes centered below histogram
    const content = new FixedWidthNode( contentWidth, new VBox( {
      align: 'center',
      spacing: 10,
      children: [ histogramNode, checkboxes ]
    } ) );

    super( content, options );

    // Disable updates of the histogram when the accordion box is collapsed.
    this.expandedProperty.link( expanded => {
      histogramNode.updateEnabledProperty.value = expanded;
    } );

    // @private
    this.histogramNode = histogramNode;
  }

  // @public
  reset() {
    this.histogramNode.reset();
  }
}

gasProperties.register( 'EnergyAccordionBox', EnergyAccordionBox );
export default EnergyAccordionBox;