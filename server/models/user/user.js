const mongoose = require("mongoose");
const Joi = require("joi");
const { generateNextId } = require("../../utils/generateNextId");

const userSchema = new mongoose.Schema({
    id: {
        type: String,
        unique: true,
    },
    email: {
        type: String,
        unique: true,
        required: true,
    },
    username: {
        type: String,
        unique: true,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    lastLogin: {
        type: Date,
    },
    subscriptionExpiryDate: {
        type: Date,
        required: true
    },
    image: {
        type: mongoose.Schema.Types.ObjectId,
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admin',
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    },
});

userSchema.pre('save', async function (next) {
    if (this.isNew) { // Check if the document is new
        this.id = await generateNextId("User", "U");
    }
    next();
});

const validateUser = (user) => {
    const schema = Joi.object({
        id: Joi.string().optional(),
        email: Joi.string().email().max(255).required(),
        username: Joi.string().min(3).max(255).required(),
        name: Joi.string().min(2).max(255).required(),
        password: Joi.string().min(6).max(255).required(),
        subscriptionExpiryDate: Joi.date().required(),
        image: Joi.string().optional().allow(null, ""),
        createdBy: Joi.string().optional(),
        createdAt: Joi.date().optional(),
    });

    return schema.validate(user);
};

module.exports = {
    User: mongoose.model('User', userSchema),
    validateUser,
};