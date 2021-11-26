// Copyright 2018-2021, University of Colorado Boulder

/**
 * NumberOfParticlesControl is a control for changing the number of particles for a specific type of particle.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import merge from '../../../../phet-core/js/merge.js';
import FineCoarseSpinner from '../../../../scenery-phet/js/FineCoarseSpinner.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import { HBox } from '../../../../scenery/js/imports.js';
import { Node } from '../../../../scenery/js/imports.js';
import { Text } from '../../../../scenery/js/imports.js';
import { VBox } from '../../../../scenery/js/imports.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import gasProperties from '../../gasProperties.js';
import GasPropertiesColors from '../GasPropertiesColors.js';
import GasPropertiesConstants from '../GasPropertiesConstants.js';

// const
const X_SPACING = 8;

class NumberOfParticlesControl extends VBox {

  /**
   * @param {Node} icon
   * @param {string} title
   * @param {NumberProperty} numberOfParticlesProperty
   * @param {Object} [options]
   */
  constructor( icon, title, numberOfParticlesProperty, options ) {
    assert && assert( icon instanceof Node, `invalid icon: ${icon}` );
    assert && assert( typeof title === 'string', `invalid title: ${title}` );
    assert && assert( numberOfParticlesProperty instanceof NumberProperty,
      `invalid numberOfParticlesProperty: ${numberOfParticlesProperty}` );

    options = merge( {

      // superclass options
      align: 'left',
      spacing: 10,

      // phet-io
      tandem: Tandem.REQUIRED
    }, options );

    assert && assert( numberOfParticlesProperty instanceof NumberProperty,
      `invalid numberOfParticlesProperty: ${numberOfParticlesProperty}` );
    assert && assert( numberOfParticlesProperty.range,
      'numberOfParticlesProperty missing range' );

    const labelNode = new Text( title, {
      font: GasPropertiesConstants.CONTROL_FONT,
      fill: GasPropertiesColors.textFillProperty,
      maxWidth: 150, // determined empirically,
      tandem: options.tandem.createTandem( 'labelNode' )
    } );

    const titleBox = new HBox( {
      spacing: X_SPACING,
      children: [ icon, labelNode ]
    } );

    const spinner = new FineCoarseSpinner( numberOfParticlesProperty, {
      deltaFine: 1,
      deltaCoarse: 50,
      numberDisplayOptions: {
        textOptions: {
          font: new PhetFont( 18 )
        }
      },
      maxWidth: 190, // determined empirically
      tandem: options.tandem.createTandem( 'spinner' )
    } );

    // Limit width of text
    labelNode.maxWidth = spinner.width - icon.width - X_SPACING;

    assert && assert( !options.children, 'NumberOfParticlesControl sets children' );
    options = merge( {
      children: [ titleBox, spinner ]
    }, options );

    super( options );
  }
}

gasProperties.register( 'NumberOfParticlesControl', NumberOfParticlesControl );
export default NumberOfParticlesControl;