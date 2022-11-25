// Copyright 2022, University of Colorado Boulder

/**
 * CollisionCounterCheckbox is the 'Collision Counter' check box, used to control visibility of the collision counter.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';
import gasProperties from '../../gasProperties.js';
import GasPropertiesStrings from '../../GasPropertiesStrings.js';
import GasPropertiesCheckbox, { GasPropertiesCheckboxOptions } from './GasPropertiesCheckbox.js';
import GasPropertiesIconFactory from './GasPropertiesIconFactory.js';

type SelfOptions = EmptySelfOptions;

type CollisionCounterCheckboxOptions = SelfOptions & StrictOmit<GasPropertiesCheckboxOptions, 'textStringProperty' | 'icon'>;

export default class CollisionCounterCheckbox extends GasPropertiesCheckbox {

  public constructor( collisionCounterVisibleProperty: Property<boolean>, providedOptions: CollisionCounterCheckboxOptions ) {

    const options = optionize<CollisionCounterCheckboxOptions, SelfOptions, GasPropertiesCheckboxOptions>()( {

      // GasPropertiesCheckboxOptions
      textStringProperty: GasPropertiesStrings.collisionCounterStringProperty,
      icon: GasPropertiesIconFactory.createCollisionCounterIcon()
    }, providedOptions );

    super( collisionCounterVisibleProperty, options );
  }
}

gasProperties.register( 'CollisionCounterCheckbox', CollisionCounterCheckbox );