import User from '../models/user.js';

export async function uploadProfileImage(req, res) {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const userId = req.session.user?.id;
        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        await User.update(
            { profileImage: `/profile_images/${req.file.filename}` },
            { where: { id: userId } }
        );

        res.status(200).json({ message: 'Profile image uploaded successfully', imageUrl: `/profile_images/${req.file.filename}` });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error uploading profile image' });
    }
}

export async function getProfile(req, res) {
    try {
        const userId = req.session.user?.id;
        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const user = await User.findByPk(userId, { attributes: ['id', 'email', 'profileImage'] });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching user profile' });
    }
}

export async function deleteProfileImage(req, res) {
    try {
        const userId = req.session.user?.id;
        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        await User.update({ profileImage: null }, { where: { id: userId } });

        res.status(200).json({ message: 'Profile image removed' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error removing profile image' });
    }
}
