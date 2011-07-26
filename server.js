var io = require('socket.io').listen(3000),
    bank = {};  // currently connected client ids

/// config
// send minified client
io.enable('browser client minification');
// apply etag caching logic based on version number
io.enable('browser client etag');
// reduce logging
io.set('log level', 1);

// gather data from client channel
var client = io
  .of('/client')
  .on('connection', function(socket) {
    
    socket.on('event', function(data) {
      // store connection
      if(data.a == 'connect')
      {
        bank[socket.id] = data;
      }
      else if(data.a == 'move')
      {
        bank[socket.id].x = data.x;
        bank[socket.id].y = data.y;
      }
      // append client's socket id to data
      data.id = socket.id;
      // send to admin
      admin.emit(data.a, data);
      // log
      console.log(data);
    });
    
    socket.on('disconnect', function() {
      // remove from temp bank
      delete bank[socket.id];
      // send message to admin
      admin.emit('disconnect', socket.id);
      // log
      console.log(bank);
    });
    
  });

// create admin channel
var admin = io
  .of('/admin')
  .on('connection', function(socket) {
    for(id in bank) {
      admin.emit('connect', bank[id]);
    }
  });