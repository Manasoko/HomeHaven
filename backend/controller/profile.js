const { UserDb } = require('../models/user'); // Import Multer config


exports.uploadProfileImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        // Get user ID from session
        const userId = req.session.user?.id;
        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        // Update user profile image path in the database
        await UserDb.update(
            { profileImage: `/profile_images/${req.file.filename}` },
            { where: { id: userId } }
        );

        res.status(200).json({ message: 'Profile image uploaded successfully', imageUrl: `/profile_images/${req.file.filename}` });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error uploading profile image' });
    }
};

exports.getProfile =  async (req, res) => {
    try {
        const userId = req.session.user?.id;
        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        // Fetch user data from database
        const user = await UserDb.findByPk(userId, { attributes: ['id', 'email', 'profileImage'] });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching user profile' });
    }
};

exports.deleteProfileImage = async (req, res) => {
    try {
        const userId = req.session.user?.id;
        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        await UserDb.update({ profileImage: null }, { where: { id: userId } });

        res.status(200).json({ message: 'Profile image removed' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error removing profile image' });
    }
};