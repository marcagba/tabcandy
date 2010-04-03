// ##########
// An Item is an object that adheres to an interface consisting of these methods: 
//   reloadBounds: function() 
//   getBounds: function(), inherited from Item 
//   setBounds: function(rect, immediately)
//   setPosition: function(left, top, immediately), inherited from Item
//   setSize: function(width, height, immediately), inherited from Item
//   getZ: function(), inherited from Item  
//   setZ: function(value)
//   close: function() 
//   addOnClose: function(referenceObject, callback)
//   removeOnClose: function(referenceObject)
// 
// In addition, it must have these properties:
//   isAnItem, set to true (set by Item)
//   defaultSize, a Point
//   bounds, a Rect (set by Item in _init() via reloadBounds())
//   debug (set by Item)
//   $debug (set by Item in _init())
//   container, a DOM element (set by Item in _init())
//    
// Its container must also have a jQuery data named 'item' that points to the item. 
// This is set by Item in _init(). 

window.Item = function() {
  this.isAnItem = true;
  this.bounds = null;
  this.debug = false;
  this.$debug = null;
  this.container = null;
};

window.Item.prototype = { 
  // ----------  
  _init: function(container) {
    this.container = container;
    
    if(this.debug) {
      this.$debug = $('<div />')
        .css({
          border: '2px solid green',
          zIndex: -10,
          position: 'absolute'
        })
        .appendTo($('body'));
    }
    
    this.reloadBounds();        
    $(this.container).data('item', this);
  },
  
  // ----------
  getBounds: function() {
    return new Rect(this.bounds);    
  },
  
  // ----------
  setPosition: function(left, top, immediately) {
    this.setBounds(new Rect(left, top, this.bounds.width, this.bounds.height), immediately);
  },

  // ----------  
  setSize: function(width, height, immediately) {
    this.setBounds(new Rect(this.bounds.left, this.bounds.top, width, height), immediately);
  },

  // ----------
  getZ: function() {
    return parseInt($(this.container).css('zIndex'));
  },
    
  // ----------  
  pushAway: function() {
    var buffer = 10;
    
    var items = Items.getTopLevelItems();
    $.each(items, function(index, item) {
      var data = {};
      data.bounds = item.getBounds();
      data.startBounds = new Rect(data.bounds);
      data.generation = Infinity;
      item.pushAwayData = data;
    });
    
    var itemsToPush = [this];
    this.pushAwayData.generation = 0;

    var pushOne = function(baseItem) {
      var baseData = baseItem.pushAwayData;
      var bb = new Rect(baseData.bounds);
      bb.inset(-buffer, -buffer);
      var bbc = bb.center();
    
      $.each(items, function(index, item) {
        if(item == baseItem)
          return;
          
        var data = item.pushAwayData;
        if(data.generation <= baseData.generation)
          return;
          
        var bounds = data.bounds;
        var box = new Rect(bounds);
        box.inset(-buffer, -buffer);
        if(box.intersects(bb)) {
          var offset = new Point();
          var center = box.center(); 
          if(Math.abs(center.x - bbc.x) < Math.abs(center.y - bbc.y)) {
            if(center.y > bbc.y)
              offset.y = bb.bottom - box.top; 
            else
              offset.y = bb.top - box.bottom;
          } else {
            if(center.x > bbc.x)
              offset.x = bb.right - box.left; 
            else
              offset.x = bb.left - box.right;
          }
          
          bounds.offset(offset); 
          data.generation = baseData.generation + 1;
          itemsToPush.push(item);
        }
      });
    };   
    
    while(itemsToPush.length)
      pushOne(itemsToPush.shift());         

    $.each(items, function(index, item) {
      var data = item.pushAwayData;
      if(!data.bounds.equals(data.startBounds))
        item.setPosition(data.bounds.left, data.bounds.top);
    });
  },
  
  // ----------  
  _updateDebugBounds: function() {
    if(this.$debug) {
      this.$debug.css({
        left: this.bounds.left,
        top: this.bounds.top,
        width: this.bounds.width,
        height: this.bounds.height
      });
    }
  }  
};  

// ##########
window.Items = {
  // ----------  
  item: function(el) {
    return $(el).data('item');
  },
  
  // ----------  
  getTopLevelItems: function() {
    var items = [];
    
    $('.tab, .group').each(function() {
      $this = $(this);
      if(!$this.data('group'))
        items.push($this.data('item'));
    });
    
    return items;
  }
};

