require("dotenv").config();
const mongoose = require("mongoose");

function connectDB() {
    mongoose.connect(process.env.MONGO_CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true })
        .then(() => {
            console.log("Connected Successfully to Database");
        })
        .catch((err) => {
            console.log("Database Connection Error:", err);
        });
}

module.exports = connectDB;