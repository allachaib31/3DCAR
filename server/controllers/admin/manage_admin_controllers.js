const { Admin, validateAdmin } = require('../../models/admin/admin');
const bcrypt = require("bcrypt");
const httpStatus = require('http-status'); // Importing http-status package
const SALTROUNDS = Number(process.env.SALTROUNDS);

exports.addAdmin = async (req, res) => {
    const admin = req.admin;
    const { email, username, name, password } = req.body;

    try {
        // Validate the admin data using Joi
        const { error } = validateAdmin(req.body);
        if (error) {
            return res.status(httpStatus.BAD_REQUEST).json({
                msg: error.details[0].message
            });
        }

        // Check if an admin with the same email or username already exists
        let existingAdmin = await Admin.findOne({ $or: [{ email }, { username }] });
        if (existingAdmin) {
            return res.status(httpStatus.CONFLICT).json({
                msg: "Email or username already exists"
            });
        }

        // Hash the password using bcrypt
        const hashedPassword = await bcrypt.hash(password, SALTROUNDS);

        // Create a new Admin
        const newAdmin = new Admin({
            email,
            username,
            name,
            password: hashedPassword,
            createdBy: admin._id
        });

        // Save the admin to the database
        await newAdmin.save();
        // Send response
        return res.status(httpStatus.CREATED).json({
            msg: "The administrator was created successfully.",
            newAdmin
        });
    } catch (err) {
        console.error(err);
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            msg: "Server error",
            error: err.message,
        });
    }
};


exports.deleteAdmin = async (req, res) => {
    const { id } = req.params;
    const loggedInAdminId = req.admin._id;

    try {
        if (id === loggedInAdminId) {
            return res.status(httpStatus.FORBIDDEN).send({ msg: "لا يمكنك حذف نفسك" });
        }

        const admin = await Admin.findByIdAndDelete(id);
        if (!admin) {
            return res.status(httpStatus.NOT_FOUND).send({ msg: "لم يتم العثور على المسؤول" });
        }

        res.status(httpStatus.OK).send({ msg: "تم حذف المسؤول بنجاح" });
    } catch (err) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ msg: "خطأ في حذف المسؤول" });
    }
};


exports.getAdmins = async (req, res) => {
    const { _id } = req.admin;
    try {
        const admins = await Admin.find().populate("createdBy").select("_id id email username name createdBy createdAt");
        res.status(httpStatus.OK).send(admins);
    } catch (err) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ msg: "خطأ في جلب المسؤولين" });
    }
};
