import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './db/db.js';
import authRouter from './routes/auth.routes.js';
import cookieParser from 'cookie-parser';
dotenv.config();
const app = express();
app.use(express.json());
app.use(cookieParser());
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Welcome to Srisatya Toys and Gifts Backend!');
});

app.use('/api/auth', authRouter)

app.listen(PORT, () => {
    connectDB();
  console.log(`Server is running on http://localhost:${PORT}`);
});