(function($) {
  'use strict';
  
  var FilterableCell = function (cell, options) {
    this.$cell = $(cell);
    //data-* has more priority over js options: because dynamically created elements may change data-*
    this.options = $.extend({}, $.fn.filterableCell.defaults, options);
    this.match = null;
    this.init();
  };
  
  FilterableCell.prototype = {
    constructor: FilterableCell,
    
    setMatch: function(match) {
      if(match){
        this.$cell.addClass('filterable-match');
        this.$cell.removeClass('filterable-mismatch');
      } else {
        this.$cell.addClass('filterable-mismatch');
        this.$cell.removeClass('filterable-match');
      }
    },
    
    isMatch: function(query) {
      if (typeof this.options.isMatch === 'function') {
        this.match = this.options.isMatch(this.$cell.text(), query);
      } else {
        query = query.replace(/[\-\[\]\/\{\}\(\)\+\?\.\\\^\$\|]/g, '\\$&');
        query = query.replace(/\*/, '.*');
        query = '.*' + query + '.*';
        var options = this.options.ignoreCase ? 'i' : '';
        var regex = new RegExp(query, options);
        this.match = regex.test(this.$cell.text()) === true;
      }
      this.setMatch(this.match);
      return this.match;
    },
    
    init: function () {
        //add 'filterable-cell' class to every editable element
        this.$cell.addClass('filterable-cell');
        
        // setup inital match
        this.setMatch( this.isMatch(this.options.initialQuery) );
        
        //finilize init
        $.proxy(function() {
           /**
           Fired when element was initialized by `$().filterable()` method.
           Please note that you should setup `init` handler **before** applying `filterable`.
                          
           @event init
           @param {Object} event event object
           @param {Object} editable filterable instance (as here it cannot accessed via data('editable'))
           **/
           this.$element.triggerHandler('init', this);
        }, this);
    },
    
    /**
    Removes filterable feature from element
    @method destroy()
    **/
    destroy: function() {
      this.$cell.removeClass('filterable-cell filterable-match filterable-mismatch');
      this.$cell.removeData('fitlerableCell');
    }
  };
  
  // Initilize each filterable cell
  $.fn.filterableCell = function (option) {
    var args = arguments, datakey = 'filterableCell';
    
    //return jquery object
    return this.each(function () {
      var $this = $(this),
        data = $this.data(datakey),
        options = typeof option === 'object' && option;

      if (!data) {
        $this.data(datakey, (data = new FilterableCell(this, options)));
      }

      if (typeof option === 'string') { //call method
        data[option].apply(data, Array.prototype.slice.call(args, 1));
      }
    });
  };
  
  $.fn.filterableCell.defaults = {
    /**
    Function to determine if the cell matches the user supplied filter.

    @property isMatch
    @type function
    @default null
    @example
    isMatch: function(value, query) {
      var regex = RegExp('.*' + query + '.*');
      return regex.text( $.trim(value) );
    }
    **/
    isMatch: null,
    
    /**
    Function to determine if the cell matches the user supplied filter.

    @property initialQuery
    @type string
    @default ''
    **/
    initialQuery: ''
  };
})(jQuery);