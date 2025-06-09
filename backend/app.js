const dotenv = require('dotenv');
const express = require('express');

const app = express()
dotenv.config();

//Middlewares
const corsMiddleware = require('./middleware/cors');
const sessionMiddleware = require('./middleware/session');
const bodyParserMiddleware = require('./middleware/bodyParser');
const { propertyImageUpload } = require('./middleware/multer');
const errorHandlerMiddleware = require('./middleware/errorHandler');
const staticFilesMiddleware = require('./middleware/staticFiles');

//Models
const sequelize = require('./utils/database');
const { Property, Image } = require('./models/property');
const UserDb = require('./models/user');


//Routes
const authRoutes = require('./routes/auth');
const propertyRoutes = require('./routes/property');

app.use(corsMiddleware);
app.use(bodyParserMiddleware);
app.use(propertyImageUpload);
app.use(staticFilesMiddleware);
app.use(sessionMiddleware);

app.use('/api', authRoutes);
app.use('/api', propertyRoutes);

app.use(errorHandlerMiddleware)


UserDb.hasMany(Property, {foreignKey: 'userId', onDelete: 'CASCADE'});
Property.belongsTo(UserDb, {foreignKey: 'userId'});
Property.hasMany(Image, { foreignKey: 'propertyId', as: 'images', onDelete: 'CASCADE' });
Image.belongsTo(Property, { foreignKey: 'propertyId' });

app.get('/api/test-session', (req, res) => {
    console.log('Current session:', req.session);
    if (req.session.isLoggedIn) {
        res.json({isLoggedIn: true});
    } else {
        res.json({ isLoggedIn: false });
    }
});

(async () => {
    try {
        await sequelize.sync();
        app.listen(process.env.SERVER_PORT, () => {
            console.log('Server started ');
        });
    } catch (error) {
        console.log(error);
    }
})();
