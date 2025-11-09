import multer from 'multer';
import type { FileFilterCallback } from 'multer';
import type { Request } from 'express';

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
const fileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
  if (['image/png', 'image/jpeg', 'image/jpg'].includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

export const propertyImageUpload = multer({ storage: fileStorage, fileFilter }).array('images', 20);
export const profileImageUpload = multer({ storage: profileImageStorage, fileFilter }).single('profileImage');