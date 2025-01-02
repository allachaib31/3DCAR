const express = require("express");
const { isValidateTokenClient, authClient } = require("../../controllers/client/auth_client_controllers");
const { verifyTokenClient } = require("../../middleware/client/client");
const Router = express.Router();


//POST METHODS
Router.post("/api/v1.0/client/auth", authClient);

//GET METHODS
Router.get("/api/v1.0/client/isValidateToken", verifyTokenClient, isValidateTokenClient);

module.exports = Router;