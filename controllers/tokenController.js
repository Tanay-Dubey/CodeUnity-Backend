require("dotenv").config();
const { verifyAccessToken, verifyRefreshToken } = require("../utils/verifyToken.js");

const checkToken = async (req, res) => {
    // console.log("Reached");
    const accesstoken = req.cookies.accesstoken;
    const refreshtoken = req.cookies.refreshtoken;
    if (!accesstoken) {
        if (!refreshtoken) {
            res.status(400).json({ reauthenticate: true, message: "Reauthenticate" });
        }
        else {
            const refreshResult = verifyRefreshToken(refreshtoken);
            if (refreshResult["result"]) {
                res.cookie("accesstoken", refreshResult.accesstoken,
                    {
                        maxAge: 2 * 60 * 1000
                    });
                // res.status(200).json({ result: true, data: refreshResult.data, message: "Authenticated" });
                next(); 
            }
            else {
                res.status(400).json({ reauthenticate:true, message: "Reauthenticate" });
            }
        }
    }
    else {
        const accessResult = verifyAccessToken(accesstoken);
        if (accessResult["result"]) {
            // res.status(200).json({ result: true, data: accessResult.data });
            next();
        }
        else {
            const refreshResult = verifyRefreshToken(refreshtoken);
            if (refreshResult["result"]) {
                res.cookie("accesstoken", refreshResult.accesstoken,
                    {
                        maxAge: 2 * 60 * 1000
                    });
                // res.status(200).json({ result: true, data: refreshResult.data, message: "Authenticated" });
                next();
            }
        }

    }
}

module.exports={checkToken};