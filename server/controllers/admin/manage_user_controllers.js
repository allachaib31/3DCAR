const { User, validateUser } = require('../../models/user/user');
const bcrypt = require("bcrypt");
const { File } = require("../../models/file/file");
const { Readable } = require('stream');
const { bucket } = require('../../server');
const httpStatus = require('http-status'); // Importing http-status package
const { saveFile } = require('../../utils/saveFile');
const SALTROUNDS = Number(process.env.SALTROUNDS);

exports.addUser = async (req, res) => {
    const admin = req.admin;
    const { file } = req;
    const {  email, username, name, password, subscriptionExpiryDate  } = req.body;

    try {
        // Validate the User data using Joi
        const { error } = validateUser(req.body);
        if (error) {
            return res.status(httpStatus.BAD_REQUEST).json({
                msg: error.details[0].message
            });
        }
        let newFile
        if (file) {
            newFile = await saveFile(file, File, Readable, bucket);
        }

        // Check if an User with the same email or username already exists
        let existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            return res.status(httpStatus.CONFLICT).json({
                msg: "البريد الإلكتروني أو اسم المستخدم موجود بالفعل"
            });
        }

        // Hash the password using bcrypt
        const hashedPassword = await bcrypt.hash(password, SALTROUNDS);

        // Create a new user
        const newUser = new User({
            email,
            username,
            name,
            password: hashedPassword,
            subscriptionExpiryDate,
            image: newFile ? newFile._id : null,
            createdBy: admin._id
        });

        // Save the user to the database
        await newUser.save();

        // Send response
        return res.status(httpStatus.CREATED).json({
            msg: "تم إنشاء المستخدم بنجاح",
            newUser
        });
    } catch (err) {
        console.log(err)
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            msg: "خطأ في الخادم",
            error: err.message,
        });
    }
};

exports.updateImageUser = async (req, res) => {
    const { file } = req;
    const { userId } = req.body;
    try {
        console.log(userId)
        let newFile
        if (file) {
            newFile = await saveFile(file, File, Readable, bucket);
        }

        // Check if an User with the same email or username already exists
        let existingUser = await User.findById(userId);
        if (!existingUser) {
            return res.status(httpStatus.CONFLICT).json({
                msg: "user not found"
            });
        }
        existingUser.image = newFile._id;
        existingUser.save();

        // Send response
        return res.status(httpStatus.CREATED).json({
            msg: "تم رفع الصورة بنجاح",
        });
    } catch (err) {
        console.log(err)
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            msg: "خطأ في الخادم",
            error: err.message,
        });
    }
}

exports.deleteUser = async (req, res) => {
    const { id } = req.params;

    try {
        const user = await User.findByIdAndDelete(id);
        if (!user) {
            return res.status(httpStatus.NOT_FOUND).send({ msg: "لم يتم العثور على المستخدم" });
        }

        res.status(httpStatus.OK).send({ msg: "تم حذف المستخدم بنجاح" });
    } catch (err) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ msg: "خطأ في حذف المستخدم" });
    }
};


exports.getUsers = async (req, res) => {

    try {
        const users = await User.find().populate("createdBy").select("_id id email username name subscriptionExpiryDate createdBy createdAt");
        res.status(httpStatus.OK).send(users);
    } catch (err) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ msg: "خطأ في جلب المستخدم" });
    }
};
