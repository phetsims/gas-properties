// Copyright 2018-2022, University of Colorado Boulder

/**
 * ParticlesAccordionBox is the accordion box titled 'Particles'.  It contains controls for setting the number
 * of particles.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Property from '../../../../axon/js/Property.js';
import { optionize4 } from '../../../../phet-core/js/optionize.js';
import PickOptional from '../../../../phet-core/js/types/PickOptional.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import { Node, NodeTranslationOptions, Text, VBox } from '../../../../scenery/js/imports.js';
import AccordionBox, { AccordionBoxOptions } from '../../../../sun/js/AccordionBox.js';
import gasProperties from '../../gasProperties.js';
import GasPropertiesStrings from '../../GasPropertiesStrings.js';
import GasPropertiesColors from '../GasPropertiesColors.js';
import GasPropertiesConstants from '../GasPropertiesConstants.js';
import GasPropertiesCheckbox from './GasPropertiesCheckbox.js';
import GasPropertiesIconFactory from './GasPropertiesIconFactory.js';
import NumberOfParticlesControl from './NumberOfParticlesControl.js';

type SelfOptions = {
  fixedWidth?: number;
  collisionsEnabledProperty?: Property<boolean> | null; // no checkbox if null
};

type ParticlesAccordionBoxOptions = SelfOptions & NodeTranslationOptions &
  PickOptional<AccordionBoxOptions, 'expandedProperty'> &
  PickRequired<AccordionBoxOptions, 'tandem'>;

export default class ParticlesAccordionBox extends AccordionBox {

  public constructor( numberOfHeavyParticlesProperty: NumberProperty, numberOfLightParticlesProperty: NumberProperty,
                      modelViewTransform: ModelViewTransform2, providedOptions: ParticlesAccordionBoxOptions ) {

    const options = optionize4<ParticlesAccordionBoxOptions, SelfOptions, AccordionBoxOptions>()(
      {}, GasPropertiesConstants.ACCORDION_BOX_OPTIONS, {

        // SelfOptions
        fixedWidth: 100,
        collisionsEnabledProperty: null,

        //  AccordionBoxOptions
        contentXMargin: GasPropertiesConstants.ACCORDION_BOX_OPTIONS.contentXMargin,
        titleNode: new Text( GasPropertiesStrings.particlesStringProperty, {
          font: GasPropertiesConstants.TITLE_FONT,
          fill: GasPropertiesColors.textFillProperty
        } )
      }, providedOptions );

    // Limit width of title
    options.titleNode.maxWidth = 0.75 * options.fixedWidth;

    const contentWidth = options.fixedWidth - ( 2 * options.contentXMargin );

    const children: Node[] = [

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
        textStringProperty: GasPropertiesStrings.collisionsStringProperty,
        textMaxWidth: 175, // determined empirically
        tandem: options.tandem.createTandem( 'collisionsCheckbox' )
      } ) );
    }

    const content = new VBox( {
      preferredWidth: contentWidth,
      widthSizable: false, // so that width will remain preferredWidth
      align: 'left',
      spacing: 15,
      children: children
    } );

    super( content, options );
  }

  public override dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }
}

gasProperties.register( 'ParticlesAccordionBox', ParticlesAccordionBox );