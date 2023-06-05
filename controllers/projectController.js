require("dotenv").config();
const fs = require("fs");
const Project = require("../models/Project.js");
const path = require("path");
const AdmZip = require('adm-zip');
const multer = require("multer");

let upload = multer().single("myfile");

const createProject = async (req, res) => {
    const newProject = new Project(req.body);
    const { name } = req.body;
    try {
        const project = await newProject.save();
        const uniqueName = `${project.id}-${project.name}`;
        fs.mkdir(path.join(__dirname, `../public/${uniqueName}`), () => {
            console.log("Project created successfully")
            res.status(200).json({ project });
        });
    }
    catch (err) {
        res.status(500).json({ message: err.message });
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
            res.status(200).json({ project });
        }
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
}

const renameProject = async (req, res) => {
    const { projectId, newName } = req.body;
    try {
        const project = await Project.findByIdAndUpdate(projectId, { name: newName }, { new: true });
        res.status(200).json({ project });
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
}

const deleteProject = async (req, res) => {
    const { projectId } = req.body;
    try {
        const project = await Project.findByIdAndDelete(projectId);
        const projectname = `${project.id}-${project.name}`;
        fs.rmdir(path.join(__dirname, `../public/${projectname}`), () => {
            console.log("Project deleted successfully");
            res.status(200).json({ message: "Project deleted successfully" });
        });
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
}


module.exports = { createProject, uploadProject, getProject, renameProject, deleteProject };