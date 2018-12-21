// Copyright 2018, University of Colorado Boulder

/**
 * The lovechild of a ComboBox and a NumberDisplay. Allows the user to choose one of N dynamic numeric values.
 * The choices in a ComboBox are typically static, not recommended for displaying dynamic values. But here we are.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const ComboBox = require( 'SUN/ComboBox' );
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const NumberDisplay = require( 'SCENERY_PHET/NumberDisplay' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const StringUtils = require( 'PHETCOMMON/util/StringUtils' );

  // constants
  const valueUnitsString = require( 'string!GAS_PROPERTIES/valueUnits' );

  class ComboDisplay extends ComboBox {

    /**
     * @param {Object[]} items - describes items in the ComboBox, each Object has these fields:
     *   {*} choice - a value of choiceProperty that corresponds to the item
     *   {NumberProperty} numberProperty - the value of the item
     *   {Range} range - the range of the item's value
     *   {string} units - the units used to label the item's value
     *   {Object} [numberDisplayOptions] - options passed to this item's NumberDisplay
     * @param {Property} choiceProperty - determines which item is currently selected
     * @param {Node} listParent - parent for the ComboBox list
     * @param {Object} [options]
     */
    constructor( items, choiceProperty, listParent, options ) {

      options = _.extend( {

        numberDisplayOptions: null, // {*|null} propagated to all NumberDisplay subcomponents

        // ComboBox options
        itemHighlightFill: 'rgba( 255, 0, 0, 0.1 )',
        align: 'right',
        buttonXMargin: 5,
        buttonYMargin: 2,
        buttonCornerRadius: 5,
        itemXMargin: 2,
        itemYMargin: 2,
        buttonLineWidth: 0.4

      }, options );

      // defaults for NumberDisplay
      options.numberDisplayOptions = _.extend( {
        backgroundFill: null,
        backgroundStroke: null,
        font: new PhetFont( 14 ),
        align: 'right',
        xMargin: 0,
        yMargin: 0
      }, options.numberDisplayOptions );

      assert && assert( !options.numberDisplayOptions.valuePattern,
        'ComboDisplay sets numberDisplayOptions.valuePattern' );

      // Convert ComboDisplay items to ComboBox items
      const comboBoxItems = [];
      items.forEach( item => {

        assert && assert( item.choice, 'missing item.choice' );
        assert && assert( item.numberProperty, 'missing item.numberProperty' );
        assert && assert( item.range, 'missing item.range' );
        assert && assert( item.units, 'missing item.units' );
        assert && assert( !item.numberDisplayOptions || !item.numberDisplayOptions.valuePattern,
          'ComboDisplay sets item.numberDisplayOptions.valuePattern' );

        const itemNode = new NumberDisplay( item.numberProperty, item.range,
          _.extend( {}, options.numberDisplayOptions, item.numberDisplayOptions, {
            valuePattern: StringUtils.fillIn( valueUnitsString, {
              value: '{0}',
              units: item.units
            } )
          } ) );

        // Don't allow the NumberDisplay to grow, since it's in a ComboBox
        itemNode.maxWidth = itemNode.width;

        comboBoxItems.push( ComboBox.createItem( itemNode, item.choice ) );
      } );

      super( comboBoxItems, choiceProperty, listParent, options );
    }
  }

  return gasProperties.register( 'ComboDisplay', ComboDisplay );
} );