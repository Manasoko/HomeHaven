import Sequelize from "sequelize";
import sequelize from "../utils/database.js";
import bcrypt from "bcryptjs";

const User = sequelize.define(
  "User",
  {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [2, 500],
      },
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    phoneNumber: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    password: {
      type: Sequelize.STRING,
      allowNull: true,
      validate: {
        len: [8, 255], // Only validates if not null
        isStrongPassword(value) {
          if (this.provider === "local" && !value) {
            throw new Error("Password required for local auth");
          }
        },
      },
    },
    provider: {
      type: Sequelize.ENUM("local", "google", "facebook", "github"),
      allowNull: false,
      defaultValue: "local",
    },
    providerId: { type: Sequelize.STRING, allowNull: true },
    avatar: { type: Sequelize.STRING, allowNull: true },
    resetPasswordToken: { type: Sequelize.STRING, allowNull: true },
    resetPasswordExpires: { type: Sequelize.DATE, allowNull: true },
  },
  {
    hooks: {
      beforeCreate: async (user) => {
        if (user.password) {
          user.password = await bcrypt.hash(user.password, 12);
        }
      },
      beforeUpdate: async (user) => {
        if (user.changed("password") && user.password) {
          user.password = await bcrypt.hash(user.password, 12);
        }
      },
    },
    indexes: [
      { unique: true, fields: ["email"] },
      { fields: ["provider", "providerId"] },
    ],
  },
  { logging: false }
);

User.prototype.comparePassword = async function (candidatePassword) {
  if (!this.password) return false;
  return await bcrypt.compare(candidatePassword, this.password);
};

export default User;
