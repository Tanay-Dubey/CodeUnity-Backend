require("dotenv").config();
const mongoose = require("mongoose");
const File = require("../models/File");
const { getFilePath } = require("../utils/getFilePath")
const path = require("path")
const fs = require("fs")

const createFile = async (req, res) => {
    const { name, path, projectId } = req.body;
    try {
        // const parentPath = await getFilePath(parentId, "");
        const filePath = path.join(__dirname, `../public/${path}`);
        const newFile = new File({
            name,
            type: "file",
            parentId,
            path: filePath,
            projectId
        });

        const file = newFile.save();
        fs.writeFile(filePath, "", () => {
            console.log("File created successfully");
            res.status(200).json({ result: true, file });
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
    const { fileId, newName, path } = req.body;
    try {
        // const relPath = await getFilePath(fileId, "", async (fileId) => {
        //     const file = await File.findByIdAndDelete(fileId);
        //     return file;
        // });
        const filePath = path.join(__dirname, `../public/${path}`);
        const file = await File.findByIdAndUpdate(fileId, { name: newName, path: filePaht }, { new: false });

        fs.rename(file.path, filePath, (err) => {
            if (err) {
                console.log(err.message)
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
    const { path } = req.body;
    const filePath = path.join(__dirname, `../public/${path}`);
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
    const { path, content } = req.body;
    const filePath = path.join(__dirname, `../public/${path}`);
    try {
        fs.writeFile(filePath, content, (err, data) => {
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