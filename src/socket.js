const { Server } = require("socket.io");
const redis = require("redis");

let io;

const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "https://app.golabing.ai", // ✅ Use your production frontend URL
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  // Redis subscriber client
  const subscriber = redis.createClient({
    socket: {
      host: "localhost", // or your Redis host
      port: 6379,
    }
  });

  subscriber.connect().catch(console.error);

  subscriber.on("error", (err) => {
    console.error("❌ Redis error:", err);
  });

  subscriber.subscribe("notification", (message) => {
    try {
      const { userId, notification } = JSON.parse(message);
      console.log("📥 Received notification:", notification);

      // Send to user's socket room
      io.to(`user_${userId}`).emit("notification", notification);
      console.log(`🔔 Sent notification to user_${userId}`);
    } catch (err) {
      console.error("❌ Failed to parse notification:", err);
    }
  });

  io.on("connection", (socket) => {
    console.log("✅ Client connected:", socket.id);

    socket.on("join_rooms", ({ userId, orgId }) => {
      if (userId) {
        socket.join(`user_${userId}`);
        console.log(`➕ ${socket.id} joined user_${userId}`);
      }
      if (orgId) {
        socket.join(`org_${orgId}`);
        console.log(`➕ ${socket.id} joined org_${orgId}`);
      }
    });

    socket.on("disconnect", () => {
      console.log("❌ Client disconnected:", socket.id);
    });
  });

  return io;
};

const getIO = () => {
  if (!io) throw new Error("Socket.io not initialized!");
  return io;
};

module.exports = {
  initSocket,
  getIO,
};
