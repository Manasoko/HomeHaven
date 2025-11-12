import { validationResult } from "express-validator";
import type { Request, Response, NextFunction } from "express";
import crypto from "crypto";
import nodemailer, { type Transporter } from "nodemailer";
import dotenv from "dotenv";
import { Op } from "sequelize";

dotenv.config();

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

import UserDB from "../models/user.js";

interface SignupRequestBody {
  username: string;
  email: string;
  phoneNumber: string;
  password: string; // Assuming password is part of the request body
}

interface LoginRequestBody {
  email: string;
}

interface ResetPasswordRequestBody {
  email: string;
}

interface ValidateTokenRequestBody {
  resetToken: string;
}

interface ResetPasswordInputs {
  password: string;
}

interface ResetPasswordRequestBodyWithToken {
  token: string;
  inputs: ResetPasswordInputs;
}

export async function postSignup(
  req: Request<{}, {}, SignupRequestBody>,
  res: Response,
  next: NextFunction
) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorArray = errors.array();
    return res.status(422).json({
      error:
        errorArray.length > 0
          ? errorArray[0]?.msg || "Validation failed."
          : "Validation failed.",
    });
  }
  try {
    const { username, email, phoneNumber, password } = req.body;
    const hashedPassword = crypto
      .createHash("sha256")
      .update(password)
      .digest("hex"); // Example hashing
    const user = await UserDB.create({
      name: username,
      email: email,
      password: hashedPassword,
      phoneNumber: phoneNumber,
      provider: "local", // Assuming a default provider
    });
    req.session.user = { username: username, email: email, id: user.id };
    req.session.isLoggedIn = true;

    req.session.save((err) => {
      if (err) {
        console.log("Session save error:", err);
      } else {
        console.log("Session saved successfully");
        return res.json({ redirect: process.env.CLIENT_PORT });
      }
    });
  } catch (error) {
    if ((error as any).name === "SequelizeUniqueConstraintError") {
      return res.status(400).json({
        error: "A user with this email already exists.",
      });
    } else {
      console.error(error);
    }
  }
}

export async function postLogin(
  req: Request<{}, {}, LoginRequestBody>,
  res: Response,
  next: NextFunction
) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorArray = errors.array();
    return res.status(422).json({
      error:
        errorArray.length > 0
          ? errorArray[0]?.msg || "Validation failed."
          : "Validation failed.",
    });
  }

  try {
    const { email } = req.body;
    const user = await UserDB.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: "User Not Found" });
    }

    req.session.user = { id: user.id, email, name: user.name };
    req.session.isLoggedIn = true;
    req.session.save((err) => {
      if (err) {
        console.error("Session save error:", err);
      } else {
        return res.json({ redirect: "/api/get-session" });
      }
    });
    console.log("Session after login:", req.session);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
}

export async function postResetPassword(
  req: Request<{}, {}, ResetPasswordRequestBody>,
  res: Response,
  next: NextFunction
) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorArray = errors.array();
    return res.status(422).json({
      error:
        errorArray.length > 0
          ? errorArray[0]?.msg || "Validation failed."
          : "Validation failed.",
    });
  }
  try {
    const user = await UserDB.findOne({
      where: { email: req.body.email },
    });
    if (!user) {
      return res.status(404).json({ message: "User Not Found" });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const tokenExpiration = new Date(Date.now() + 3600000); // 1 hour from now
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = tokenExpiration;
    await user.save();

    console.log(
      `Token generated and saved ${resetToken} expiring ${tokenExpiration}`
    );

    const resetUrl = `http://localhost:5173/reset/${resetToken}`;

    const transporter: Transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      to: user.email,
      from: "samuelqw041@gmail.com",
      subject: "Password Reset",
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
    console.log("Password sent");
    res.json({ message: "Password reset email sent" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Server error" });
  }
}

export async function validateToken(
  req: Request<{}, {}, ValidateTokenRequestBody>,
  res: Response
) {
  const { resetToken } = req.body;
  const now = new Date();
  try {
    const user = await UserDB.findOne({
      where: {
        resetPasswordToken: resetToken,
        resetPasswordExpires: { [Op.gt]: now },
      },
    });
    if (!user) {
      console.log(user);
      return res.status(400).json({ message: "Invalid or expired token" });
    }
    console.log("Validation done");
    return res.status(200).json({ message: "Token is valid" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error" });
  }
}

export async function resetPassword(
  req: Request<{}, {}, ResetPasswordRequestBodyWithToken>,
  res: Response
) {
  const { token, inputs } = req.body;
  try {
    const user = await UserDB.findOne({
      where: {
        resetPasswordToken: token,
        resetPasswordExpires: { [Op.gt]: new Date() },
      },
    });
    if (!user) {
      console.log(user);
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    console.log("User password changing");
    user.password = inputs.password; // Ensure password is hashed before saving
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();

    console.log("User data is updated");

    return res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error" });
  }
}

export function logout(req: Request, res: Response) {
  req.session.destroy((err) => {
    res.clearCookie("connect.sid");
    if (err) {
      return res.status(500).json({ message: "Server error" });
    } else {
      return res.json({ message: "You have logged out successfully" });
    }
  });
}
