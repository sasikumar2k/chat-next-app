import { createServer } from "http";
import { Server } from "socket.io";
import next from "next";

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer((req, res) => {
    handle(req, res);
  });

  const io = new Server(httpServer, {
    cors: {
      origin: "*",
    },
  });

  let activeUsers = new Set();

  io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);
    activeUsers.add(socket.id);

    io.emit("activeUsers", Array.from(activeUsers));

    socket.on("message", (message) => {
      io.emit("message", { userId: socket.id, text: message });
    });

    socket.on("disconnect", () => {
      console.log("A user disconnected:", socket.id);
      activeUsers.delete(socket.id);
      io.emit("activeUsers", Array.from(activeUsers));
    });
  });

  httpServer.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
  });
});
