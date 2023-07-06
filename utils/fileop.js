const File = require("../models/File");
const mongoose = require("mongoose");

async function getFilePath(fileId, filepath) {
    const file = await File.findById(fileId);
    if (file.type === "root") {
        filepath = `/${file.id}-${file.name}/${filepath}`;
        return filepath;
    }
    filepath = `/${file.name}/${filepath}`;
    return getFilePath(file.parentId, filepath);
}

async function deleteFolder(folderId, session) {
    let children = [];
    const folder = await File.findByIdAndDelete(folderId).session(session);
    const docs=await File.findById(folder.id);
    if(docs.length===0)
        return;
    docs.map((doc)=>{
        deleteFolder(doc.id,sesion);
    })
}

module.exports = { getFilePath,deleteFolder };