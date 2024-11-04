const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const httpStatus = require('http-status');
const { User } = require("../../models/user/user");
const JWTKEY = process.env.JWTKEY;

exports.authClient = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(httpStatus.UNAUTHORIZED).send({ msg: "Incorrect email or password" });
        }

        // Compare passwords
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(httpStatus.UNAUTHORIZED).send({ msg: "Incorrect email or password" });
        }

        // Check if the subscription has expired
        if (user.subscriptionExpiryDate && new Date(user.subscriptionExpiryDate) < new Date()) {
            return res.status(httpStatus.FORBIDDEN).send({ msg: "Subscription has expired. Please renew to continue." });
        }

        // Generate JWT token
        const token = jwt.sign({ _id: user._id }, JWTKEY, { expiresIn: '24h' });

        // Respond with token
        return res.status(httpStatus.OK).send({
            msg: "You have successfully logged in.",
            tokenClient: token
        });

    } catch (err) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
            msg: "An error occurred while processing your request."
        });
    }
};

exports.isValidateTokenClient = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select("_id email username name subscriptionExpiryDate")
        // Check if the subscription has expired
        if (user.subscriptionExpiryDate && new Date(user.subscriptionExpiryDate) < new Date()) {
            return res.status(httpStatus.FORBIDDEN).send({ msg: "Subscription has expired. Please renew to continue." });
        }
        return res.status(200).send({
            msg: "You have successfully logged in.",
            user
        });
    } catch (err) {
        console.log(err)
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
            msg: "An error occurred while processing your request."
        });
    }
}