var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

app.get('/view', (req, res) => {
    res.sendFile(__dirname + '/display.html');
});

io.on('connection', (socket) => {
    socket.on("join-message", (roomId) => {
        socket.join(roomId);
        console.log("User joined in a room : " + roomId);
    });

    socket.on("screen-data", function(data) {
        data = JSON.parse(data);
        var room = data.room;
        var imgStr = data.image;
        socket.broadcast.to(room).emit('screen-data', imgStr);
    });

    // Handle WebRTC signaling
    socket.on('signal', (data) => {
        io.to(data.to).emit('signal', data);
    });
});
// the server that running on port 5000
// or the port specified in the environment variable YOUR_PORT
var server_port = process.env.YOUR_PORT || process.env.PORT || 5000;
http.listen(server_port, () => {
    console.log("Started on : " + server_port);
});
