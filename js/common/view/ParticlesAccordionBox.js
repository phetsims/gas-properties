// Copyright 2018-2022, University of Colorado Boulder

/**
 * ParticlesAccordionBox is the accordion box titled 'Particles'.  It contains controls for setting the number
 * of particles.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import merge from '../../../../phet-core/js/merge.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import { Text, VBox } from '../../../../scenery/js/imports.js';
import AccordionBox from '../../../../sun/js/AccordionBox.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import gasProperties from '../../gasProperties.js';
import GasPropertiesStrings from '../../GasPropertiesStrings.js';
import GasPropertiesColors from '../GasPropertiesColors.js';
import GasPropertiesConstants from '../GasPropertiesConstants.js';
import FixedWidthNode from './FixedWidthNode.js';
import GasPropertiesCheckbox from './GasPropertiesCheckbox.js';
import GasPropertiesIconFactory from './GasPropertiesIconFactory.js';
import NumberOfParticlesControl from './NumberOfParticlesControl.js';

class ParticlesAccordionBox extends AccordionBox {

  /**
   * @param {NumberProperty} numberOfHeavyParticlesProperty
   * @param {NumberProperty} numberOfLightParticlesProperty
   * @param {ModelViewTransform2} modelViewTransform
   * @param {Object} [options]
   */
  constructor( numberOfHeavyParticlesProperty, numberOfLightParticlesProperty, modelViewTransform, options ) {
    assert && assert( numberOfHeavyParticlesProperty instanceof NumberProperty,
      `invalid numberOfHeavyParticlesProperty: ${numberOfHeavyParticlesProperty}` );
    assert && assert( numberOfLightParticlesProperty instanceof NumberProperty,
      `invalid numberOfLightParticlesProperty: ${numberOfLightParticlesProperty}` );
    assert && assert( modelViewTransform instanceof ModelViewTransform2,
      `invalid modelViewTransform: ${modelViewTransform}` );

    options = merge( {
      fixedWidth: 100,
      contentXMargin: 0,
      collisionsEnabledProperty: null, // {null|BooleanProperty} no checkbox if null

      // phet-io
      tandem: Tandem.REQUIRED
    }, GasPropertiesConstants.ACCORDION_BOX_OPTIONS, {

      // superclass options
      titleNode: new Text( GasPropertiesStrings.particlesStringProperty, {
        font: GasPropertiesConstants.TITLE_FONT,
        fill: GasPropertiesColors.textFillProperty
      } )
    }, options );

    // Limit width of title
    options.titleNode.maxWidth = 0.75 * options.fixedWidth;

    const contentWidth = options.fixedWidth - ( 2 * options.contentXMargin );

    const children = [

      // Heavy
      new NumberOfParticlesControl( GasPropertiesIconFactory.createHeavyParticleIcon( modelViewTransform ),
        GasPropertiesStrings.heavyStringProperty, numberOfHeavyParticlesProperty, {
          tandem: options.tandem.createTandem( 'numberOfHeavyParticlesControl' )
        } ),

      // Light
      new NumberOfParticlesControl( GasPropertiesIconFactory.createLightParticleIcon( modelViewTransform ),
        GasPropertiesStrings.lightStringProperty, numberOfLightParticlesProperty, {
          tandem: options.tandem.createTandem( 'numberOfLightParticlesControl' )
        } )
    ];

    if ( options.collisionsEnabledProperty ) {

      // optional Collisions checkbox, prepended so that it appears at top
      children.unshift( new GasPropertiesCheckbox( options.collisionsEnabledProperty, {
        stringProperty: GasPropertiesStrings.collisionsStringProperty,
        textMaxWidth: 175, // determined empirically
        tandem: options.tandem.createTandem( 'collisionsCheckbox' )
      } ) );
    }

    const content = new FixedWidthNode( contentWidth, new VBox( {
      align: 'left',
      spacing: 15,
      children: children
    } ) );

    super( content, options );
  }
}

gasProperties.register( 'ParticlesAccordionBox', ParticlesAccordionBox );
export default ParticlesAccordionBox;