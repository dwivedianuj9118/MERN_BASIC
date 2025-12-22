import path from 'path';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

const jwtTokenGenerator = (user) => {
    return jwt.sign({...user}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });
}

export const registerUser = async (req,res) =>{
    const {name, email, password} = req.body;
    try{
        const existingUser = await User.findOne({email});
        if(existingUser){
            return  res.status(400).json({message: 'User already exists'});
        }
        const newUser = new User({name, email, password});
        await newUser.save();
        res.status(201).json({message: 'User registered successfully',data: await User.findOne({email})});
    }catch(error){
        res.status(500).json({message: error.message});
    }
}
export const loginUser = async (req,res) =>{
    const {email, password} = req.body;
    try{
        const user = await User.findOne({email}).select('+password');

        if(!(user && (await user.matchPassword(password)))){
            return res.status(400).json({message: 'Invalid email or password'});
        }else{
            const token = jwtTokenGenerator({id: user._id, name: user.name, email: user.email});

            return res.status(200).json({message: 'Login successful',token: token});    
        }
        
    }
    catch(error){
        res.status(500).json({message: error.message});
    }
}

export const getUserProfile = async (req,res) =>{  

    try{
        const user = await User.findById(req.user._id).select('-password');
        if(!user){
            return res.status(404).json({message: 'User not found'});
        }
        res.status(200).json({message:'User Profile Data',data: user});
    }catch(error){
        res.status(500).json({message: error.message});
    }
 }
 export const updateUserProfile = async (req,res) =>{  
    try{
        const user = await User.findById(req.user._id);
        if(!user){
            return res.status(404).json({message: 'User not found'});
        }
        const {name, email, bio} = req.body;
        
        // let userData = mongoose.model('User');
        // var thing = new userData({ name: name, email: email, bio: bio });
        // thing.save(); 
        const thing = await User.findByIdAndUpdate(req.user._id, {name, email, bio}, {new: true});
    
        res.status(200).json({message:'User Profile Updated',data: thing});
    }catch(error){
        res.status(500).json({message: error.message});
    }
 }  
export const updateProfilePic = async (req,res) =>{  
    console.log(req.file);
    try{
        if(!req.file){
            return res.status(400).json({message: 'No file uploaded'});
        }
        const picPath = `uploads/${req.file.filename}`;
        const user = await User.findById(req.user._id);
        if(!user){
            return res.status(404).json({message: 'User not found'});
        }
        const updateImage  = await User.findByIdAndUpdate(req.user._id, {profilePic: picPath}, {new: true});
        
        res.status(200).json({message:'User Profile Updated',data: updateImage});
    }catch(error){
        res.status(500).json({message: error.message});
    }
 } 
export const deleteProfile = async (req,res) =>{  
    try{
        const user = await User.findById(req.user._id);
        if(!user){
            return res.status(404).json({message: 'User not found'});
        }
        const data  = await User.deleteOne(req.user._id);

        res.status(200).json({message:'User Profile Deleted',data: data});
    }catch(error){
        res.status(500).json({message: error.message});
    }
 } 
