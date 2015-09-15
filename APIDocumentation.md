# Getting Started #

## Basics ##

Each Tab Candy visualization is a set of files in its own folder inside tabcandy/content/candies/. For instance:

```
tabcandy/
  content/
    candies/
      myvisualization/
        index.html
        js/
          main.js
        img/
          button.png
```

The only file that's required is an index.html, which will be the page your visualization runs on. Your index.html needs to include these JavaScript files:

```
<script type="text/javascript;version=1.8" src="../../js/core/jquery.js"></script>  
<script type="text/javascript;version=1.8" src="../../js/core/utils.js"></script>  
<script type="text/javascript;version=1.8" src="../../js/core/tabs.js"></script>
<script type="text/javascript;version=1.8" src="../../js/core/mirror.js"></script>
```

**jquery.js** is currently required by the Tab Candy core, thought his may change in the future.

**utils.js** provides various services, such as logging and stack traces (as Firebug doesn't work very well in chrome mode).

**tabs.js** deals with tracking the tabs in the browser. It adds a Tabs object to the browser's window object; window.Tabs provides a list of tabs.

**mirror.js** creates visual tab objects with thumbnails. It adds a TabMirror object to the browser's window object. window.TabMirror.customize() allows you to provide a function that will get called for every tab created.

## Switching Visualizations ##

To add a control to switch between visualizations, include this in your index.html:

```
<!-- BEGIN Switch Control -->
<script type="text/javascript;version=1.8" src="../../js/optional/switch.js"></script>  
<script type="text/javascript;version=1.8">
  Switch.insert('body', '');
</script>
<!-- END Switch Control -->
```

**Switch.insert()** takes in two parameters: a selector for the DOM element to prepend the switch control to (additional attachement options may be available in the future), and css style text to add to the switch control.

# Object Reference #

## window.Tabs ##

window.Tabs is a read-only array of tab objects. In addition, it has these functions:

| **Function** | **Description** |
|:-------------|:----------------|
| tab(identifier) | Given identifier (currently, a DOM element in the tab's div; more possible identifiers (url, index, etc) to be added in the future), returns the appropriate "tab" object. |

## tab objects ##

These objects represent tabs in the browser, but have no visible representation in the tab candy window.

| **Function** | **Description** |
|:-------------|:----------------|
| close()      | Closes the tab. |

## window.Utils ##

Firebug doesn't work well in chrome mode, so we need additional debug support.

| **Function** | **Description** |
|:-------------|:----------------|
| log(...)     | Outputs any number of arguments to the console. Objects are expanded 1 level. |
| ilog(...)    | Outputs any number or arguments to a FirebugLite console, which gives you introspection abilities |
| error(...)   | Same as log(), but outputs as an error. |
| trace(...)   | Same as log(), but also outputs a stack trace. |
| assert(label, condition) | Prints an error if _condition_ is false. Also prints the location of the calling function. |
| isRightClick(event) | Given a mouse event, returns true if the right-mouse button was involved. |
| getMilliseconds() | Returns the current date/time represented as milliseconds. |
| getBounds(el) | Given a DOM element, returns a Rect with its dimensions. |
| isJQuery(object) | Given an object, returns true if it's a jQuery object. |

## window.Point ##

A simple point object with x and y members.

| **Function** | **Description** |
|:-------------|:----------------|
| Point(x?, y?) | Constructor. If x or y are left off, they default to 0. |

## window.Rect ##

A simple rectangle object with left, top, width, and height members. You can also access right and bottom as if they were normal properties, and setting right will adjust the width, etc.

| **Function** | **Description** |
|:-------------|:----------------|
| Rect(a, top?, width?, height?) | Constructor. If a is a Rect, the new Rect is a copy of it. Otherwise a is used for the left value. |
| intersects(rect) | Returns true if the receiver intersects rect. |
| center()     | Returns a Point representing the center of the receiver. |
| inset(a, b?) | Reduces the receiver by the given ammounts on all sides. If a is a Point, its x and y are used; otherwise a is used for x and b is used for y. Use negative values to expand the rectangle. |
| offset(a, b?) | Pushes the receiver down and right by the given ammounts. If a is a Point, its x and y are used; otherwise a is used for x and b is used for y. Use negative values to offset up and/or left. |
| equals(a)    | Returns true if a has the same dimensions as the receiver. |

## window.TabMirror ##

window.TabMirror gives you access to the visible representations of the tabs.

| **Function** | **Description** |
|:-------------|:----------------|
| customize(func) | Allows you to customize the tab representations as they are created. _func_ is a callback function that will be called every time a new tab or tabs are created. _func_ should take in one parameter, a jQuery object representing the div enclosing the tab in question. This jQuery object may be singular or multiple, depending on the number of tabs being created. |
| pausePainting() | Tells the TabMirror to stop updating thumbnails (so you can do animations without thumbnail paints causing stutters). pausePainting can be called multiple times, but every call to pausePainting needs to be mirrored with a call to resumePainting(). |
| resumePainting() | Undoes a call to pausePainting(). For instance, if you called pausePainting three times in a row, you'll need to call resumePainting three times before the TabMirror will start updating thumbnails again. |

## mirror objects ##

One mirror object represents the visual representation of a tab.

| **Function** | **Description** |
|:-------------|:----------------|
| triggerPaint() | Forces the mirror in question to update its thumbnail. |
| forceCanvasSize(w, h) | Repaints the thumbnail with the given resolution, and forces it to stay that resolution until unforceCanvasSize is called. |
| unforceCanvasSize() | Stops holding the thumbnail resolution; allows it to shift to the size of thumbnail on screen. Note that this call does not nest, unlike TabMirror.resumePainting(); if you call forceCanvasSize multiple times, you just need a single unforce to clear them all. |
| addOnClose(referenceElement, callback) | The given callback will be called right before this mirror is removed from the screen (when the uses closes the tab). The referenceElement is used to facilitate removal if necessary. |                 | removeOnClose(referenceElement) | Removes the callback associated with referenceElement for onClose notification. |