[Home Page](./00_Documentation.md)
# Chat with socket.io

Single socket with multiples channels.

## Catch-all listener
Very useful during development
```ts
socket.onAny((event, ...args) => {  
	console.log(event, args);  
});
```

## Rooms
- [Rooms | Socket.IO](https://socket.io/fr/docs/v4/rooms/)
A room is an arbitrary channel that sockets can `join` and `leave`

```ts
const io = require('socket.io')(3000);
const rooms = { 'room1': [], 'room2': [] };

io.on('connection', socket => {
	// On connection the user auto join the room1
  socket.join('room1');

	// When a message is received: it is added to the corresponding room
	// and then broadcast to all the users in that room
  socket.on('send message', (room, msg) => {
    rooms[room].push(msg);
    socket.to(room).emit('receive message', msg);
  });

	// User can change the current room
  socket.on('switch room', (newRoom) => {
    socket.leave(socket.rooms[0]);
    socket.join(newRoom);
  });
});
```

## Rooms vs Namespaces
- [Namespaces | Socket.IO](https://socket.io/fr/docs/v4/namespaces/)

In summary, if you need to segment your application into predefined sections, use namespaces. If you need to dynamically group connections or users, use rooms.
### Namespaces
- Namespaces are primarily used to separate server logic over a single shared connection ([dev.to](https://dev.to/wpreble1/socket-io-namespaces-and-rooms-d5h), [coloringchaos.github.io](https://coloringchaos.github.io/rtw-s17/namespaces-rooms/), [github.com](https://github.com/socketio/socket.io-website/blob/c8ce9d5b74d7b54eb0f7c3bbdb73c1ed83418611/public/docs/rooms-and-namespaces/index.html)).
- They are connected to by the client using `io.connect(urlAndNsp)`. The client will be added to that namespace only if it already exists on the server ([stackoverflow.com](https://stackoverflow.com/questions/10930286/socket-io-rooms-or-namespacing)).
- Namespaces can be authorization protected, meaning you can add a layer of access control to your namespaces ([stackoverflow.com](https://stackoverflow.com/questions/10930286/socket-io-rooms-or-namespacing)).
- **Although it is possible to dynamically create namespaces, it is not common practice**. If you need to create ad hoc compartments on the fly, it's usually better to use rooms ([dev.to](https://dev.to/wpreble1/socket-io-namespaces-and-rooms-d5h), [stackoverflow.com](https://stackoverflow.com/questions/10930286/socket-io-rooms-or-namespacing)).

### Rooms:
- Rooms are subchannels of namespaces and are used to further separate concerns within a namespace ([coloringchaos.github.io](https://coloringchaos.github.io/rtw-s17/namespaces-rooms/), [tutorialspoint.com](https://www.tutorialspoint.com/socket.io/socket.io_rooms.htm), [github.com](https://github.com/socketio/socket.io-website/blob/c8ce9d5b74d7b54eb0f7c3bbdb73c1ed83418611/public/docs/rooms-and-namespaces/index.html)).
- Rooms are created and managed on the server side. Clients can't join a room directly; they need to send a request to the server to join a room ([stackoverflow.com](https://stackoverflow.com/questions/10930286/socket-io-rooms-or-namespacing), [coloringchaos.github.io](https://coloringchaos.github.io/rtw-s17/namespaces-rooms/)).
- They are best suited for creating dynamic compartments on the fly to accommodate groups of users/connections ([stackoverflow.com](https://stackoverflow.com/questions/10930286/socket-io-rooms-or-namespacing)).