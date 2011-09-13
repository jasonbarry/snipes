(function(uri, port){
  // register global admin object
  var admin = { h: $(window).height(), w: $(window).width() };
  // fix squished frame bug in firefox (16 = scrollbar height)
  $('#snipes-frame').attr('height', admin.h - 16);
  // tell admin overlay what page we're watching
  $("section em").html($("#frame").attr('src'));
  // attach socket.io script
  var s = document.createElement('script');
  s.src = 'http://'+uri+':'+port+'/socket.io/socket.io.js';
  document.getElementsByTagName('head')[0].appendChild(s);
  // when script is finished loading, trigger snipes
  s.onload = function()
  {
    var socket = io.connect('http://'+uri+':'+port+'/admin');
  
    // below this line are interpreting messages from server.js
    socket.on('connect', function(client){
      if(client)
      {
        var cursor = '<div id="cursor_'+client.id+'" class="snipes-cursor" '+
                      'title="'+JSON.stringify(client).replace(/"/g, '')+'"></div>';
        $('#snipes-sandbox').append(cursor);
        // position mice that existed before admin
        if(client.x && client.y)
        {
          $('#cursor_'+client.id).css({
            left : (client.x + avg(admin.w, client.w) + 5) + 'px',
            top  : (client.y - 4) + 'px'
          });
        }
        // save w, x, and y in html5 data store
        $('#cursor_'+client.id).data('data', { w: client.w, x: client.x, y: client.y });
      }
      concurrents(1);
    });
    
    socket.on('move', function(client){
      var frame = document.getElementById("snipes-frame").contentWindow;
      var $el = $('#cursor_'+client.id);
      // TODO: somehow find the width of the child's body... that sounds dirty
      $el.css({ left: (client.x - frame.pageXOffset + avg(admin.w, $el.data('data').w) - 5) + 'px',
                top:  (client.y - frame.pageYOffset - 4) + 'px'
                });
      $.extend($el.data('data'), { x: client.x, y: client.y });
    });
    
    socket.on('click', function(client){
      var frame = document.getElementById("snipes-frame").contentWindow;
      $('#snipes-sandbox').append('<div id="pulse_'+client.id+'" class="snipes-pulse"></div>');
      var centerage = avg(admin.w, $('#cursor_'+client.id).data('data').w);
      $('#pulse_'+client.id)
        .css({ left: (client.x - frame.pageXOffset + centerage - 5) + 'px',
               top:  (client.y - frame.pageYOffset - 4) + 'px'  
               })
        .animate({ left: (client.x - frame.pageXOffset + centerage - 21) + 'px', 
                   top:  (client.y - frame.pageYOffset - 20) + 'px', 
                   width: '32px', 
                   height: '32px', 
                   opacity: '0' 
                   },
                   500, 
                   function(){
                     $(this).remove();
                   });
    });
    
    socket.on('resize', function(client){
      $('#cursor_'+client.id).data('data').w = client.w;
    });
    
    socket.on('disconnect', function(id){
      $('#cursor_'+id).remove();
      // decrement number of concurrent connections in dom
      concurrents(-1);
    });
  };
    
  // scroll cursors with page
  window.onload = function(){
    var frame = document.getElementById("snipes-frame").contentWindow;
    frame.onscroll = function(){
      // select all dots and move them accordingly
      $("div[id^='cursor_']").each(function(){
        var client = $(this).data('data');
        $(this).css({ left: (client.x - frame.pageXOffset + avg(admin.w, client.w) - 5) + 'px', 
                      top:  (client.y - frame.pageYOffset - 4) + 'px'
                      });
      });
    }
  }
  
  // reposition cursors on admin window resize. 
  // should only affect x position for centering cursors
  window.onresize = function(){
    // override admin width and height global
    admin = { h: $(window).height(), w: $(window).width() };
    // fix squished frame bug in firefox (16 = scrollbar height)
    $('#snipes-frame').attr('height', admin.h - 16);
    // select all dots and move them accordingly
    $("div[id^='cursor_']").each(function(){
      var client = $(this).data('data');
      $(this).css({ left: (client.x + avg(admin.w, client.w) + 5) + 'px' });
    });
  };
  
  // keeps cursor in correct position relative to centered layouts
  var avg = function(admin_width, client_width){
    return (admin_width - client_width) / 2;
  };
  
  var concurrents = function(num){
    var concurrent = parseInt($("#snipes-concurrent span").html());
    concurrent += num;
    $("#snipes-concurrent span").html(concurrent);
  };
})('localhost', 3000);