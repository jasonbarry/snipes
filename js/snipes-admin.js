(function(uri, port){
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
    socket.on('connect', function(data){
      if(data)
      {
        var cursor = '<div id="cursor_'+data.id+'" class="snipes-cursor" title="'+JSON.stringify(data).replace(/"/g, '')+'"></div>';
        $('body').append(cursor);
        // position mice that existed before admin
        if(data.x && data.y)
        {
          $('#cursor_'+data.id).css({
            left : (((($(window).width() - data.w) / 2) + 5) + data.x) + 'px',
            top : (data.y - 4) + 'px'
          });
        }
        // socket data -> html5 data
        $('#cursor_'+data.id).data('data', data);
        console.log(data);
      }
      var concurrent = parseInt($("#snipes-concurrent span").html());
      concurrent++;
      $("#snipes-concurrent span").html(concurrent);
    });
    
    socket.on('move', function(data){
      $el = $('#cursor_'+data.id);
      $el.css({
        left : (((($(window).width() - $el.data('data').w) / 2) + 5) + data.x) + 'px',
        top : (data.y - 4) + 'px'
      });
    });
    
    socket.on('click', function(data){
      $('body').append('<div id="pulse_'+data.id+'" class="snipes-pulse"></div>');
      $('#pulse_'+data.id).css({ top: (data.y-4)+'px', left: (data.x+5)+'px' })
                          .animate({ top: (data.y-20)+'px', left: (data.x-11)+'px', width: '32px', height: '32px', opacity: '0' },
                                     500, 
                                     function(){
                                       $(this).remove();
                                     }
                                   );
    });
    
    socket.on('resize', function(data){
      $('#cursor_'+data.id).data('data').w = data.w;
      $('#cursor_'+data.id).data('data').h = data.h;
      console.log(data);
    });
    
    socket.on('disconnect', function(id){
      $('#cursor_'+id).remove();
      console.log('disconnected: ' + id);
      var concurrent = parseInt($("section span").html());
      concurrent--;
      $("section span").html(concurrent);
    });
  };
  
  // scroll cursors with page
  window.onload = function(){
    var frame = document.getElementById("snipes-frame").contentWindow;
    frame.onscroll = function(){
      // select all dots and move them accordingly
      $("div[id^='cursor_']").each(function(){
        // -6 for centerage
        $(this).css({top: ($(this).data('data').y - frame.pageYOffset - 6)});
      });
    }
  }
})('localhost', 3000);