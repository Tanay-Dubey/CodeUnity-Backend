const express=require("express");
const router=express.Router();
const {checkToken}=require("../controllers/tokenController.js");

router.get("/",checkToken)

module.exports=router;
