(function(uri, port, jsonp, maxRate){
  // make sure we're not being watched o_O
  if(top.location == self.location)
  {
    // attach socket.io script
    var s = document.createElement('script');
    s.src = 'http://'+uri+':'+port+'/socket.io/socket.io.js';
    document.getElementsByTagName('head')[0].appendChild(s);
    // when script is finished loading, trigger snipes
    s.onload = function()
    {
      var socket = io.connect('http://'+uri+':'+port+'/client'),
          prevCoords,
          prevDate = new Date().getTime(),
      
          // preserve previously registered event handlers
          preserveOnmousemove = window.onmousemove,
          preserveOnclick     = window.onclick,
          preserveOnresize    = window.onresize,
          preserveOnunload    = window.onunload,
      
          options = { a: 'connect',
                      since: prevDate,
                      ua: navigator.userAgent,
                      cookies: document.cookie,
                      w: window.innerWidth,
                      h: window.innerHeight };
      
      // make ajax call to get more data about client
      var req = false; 
      // branch for native xhr            
      if(window.XMLHttpRequest) req = new XMLHttpRequest();
      // branch for IE/Windows ActiveX version
      else if(window.ActiveXObject) {
        try { req = new ActiveXObject("Msxml2.XMLHTTP"); } 
        catch(e) {
          try { req = new ActiveXObject("Microsoft.XMLHTTP"); } 
          catch(e){ req = false; }
        }
      }
      // check that we have access to ajax, just in case
      if(req)
      {
        req.open('GET', jsonp, true);
        req.send(null); 
        req.onreadystatechange = function()
        {   
          if(req.readyState == 4) // loaded
          {
            if(req.status == 200) // OK
            {
              // extend results of ajax call onto options              
              extend(options, JSON.parse(req.responseText));
            }
          }
        };
      }
      // send to server.js, with or without of ajax'd jsonp data
      socket.emit('event', options);
      
      window.onmousemove = function(e)
      {
        if(preserveOnmousemove) preserveOnmousemove(e);
        // avoid sending same coordinates twice in a row
        var date = new Date().getTime();
        if(date - prevDate > 1000 / maxRate)
        {
          var coords = [e.pageX, e.pageY].join(',');
          if(coords != prevCoords)
          { 
            socket.emit('event', { a: 'move', 
                                   x: e.pageX, 
                                   y: e.pageY 
                                   });
            prevCoords = coords;
            prevDate = date;
          }
        }
      };
      
      window.onclick = function(e)
      { 
        if(preserveOnclick) preserveOnclick(e);
        socket.emit('event', { a: 'click',
                               x: e.pageX, 
                               y: e.pageY 
                               });
      };
      
      window.onresize = function(e)
      { 
        if(preserveOnresize) preserveOnresize(e);
        socket.emit('event', { a: 'resize',
                               w: window.innerWidth, 
                               h: window.innerHeight
                               });
      };
      
      // disconnect
      window.onunload = function(e)
      { 
        if(preserveOnunload) preserveOnunload(e);
        socket.emit('disconnect');
      };
    };
    var extend = function(target, newObj)
    {
      for (var i in newObj)
        { target[i] = newObj[i]; }
      return target;
    };
  }
})('localhost', 3000, './ajax/jsonp.php', 33);