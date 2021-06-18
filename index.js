const express = require('express');
const http = require('http');
const cors = require('cors');
const mongoose =require('mongoose');

const {createMessage} = require('./routes/messages');
const UserRouter = require('./routes/user');
const GroupRouter = require('./routes/groups');
const MessagesRouter = require('./routes/messages');

require('dotenv').config();

const app = express();
const server = http.createServer(app);

app.use(express.json())
app.use(cors());

//routes
app.use('/users', UserRouter);
app.use('/group', GroupRouter);
app.use('/message', MessagesRouter);

//mongodb connection
const URI = process.env.ATLAS_URI;
mongoose.connect(URI, {useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true});
const connection = mongoose.connection;
connection.once('open', () => {
    console.log("MongoDB database connection established successfully");
})

const CLIENT_URL=process.env.CLIENT_URL;
//socket connection
const io = require("socket.io")(server, {
    cors: {
      origin: CLIENT_URL,
      methods: ["GET", "POST"]
    }
  });

io.on("connection", socket=>{
  console.log("connected to client");

  socket.on('chatMessage', msg => {
  socket.broadcast.emit('message',msg);
  });

  socket.on('disconnect', () => {
    console.log("client disconnected ");
  });

});

//listening port
const PORT=process.env.LISTENING_PORT;
server.listen(PORT,()=>{
    console.log(`listning at ${PORT}`);
})