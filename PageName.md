# Current Revision A Milestone Bug List #

**[Revision A Milestone](http://aza.etherpad.com/tabcandy)**



---
# Unclaimed TODO #

  * Hide the tabcandy tab, and provide another set of UI elements to get there



# Aza TODO #

  * Define what the first release looks like
  * Add a gesture to move from any page back to the tabcandy page
  * Complete work on Groups
  * Named spaces
  * Auto-sizing spaces

# Ian TODO #

## Priorities ##

Make the core stable and modular. Continue advancing my "stacks" visualization as a way to push on the core (as well as to explore ui concepts).

## Stability/Robustness ##

  * Why does it say "Invalid chrome uri" in the console?
  * Sometimes after running the page for a while, the browser slows down (leaks?)
  * When you launch, if you've got a bunch of pages, the thumbnails don't all update
  * Make sure we're doing the right things for security
    * https://developer.mozilla.org/en/Security_best_practices_in_extensions
    * In particular, is there a way to have our tab tracking work with Chrome privileges, but each of the visualizations don't have chrome privileges? Otherwise each new visualization is a potential attack point.
  * Can we know a tab has arrived even before onReady?
  * Even though the popups get killed by the browser, we seem to still get a tab for them, and it doesn't go away
  * Sites with animated gifs seem to repaint their thumbnails fine if you start up with them, but not if you add them during the session

## Stacks ##

  * Prettier stack
    * rotations
    * Kill tab text labels and close boxes
    * Add a stack-wide close box?
  * Line instead of lasso
    * Update selection live
    * Fade line as you go
    * Have the tabs follow the line like little bitty puppies??!one!
  * Mouse over a stack to spread it out

## New Candies ##

  * Just text version
  * Auto everything version
  * Keyboard commands everywhere
  * Physics
    * http://box2d-js.sourceforge.net/

## Ian1 Candy ##

  * Zoom into a group.
  * On resize

## Other ##

  * Clean up Group.arrange()
  * implement an animation system that can handle many moving objects at the same time
  * Add Firebug lite to the stacks candy
  * Figure out how to know that one tab spawned another, then show it visually
  * Special graphic treatment for tabs that haven't been viewed yet
  * Google related search
  * "Keep in dock" for webpages
  * Use inertia for thrown tabs
  * Don't track tabs in other windows
  * We need to add a fix so that the hit test (lasso, line) works for elements behind other elements somehow
  * We can, after a hit is found, hide that element and try the hit test again
  * The lasso/line feature masks clicks in the UI; fix this
  * Highlight as you go in the line experience
  * Command click for selection
  * Stacking
    * Animate rotation
      * http://www.zachstronaut.com/posts/2009/08/07/jquery-animate-css-rotate-scale.html
  * The "switch" tab title needs to be prettier
  * It sometimes collapses the top chrome of the window and sometimes doesn't
  * Collapsing the top chrome should be a preference
  * Remember settings like collapse top chrome and hide tab bar between runs
  * Add a "new tab" button
  * If you put a URL into the search box it should just go there
  * Overlay the command keys for jumping to a tab on the appropriate page thumbnails
  * Should start automatically when you launch the browser
  * Can we provide a non-chrome-space environment for people to build their versions in, to save them the headaches of debugging?
  * Check out related add-ons:
    * Foxtab
    * treetab

## Ongoing ##

  * Modularize it with an API so it can support multiple experiences
  * Document API

# Random UI Thoughts #

  * I'd love a mode for killing tabs where I can just drag across them
  * Once you've filtered your tabs, you should be able to do things to that filtered set, like stack them, kill them, etc

# General Principles #

  * Any div with class ".tab" is assumed to be a tab
  * In general, things prefer not to overlap
