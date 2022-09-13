// Copyright 2018-2022, University of Colorado Boulder

/**
 * DiffusionControlPanel is the control panel that appears on the right side of the 'Diffusion' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import ReadOnlyProperty from '../../../../axon/js/ReadOnlyProperty.js';
import merge from '../../../../phet-core/js/merge.js';
import { VBox } from '../../../../scenery/js/imports.js';
import HSeparatorDeprecated from '../../../../sun/js/HSeparatorDeprecated.js';
import Panel from '../../../../sun/js/Panel.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import GasPropertiesColors from '../../common/GasPropertiesColors.js';
import GasPropertiesConstants from '../../common/GasPropertiesConstants.js';
import FixedWidthNode from '../../common/view/FixedWidthNode.js';
import StopwatchCheckbox from '../../common/view/StopwatchCheckbox.js';
import gasProperties from '../../gasProperties.js';
import DiffusionSettings from '../model/DiffusionSettings.js';
import CenterOfMassCheckbox from './CenterOfMassCheckbox.js';
import DiffusionSettingsNode from './DiffusionSettingsNode.js';
import DiffusionViewProperties from './DiffusionViewProperties.js';
import DividerToggleButton from './DividerToggleButton.js';
import ParticleFlowRateCheckbox from './ParticleFlowRateCheckbox.js';
import ScaleCheckbox from './ScaleCheckbox.js';

class DiffusionControlPanel extends Panel {

  /**
   * @param {DiffusionSettings} leftSettings - setting for the left side of the container
   * @param {DiffusionSettings} rightSettings - setting for the right side of the container
   * @param {ModelViewTransform2} modelViewTransform
   * @param {BooleanProperty} hasDividerProperty
   * @param {Property.<number>} numberOfParticlesProperty
   * @param {BooleanProperty} stopwatchVisibleProperty
   * @param {DiffusionViewProperties} viewProperties
   * @param {Object} [options]
   */
  constructor( leftSettings, rightSettings, modelViewTransform, hasDividerProperty,
               numberOfParticlesProperty, stopwatchVisibleProperty, viewProperties, options ) {
    assert && assert( leftSettings instanceof DiffusionSettings,
      `invalid leftSettings: ${leftSettings}` );
    assert && assert( rightSettings instanceof DiffusionSettings,
      `invalid rightSettings: ${rightSettings}` );
    assert && assert( hasDividerProperty instanceof BooleanProperty,
      `invalid hasDividerProperty: ${hasDividerProperty}` );
    assert && assert( numberOfParticlesProperty instanceof ReadOnlyProperty,
      `invalid numberOfParticlesProperty: ${numberOfParticlesProperty}` );
    assert && assert( stopwatchVisibleProperty instanceof BooleanProperty,
      `invalid stopwatchVisibleProperty: ${stopwatchVisibleProperty}` );
    assert && assert( viewProperties instanceof DiffusionViewProperties,
      `invalid viewProperties: ${viewProperties}` );

    options = merge( {
      fixedWidth: 100,
      xMargin: 0,

      // phet-io
      tandem: Tandem.REQUIRED
    }, GasPropertiesConstants.PANEL_OPTIONS, options );

    const contentWidth = options.fixedWidth - ( 2 * options.xMargin );

    const dividerToggleButton = new DividerToggleButton( hasDividerProperty, {
      tandem: options.tandem.createTandem( 'dividerToggleButton' )
    } );

    const checkboxOptions = {
      textMaxWidth: 175 // determined empirically
    };

    const content = new FixedWidthNode( contentWidth, new VBox( {
      align: 'left',
      spacing: 18,
      children: [

        // spinners
        new DiffusionSettingsNode( leftSettings, rightSettings, modelViewTransform, hasDividerProperty, {
          tandem: options.tandem.createTandem( 'settingsNode' )
        } ),

        // Remove/Reset Separator button, centered
        new FixedWidthNode( contentWidth, dividerToggleButton, {
          align: 'center'
        } ),

        // ------------
        new HSeparatorDeprecated( contentWidth, {
          stroke: GasPropertiesColors.separatorColorProperty,
          maxWidth: contentWidth
        } ),

        // checkboxes
        new VBox( {
          align: 'left',
          spacing: 12,
          children: [
            new CenterOfMassCheckbox( viewProperties.centerOfMassVisibleProperty, merge( {}, checkboxOptions, {
              tandem: options.tandem.createTandem( 'centerOfMassCheckbox' )
            } ) ),
            new ParticleFlowRateCheckbox( viewProperties.particleFlowRateVisibleProperty, merge( {}, checkboxOptions, {
              tandem: options.tandem.createTandem( 'particleFlowRateCheckbox' )
            } ) ),
            new ScaleCheckbox( viewProperties.scaleVisibleProperty, merge( {}, checkboxOptions, {
              tandem: options.tandem.createTandem( 'scaleCheckbox' )
            } ) ),
            new StopwatchCheckbox( stopwatchVisibleProperty, merge( {}, checkboxOptions, {
              tandem: options.tandem.createTandem( 'stopwatchCheckbox' )
            } ) )
          ]
        } )
      ]
    } ) );

    super( content, options );

    // Disable the button when the container is empty.
    numberOfParticlesProperty.link( numberOfParticles => {
      dividerToggleButton.enabled = ( numberOfParticles !== 0 );
    } );
  }
}

gasProperties.register( 'DiffusionControlPanel', DiffusionControlPanel );
export default DiffusionControlPanel;