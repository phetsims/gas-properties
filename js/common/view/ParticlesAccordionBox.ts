// Copyright 2018-2024, University of Colorado Boulder

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
        collisionsEnabledProperty: null,

        // AccordionBoxOptions
        isDisposable: false,
        contentXMargin: GasPropertiesConstants.ACCORDION_BOX_OPTIONS.contentXMargin,
        titleNode: new Text( GasPropertiesStrings.particlesStringProperty, {
          font: GasPropertiesConstants.TITLE_FONT,
          fill: GasPropertiesColors.textFillProperty,
          maxWidth: 170
        } )
      }, providedOptions );

    const children: Node[] = [];

    // optional Collisions checkbox
    if ( options.collisionsEnabledProperty ) {
      const collisionsCheckbox = new GasPropertiesCheckbox( options.collisionsEnabledProperty, {
        textStringProperty: GasPropertiesStrings.collisionsStringProperty,
        textMaxWidth: 175, // determined empirically
        tandem: options.tandem.createTandem( 'collisionsCheckbox' )
      } );
      children.push( collisionsCheckbox );
    }

    // Heavy
    const numberOfHeavyParticlesControl = new NumberOfParticlesControl( GasPropertiesIconFactory.createHeavyParticleIcon( modelViewTransform ),
      GasPropertiesStrings.heavyStringProperty, numberOfHeavyParticlesProperty, {
        tandem: options.tandem.createTandem( 'numberOfHeavyParticlesControl' )
      } );
    children.push( numberOfHeavyParticlesControl );

    // Light
    const numberOfLightParticlesControl = new NumberOfParticlesControl( GasPropertiesIconFactory.createLightParticleIcon( modelViewTransform ),
      GasPropertiesStrings.lightStringProperty, numberOfLightParticlesProperty, {
        tandem: options.tandem.createTandem( 'numberOfLightParticlesControl' )
      } );
    children.push( numberOfLightParticlesControl );

    const content = new VBox( {
      align: 'left',
      spacing: 15,
      children: children
    } );

    super( content, options );
  }
}

gasProperties.register( 'ParticlesAccordionBox', ParticlesAccordionBox );