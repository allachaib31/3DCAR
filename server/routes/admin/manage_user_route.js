const express = require("express");
const multer = require("multer");
const { addUser, changeStatus, deleteUser, getUsers, searchUser, updateImageUser, updateUserBlocked } = require("../../controllers/admin/manage_user_controllers");
const { verifyToken } = require("../../middleware/admin/admin");
const Router = express.Router();

const  storage = multer.memoryStorage();
const upload  =  multer({storage});

//POST METHODS
Router.post("/api/v1.0/admin/addUser", verifyToken, upload.single("image"),addUser);

//PATCH METHDOS
Router.patch("/api/v1.0/admin/updateImageUser", upload.single("image"), updateImageUser)
Router.patch("/api/v1.0/admin/updateUserBlocked", verifyToken, updateUserBlocked)

//DELETE METHODS
Router.delete("/api/v1.0/admin/deleteUser/:id", verifyToken,deleteUser);

//GET METHODS
Router.get("/api/v1.0/admin/getUsers", verifyToken,getUsers);


module.exports = Router;