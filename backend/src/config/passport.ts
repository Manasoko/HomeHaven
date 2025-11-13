import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import type {Profile, VerifyCallback} from "passport-google-oauth20";
import User from "../models/user.js";
import { Model } from "sequelize";

// Define User interface to match your User model
interface UserInstance extends Model {
  id: number;
  name: string;
  email: string;
  provider: string;
  providerId?: string;
  avatar?: string;
}

// Extend Express user type
declare global {
  namespace Express {
    interface User extends UserInstance {}
  }
}

passport.serializeUser((user: Express.User, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: number, done) => {
  try {
    const user = await User.findByPk(id) as UserInstance | null;
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

// Google Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      callbackURL: "/api/auth/google/callback",
    },
    async (
      accessToken: string,
      refreshToken: string,
      profile: Profile,
      done: VerifyCallback
    ) => {
      try {
        // Check if user exists with this email but registered via local auth
        const existingLocalUser = await User.findOne({
          where: {
            email: profile.emails?.[0]?.value,
            provider: "local",
          },
        }) as UserInstance | null;

        if (existingLocalUser) {
          return done(null, false, {
            message:
              "Email already registered via password. Please log in that way or link accounts later.",
          });
        }

        // Check if user exists with Google provider
        let user = await User.findOne({
          where: {
            provider: "google",
            providerId: profile.id,
          },
        }) as UserInstance | null;

        // Create new user if doesn't exist
        if (!user) {
          user = await User.create({
            name: profile.displayName,
            email: profile.emails?.[0]?.value || "",
            provider: "google",
            providerId: profile.id,
            avatar: profile.photos?.[0]?.value || null,
          }) as UserInstance;
        }

        return done(null, user);
      } catch (err) {
        const error = err instanceof Error ? err : new Error("Unknown error occurred");
        return done(error, undefined);
      }
    }
  )
);

export default passport;