// Copyright 2018-2019, University of Colorado Boulder

//TODO placeholder, see https://github.com/phetsims/states-of-matter/issues/217
/**
 * Bicycle pump, used to add particles to the container.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const Dimension2 = require( 'DOT/Dimension2' );
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

      const background = new Rectangle( 0, 0, 100, 200, {
        fill: 'grey',
        stroke: 'black',
        cornerRadius: 3
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
        centerX: background.centerX,
        top: background.top + 10
      } );

      const progressBarSize = new Dimension2( 18, 130 );
      const progressBar = new Rectangle( 0, 0, progressBarSize.width, progressBarSize.height, {
        fill: 'white',
        stroke: 'black',
        centerX: background.centerX,
        centerY: pumpButton.bottom + ( background.bottom - pumpButton.bottom ) / 2
      } );

      const fillBarMargin = 3;
      const fillBarSize = new Dimension2( progressBarSize.width - 2 * fillBarMargin, progressBarSize.height - 2 * fillBarMargin );
      const fillBar = new Rectangle( 0, 0, fillBarSize.width, fillBarSize.height, {
        fill: options.color,
        center: progressBar.center
      } );

      assert && assert( !options.children, 'BicyclePumpNode sets children' );
      options.children = [ background, pumpButton, progressBar, fillBar ];

      super( options );

      numberOfParticlesProperty.link( numberOfParticles => {
        const fillBarHeight = fillBarSize.height * ( 1 - numberOfParticles / numberOfParticlesProperty.range.max );
        fillBar.setRect( 0, 0, fillBarSize.width, fillBarHeight );
        fillBar.bottom = progressBar.bottom - fillBarMargin;
      } );
    }
  }

  return gasProperties.register( 'BicyclePumpNode', BicyclePumpNode );
} );
 