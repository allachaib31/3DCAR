const escapeHtml = require("escape-html");

const escapeIfString = (value) => {
    if (typeof value === 'string') {
        return escapeHtml(value);
    } else if (value !== null && typeof value === 'object') {
        return escapeHtmlRecursively(value);
    } else {
        return value;
    }
};

const escapeHtmlRecursively = (obj) => {
    if (Array.isArray(obj)) {
        return obj.map(item => escapeIfString(item));
    } else if (obj !== null && typeof obj === 'object') {
        const escapedObj = {};
        for (const key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
                escapedObj[key] = escapeIfString(obj[key]);
            }
        }
        return escapedObj;
    }
    return obj;
};

const escapeHtmlMiddleware = async (req, res, next) => {
    // Escape HTML in query parameters
    if (req.query) {
        req.query = escapeHtmlRecursively(req.query);
    }

    // Escape HTML in request body parameters
    if (req.body) {
        req.body = escapeHtmlRecursively(req.body);
    }

    // Escape HTML in request params
    if (req.params) {
        req.params = escapeHtmlRecursively(req.params);
    }

    // Escape HTML in cookies
    if (req.cookies) {
        req.cookies = escapeHtmlRecursively(req.cookies);
    }

    // Escape HTML in request headers
    if (req.headers) {
        req.headers = escapeHtmlRecursively(req.headers);
    }

    next();
};

module.exports = escapeHtmlMiddleware;
