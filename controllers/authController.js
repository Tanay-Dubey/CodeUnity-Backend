require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User.js");
const {getAccessToken,getRefreshToken} =require("../utils/registerToken.js")

const registerUser = async (req, res) => {
    // console.log(req.body);
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(req.body.password, salt);
    req.body.password = hash;
    const newUser = new User(req.body);
    const { email } = req.body;

    try {
        const oldUser = await User.findOne({ email });
        if (oldUser) {
            console.log(oldUser);
            res.status(400).json({result:false, message: "Username is already available" });
            return;
        }

        const user = await newUser.save();
        const accesstoken=getAccessToken(user.id);
        const refreshtoken=getRefreshToken(user.id);
        res.setHeader("Set-Cookie","test=true");
        res.cookie("accesstoken",accesstoken,
        {
            httpOnly:false,
            maxAge:2*60*1000
        });
        res.cookie("refreshtoken",refreshtoken,
        {
            httpOnly:false,
            maxAge:5*60*1000
        });
        res.status(200).json({result:true, user });
    }
    catch (err) {
        res.status(500).json({result:false, message: err.message });
    }
    res.send();
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
                res.status(400).json({result:false,message:"Incorrect Password"})
            }
            else
            {
                const accesstoken=getAccessToken(user.id);
                const refreshtoken=getRefreshToken(user.id);
                res.cookie("accesstoken",accesstoken,
                {
                    maxAge:2*60*1000
                });
                res.cookie("refreshtoken",refreshtoken,
                {
                    maxAge:5*60*1000
                });
                res.status(200).json({result:true,user})
            }
        }
        else{
            res.status(404).json({result:false,message:"Email does not exists"});
        }
    }
    catch(err)
    {
        res.status(500).json({result:false,message:err.message  });
    }
    res.send();
}

module.exports={registerUser,loginUser};