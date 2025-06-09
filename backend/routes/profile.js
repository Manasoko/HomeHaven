const express = require('express');
const { UserDb } = require('../models/user');
const { profileImageUpload } = require('../middleware/multer');
const profileController = require('../controller/profile');

const router = express.Router();

// Profile image upload route
router.post('/upload-profile', profileImageUpload, profileController.uploadProfileImage);

router.get('/profile', profileController.getProfile);

router.delete('/profile-image', profileController.deleteProfileImage);

module.exports = router;
