import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/database.js';
import { registerUser } from './controllers/authenticateController.js';

dotenv.config();
connectDB();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {

    res.send('API is running...');
});
app.post('/data', (req, res) => {
    console.log(req.body);
    res.send('API is running...');
});

app.post('/register', registerUser);


app.post('/login', (req, res) => {
    // Login logic here
    res.send('User logged in');
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});