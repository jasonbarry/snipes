# Snipes.js

Unobtrusive Realtime Mouse-Tracking Analytics for Node.js
---

## Features

  - Realtime mousemove, click, scroll, resize, connect, and disconnect observers
  - Only broadcast cursor positions to admin, not to other clients. This way visitors won't be bothered with cursor positions they don't care about.
  - Works in Safari 3+, Google Chrome 4+, Firefox 3+, Opera 10.61+, Internet Explorer 5.5+

## Demo

Try out the [demo](http://ve.kl7xwf7m.vesrv.com/admin.html) in a new window to see your cursor + the cursors of all other concurrent connections. Try it with two different browsers side by side.

## How to Install

    git clone git://github.com/jasonbarry/snipes.js.git

## How to Use

  - Paste the following right before your `</body>` tag on the page you'd like to observe:

    &lt;script src="./js/snipes-client.js"&gt;&lt;/script&gt;
    
  - Edit the last line of `snipes-admin.js` and `snipes-client.js` from `'localhost'` to the URI of your server.
  - Change the `src` attribute of the `iframe` in `admin.html` to the path of the page you're observing.
  - Then just `node server.js` and you're good to go!

## Dependencies

  - [Node.js](http://nodejs.org) - an event-driven I/O server-side JavaScript environment based on V8.
  - [Socket.io](http://socket.io) - client/server communication leveraging HTML5 WebSockets with a Flash-based fallback.
  - [jQuery](http://jquery.com) - JavaScript library, only needed on admin side.
  - Recommended but not required: [upstart](http://upstart.ubuntu.com/) and [monit](http://mmonit.com/monit/). See [why](http://howtonode.org/deploying-node-upstart-monit).

## Known Issues

This is a pre-beta release, so there might be some bugs. Please report issues on the GitHub page.

  - Admin view can only view one page at a time
  - Cursor positions have some issues with scrolling and fluid widths
  - No gui response for click event on admin side
  - No touchscreen support

## Planned Features

  - Filter cursors by user agent, referral page, country, language, etc
  - Release JSONP file in more languages than just PHP
  - Live heatmaps ala [heatmap.js](http://www.patrick-wied.at/static/heatmapjs/)
  - Hosting...?