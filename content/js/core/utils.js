// Title: utils.js
(function(){

const Cc = Components.classes;
const Ci = Components.interfaces;
const Cu = Components.utils;
const Cr = Components.results;

// Get this in a way where we can load the page automatically
// where it doesn't need to be focused...
var homeWindow = Cc["@mozilla.org/embedcomp/window-watcher;1"]
    .getService(Ci.nsIWindowWatcher)
    .activeWindow;

var consoleService = Cc["@mozilla.org/consoleservice;1"]
    .getService(Components.interfaces.nsIConsoleService);

// ##########
// Class: Point
// A simple point. 
//
// Constructor: Point
// If a is a Point, creates a copy of it. Otherwise, expects a to be x, 
// and creates a Point with it along with y. If either a or y are omitted, 
// 0 is used in their place. 
window.Point = function(a, y) {
  if(isPoint(a)) {
    this.x = a.x;
    this.y = a.y;
  } else {
    this.x = (Utils.isNumber(a) ? a : 0);
    this.y = (Utils.isNumber(y) ? y : 0);
  }
};

// ----------
window.isPoint = function(p) {
  return (p && Utils.isNumber(p.x) && Utils.isNumber(p.y));
};

window.Point.prototype = { 
  // ---------- 
  distance: function(point) { 
    var ax = Math.abs(this.x - point.x);
    var ay = Math.abs(this.y - point.y);
    return Math.sqrt((ax * ax) + (ay * ay));
  },

  // ---------- 
  plus: function(point) { 
    return new Point(this.x + point.x, this.y + point.y);
  }
};

// ##########  
// Class: Rect
// A simple rectangle. 
//
// Constructor: Rect
// If a is a Rect, creates a copy of it. Otherwise, expects a to be left, 
// and creates a Rect with it along with top, width, and height. 
window.Rect = function(a, top, width, height) {
  // Note: perhaps 'a' should really be called 'rectOrLeft'
  if(isRect(a)) {
    this.left = a.left;
    this.top = a.top;
    this.width = a.width;
    this.height = a.height;
  } else {
    this.left = a;
    this.top = top;
    this.width = width;
    this.height = height;
  }
};

// ----------
window.isRect = function(r) {
  return (r 
      && Utils.isNumber(r.left)
      && Utils.isNumber(r.top)
      && Utils.isNumber(r.width)
      && Utils.isNumber(r.height));
};

window.Rect.prototype = {
  // ----------
  get right() {
    return this.left + this.width;
  },
  
  // ----------
  set right(value) {
      this.width = value - this.left;
  },

  // ----------
  get bottom() {
    return this.top + this.height;
  },
  
  // ----------
  set bottom(value) {
      this.height = value - this.top;
  },
  
  // ----------
  intersects: function(rect) {
    return (rect.right > this.left
        && rect.left < this.right
        && rect.bottom > this.top
        && rect.top < this.bottom);      
  },
  
  // ----------
  // Function: containsPoint
  // Returns a boolean denoting if the <Point> is inside of
  // the bounding rect.
  // 
  // Paramaters
  //  - A point
  containsPoint: function(point){
    return( point.x > this.left
         && point.x < this.right
         && point.y > this.top
         && point.y < this.bottom )
  },
  
  // ----------
  // Function: contains
  // Returns a boolean denoting if the <Rect> is contained inside
  // of the bounding rect.
  //
  // Paramaters
  //  - A rect
  contains: function(rect){
    return( rect.left > this.left
         && rect.right < this.right
         && rect.top > this.top
         && rect.bottom < this.bottom )
  },
  
  // ----------
  center: function() {
    return new Point(this.left + (this.width / 2), this.top + (this.height / 2));
  },
  
  // ----------
  inset: function(a, b) {
    if(typeof(a.x) != 'undefined' && typeof(a.y) != 'undefined') {
      b = a.y; 
      a = a.x;
    }
    
    this.left += a;
    this.width -= a * 2;
    this.top += b;
    this.height -= b * 2;
  },
  
  // ----------
  offset: function(a, b) {
    if(typeof(a.x) != 'undefined' && typeof(a.y) != 'undefined') {
      this.left += a.x;
      this.top += a.y;
    } else {
      this.left += a;
      this.top += b;
    }
  },
  
  // ----------
  equals: function(a) {
    return (a.left == this.left
        && a.top == this.top
        && a.width == this.width
        && a.height == this.height);
  },
  
  // ----------
  union: function(a){
    var newLeft = Math.min(a.left, this.left);
    var newTop = Math.min(a.top, this.top);
    var newWidth = Math.max(a.right, this.right) - newLeft;
    var newHeight = Math.max(a.bottom, this.bottom) - newTop;
    var newRect = new Rect(newLeft, newTop, newWidth, newHeight); 
  
    return newRect;
  },
  
  // ----------
  copy: function(a) {
    this.left = a.left;
    this.top = a.top;
    this.width = a.width;
    this.height = a.height;
  }
};

// ##########
// Class: Subscribable
// A mix-in for allowing objects to collect subscribers for custom events. 
// Currently supports only onClose. 
// TODO generalize for any number of events
window.Subscribable = function() {
  this.subscribers = {};
  this.onCloseSubscribers = null;
};

window.Subscribable.prototype = {
  // ----------
  // Function: addSubscriber
  // The given callback will be called when the Subscribable fires the given event.
  // The refObject is used to facilitate removal if necessary. 
  addSubscriber: function(refObject, eventName, callback) {
    if(!this.subscribers[eventName])
      this.subscribers[eventName] = [];
      
    var subs = this.subscribers[eventName];
    var existing = iQ.grep(subs, function(element) {
      return element.refObject == refObject;
    });
    
    if(existing.length) {
      Utils.assert('should only ever be one', existing.length == 1);
      existing[0].callback = callback;
    } else {  
      subs.push({
        refObject: refObject, 
        callback: callback
      });
    }
  },
  
  // ----------
  // Function: removeSubscriber
  // Removes the callback associated with refObject for the given event. 
  removeSubscriber: function(refObject, eventName) {
    if(!this.subscribers[eventName])
      return;
      
    this.subscribers[eventName] = iQ.grep(this.subscribers[eventName], function(element) {
      return element.refObject == refObject;
    }, true);
  },
  
  // ----------
  // Function: _sendToSubscribers
  // Internal routine. Used by the Subscribable to fire events.
  _sendToSubscribers: function(eventName, eventInfo) {
    if(!this.subscribers[eventName])
      return;
      
    var self = this;
    var subsCopy = iQ.merge([], this.subscribers[eventName]);
    iQ.each(subsCopy, function(index, object) { 
      object.callback(self, eventInfo);
    });
  },
  
  // ----------
  // Function: addOnClose
  // The given callback will be called when the Subscribable fires its onClose.
  // The referenceElement is used to facilitate removal if necessary. 
  addOnClose: function(referenceElement, callback) {
    if(!this.onCloseSubscribers)
      this.onCloseSubscribers = [];
      
    var existing = iQ.grep(this.onCloseSubscribers, function(element) {
      return element.referenceElement == referenceElement;
    });
    
    if(existing.length) {
      Utils.assert('should only ever be one', existing.length == 1);
      existing[0].callback = callback;
    } else {  
      this.onCloseSubscribers.push({
        referenceElement: referenceElement, 
        callback: callback
      });
    }
  },
  
  // ----------
  // Function: removeOnClose
  // Removes the callback associated with referenceElement for onClose notification. 
  removeOnClose: function(referenceElement) {
    if(!this.onCloseSubscribers)
      return;
      
    this.onCloseSubscribers = iQ.grep(this.onCloseSubscribers, function(element) {
      return element.referenceElement == referenceElement;
    }, true);
  },
  
  // ----------
  // Function: _sendOnClose
  // Internal routine. Used by the Subscribable to fire onClose events.
  _sendOnClose: function() {
    if(!this.onCloseSubscribers)
      return;
      
    iQ.each(this.onCloseSubscribers, function(index, object) { 
      object.callback(this);
    });
  }
};

// ##########
// Class: Utils
// Singelton with common utility functions.
var Utils = {
  // ___ Windows and Tabs

  // ----------
  // Variable: activeWindow
  get activeWindow(){
    var win = Cc["@mozilla.org/embedcomp/window-watcher;1"]
               .getService(Ci.nsIWindowWatcher)
               .activeWindow;
               
    if( win != null ) 
      return win;  
      
    if(homeWindow != null)
      return homeWindow;
      
    win = Cc["@mozilla.org/appshell/window-mediator;1"]
      .getService(Components.interfaces.nsIWindowMediator)
      .getMostRecentWindow("navigator:browser");

    return win;
  },
  
  // ----------
  // Variable: activeTab
  // The <Tabs> tab that represents the active tab in the active window.
  get activeTab(){
    var tabBrowser = this.activeWindow.gBrowser;
    var rawTab = tabBrowser.selectedTab;
    for( var i=0; i<Tabs.length; i++){
      if(Tabs[i].raw == rawTab)
        return Tabs[i];
    }
    
    return null;
  },
  
  // ----------
  // Variable: homeTab
  // The <Tabs> tab that represents the tab candy tab.
  // TODO: what if there are multiple tab candy tabs?
  get homeTab(){
    for( var i=0; i<Tabs.length; i++){
      if(Tabs[i].contentWindow.location.host == "tabcandy"){
        return Tabs[i];
      }
    }
    
    return null;
  },

  // ----------
  // Function: getCurrentWindow
  // Returns the nsIDOMWindowInternal for the currently active window, 
  // i.e. the window belonging to the active page's DOM "window" object.
  getCurrentWindow: function() {
    var wm = Cc["@mozilla.org/appshell/window-mediator;1"]
             .getService(Ci.nsIWindowMediator);
    var browserEnumerator = wm.getEnumerator("navigator:browser");
    while (browserEnumerator.hasMoreElements()) {
      var browserWin = browserEnumerator.getNext();
      var tabbrowser = browserWin.gBrowser;
  
      // Check each tab of this browser instance
      var numTabs = tabbrowser.browsers.length;
      for (var index = 0; index < numTabs; index++) {
        var currentBrowser = tabbrowser.getBrowserAtIndex(index);
        if(currentBrowser.contentWindow == window)
          return browserWin;
      }
    }
    
    return null;
  },

  // ___ Files
  getInstallDirectory: function(id, callback) { 
    if (Cc["@mozilla.org/extensions/manager;1"]) {
      var extensionManager = Cc["@mozilla.org/extensions/manager;1"]  
                             .getService(Ci.nsIExtensionManager);  
      var file = extensionManager.getInstallLocation(id).getItemFile(id, "install.rdf"); 
      callback(file.parent);  
    }
    else {
      Components.utils.import("resource://gre/modules/AddonManager.jsm");
      AddonManager.getAddonByID(id, function(addon) {
        var fileStr = addon.getResourceURL("install.rdf");
        var ios = Cc["@mozilla.org/network/io-service;1"].getService(Ci.nsIIOService);  
        var url = ios.newURI(fileStr, null, null);
        callback(url.QueryInterface(Ci.nsIFileURL).file.parent);
      });
    }
  }, 
  
  getFiles: function(dir) {
    var files = [];
    if(dir.isReadable() && dir.isDirectory) {
      var entries = dir.directoryEntries;
      while(entries.hasMoreElements()) {
        var entry = entries.getNext();
        entry.QueryInterface(Ci.nsIFile);
        files.push(entry);
      }
    }
    
    return files;
  },

  getVisualizationNames: function(callback) {
    var self = this;
    this.getInstallDirectory("tabcandy@aza.raskin", function(dir) {
      var names = [];
      dir.append('content');
      dir.append('candies');
      var files = self.getFiles(dir);
      var count = files.length;
      var a;
      for(a = 0; a < count; a++) {
        var file = files[a];
        if(file.isDirectory()) 
          names.push(file.leafName);
      }
 
      callback(names);
    });
  },
    
  // ___ Logging
  
  ilog: function(){ 
    Utils.log('!!ilog is no longer supported!!');
  },
  
  log: function() { // pass as many arguments as you want, it'll print them all
    var text = this.expandArgumentsForLog(arguments);
    consoleService.logStringMessage(text);
  }, 
  
  error: function() { // pass as many arguments as you want, it'll print them all
    var text = this.expandArgumentsForLog(arguments);
    Cu.reportError('tabcandy error: ' + text);
  }, 
  
  trace: function() { // pass as many arguments as you want, it'll print them all
    var text = this.expandArgumentsForLog(arguments);
    if(typeof(printStackTrace) != 'function')
      this.log(text + ' trace: you need to include stacktrace.js');
    else {
      var calls = printStackTrace();
      calls.splice(0, 3); // Remove this call and the printStackTrace calls
      this.log('trace: ' + text + '\n' + calls.join('\n'));
    }
  }, 
  
  assert: function(label, condition) {
    if(!condition) {
      var text;
      if(typeof(label) == 'undefined')
        text = 'badly formed assert';
      else
        text = 'tabcandy assert: ' + label;        
        
      if(typeof(printStackTrace) == 'function') {
        var calls = printStackTrace();
        text += '\n' + calls[3];
      }
      
      this.log(text);
    }
  },
  
  expandObject: function(obj) {
      var s = obj + ' = {';
      for(prop in obj) {
        var value;
        try {
          value = obj[prop]; 
        } catch(e) {
          value = '[!!error retrieving property]';
        }
        
        s += prop + ': ';
        if(typeof(value) == 'string')
          s += '\'' + value + '\'';
        else if(typeof(value) == 'function')
          s += 'function';
        else
          s += value;

        s += ", ";
      }
      return s + '}';
    }, 
    
  expandArgumentsForLog: function(args) {
    var s = '';
    var count = args.length;
    var a;
    for(a = 0; a < count; a++) {
      var arg = args[a];
      if(typeof(arg) == 'object')
        arg = this.expandObject(arg);
        
      s += arg;
      if(a < count - 1)
        s += '; ';
    }
    
    return s;
  },
  
  testLogging: function() {
    this.log('beginning logging test'); 
    this.error('this is an error');
    this.trace('this is a trace');
    this.log(1, null, {'foo': 'hello', 'bar': 2}, 'whatever');
    this.log('ending logging test');
  }, 
  
  // ___ Event
  isRightClick: function(event) {
    if(event.which)
      return (event.which == 3);
    else if(event.button) 
      return (event.button == 2);
    
    return false;
  },
  
  // ___ Time
  getMilliseconds: function() {
  	var date = new Date();
  	return date.getTime();
  },
  
  // ___ Geometry
  getBounds: function(el) {
    return new Rect(
      parseInt(el.style.left) || el.offsetLeft, 
      parseInt(el.style.top) || el.offsetTop, 
      el.clientWidth,
      el.clientHeight
    );
  },

  // ___ Misc
  isDOMElement: function(object) {
    return (object && typeof(object.nodeType) != 'undefined' ? true : false);
  },
 
  // ----------
  // Function: isNumber
  // Returns true if the argument is a valid number. 
  isNumber: function(n) {
    return (typeof(n) == 'number' && !isNaN(n));
  },
  
  // ----------
  // Function: copy
  // Returns a copy of the argument. Note that this is a shallow copy; if the argument
  // has properties that are themselves objects, those properties will be copied by reference.
  copy: function(value) {
    if(value && typeof(value) == 'object') {
      if(iQ.isArray(value))
        return iQ.extend([], value);
        
      return iQ.extend({}, value);
    }
      
    return value;
  }
};

window.Utils = Utils;

window.Math.tanh = function tanh(x){
  var e = Math.exp(x);
  return (e - 1/e) / (e + 1/e); 
}

})();
