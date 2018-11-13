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
  const Node = require( 'SCENERY/nodes/Node' );
  const PhetColorScheme = require( 'SCENERY_PHET/PhetColorScheme' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const Rectangle = require( 'SCENERY/nodes/Rectangle' );
  const RectangularPushButton = require( 'SUN/buttons/RectangularPushButton' );
  const Text = require( 'SCENERY/nodes/Text' );

  // constants
  const PARTICLES_PER_PUMP = 20;

  class BicyclePumpNode extends Node {

    /**
     * @param {NumberProperty} numberOfParticlesProperty
     * @param {Object} [options]
     * @constructor
     */
    constructor( numberOfParticlesProperty, options ) {

      options = _.extend( {
        color: 'white'
      }, options );

      assert && assert( numberOfParticlesProperty.range, 'missing numberOfParticlesProperty.range' );

      const rectangle = new Rectangle( 0, 0, 100, 200, {
        fill: options.color,
        stroke: 'black'
      } );

      const pumpButton = new RectangularPushButton( {
        baseColor: PhetColorScheme.BUTTON_YELLOW,
        content: new Text( 'pump', {
          font: new PhetFont( 18 )
        } ),
        listener: () => {
          numberOfParticlesProperty.value += Math.min( PARTICLES_PER_PUMP,
            numberOfParticlesProperty.range.max - numberOfParticlesProperty.value );
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

      super( options );

      numberOfParticlesProperty.link( numberOfParticles => {
        pumpButton.enabled = ( numberOfParticles < numberOfParticlesProperty.range.max );
        particleCountNode.text = numberOfParticles;
        particleCountNode.center = rectangle.center;
      } );
    }
  }

  return gasProperties.register( 'BicyclePumpNode', BicyclePumpNode );
} );
 