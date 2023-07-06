const express = require("express");
const router = express.Router();
const { getFolder, createFolder, renameFolder, deleteFolder } = require("../controllers/folderController.js");

router.get("/getfolder", getFolder);

router.post("/createfolder", createFolder);

router.put("/renamefolder", renameFolder);

router.delete("/deletefolder", deleteFolder);

router.post("/savefolder",saveFolder);

module.exports = router;