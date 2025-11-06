import multer from 'multer';

// Storage for property images
const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images');
    },
    filename: (req, file, cb) => {
        const timestamp = new Date().toISOString().replace(/T/, '.').replace(/\..+/, '').replace(/:/g, '-');
        cb(null, timestamp + '-' + file.originalname);
    }
});

// Storage for profile images
const profileImageStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images/profile');
    },
    filename: (req, file, cb) => {
        const timestamp = new Date().toISOString().replace(/T/, '.').replace(/\..+/, '').replace(/:/g, '-');
        cb(null, timestamp + '-' + file.originalname);
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

export const propertyImageUpload = multer({ storage: fileStorage, fileFilter }).array('images', 20);
export const profileImageUpload = multer({ storage: profileImageStorage }).single('profileImage');
