const jwt = require('jsonwebtoken');
const httpStatus = require('http-status');
const JWTKEY = process.env.JWTKEY;

exports.verifyToken = (req, res, next) => {
    const token = req.header('Authorization');
    console.log(token)
    if (!token) {
        return res.status(httpStatus.UNAUTHORIZED).send({ msg: "Access denied. No token provided." });
    }

    try {
        const decoded = jwt.verify(token, JWTKEY);
        req.admin = decoded;
        next();
    } catch (err) {
        return res.status(httpStatus.FORBIDDEN).send({ msg: "Invalid token." });
    }
};
