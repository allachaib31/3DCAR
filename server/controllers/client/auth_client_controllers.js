const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const httpStatus = require('http-status');
const { User } = require("../../models/user/user");
const JWTKEY = process.env.JWTKEY;

exports.authClient = async (req, res) => {
    const { email, password } = req.body;

    // Get the user's IP address
    let userIp = req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    console.log(userIp)
    if (userIp === '::1') {
        userIp = '127.0.0.1'; // Normalize IPv6 loopback to IPv4 loopback
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(httpStatus.UNAUTHORIZED).send({ msg: "البريد الإلكتروني أو كلمة المرور غير صحيحة" });
        }

        // Compare passwords
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(httpStatus.UNAUTHORIZED).send({ msg: "البريد الإلكتروني أو كلمة المرور غير صحيحة" });
        }

        // Check if the subscription has expired
        if (user.subscriptionExpiryDate && new Date(user.subscriptionExpiryDate) < new Date()) {
            return res.status(httpStatus.FORBIDDEN).send({ msg: "انتهت صلاحية الاشتراك. يرجى تجديد الاشتراك للاستمرار." });
        }
        if (user.isBlocked) {
            return res.status(httpStatus.FORBIDDEN).send({ msg: "تم ايقاف حسابك يرجى التواصل مع صاحب الموقع." });
        }
        // Save the IP address if it's new
        if (!user.ipAddresses.includes(userIp)) {
            user.ipAddresses.push(userIp);
        }
        user.lastLogin = new Date(); // Update last login timestamp
        await user.save();

        // Generate JWT token
        const token = jwt.sign({ _id: user._id }, JWTKEY, { expiresIn: '24h' });

        // Respond with token
        return res.status(httpStatus.OK).send({
            msg: "لقد قمت بتسجيل الدخول بنجاح.",
            tokenClient: token,
        });

    } catch (err) {
        console.error("Error during login:", err);
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
            msg: "حدث خطأ أثناء معالجة طلبك.",
        });
    }
};


exports.isValidateTokenClient = async (req, res) => {
    console.log(req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress)

    try {
        const user = await User.findById(req.user._id).select("_id email username name subscriptionExpiryDate isBlocked image")
        // Check if the subscription has expired
        if (user.subscriptionExpiryDate && new Date(user.subscriptionExpiryDate) < new Date()) {
            return res.status(httpStatus.FORBIDDEN).send({ msg: "Subscription has expired. Please renew to continue." });
        }
        if (user.isBlocked) {
            return res.status(httpStatus.FORBIDDEN).send({ msg: "تم ايقاف حسابك يرجى التواصل مع صاحب الموقع." });
        }
        return res.status(200).send({
            msg: "لقد قمت بتسجيل الدخول بنجاح.",
            user
        });
    } catch (err) {
        console.log(err)
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
            msg: "حدث خطأ أثناء معالجة طلبك."
        });
    }
}