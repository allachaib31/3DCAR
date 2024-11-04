const mongoose = require("mongoose");
const Joi = require("joi");
const { generateNextId } = require("../../utils/generateNextId");

// Define the schema for the Categorie model
const categorieSchema = new mongoose.Schema({
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
    items: {
        type: Array,
    },
    image: {
        type: mongoose.Schema.Types.ObjectId,
    },
    type: {
        type: String,
        required: true
    },
    ranking: {
        type: Number,
        unique: true,
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
categorieSchema.pre('save', async function (next) {
    if (this.isNew) { // Check if the document is new
        // Generate a new ID using your custom utility function
        this.id = await generateNextId("Categorie", "C");

        // Find the document with the highest ranking
        const lastCategory = await mongoose.model('Categorie').findOne().sort('-ranking').exec();
        
        // Set the ranking as the last one + 1 or 1 if it's the first document
        this.ranking = lastCategory ? lastCategory.ranking + 1 : 1;
    }
    next();
});

// Create a validation schema using Joi
const validationCategorie = (categorie) => {
    const schema = Joi.object({
        id: Joi.string().optional(), // Automatically generated, so optional
        nameAr: Joi.string().required().messages({
            'string.empty': 'The Arabic name is required.'
        }),
        nameEn: Joi.string().required().messages({
            'string.empty': 'The English name is required.'
        }),
        items: Joi.array().optional().allow(null),
        image: Joi.string().optional().allow(null, ""), // Image is optional
        type: Joi.string().required(),
        createdBy: Joi.string().optional(), // Admin ID (ObjectId as a string)
        ranking: Joi.number().optional(), // Optional because it's generated automatically
        createdAt: Joi.date().optional(), // Automatically set, so optional
    });

    return schema.validate(categorie);
};


module.exports = { 
    Categorie: mongoose.model("Categorie", categorieSchema),
    validationCategorie
};
