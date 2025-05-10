const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../Models/User.js");
require("dotenv").config();

const login = async(req,res)=>{
    const {email, password} = req.body;
    try {
        const existinguser = await User.findOne({email});
        if(!existinguser) return res.json({message:"User not found"});

        const isPasswordcorrect = await bcrypt.compare(password, existinguser.password);
        if(!isPasswordcorrect) return res.json({message: "Incorrect Passoword"});

        const token = jwt.sign({
            email: existinguser.email,
            userId: existinguser._id
        }, process.env.JWT_KEY, {expiresIn:"24h"});

        existinguser.password = undefined;

        console.log("new token", token);
        res.status(201).cookie("token", token, {
            httpOnly: true,
            secure: true, // set to true in production with HTTPS
            sameSite: "None",
            maxAge: 24 * 60 * 60 * 1000
        }).json({ message: "Success", user: existinguser });

    } catch (error) {
        console.log(error);
        res.status(500).json({error: "server error in login"});
    }
}

const register = async(req,res)=>{
    const {fullname,email,password}=req.body;
    // console.log(req.body);

    try {
        const existinguser =await User.findOne({email});
        if(existinguser) return res.json({message:"existing user"});
        
        const hashedPassword = await bcrypt.hash(password, 12);
        const newuser = await User.create({fullname,email,password:hashedPassword});

        const token = jwt.sign({
            email: newuser.email,
            userId: newuser._id
        }, process.env.JWT_KEY, {expiresIn:"24h"});

        newuser.password = undefined;

        console.log("new token", token);
        res.status(201).cookie("token",token,{
            httpOnly:true,
            secure: false,
            sameSite: "Strict",
            maxAge: 24* 60* 60* 1000
       }).json({message:"Success", user:newuser});
        
    } catch (error) {
        console.log(error);
        res.status(500).json({error: "server error in login"});
    }

}


module.exports = {login, register};