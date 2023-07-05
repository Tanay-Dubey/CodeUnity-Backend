const mongoose=require("mongoose");
const Schema=mongoose.Schema;

const collaboratorSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: "User" },
  });

const projectSchema=new Schema({
    name:{type:String},
    admin:{type:Schema.Types.ObjectId,ref:"User"},
    collaborators:[collaboratorSchema]
},{timestamps:true});

const ProjectModel=mongoose.model("Project",projectSchema);
module.exports=ProjectModel;