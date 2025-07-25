const express = require('express');
const { body } = require('express-validator');
const bcrypt = require('bcryptjs');

const authController = require('../controller/auth');
const UserDB = require('../models/user');
const router = express.Router();


router.post(
    '/add-user',
    [
        body('email')
            .isEmail()
            .withMessage('Invalid email')
            .custom(async (value, { req }) => {
                const user = await UserDB.findOne({ where: { email: value } });
                if (user) {
                    return Promise.reject('Email is already in the database.');
                }
                return true;
            }),
        body('password')
            .isLength({ min: 5 })
            .matches(/^[a-zA-Z0-9!@#$%^&*(),.?":{}|<>]*$/)
            .withMessage('Password must be above 5 characters')
            .custom((value, { req }) => {
                if (value !== req.body.confirmPassword) {
                    return Promise.reject("Passwords don't match");
                }
                return true;
            }),
    ],
    authController.postSignup
);

router.post(
    '/login-user',
    [
        body('password').custom(async (value, { req }) => {
            const user = await UserDB.findOne({
                where: { email: req.body.email },
            });
            if (!user) {
                return Promise.reject('Email is not registered');
            }
            const doMatch = await bcrypt.compare(value, user.password);
            if (!doMatch) {
                return Promise.reject('Incorrect Password');
            }
        }),
    ],
    authController.postLogin
);

router.post(
    '/reset',
    [
        body('email').custom(async (value, { req }) => {
            const user = await UserDB.findOne({
                where: { email: req.body.email },
            });
            if (!user) {
                return Promise.reject('Email is not registered');
            }
        }),
    ],
    authController.postResetPassword
);

router.post('/validate-token', authController.validateToken);

router.post(
    '/reset-password',
    body('password')
        .isLength({ min: 5 })
        .matches(/^[a-zA-Z0-9!@#$%^&*(),.?":{}|<>]*$/)
        .withMessage('Password must be above 5 characters')
        .custom((value, { req }) => {
            if (value !== req.body.confirmPassword) {
                return Promise.reject("Passwords don't match");
            }
            return true;
        }),
    authController.resetPassword
);

router.post('/logout', authController.logout);

module.exports = router;
