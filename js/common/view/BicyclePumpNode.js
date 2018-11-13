// Copyright 2018, University of Colorado Boulder

//TODO placeholder, see https://github.com/phetsims/states-of-matter/issues/217
/**
 * Bicycle pump, used to add particles to the container.
 * 
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const gasPropertiesColorProfile = require( 'GAS_PROPERTIES/common/gasPropertiesColorProfile' );
  const inherit = require( 'PHET_CORE/inherit' );
  const Node = require( 'SCENERY/nodes/Node' );
  const PhetColorScheme = require( 'SCENERY_PHET/PhetColorScheme' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const Rectangle = require( 'SCENERY/nodes/Rectangle' );
  const RectangularPushButton = require( 'SUN/buttons/RectangularPushButton' );
  const Text = require( 'SCENERY/nodes/Text' );

  // constants
  const PARTICLES_PER_PUMP = 20;

  /**
   * @param {String} particleTypeProperty
   * @param {NumberProperty} numberOfHeavyParticlesProperty
   * @param {NumberProperty} numberOfLightParticlesProperty
   * @param {Object} [options]
   * @constructor
   */
  function BicyclePumpNode( particleTypeProperty, numberOfHeavyParticlesProperty, numberOfLightParticlesProperty, options ) {

    assert && assert( numberOfHeavyParticlesProperty.range, 'missing numberOfHeavyParticlesProperty.range' );
    assert && assert( numberOfLightParticlesProperty.range, 'missing numberOfLightParticlesProperty.range' );

    const rectangle = new Rectangle( 0, 0, 120, 240, {
      lineWidth: 2
    } );

    const pumpButton = new RectangularPushButton( {
      baseColor: PhetColorScheme.BUTTON_YELLOW,
      content: new Text( 'pump', {
        font: new PhetFont( 18 )
      } ),
      listener: () => {
        if ( particleTypeProperty.value === 'heavy' ) {
          numberOfHeavyParticlesProperty.value += Math.min( PARTICLES_PER_PUMP,
            numberOfHeavyParticlesProperty.range.max - numberOfHeavyParticlesProperty.value );
        }
        else {
          numberOfLightParticlesProperty.value += Math.min( PARTICLES_PER_PUMP,
            numberOfLightParticlesProperty.range.max - numberOfLightParticlesProperty.value );
        }
      },
      centerX: rectangle.centerX,
      top: rectangle.top + 10
    } );

    const particleCountNode = new Text( '', {
      font: new PhetFont( 18 ),
      center: rectangle.center
    } );

    assert && assert( !options.children, 'BicyclePumpNode sets children' );
    options.children = [ rectangle, pumpButton, particleCountNode ];

    Node.call( this, options );

    // Change color of the pump to match the type of particle
    particleTypeProperty.link( particleType => {

      if ( particleType === 'heavy' ) {
        rectangle.fill = gasPropertiesColorProfile.heavyParticleColorProperty;
        pumpButton.enabled = ( numberOfHeavyParticlesProperty.value <  numberOfHeavyParticlesProperty.range.max );
        particleCountNode.text = numberOfHeavyParticlesProperty.value;
      }
      else {
        rectangle.fill = gasPropertiesColorProfile.lightParticleColorProperty;
        pumpButton.enabled = ( numberOfLightParticlesProperty.value <  numberOfLightParticlesProperty.range.max );
        particleCountNode.text = numberOfLightParticlesProperty.value;
      }
      particleCountNode.center = rectangle.center;
    } );

    numberOfHeavyParticlesProperty.link( numberOfHeavyParticles => {
      if ( particleTypeProperty.value === 'heavy' ) {
        pumpButton.enabled = ( numberOfHeavyParticles <  numberOfHeavyParticlesProperty.range.max );
        particleCountNode.text = numberOfHeavyParticles;
        particleCountNode.center = rectangle.center;
      }
    } );

    numberOfLightParticlesProperty.link( numberOfLightParticles => {
      if ( particleTypeProperty.value === 'light' ) {
        pumpButton.enabled = ( numberOfLightParticles <  numberOfLightParticlesProperty.range.max );
        particleCountNode.text = numberOfLightParticles;
        particleCountNode.center = rectangle.center;
      }
    } );
  }

  gasProperties.register( 'BicyclePumpNode', BicyclePumpNode );

  return inherit( Node, BicyclePumpNode );
} );
 