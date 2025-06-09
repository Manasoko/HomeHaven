const session = require('express-session');
const sequelizeStore = require('connect-session-sequelize')(session.Store);
const sequelize = require('../utils/database');

const sessionStore = new sequelizeStore({
    db: sequelize,
});

const sessionMiddleware = session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: sessionStore,
    cookie: {
        httpOnly: true,
        maxAge: parseInt(process.env.COOKIE_MAX_AGE),
    },
});

module.exports = sessionMiddleware;
