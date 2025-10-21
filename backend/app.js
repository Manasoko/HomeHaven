import path from 'path';
import express from 'express';
import { fileURLToPath } from 'url';
import 'dotenv/config';
import passport from 'passport';

import corsMiddleware from './middleware/cors.js';
import sessionMiddleware from './middleware/session.js';
import bodyParserMiddleware from './middleware/bodyParser.js';
import { propertyImageUpload } from './middleware/multer.js';
import errorHandlerMiddleware from './middleware/errorHandler.js';
import staticFilesMiddleware from './middleware/staticFiles.js';

import sequelize from './utils/database.js';
import { Property, Image } from './models/property.js';
import UserDb from './models/user.js';

import authRoutes from './routes/auth.js';
import propertyRoutes from './routes/property.js';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middlewares
app.use(corsMiddleware);
app.use(bodyParserMiddleware);
app.use(sessionMiddleware);
app.use(passport.initialize());
app.use(passport.session());

app.use(propertyImageUpload);
app.use(staticFilesMiddleware);

import './config/passport.js';

app.use('/api', authRoutes);
app.use('/api', propertyRoutes);

app.use('/images', express.static(path.join(__dirname, 'images')));

app.use(errorHandlerMiddleware);

UserDb.hasMany(Property, { foreignKey: 'userId', onDelete: 'CASCADE', as: 'properties' });
Property.belongsTo(UserDb, { foreignKey: 'userId', as: 'agent' });
Property.hasMany(Image, { foreignKey: 'propertyId', as: 'images', onDelete: 'CASCADE' });
Image.belongsTo(Property, { foreignKey: 'propertyId' });

app.get('/api/get-session', (req, res) => {
    console.log('Current session:', req.session);
    if (req.session.passport && req.session.passport.user) {
        res.json({
            isLoggedIn: true,
            user: req.session.user
        });
    } else {
        res.json({ isLoggedIn: false });
    }
});

(async () => {
    try {
        await sequelize.sync();
        app.listen(process.env.SERVER_PORT, () => {
            console.log('Server started');
        });
    } catch (error) {
        console.log(error);
    }
})();
