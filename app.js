const express = require("express");
require("dotenv").config();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require("./db");
const authRouter = require("./routes/authRouter");
const projectRouter = require("./routes/projectRouter");
const tokenRouter = require("./routes/tokenRouter");
const fileRouter = require("./routes/fileRouter");
const folderRouter = require("./routes/folderRouter");

const app = express();
app.use(express.json());
app.use(express.urlencoded());
app.use(cors({ credentials: true, origin: process.env.ORIGIN_URL }));
app.use(cookieParser());

const port = process.env.PORT || 8000;

connectDB();

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', process.env.ORIGIN_URL);
  next();
});
app.use("/auth", authRouter);
app.use("/", tokenRouter);
app.use("/project", projectRouter);
app.use("/file", fileRouter);
app.use("/folder", folderRouter);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
})
