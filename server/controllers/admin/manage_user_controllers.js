const { User, validateUser } = require('../../models/user/user');
const bcrypt = require("bcrypt");
const httpStatus = require('http-status'); // Importing http-status package
const SALTROUNDS = Number(process.env.SALTROUNDS);

exports.addUser = async (req, res) => {
    const admin = req.admin;
    const {  email, username, name, password, subscriptionExpiryDate  } = req.body;

    try {
        // Validate the User data using Joi
        const { error } = validateUser(req.body);
        if (error) {
            return res.status(httpStatus.BAD_REQUEST).json({
                msg: error.details[0].message
            });
        }

        // Check if an User with the same email or username already exists
        let existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            return res.status(httpStatus.CONFLICT).json({
                msg: "Email or username already exists"
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
