const express = require("express");
const { addAdmin, deleteAdmin, getAdmins, renewSubscription } = require("../../controllers/admin/manage_admin_controllers");
const { verifyToken } = require("../../middleware/admin/admin");
const Router = express.Router()

//POST METHODS
Router.post("/api/v1.0/admin/addAdmin", verifyToken ,addAdmin);

//PATCH METHODS
Router.patch("/api/v1.0/admin/renewSubscription", verifyToken, renewSubscription)
//DELETE METHODS
Router.delete("/api/v1.0/admin/deleteAdmin/:id", verifyToken,deleteAdmin);

//GET METHODS
Router.get("/api/v1.0/admin/getAdmins", verifyToken,getAdmins);


module.exports = Router;