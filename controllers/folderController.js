require("dotenv").config();
const mongoose = require("mongoose");
const File = require("../models/File");
const { getFilePath, deleteFolderTree } = require("../utils/fileop")
const path = require("path")
const fs = require("fs")

const createFolder = async (req, res) => {
    const { name, folderpath, projectId, parentId } = req.body;
    try {
        // const parentPath = await getFilePath(parentId, "");
        const folderPath = path.join(__dirname, `../public/${folderpath}`);
        const newFile = new File({
            name,
            type: "folder",
            parentId,
            path: folderPath,
            projectId
        });

        const folder = await newFile.save();
        fs.mkdir(folderPath, (err) => {
            console.log("Folder Created Successfully");
            res.status(200).json({ result: true, folder });
        })
    }
    catch (err) {
        res.status(400).json({ result: false, message: err.message });
    }
}

const deleteFolder = async (req, res) => {
    const { folderId, folderpath } = req.body;
    try {
        await deleteFolderTree(folderId);
        const folderPath = path.join(__dirname, `../public/${folderpath}`);
        fs.rmdir(folderPath, { recursive: true, force: true }, (err) => {
            if (err) {
                console.log(err);
            }
            else {
                console.log("Folder deleted successfully");
                res.status(200).json({ result: true });
            }
        })
    }
    catch (err) {
        res.status(400).json({ result: false, message: err.message });
    }
}

const renameFolder = async (req, res) => {
    const { folderId, newName, folderpath } = req.body;
    try {
        // const relPath = await getFilePath(fileId, "", async (fileId) => {
        //     const file = await File.findByIdAndDelete(fileId);
        //     return file;
        // });
        const folderPath = path.join(__dirname, `../public/${folderpath}`);
        const folder = await File.findByIdAndUpdate(folderId, { name: newName, path: folderPath }, { new: false });

        fs.rename(folder.path, folderPath, (err) => {
            if (err) {
                console.log(err.message)
            }
            else
                console.log("Folder Renamed successfully");
            res.status(200).json({ result: true })
        })
    }
    catch (err) {
        res.status(400).json({ result: false, message: err.message })
    }
}

const getFolder = async (req, res) => {
    const { folderId, folderpath } = req.body;
    // const folderPath = path.join(__dirname, `../public/${folderpath}`);
    try {
        const docs = await File.find({ parentId: folderId });
        res.status(200).json({ result: true, docs });
    }
    catch (err) {
        res.status(400).json({ result: false, message: err.message });
    }
}


module.exports = { createFolder, deleteFolder, renameFolder, getFolder };