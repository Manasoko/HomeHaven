import path from 'path';
import express from 'express';
import dotenv from 'dotenv';
dotenv.config();

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
import profileRoutes from './routes/profile.js';

const app = express();

// Middlewares
app.use(corsMiddleware);
app.use(bodyParserMiddleware);
app.use(sessionMiddleware);
app.use(propertyImageUpload);
app.use(staticFilesMiddleware);

app.use('/api', authRoutes);
app.use('/api', propertyRoutes);

app.use('/images', express.static(path.join(path.dirname(new URL(import.meta.url).pathname), 'images')));

app.use(errorHandlerMiddleware);

UserDb.hasMany(Property, { foreignKey: 'userId', onDelete: 'CASCADE' });
Property.belongsTo(UserDb, { foreignKey: 'userId' });
Property.hasMany(Image, { foreignKey: 'propertyId', as: 'images', onDelete: 'CASCADE' });
Image.belongsTo(Property, { foreignKey: 'propertyId' });

app.get('/api/get-session', (req, res) => {
    console.log('Current session:', req.session);
    if (req.session.isLoggedIn) {
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
