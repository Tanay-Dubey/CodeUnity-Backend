const express = require("express");
const router = express.Router();
const { createProject, uploadProject,getProject,renameProject,deleteProject,addCollaborators,removeCollaborators } = require("../controllers/projectController.js");

router.post("/createproject", createProject);

router.post("/uploadproject", uploadProject);

router.get("/getproject",getProject);

router.put("/renameproject",renameProject);

router.delete("/deleteproject",deleteProject);

router.put("/addcollab",addCollaborators);

router.delete("/removecollab",removeCollaborators); 

module.exports = router;