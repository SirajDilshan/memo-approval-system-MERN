const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const { setIO } = require("./socket"); // ✅ import setIO
const notificationRoutes = require('./routes/NotificationRoutes');


dotenv.config();
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: { origin: "http://localhost:3000", credentials: true },
});

setIO(io); // ✅ store io globally for later access

// Middleware
app.use(express.json());
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// DB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/memos", require("./routes/memoRoutes"));
app.use('/api/notifications', notificationRoutes);


app.get("/", (req, res) => {
  res.send("UMIS Backend Running");
});

// Socket.IO Events
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

// Server Start
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
