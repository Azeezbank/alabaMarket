import express from 'express';
import type { Request, Response } from 'express';
import cookieParser from "cookie-parser";
import dotenv from 'dotenv';
import logout from './routes/Logout.js';
import auth from './routes/Auth.route.js';
import seller from './routes/Seller.route.js';
import bodyParser from "body-parser";
import admin from './routes/Admin.js';
import { setupSwagger } from "./config/swagger.js";



dotenv.config();

const app = express();
app.use(express.json());
app.use(bodyParser.json());
app.use(cookieParser());
// app.use(passport.initialize());

const PORT = process.env.PORT || 3000;
//Swagger document
setupSwagger(app);

app.get('/', (req: Request, res: Response) => {
    res.send('Welcome to Alabamarket API');
})

// sign up and verify mail and phone number
app.use('/api/auth', auth)

//Admin
app.use('/api/admin', admin)

//Seller shoup
app.use('/api/seller', seller)

//Logout route
app.use('/api/logout', logout)



app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});