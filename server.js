const { createServer } = require("http");
const { Server } = require("socket.io");

const dotenv = require("dotenv");
dotenv.config();
const cors = require("cors");
const express = require("express");
const app = express();
const server = createServer(app);
const mongoose = require("mongoose");

const usersRouter = require("./controllers/users");

const messagesRouter = require("./controllers/messages");
const chatlogsRouter = require("./controllers/chatlogs");
const message = require("./models/message");



const port = process.env.PORT ? process.env.PORT : "3000";


mongoose.connect(process.env.MONGODB_URI);

mongoose.connection.on("connected", () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});

const corsOptions = {
  origin: "https://chatter-messaging.netlify.app", // Allow your frontend URL
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Allowed methods
  allowedHeaders: ["Authorization", "Content-Type"], // Allowed headers
  credentials: true, // Allow cookies if needed
};







app.use(
  cors(corsOptions)
);

app.options("*", cors(corsOptions));


app.use(express.json());


app.use("/users", usersRouter);

app.use("/messages", messagesRouter);
app.use("/chatlogs", chatlogsRouter);


const io = new Server(server, {
  cors: {
    origin: "https://chatter-messaging.netlify.app", // Allow your frontend URL
    methods: ["GET", "POST"],
    credentials: true
  }
});



io.on("connection", (socket) => {
  
  

  socket.on('join', (id, user) => {
    console.log(  user, 'joined chat:', id)

    socket.join(id)
  });

    socket.on("message", (messagecontent, currentRoom, chatID) => {

      console.log(chatID)
      socket.to(currentRoom).emit('message', messagecontent)

     
      
        io.emit('refreshChatLog', messagecontent, chatID)

       
     
     
      
      
      
    });


    socket.on('leave', (id, user) => {
       socket.leave(id)
      console.log(user, 'left', id)
    })
  })
  
  
 


server.listen(port, () => {
  console.log(`Listening on ${port}`);
});





const chatLogIndex = async () => {
  try {
    const res = await fetch(BACKEND_URL, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    return res.json();
  } catch (error) {
    console.log(error);
  }
};