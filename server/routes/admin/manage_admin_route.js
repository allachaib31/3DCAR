const express = require("express");
const { addAdmin, updateAdmin, updatePassword, blockAdmin, deleteAdmin, getAdmins, searchAdmin } = require("../../controllers/admin/manage_admin_controllers");
const { verifyToken } = require("../../middleware/admin/admin");
const Router = express.Router()

//POST METHODS
Router.post("/api/v1.0/admin/addAdmin", verifyToken ,addAdmin);


//DELETE METHODS
Router.delete("/api/v1.0/admin/deleteAdmin", verifyToken,deleteAdmin);

//GET METHODS
Router.get("/api/v1.0/admin/getAdmins", verifyToken,getAdmins);


module.exports = Router;