# Snipes.js

Unobtrusive Realtime Mouse-Tracking Analytics for Node.js
---

## Features

  - Realtime mousemove, click, scroll, resize, connect, and disconnect observers
  - Only broadcast cursor positions to admin, not to other clients. This way visitors won't be bothered with cursor positions they don't care about.
  - Works in Safari 3+, Google Chrome 4+, Firefox 3+, Opera 10.61+, Internet Explorer 5.5+

## Demo

Run server.js in node (see step 4 of How to Use, below) and then open index.html in one browser window and admin.html in another. Try with multiple index.html windows open to test concurrent connections.

## How to Install

    git clone git://github.com/jasonbarry/snipes.js.git

## How to Use

  - Paste the following right before your `</body>` tag on the page you'd like to observe:

```js
<script src="./js/snipes-client.js"></script>
```

  - Edit the last line of `snipes-admin.js` and `snipes-client.js` from `'localhost'` to the URI of your server.
  - Change the `src` attribute of the `iframe` in `admin.html` to the path of the page you're observing.
  - Then just `node server.js` and you're good to go! (or `nohup node server.js &` if you want it to run in the background)

## Dependencies

  - [Node.js](http://nodejs.org) - an event-driven I/O server-side JavaScript environment based on V8.
  - [Socket.io](http://socket.io) - client/server communication leveraging HTML5 WebSockets with a Flash-based fallback.
  - [jQuery](http://jquery.com) - JavaScript library, only needed on admin side.

## Known Issues

This is a pre-beta release, so there might be some bugs. Please report issues on the GitHub page.

  - Admin view can only view one page at a time
  - Cursor positions are not accurate with fluid widths or when the window width is less than the body width

## Planned Features

  - Filter cursors by user agent, referral page, country, language, etc
  - Live heatmaps ala [heatmap.js](http://www.patrick-wied.at/static/heatmapjs/)
  - Hosting...?