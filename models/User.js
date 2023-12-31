const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    projects:[{type:Schema.Types.ObjectId,ref:"Project"}]
}, { timestamps: true });

const UserModel = mongoose.model("User", userSchema);
module.exports = UserModel;