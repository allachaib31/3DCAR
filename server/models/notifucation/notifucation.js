const mongoose = require("mongoose");
const Joi = require("joi");
const { generateNextId } = require("../../utils/generateNextId");

const notificationSchema = new mongoose.Schema({
    receiverId: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: 'receiverModel',
        required: function () {
            return !this.isGlobal;
        }
    },
    receiverModel: {
        type: String,
        enum: ['Admin', 'User'],
        required: function () {
            return !this.isGlobal;
        }
    },
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: 'senderModel',
        required: true
    },
    senderModel: {
        type: String,
        enum: ['Admin', 'User'],
        required: true
    },
    type: {
        type: String,
        enum: ['message', 'alert', 'reminder'],
        required: true
    },
    content: {
        type: String,
        required: true
    },
    isRead: {
        type: Boolean,
        default: false
    },
    isGlobal: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

notificationSchema.pre('save', async function (next) {
    if (this.isNew) {
        this.id = await generateNextId("Notification", "N");
    }
    next();
})

const validateNotification = (notification) => {
    const schema = Joi.object({
        senderId: Joi.string().required(),
        senderModel: Joi.string().valid('Admin', 'User').required(),
        receiverId: Joi.string().when('isGlobal', {
            is: false,
            then: Joi.required(),
            otherwise: Joi.optional()
        }),
        receiverModel: Joi.string().valid('Admin', 'User').when('isGlobal', {
            is: false,
            then: Joi.required(),
            otherwise: Joi.optional()
        }),
        type: Joi.string().valid('message', 'alert', 'reminder').required(),
        content: Joi.string().min(1).max(1000).required(),
        isRead: Joi.boolean().optional(),
        isGlobal: Joi.boolean().optional(), // Whether the notification is global
        createdAt: Joi.date().optional(),
        updatedAt: Joi.date().optional(),
    });

    return schema.validate(notification);
};

module.exports = {
    Notification: mongoose.model('Notification', notificationSchema),
    validateNotification
};
