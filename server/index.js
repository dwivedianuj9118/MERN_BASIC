import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import connectDB from './config/database.js';
import { registerUser,loginUser, getUserProfile, updateUserProfile } from './controllers/authenticateController.js';
import protect from './middleware/authMiddleware.js';

dotenv.config();
connectDB();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
// app.use(cookieParser());

app.get('/', (req, res) => {

    res.send('API is running...');
});
app.post('/data', (req, res) => {
    console.log(req.body);
    res.send('API is running...');
});

app.post('/register', registerUser);
app.post('/login', loginUser);
app.post('/updateUserProfile',protect, updateUserProfile);
app.get('/getUserProfile',protect, getUserProfile);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});