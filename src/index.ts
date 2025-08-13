import express from 'express';
import type { Request, Response } from 'express';
import cookieParser from "cookie-parser";
import dotenv from 'dotenv';
import logout from './routes/Logout.js';
import auth from './routes/Auth.route.js';
import sellerShop from './routes/Seller.route.js';
import bodyParser from "body-parser";



dotenv.config();

const app = express();
app.use(express.json());
app.use(bodyParser.json());
app.use(cookieParser());
// app.use(passport.initialize());

const PORT = process.env.PORT || 3000;

app.get('/', (req: Request, res: Response) => {
    res.send('Welcome to Alabamarket API');
})

// google authentication routes
// app.use('/api/google/auth', googleAuth);

// authentication routes for Email and phone number
app.use('/api/auth', auth);

//Seller shoup
app.use('/api/seller', sellerShop)

//Logout route
app.use('/api/logout', logout)



app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});