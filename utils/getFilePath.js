const File = require("../models/File");

async function getFilePath(fileId, filepath) {
    const file = await File.findById(fileId);
    if (file.type === "root") {
        filepath = `/${file.id}-${file.name}/${filepath}`;
        return filepath;
    }
    filepath = `/${file.name}/${filepath}`;
    return getFilePath(file.parentId, filepath);
}

module.exports = { getFilePath };