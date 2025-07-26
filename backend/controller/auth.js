import bcrypt from 'bcryptjs';
import { validationResult } from 'express-validator';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import { Op } from 'sequelize';

dotenv.config();

import UserDB from '../models/user.js';

export async function postSignup(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            error: errors.array()[0].msg,
        });
    }
    try {
        const { username, email, password, phoneNumber } = req.body;
        const hashedPassword = await bcrypt.hash(password, 12);
        const user = await UserDB.create({
            name: username,
            email: email,
            password: hashedPassword,
            phoneNumber: phoneNumber,
        });
        req.session.user = { username: username, email: email, id: user.id };
        req.session.isLoggedIn = true;

        req.session.save(err => {
            if (err) {
                console.log('Session save error:', err);
            } else {
                console.log('Session saved successfully');
                return res.json({ redirect: process.env.CLIENT_PORT });
            }
        });
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({
                error: 'A user with this email already exists.',
            });
        } else {
            console.error(error);
        }
    }
}

export async function postLogin(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ error: errors.array()[0].msg });
    }

    try {
        const { email } = req.body;
        const user = await UserDB.findOne({ where: { email } });

        req.session.user = { id: user.id, email, name: user.name };
        req.session.isLoggedIn = true;
        req.session.save(err => {
            if (err) {
                console.error('Session save error:', err);
            } else {
                return res.json({ redirect: '/api/get-session' });
            }
        });
        console.log("Session after login:", req.session);
    } catch (error) {
        console.error(error);
        return res.status(404).json({ message: 'User Not Found' });
    }
}

export async function postResetPassword(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            error: errors.array()[0].msg,
        });
    }
    try {
        const user = await UserDB.findOne({
            where: { email: req.body.email },
        });
        const resetToken = crypto.randomBytes(32).toString('hex');
        const tokenExpiration = new Date(Date.UTC(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), new Date().getHours() + 1, new Date().getMinutes(), new Date().getSeconds()));
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = tokenExpiration;
        await user.save();

        console.log(`Token generated and saved ${resetToken} expiring ${tokenExpiration}`);

        const resetUrl = `http://localhost:5173/reset/${resetToken}`;
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD,
            },
            timeout: 3000
        });

        const mailOptions = {
            to: user.email,
            from: 'samuelqw041@gmail.com',
            subject: 'Password Reset',
            text: `
                Dear ${user.name},\n\n
                You are receiving this email because you requested a password reset.\n\n
               Please click on the following link or paste it into your browser to reset your password:\n\n
               ${resetUrl}\n\n
               If you did not request this, please ignore this email.\n\n
               Best regards,\n
               The Home Haven Team`,
        };

        await transporter.sendMail(mailOptions);
        console.log('Password sent');
        res.json({ message: 'Password reset email sent' });
    } catch (err) {
        console.log(err);
    }
}

export async function validateToken(req, res) {
    const { resetToken } = req.body;
    const now = new Date();
    try {
        const user = await UserDB.findOne({ where: { resetPasswordToken: resetToken, resetPasswordExpires: { [Op.gt]: now } } });
        if (!user) {
            console.log(user);
            return res.status(400).json({ message: 'Invalid or expired token' });
        }
        console.log('Validation done');
        return res.status(200).json({ message: 'Token is valid' });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Server error' });
    }
}

export async function resetPassword(req, res) {
    const { token, inputs } = req.body;
    try {
        const user = await UserDB.findOne({ where: { resetPasswordToken: token, resetPasswordExpires: { [Op.gt]: new Date() } } });
        if (!user) {
            console.log(user);
            return res.status(400).json({ message: 'Invalid or expired token' });
        }

        console.log('User password changing');

        user.password = await bcrypt.hash(inputs.password, 12);
        console.log('Changing?');
        user.resetPasswordToken = null;
        user.resetPasswordExpires = null;
        await user.save();

        console.log('User data is updated');

        return res.status(200).json({ message: 'Password reset successful' });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Server error' });
    }
}

export function logout(req, res) {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).json({ message: 'Server error' });
        } else {
            return res.json({ message: 'You have logged out successfully' });
        }
    });
}
