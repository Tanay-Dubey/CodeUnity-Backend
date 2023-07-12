const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const projectSchema = new Schema({
  name: { type: String },
  admin: { type: Schema.Types.ObjectId, ref: "User" },
  collaborators: [{ type: Schema.Types.ObjectId, ref: "User" }],
  folderId: { type: Schema.Types.ObjectId, ref: "File" },
  favourite:{type:Boolean,default:false}
}, { timestamps: true });

const ProjectModel = mongoose.model("Project", projectSchema);
module.exports = ProjectModel;