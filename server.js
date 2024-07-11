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
const messagesRouter = require("./controllers/messages")
const port = process.env.PORT ? process.env.PORT : "3000";
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
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

io.on("connection", (socket) => {
  socket.on("message", (messagecontent) => {
    socket.broadcast.emit('message', messagecontent)
    console.log(messagecontent)

  });
});

server.listen(port, () => {
  console.log(`Listening on ${port}`);
});
