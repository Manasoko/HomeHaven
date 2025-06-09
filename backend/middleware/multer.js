const multer = require('multer');
const { v4: uuidv4 } = require('uuid');

// Storage for property images
const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images');
    },
    filename: (req, file, cb) => {
        cb(null, uuidv4());
    }
});

// Storage for profile images
const profileImageStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images/profile');
    },
    filename: (req, file, cb) => {
        cb(null,uuidv4());
    }
});

// File filter
const fileFilter = (req, file, cb) => {
    if (['image/png', 'image/jpeg', 'image/jpg'].includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid image type!'), false);
    }
};

module.exports = {
    propertyImageUpload: multer({ storage: fileStorage, fileFilter }).array('images', 20),
    profileImageUpload: multer({ storage: profileImageStorage }).single('profileImage'),
};
