const express = require("express");
const router = express.Router();
const { getFile, createFile, renameFile, deleteFile } = require("../controllers/fileController.js");

router.get("/getfile", getFile);

router.post("/createfile", createFile);

router.put("/renamefile", renameFile);

router.delete("/deletefile", deleteFile);

router.post("/savefile",saveFile);

module.exports = router;