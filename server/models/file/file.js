const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema({
    filename: String,
    contentType: String,
    length: Number,
    id: mongoose.Schema.Types.ObjectId
})

module.exports = {
    File: mongoose.model('File', fileSchema)
}