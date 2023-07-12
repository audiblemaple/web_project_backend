require('dotenv').config();
const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./routes/user');
const workSessionsRoutes = require('./routes/workSessions');
const cors = require('cors');
const corsOptions = require('./config/corsOptions');

const server_app = express();

server_app.set('view engine', 'pug');
server_app.set('views', path.join(__dirname, 'views'));

server_app.use(cors(corsOptions));
server_app.options('*', cors(corsOptions))

//middleware

server_app.use(express.json()); // for req.body (enable access to data that was sent to server)

server_app.use((req, res, next) => {
    console.log(req.path, req.method);
    next();
})

server_app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    next();
})

// connecting routes - also kind of middleware
server_app.use('/api/user', userRoutes);
server_app.use('/api/home_screen', workSessionsRoutes);

// connect to DB
mongoose.connect(process.env.MONGO_URI)
.then(() =>{
    // listen for requests
    server_app.listen(process.env.PORT, () => {
    console.log(`connected to DB and listening on port ${process.env.PORT}`);
});
})
.catch((error) => {
    console.log(error);
});

