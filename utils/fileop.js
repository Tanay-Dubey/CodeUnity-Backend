const File = require("../models/File");
const mongoose = require("mongoose");

async function getFilePath(fileId, filepath) {
    const file = await File.findById(fileId);
    if (file.type === "root") {
        filepath = `/${file._idid}-${file.name}/${filepath}`;
        return filepath;
    }
    filepath = `/${file.name}/${filepath}`;
    return getFilePath(file.parentId, filepath);
}

async function deleteFolderTree(folderId) {
    const folder = await File.findByIdAndDelete(folderId);
    console.log(folder);
    const docs=await File.find({parentId:folder.id});
    console.log(docs);
    if(!docs)
        return;
    docs.map((doc)=>{
        deleteFolderTree(doc._id);
    })
}

module.exports = { getFilePath,deleteFolderTree };