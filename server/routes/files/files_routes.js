const express = require("express");
const { getFile } = require("../../controllers/files/files_controllers");

const Router = express.Router();

//GET METHODS
Router.get("/api/v1.0/file/:id", getFile);

module.exports = Router;