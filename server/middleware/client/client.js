const jwt = require('jsonwebtoken');
const httpStatus = require('http-status');
const JWTKEY = process.env.JWTKEY;

exports.verifyTokenClient = (req, res, next) => {
    const token = req.header('AuthorizationClient');
    console.log(token)
    if (!token) {
        return res.status(httpStatus.UNAUTHORIZED).send({ msg: "Access denied. No token provided." });
    }

    try {
        const decoded = jwt.verify(token, JWTKEY);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(httpStatus.FORBIDDEN).send({ msg: "Invalid token." });
    }
};
