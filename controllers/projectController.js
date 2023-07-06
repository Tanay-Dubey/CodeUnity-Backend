require("dotenv").config();
const fs = require("fs");
const Project = require("../models/Project.js");
const File = require("../models/File.js")
const path = require("path");
const multer = require("multer");
const mongoose = require("mongoose");

let upload = multer().single("myfile");

const createProject = async (req, res) => {
    const { name, admin } = req.body;

    const session = await mongoose.startSession();
    (await session).startTransaction();

    try {
        const newProject = new User({
            name,
            admin,
            collaborators:[admin]
        });
        const project = await newProject.save({ session });

        const newFolder = new File({
            name,
            type: "root",
            projectId: project.id
        });
        const folder = await newFolder.save({ session });

        const updatedProject = await Project.findByIdAndUpdate(project.id, { folderId: folder.id }, { new: true }).session(session);

        const uniqueName = `${project.id}-${project.name}`;
        fs.mkdir(path.join(__dirname, `../public/${uniqueName}`), () => {
            console.log("Project created successfully")
            res.status(200).json({ result: true, updatedProject });
        });

        (await session).commitTransaction();
        session.endSession();

        console.log("Transaction commited successfully");
    }
    catch (err) {
        await session.abortTransaction();
        session.endSession();
        res.status(500).json({ result: false, message: err.message });
    }
}

const uploadProject = async (req, res) => {
    upload(req, res, async (err) => {
        console.log(req.file.originalname);
        res.status(200).json({ message: "File delivered" });
    })

}

const getProject = async (req, res) => {
    const { projectId } = req.body;
    try {
        const project = await Project.findById(projectId);
        if (!project) {
            res.status(400).json({ message: "Project Not Found" });
        }
        else {
            res.status(200).json({ result: true, project });
        }
    }
    catch (err) {
        res.status(500).json({ result: false, message: err.message });
    }
}

const renameProject = async (req, res) => {
    const { projectId, newName } = req.body;
    try {
        const oldProject = await Project.findByIdAndUpdate(projectId, { name: newName }, { new: false });
        const oldName = `${oldProject.id}-${oldProject.name}`;
        fs.rename(path.join(__dirname, `..public/${oldName}`, path.join(__dirname, `..public/${oldProject.id}-${newName}`)), () => {
            console.log("Project renamed successfully");

        });
        res.status(200).json({ result: true });
    }
    catch (err) {
        res.status(500).json({ result: false, message: err.message });
    }
}

const deleteProject = async (req, res) => {
    const { projectId } = req.body;
    try {
        const project = await Project.findByIdAndDelete(projectId);
        const projectname = `${project.id}-${project.name}`;
        fs.rmdir(path.join(__dirname, `../public/${projectname}`), () => {
            console.log("Project deleted successfully");
            res.status(200).json({ result: true, message: "Project deleted successfully" });
        });
    }
    catch (err) {
        res.status(500).json({ result: false, message: err.message });
    }
}

const addCollaborators = async (req, res) => {
    const { projectId, collaboratorId } = req.body;
    try {
        const project = await Project.findByIdAndUpdate(projectId, {
            $push: { collaborators: { user: collaboratorId } }
        }, {
            new: true
        });
        res.status(200).json({ result: true, project: project });
    }
    catch (err) {
        res.status(500).json({ result: false, message: err.message });
    }
}

const removeCollaborators = async (req, res) => {
    const { projectId, collaboratorId } = req.body;
    try {
        const project = Project.findByIdAndUpdate(projectId, { $pull: { collaborators: { user: collaboratorId } } },
            { new: true });
        res.status(200).json({ result: true, project: project });
    }
    catch (err) {
        res.status(500).json({ result: false, message: err.message });
    }
}

const fetchProjects=async(req,res)=>{
    const {userId}=req.body;
    try{
        const projects=await Project.find({"collaborators.user":userId});
        res.status(200).json({result:true,projects});
    }
    catch(err)
    {
        res.status(500).json({result:false,message:err.message});
    }
}


module.exports = { createProject, uploadProject, getProject, renameProject, deleteProject, addCollaborators, removeCollaborators,fetchProjects };