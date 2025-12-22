import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/database.js';
import { registerUser,loginUser, getUserProfile, updateUserProfile, updateProfilePic,deleteProfile } from './controllers/authenticateController.js';
import protect from './middleware/authMiddleware.js';
import upload from './middleware/fileUploadMiddleware.js';
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
app.put('/updateUserProfile',protect, updateUserProfile);
app.get('/getUserProfile',protect, getUserProfile);

app.post('/updateProfilePic',protect, upload.single('profilePic'),updateProfilePic)
app.use('/uploads', express.static('uploads'));

app.delete('/deleteAccount', protect, deleteProfile);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});