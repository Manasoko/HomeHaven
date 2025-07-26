import express from 'express';
import { profileImageUpload } from '../middleware/multer.js';
import * as profileController from '../controller/profile.js';

const router = express.Router();

// Profile image upload route
router.post('/upload-profile', profileImageUpload, profileController.uploadProfileImage);

router.get('/profile', profileController.getProfile);

router.delete('/profile-image', profileController.deleteProfileImage);

export default router;
