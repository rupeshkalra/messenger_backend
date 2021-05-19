const express = require('express');
const http = require('http');
const cors = require('cors');
const mongoose =require('mongoose');

const {createMessage} = require('./routes/messages');
const UserRouter = require('./routes/user');
const GroupRouter = require('./routes/groups');

require('dotenv').config();

const app = express();
const server = http.createServer(app);

app.use(express.json())
app.use(cors());

//routes
app.use('/users', UserRouter);
app.use('/group', GroupRouter);

//mongodb connection
const URI = "mongodb+srv://admin:uWnGi6WMcjiQ0vid@cluster0.v0tav.mongodb.net/messageappdb?retryWrites=true&w=majority";
mongoose.connect(URI, {useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true});
const connection = mongoose.connection;
connection.once('open', () => {
    console.log("MongoDB database connection established successfully");
})

//socket connection
const io = require("socket.io")(server, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"]
    }
  });

io.on("connection", socket=>{
  console.log("connected to client");
  socket.on('chatMessage', msg => {
    console.log(msg);
  });

  socket.on('disconnect', () => {
    console.log("client disconnected ");
  });

});

//listening port
const Port=8000;
server.listen(Port,()=>{
    console.log(`Listening at ${Port}`)
})