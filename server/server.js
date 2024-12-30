require("custom-env").env();
const express = require('express');  // Import both the server and the app instance
const app = express();
const connectDB = require('./config/db');
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const { rateLimit } = require("express-rate-limit");
const mongoose = require("mongoose");
const path = require('path');
const helmet = require("helmet");
const escape = require('./middleware/escape');
const compression = require("compression");

const PORT = process.env.PORT;

// MongoDB Connection
connectDB();

const conn = mongoose.connection;
conn.once('open', () => {
    let bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db);
    module.exports.bucket = bucket;

    const limiter = rateLimit({
        windowMs: 15 * 60 * 1000,
        max: 5000,
        message: "Too many requests from this IP, please try again later.",
        statusCode: 429,
        headers: true
    });

    app
        .use(express.json({ limit: '50mb' }))
        .use(express.urlencoded({ limit: '50mb', extended: true }))
        app.use(compression({ filter: () => false }))
        //.use(helmet())
        .disable("x-powered-by")
        .use(cors({
            origin: process.env.URL,
            credentials: true
        }))
        .use(limiter)
        .use(cookieParser())
        .use(morgan(process.env.MODE))
        .use(escape);

    // Import routes
    const authAdminRoute = require("./routes/admin/auth_admin_routes");
    const manageAdminRoute = require("./routes/admin/manage_admin_route");
    const manageUserRoute = require("./routes/admin/manage_user_route");
    const authClientRoute = require("./routes/client/auth_client_routes");
    app
        .use(authAdminRoute)
        .use(manageAdminRoute)
        .use(manageUserRoute)
        .use(authClientRoute);

    app.use(express.static(path.join(__dirname, 'build')));
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, 'build', 'index.html'));
    });

    // Start the combined HTTP + WebSocket server
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
});
