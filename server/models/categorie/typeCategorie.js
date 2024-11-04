const mongoose = require("mongoose");
const Joi = require("joi");
const { generateNextId } = require("../../utils/generateNextId");

const typeCategorieSchema = new mongoose.Schema({
    id: {
        type: String,
        unique: true,
    },
    nameAr: {
        type: String,
        unique: true,
        required: true,
    },
    nameEn: {
        type: String,
        unique: true,
        required: true,
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
        default: Date.now,
    },
});

// Pre-save hook to set id and ranking
typeCategorieSchema.pre('save', async function (next) {
    if (this.isNew) { // Check if the document is new
        // Generate a new ID using your custom utility function
        this.id = await generateNextId("TypeCategorie", "TC");
    }
    next();
});

const validationTypeCategorie = (TypeCategorie) => {
    const schema = Joi.object({
        id: Joi.string().optional(), // Automatically generated, so optional
        nameAr: Joi.string().required().messages({
            'string.empty': 'The Arabic name is required.'
        }),
        nameEn: Joi.string().required().messages({
            'string.empty': 'The English name is required.'
        }),
        image: Joi.string().optional().allow(null, ""), // Image is optional
        createdBy: Joi.string().optional(), // Admin ID (ObjectId as a string)
        ranking: Joi.number().optional(), // Optional because it's generated automatically
        createdAt: Joi.date().optional(), // Automatically set, so optional
    });

    return schema.validate(TypeCategorie);
};

module.exports = { 
    TypeCategorie: mongoose.model("TypeCategorie", typeCategorieSchema),
    validationTypeCategorie
};
