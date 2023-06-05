const mongoose=require("mongoose");
const Schema=mongoose.Schema;

const FileSchema=new Schema({
    name:{type:String},
    type:{type:String,enum:["file","folder"]},
    parent:{type:Schema.Types.ObjectId},
    path:{type:String},
    projectId:{type:Schema.Types.ObjectId,ref:"Project"}
},{timestamps:true});

const FileModel=mongoose.model("File",FileSchema);
module.exports=FileModel;