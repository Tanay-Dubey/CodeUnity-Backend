require("dotenv").config();
const mongoose = require("mongoose");
const File = require("../models/File");
const { getFilePath, deleteFolder } = require("../utils/fileop")
const path = require("path")
const fs = require("fs")

const createFolder = async (req, res) => {
    const { name, path, projectId } = req.body;
    try {
        // const parentPath = await getFilePath(parentId, "");
        const folderPath = path.join(__dirname, `../public/${path}`);
        const newFile = new File({
            name,
            type: "folder",
            parentId,
            path: folderPath,
            projectId
        });

        const folder = newFile.save();
        fs.mkdir(folderPath, (err) => {
            if (err) {
                console.log(err);
            }
            else {
                console.log("Folder Created Successfully");
                res.status(200).json({ result: true, folder });
            }
        })
    }
    catch (err) {
        res.status(400).json({ result: false, message: err.message });
    }
}

const deleteFolder = async (req, res) => {
    const { folderId, path } = req.body;
    const session = mongoose.startSession();
    (await session).startTransaction();
    try {
        deleteFolder(folderId, session);
        const folderPath = path.join(__dirname, `../public/${path}`);
        fs.rmdir(folderPath, { recursive: true, force: true }, (err) => {
            if (err) {
                console.log(err);
            }
            else {
                console.log("Folder deleted successfully");
                res.status(200).json({ result: true });
            }
        })
            (await session).commitTransaction();
        (await session).endSession();
    }
    catch (err) {
        await session.abortTransaction();
        session.endSession();
        res.status(400).json({ result: false, message: err.message });
    }
}

const renameFolder = async (req, res) => {
    const { folderId, newName, path } = req.body;
    try {
        // const relPath = await getFilePath(fileId, "", async (fileId) => {
        //     const file = await File.findByIdAndDelete(fileId);
        //     return file;
        // });
        const folderPath = path.join(__dirname, `../public/${path}`);
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
    const { folderId, path } = req.body;
    const folderPath = path.join(__dirname, `../public/${path}`);
    try {
        const docs = await File.find({ parentId: folderId });
        res.status(200).json({ result: true, docs });
    }
    catch (err) {
        res.status(400).json({ result: false, message: err.message });
    }
}


module.exports = { createFolder, deleteFolder, renameFolder, getFolder };