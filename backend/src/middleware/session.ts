import session from 'express-session';
import connectSessionSequelize from 'connect-session-sequelize';
import sequelize from '../utils/database.js';

const SequelizeStore = connectSessionSequelize(session.Store);

const sessionStore = new SequelizeStore({
    db: sequelize,
});

const sessionMiddleware = session({
    secret: process.env.SESSION_SECRET || 'secret',
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    cookie: {
        httpOnly: true,
        maxAge: parseInt(process.env.COOKIE_MAX_AGE || '86400000'), // Default 1 day
    },
});

export default sessionMiddleware;
