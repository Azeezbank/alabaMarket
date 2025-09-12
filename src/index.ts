import express from 'express';
import type { Request, Response } from 'express';
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
import video from './routes/Video.js';
import buyer from './routes/Buyer.js';
import redis from './config/redisClient.js';
import "./jobs/subscriptionExpiryJob.js";
import webhook from './routes/webhook.route.js';
import cors from "cors";
import protectPage from './routes/protectPage.js';
// import { isAdmin } from './middlewares/Admin.js';


dotenv.config();

const app = express();
app.use(cors({
  origin: [
    "http://localhost:3000",
    "https://frontenddev.alabamarket.com"
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "Accept"]
}));
app.use(express.json());
app.use(bodyParser.json());
app.use(cookieParser());

const PORT = process.env.PORT || 3000;
//Swagger document
setupSwagger(app);

app.get('/', (req: Request, res: Response) => {
    res.send('Welcome to Alabamarket API');
})

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
app.use('/api/chat', chat)

//Payment webhook
app.use('/api/payment/webhook', webhook)

//Video call signaling
app.use('/api/video/status', video)

//Protect page from Unathorized access
app.use('/api/protect', protectPage);


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