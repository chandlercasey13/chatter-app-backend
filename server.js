const { createServer } = require("http");
const { Server } = require("socket.io");

const dotenv = require("dotenv");
dotenv.config();
const cors = require("cors");
const express = require("express");
const app = express();
const server = createServer(app);
const mongoose = require("mongoose");
const testJWTRouter = require("./controllers/test-jwt");
const usersRouter = require("./controllers/users");
const profilesRouter = require("./controllers/profiles");
const messagesRouter = require("./controllers/messages");
const chatlogsRouter = require("./controllers/chatlogs");
const message = require("./models/message");

const port = process.env.PORT ? process.env.PORT : "3000";
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5174",
  },
});

mongoose.connect(process.env.MONGODB_URI);

mongoose.connection.on("connected", () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});

app.use(cors());
app.use(express.json());

// Routes go here
app.use("/test-jwt", testJWTRouter);
app.use("/users", usersRouter);
app.use("/profiles", profilesRouter);
app.use("/messages", messagesRouter);
app.use("/chatlogs", chatlogsRouter);

io.on("connection", (socket) => {
  socket.on('join', (id, user) => {
    console.log( id, user, 'joined')

    socket.join(id)
  });

    socket.on("message", (messagecontent, currentRoom) => {
     
      
      socket.to(currentRoom).emit('message', messagecontent)
      
      
    });


    socket.on('leave', (id, user) => {
      socket.leave(id)
      console.log('left', id)
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