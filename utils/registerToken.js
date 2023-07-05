const jwt = require("jsonwebtoken");

function getAccessToken(userId)
{
    return jwt.sign({id:userId},process.env.ACCESS_KEY,{expiresIn:"2m"});
}

function getRefreshToken(userId)
{
    return jwt.sign({id:userId},process.env.REFRESH_KEY,{expiresIn:"5m"});
}

module.exports={getAccessToken,getRefreshToken};