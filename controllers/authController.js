require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User.js");

const registerUser = async (req, res) => {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(req.body.password, salt);
    req.body.password = hash;
    const newUser = new User(req.body);
    const { username } = req.body;

    try {
        const oldUser = await User.findOne({ username });
        if (oldUser) {
            res.status(400).json({ message: "Username is already available" });
        }

        const user = await newUser.save();
        const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_KEY, { expiresIn: "1h" });
        res.status(200).json({ user, token });
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const loginUser=async (req,res)=>{
    const {username,password}=req.body;
    
    try{
        const user=await User.findOne({username});
        if(user)
        {
            const validity=await bcrypt.compare(password,user.password);
            if(!validity)
            {
                res.status(400).json({message:"Wrong Password"})
            }
            else
            {
                const token=jwt.sign({id:user.id,username:user.username},process.env.JWT_KEY,{
                expiresIn:"1h"})
                res.status(200).json({user,token})
            }
        }
        else{
            res.status(404).json({message:"User does not exists"});
        }
    }
    catch(err)
    {
        res.status(500).json({message:err.message});
    }
}

module.exports={registerUser,loginUser};