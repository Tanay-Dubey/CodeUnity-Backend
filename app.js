const express = require("express");
require("dotenv").config();
const cors = require("cors");
const cookieParser=require("cookie-parser");
const connectDB = require("./db");
const authRouter = require("./routes/authRouter"); 
const projectRouter=require("./routes/projectRouter");
const tokenRouter=require("./routes/tokenRouter");

const app = express();
app.use(express.json());
app.use(express.urlencoded());
app.use(cors());
app.use(cookieParser());

const port = process.env.PORT || 8000;

connectDB();

app.use("/",tokenRouter);
app.use("/auth", authRouter);
app.use("/project",projectRouter);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
})
