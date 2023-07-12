require("dotenv").config();
const mongoose = require("mongoose");
const File = require("../models/File");
const { getFilePath } = require("../utils/fileop.js")
const path = require("path")
const fs = require("fs")

const createFile = async (req, res) => {
    const { name, filepath, projectId, parentId } = req.body;
    try {
        // const parentPath = await getFilePath(parentId, "");
        const filePath = path.join(__dirname, `../public/${filepath}`);
        console.log(filePath);
        const newFile = new File({
            name,
            type: "file",
            parentId,
            path: filePath,
            projectId
        });

        const file = await newFile.save();
        fs.writeFile(filePath, "", () => {
            console.log("File created successfully");
            res.status(200).json({ result: true, file: file });
        });
    }
    catch (err) {
        res.status(400).json({ result: false, message: err.message });
    }
}

const deleteFile = async (req, res) => {
    const { fileId } = req.body;
    try {
        const file = await File.findByIdAndDelete(fileId);
        fs.unlink(file.path, (err) => {
            if (err) {
                console.log(err);
            }
            else {
                console.log("File deleted successfully");
                res.status(200).json({ result: true })
            }
        });
    }
    catch (err) {
        res.status(400).json({ result: false, message: err.message });
    }
}

const renameFile = async (req, res) => {
    const { fileId, newName, filepath } = req.body;
    try {
        const filePath = path.join(__dirname, `../public/${filepath}`);
        const file = await File.findByIdAndUpdate(fileId, { name: newName, path: filepath }, { new: false });

        fs.rename(path.join(__dirname,`../public/${file.path}`), filePath, (err) => {
            if (err) {
                console.log(err.message);
            }
            else
                console.log("File Renamed successfully");
            res.status(200).json({ result: true })
        })
    }
    catch (err) {
        res.status(400).json({ result: false, message: err.message })
    }
}

const getFile = async (req, res) => {
    const { filepath } = req.body;
    const filePath = path.join(__dirname, `../public/${filepath}`);
    try {
        fs.readFile(filePath, "utf-8", (err, data) => {
            if (err) {
                console.log(err);
            }
            else {
                console.log(data);
                res.status(200).json({ result: true, data });
            }
        })
    }
    catch (err) {
        res.status(400).json({ result: false, message: err.message });
    }
}

const saveFile = async (req, res) => {
    const { filepath, content } = req.body;
    const filePath = path.join(__dirname, `../public/${filepath}`);
    try {
        fs.writeFile(filePath, content, (err) => {
            if (err) {
                console.log(err);
            }
            else {
                console.log("File Saved Successfully");
                res.status(200).json({ result: true });
            }
        })
    }
    catch (err) {
        res.status(400).json({ result: false, message: err.message });
    }
}

module.exports = { createFile, deleteFile, renameFile, getFile, saveFile };