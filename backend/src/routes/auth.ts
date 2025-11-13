import express from "express";
import type { Request, Response } from "express";
import { body } from "express-validator";
import passport from "passport";

declare module "express-session" {
  interface SessionData {
    isLoggedIn?: boolean;
    user?: {
      id?: number;
      email?: string;
      username?: string;
      name?: string;
    };
  }
}

import * as authController from "../controller/auth.js";
import User from "../models/user.js";

const router = express.Router();

router.post(
  "/add-user",
  [
    body("email")
      .isEmail()
      .withMessage("Invalid email")
      .custom(async (value, { req }) => {
        const user = await User.findOne({ where: { email: value } });
        if (user) {
          return Promise.reject("Email is already in the database.");
        }
        return true;
      }),
    body("password")
      .isLength({ min: 5 })
      .matches(/^[a-zA-Z0-9!@#$%^&*(),.?":{}|<>]*$/)
      .withMessage("Password must be above 5 characters")
      .custom((value, { req }) => {
        if (value !== req.body.confirmPassword) {
          return Promise.reject("Passwords don't match");
        }
        return true;
      }),
  ],
  authController.postSignup
);

router.get("/login", (req, res, next) => {
  res.redirect(process.env.CLIENT_PORT + "/login?error=oauth_failed");
});

router.post(
  "/login",
  [
    body("password").custom(async (value, { req }) => {
      const user = await User.findOne({
        where: { email: req.body.email },
      });
      if (!user) {
        return Promise.reject("Email is not registered");
      }
      const doMatch = await user.comparePassword(value);
      if (!doMatch) {
        return Promise.reject("Incorrect Password");
      }
    }),
  ],
  authController.postLogin
);

router.post(
  "/reset",
  [
    body("email").custom(async (value, { req }) => {
      const user = await User.findOne({
        where: { email: req.body.email },
      });
      if (!user) {
        return Promise.reject("Email is not registered");
      }
    }),
  ],
  authController.postResetPassword
);

router.post("/validate-token", authController.validateToken);

router.post(
  "/reset-password",
  body("password")
    .isLength({ min: 5 })
    .matches(/^[a-zA-Z0-9!@#$%^&*(),.?":{}|<>]*$/)
    .withMessage("Password must be above 5 characters")
    .custom((value, { req }) => {
      if (value !== req.body.confirmPassword) {
        return Promise.reject("Passwords don't match");
      }
      return true;
    }),
  authController.resetPassword
);

//3rd parties Auth
//Google
router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/api/login",
    failureMessage: true,
  }),
  (req, res) => {
    console.log("Google auth successful, redirecting...");
    res.redirect(process.env.CLIENT_PORT + "/"); // or send JSON
  }
);

router.get("/user", async (req: Request, res: Response) => {
  try {
    // Check session (your existing way)
    if (!req.session.user?.id) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    // Get user from database
    const user = await User.findByPk(req.session.user.id, {
      attributes: { exclude: ["password"] },
    });

    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    res.json({
      id: user.id,
      email: user.email,
      name: user.name,
      avatar: user.avatar,
      provider: user.provider,
    });
  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

router.post("/logout", authController.logout);
export default router;
