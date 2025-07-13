import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import socketHandler from './socket.js';

const app = express();
app.use(cors());

const PORT = process.env.PORT || 3000;


const server = http.createServer(app);  

const io = new Server(server, {
  cors: {
    origin: "*", // Change this to your client URL
    methods: ["GET", "POST"]
  }
});

socketHandler(io);



server.listen(PORT, () => {
  console.log("✅ Server running at http://localhost:3000");
});