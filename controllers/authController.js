require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User.js");
const {getAccessToken,getRefreshToken} =require("../utils/registerToken.js")

const registerUser = async (req, res) => {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(req.body.password, salt);
    req.body.password = hash;
    const newUser = new User(req.body);
    const { email } = req.body;

    try {
        const oldUser = await User.findOne({ email });
        if (oldUser) {
            console.log(oldUser);
            res.status(400).json({ message: "Username is already available" });
            return;
        }

        const user = await newUser.save();
        const accesstoken=getAccessToken(user.id);
        const refreshtoken=getRefreshToken(user.id);
        res.cookie("accesstoken",accesstoken,
        {
            httpOnly:true,
            maxAge:2*60*1000
        });
        res.cookie("refreshtoken",refreshtoken,
        {
            httpOnly:true,
            maxAge:5*60*1000
        });
        res.status(200).json({ user });
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const loginUser=async (req,res)=>{
    const {email,password}=req.body;
    
    try{
        const user=await User.findOne({email});
        if(user)
        {
            const validity=await bcrypt.compare(password,user.password);
            if(!validity)
            {
                res.status(400).json({message:"Wrong Password"})
            }
            else
            {
                const accesstoken=getAccessToken(user.id);
                const refreshtoken=getRefreshToken(user.id);
                res.cookie("accesstoken",accesstoken,
                {
                    httpOnly:true,
                    maxAge:2*60*1000
                });
                res.cookie("refreshtoken",refreshtoken,
                {
                    httpOnly:true,
                    maxAge:5*60*1000
                });
                res.status(200).json({user})
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