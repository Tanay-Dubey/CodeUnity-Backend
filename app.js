const express = require("express");
require("dotenv").config();
const cors = require("cors");
const connectDB = require("./db");
const authRouter = require("./routes/authRouter"); 
const projectRouter=require("./routes/projectRouter");

const app = express();
app.use(express.json());
app.use(express.urlencoded());
app.use(cors());

const port = process.env.PORT || 8000;

connectDB();

app.use("/auth", authRouter);
app.use("/project",projectRouter);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
})
