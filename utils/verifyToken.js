const jwt = require("jsonwebtoken");
const { getAccessToken } = require("../utils/registerToken");

function verifyAccessToken(token) {
    jwt.verify(token, process.env.ACCESS_KEY, (err, data) => {
        if (err) {
            return { "result": false };
        }
        else {
            return { "result": true, "data": data };
        }
    });
}

function verifyRefreshToken(token) {
    jwt.verify(token, process.env.REFRESH_KEY, (err, data) => {
        if (err) {
            return { "result": false, "message": "Reauthenticate" };
        }
        else {
            const accesstoken = getAccessToken(data.id);
            return { "result": true, "accesstoken": accesstoken, "data": data };
        }
    });
}

module.exports = { verifyAccessToken, verifyRefreshToken };
