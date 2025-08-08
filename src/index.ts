import express from 'express';
import type { Request, Response } from 'express';
import cookieParser from "cookie-parser";
import dotenv from 'dotenv';
// import googleAuth from './routes/Auth.google.route';
import auth from './routes/Auth.route';
import sellerShop from './routes/seller/Shop.route';



dotenv.config();

const app = express();
app.use(express.json());
app.use(cookieParser());
// app.use(passport.initialize());

const PORT = process.env.PORT || 5000;

app.get('/', (req: Request, res: Response) => {
    res.send('Welcome to Alabamarket API');
})

// google authentication routes
// app.use('/api/google/auth', googleAuth);

// authentication routes for Email and phone number
app.use('/api/auth', auth);

//Seller shoup
app.use('/api/seller', sellerShop)



app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});