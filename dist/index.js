import express from 'express';
import cookieParser from "cookie-parser";
import dotenv from 'dotenv';
import auth from './routes/Auth.route.js';
import seller from './routes/Seller.route.js';
import bodyParser from "body-parser";
import admin from './routes/Admin.js';
import { setupSwagger } from "./config/swagger.js";
import http from "http";
import { Server } from "socket.io";
import { initializeSocket } from "./routes/Messages.js";
import chat from './routes/Messages.js';
import { registerSocketHandlers } from './routes/Video.js';
import buyer from './routes/Buyer.js';
import redis from './config/redisClient.js';
dotenv.config();
const app = express();
app.use(express.json());
app.use(bodyParser.json());
app.use(cookieParser());
// app.use(passport.initialize());
const PORT = process.env.PORT || 3000;
//Swagger document
setupSwagger(app);
app.get('/', (req, res) => {
    res.send('Welcome to Alabamarket API');
});
app.get("/redis", async (req, res) => {
    await redis.set("testkey", "Hello Redis!. Hi, I'm connected");
    const value = await redis.get("testkey");
    res.send(`Redis value: ${value}`);
});
// sign up and verify mail and phone number
app.use('/api/auth', auth);
//Admin
app.use('/api/admin', admin);
//Seller shoup
app.use('/api/seller', seller);
//Buyer endpoints
app.use('/api/buyer', buyer);
//Messages
app.use('/api/chat', chat);
//Socket.io for chat and video supporting WebRTC
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*", // we can restrict this later
        methods: ["GET", "POST"]
    }
});
// Initialize socket events for chat
initializeSocket(io);
//initialize  socket for video call signaling
registerSocketHandlers(io);
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
