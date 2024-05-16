const express = require('express');
const mongoose = require('mongoose');
const os = require('os');
const cors = require('cors');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const { ConnectToDataBase } = require('./config/database_config');
const http = require('http');

const AuthRoutes = require('./routes/auth.routes');
const Role_PermissionRoutes = require('./routes/admin/role_permission.routes');
const Product_CategoryRoutes = require('./routes/admin/product_category.routes');

require('dotenv').config();

// Database connection
ConnectToDataBase()

const app = express();

app.use(cors());
app.use(express.static(__dirname + '/public'));
app.use(morgan('dev'));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Socket.IO setup
const server = http.createServer(app);

// Server Health check
app.get('/health', (req, res) => {
    try {
        const networkInterfaces = os.networkInterfaces();

        // Extract IPv4 adresses
        const IPv4Adresses = Object.values(networkInterfaces)
            .flat()
            .filter(interfaceInfo => interfaceInfo.family === 'IPv4')
            .map(interfaceInfo => interfaceInfo.address);

        if (mongoose.connection.name) {
            const message = {
                host: IPv4Adresses,
                message: 'Healthy',
                status: true,
                time: new Date(),
            };
            console.log(message);
            return res.status(200).json({ response: message });
        } else {
            const message = {
                host: IPv4Adresses,
                message: 'Unhealthy',
                status: false,
                time: new Date(),
            };
            console.log(message);
            return res.status(501).json({ response: message });
        }
    } catch (error) {
        return res.status(500).json({ response: error.message })
    }
});

/* ADMIN */
// ADMIN API routes
app.use('/admin/api', [
    Role_PermissionRoutes,
    Product_CategoryRoutes
]);

/* AUTH */
// API routes
app.use('/api', AuthRoutes);

/* USER */
// USER API routes

app.get('/api/server/check', (req, res) => {
    res.send("Hi!...I am server, Happy to see you boss...");
});

// Internal server error handeling middleware
app.use((err, req, res, next) => {
    console.log(err);
    res.status(500).json({
        status: 500,
        message: "Server Error",
        error: err
    });
});


// Page not found middleware
app.use((req, res, next) => {
    res.status(404).json({
        status: 404,
        message: "Page Not Found"
    });
});

const PORT = process.env.PORT || 4002;
const HOST = `${process.env.HOST}:${PORT}` || `http://localhost:${PORT}`;

server.listen(PORT, () => {
    console.log(`Server Connected On Port ${HOST}`)
});