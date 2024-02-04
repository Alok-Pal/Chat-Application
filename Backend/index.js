import express from "express";
import { createServer } from "http";
import cors from "cors";
import { Server } from "socket.io";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import { userRouter } from "./app/routes/userRoutes.js";

dotenv.config();

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: "http://192.168.29.123:8081",
  },
});

const port = 8080;

let chatGroups = [];

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

const createUniqueId = () => {
  return Math.random().toString(20).substring(2,10)
}

io.on("connection", (socket) => {
  console.log(`${socket.id} user is just conected`);

  //  to extract all groups.
  socket.on("getAllGroups", () => {
    // we emit it in order to get it on the frontend server
    socket.emit("groupList", chatGroups)
  })


  socket.on("createNewGroup", (currentGroupName) => {

    // we are pushing the groupname in chat groups.
    chatGroups.unshift({
      id: chatGroups.length + 1,
      currentGroupName,
      messages: [],
    });

    socket.emit("groupList", chatGroups)
  });

  socket.on("findGroup", (id) => {
    const filteredGroup = chatGroups.filter(item => item.id === id)
    socket.emit("foundGroup", filteredGroup[0].messages)
  })

  socket.on("newChatMessage", (data) => {
    const { currentChatMesage, groupIdentifier, currentUser, timeData } = data;
    const filteredGroup = chatGroups.filter(item => item.id === groupIdentifier)
    const newMessage = {
      id: createUniqueId(),
      text : currentChatMesage,
      currentUser,
      time : `${timeData.hr}:${timeData.mins}`
    }
    socket.to(filteredGroup[0].currentGroupName).emit("groupMessage", newMessage);
    filteredGroup[0].messages.push(newMessage)
    socket.emit("groupList", chatGroups)
    socket.emit("foundGroup", filteredGroup[0].messages)
   
  })

  socket.on("disconnect", () => console.log("user disconnected"));
});

app.use('/', userRouter)

httpServer.listen(port, () => {
  console.log(`app is running on Port ${port}`);
});
