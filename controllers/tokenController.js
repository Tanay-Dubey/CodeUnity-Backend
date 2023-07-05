require("dotenv").config();
const { verifyAccessToken, verifyRefreshToken } = require("../utils/verifyToken.js");

const checkToken = async (req, res) => {
    const accesstoken = req.cookies.accesstoken;
    const refreshtoken = req.cookies.refreshtoken;
    if (!accesstoken) {
        if (!refreshtoken) {
            res.status(400).json({ result: false, message: "Reauthenticate" });
        }
        else {
            const refreshResult = verifyRefreshToken(refreshtoken);
            if (refreshResult["result"]) {
                res.cookie("accesstoken", refreshResult.accesstoken,
                    {
                        httpOnly: true,
                        maxAge: 2 * 60 * 1000
                    });
                res.status(200).json({ result: true, data: refreshResult.data, message: "Authenticated" });
            }
            else {
                res.status(400).json({ result: false, message: "Reauthenticate" });
            }
        }
    }
    else {
        const accessResult = verifyAccessToken(accesstoken);
        if (accessResult["result"]) {
            res.status(200).json({ result: true, data: accessResult.data });
        }
        else {
            const refreshResult = verifyRefreshToken(refreshtoken);
            if (refreshResult["result"]) {
                res.cookie("accesstoken", refreshResult.accesstoken,
                    {
                        httpOnly: true,
                        maxAge: 2 * 60 * 1000
                    });
                res.status(200).json({ result: true, data: refreshResult.data, message: "Authenticated" });
            }
        }

    }
}

module.exports={checkToken};