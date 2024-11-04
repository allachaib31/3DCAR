const express = require("express");
const { authAdmin, isValidateToken } = require("../../controllers/admin/auth_admin_controllers");
const { verifyToken } = require("../../middleware/admin/admin");
const Router = express.Router();

//POST METHODS
Router.post("/api/v1.0/admin/auth", authAdmin);

//GET METHODS
Router.get("/api/v1.0/admin/isValidateToken", verifyToken, isValidateToken);

module.exports = Router;