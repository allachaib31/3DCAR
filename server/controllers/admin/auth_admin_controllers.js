const { Admin, validateAdmin } = require('../../models/admin/admin');
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const httpStatus = require('http-status');
const nodemailer = require('nodemailer');
const ejs = require('ejs');
const path = require('path');
const JWTKEY = process.env.JWTKEY;
const SALTROUNDS = Number(process.env.SALTROUNDS);

exports.authAdmin = async (req, res) => {
    const { email, password } = req.body;

    try {

        // Find admin by email
        const admin = await Admin.findOne({ email });
        if (!admin) {
            return res.status(httpStatus.UNAUTHORIZED).send({ msg: "Incorrect email or password" });
        }

        // Compare passwords
        const validPassword = await bcrypt.compare(password, admin.password);
        if (!validPassword) {
            return res.status(httpStatus.UNAUTHORIZED).send({ msg: "Incorrect email or password" });
        }

        // Generate JWT token
        const token = jwt.sign({ _id: admin._id }, JWTKEY, { expiresIn: '24h' });
        admin.lastLogin = new Date();
        await admin.save();
        // Respond with token
        return res.status(httpStatus.OK).send({
            msg: "You have successfully logged in.",
            token
        });

    } catch (err) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
            msg: "An error occurred while processing your request."
        });
    }
};


exports.isValidateToken = async (req, res) => {
    try {
        const admin = await Admin.findById(req.admin._id).select("_id email username name")
        return res.status(200).send({
            msg:"You have successfully logged in.",
            admin
        });
    } catch (err) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
            msg: "An error occurred while processing your request."
        });
    }
}