// Copyright 2018, University of Colorado Boulder

/**
 * User interface for global options, shown in the 'Options' dialog, accessed from the PhET Menu.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const GasPropertiesColorProfile = require( 'GAS_PROPERTIES/common/GasPropertiesColorProfile' );
  const GasPropertiesGlobalOptions = require( 'GAS_PROPERTIES/common/GasPropertiesGlobalOptions' );
  const Node = require( 'SCENERY/nodes/Node' );
  const ProjectorModeCheckbox = require( 'JOIST/ProjectorModeCheckbox' );

  class GasPropertiesGlobalOptionsNode extends Node {

    /**
     * @param {GasPropertiesGlobalOptions} globalOptions
     */
    constructor( globalOptions ) {
      assert && assert( globalOptions instanceof GasPropertiesGlobalOptions,
        `invalid globalOptions: ${globalOptions}` );

      // Projector Mode
      const projectorModeCheckbox = new ProjectorModeCheckbox( {
        projectorModeEnabledProperty: globalOptions.projectorModeEnabledProperty
      } );

      super( {
        children: [ projectorModeCheckbox ]
      } );

      // Switch between default and projector color profiles.
      globalOptions.projectorModeEnabledProperty.link( projectorModeEnabled => {
        GasPropertiesColorProfile.profileNameProperty.set( projectorModeEnabled ? 'projector' : 'default' );
      } );
    }
  }

  return gasProperties.register( 'GasPropertiesGlobalOptionsNode', GasPropertiesGlobalOptionsNode );
} );