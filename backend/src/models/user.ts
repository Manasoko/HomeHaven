import { Model, INTEGER, STRING, DATE, ENUM } from "sequelize";
import type {
  CreationOptional,
  ModelStatic,
  InferAttributes,
  InferCreationAttributes,
} from "sequelize";
import sequelize from "../utils/database.js";
import bcrypt from "bcryptjs";

interface UserModel
  extends Model<
    InferAttributes<UserModel>,
    InferCreationAttributes<UserModel>
  > {
  id: CreationOptional<number>;
  name: string;
  email: string;
  phoneNumber: string | null;
  password: string | null;
  provider: "local" | "google" | "apple";
  providerId: string | null;
  avatar: string | null;
  resetPasswordToken: string | null;
  resetPasswordExpires: Date | null;

  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserModel = sequelize.define<UserModel>(
  "User",
  {
    id: {
      type: INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    name: {
      type: STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [2, 500],
      },
    },
    email: {
      type: STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    phoneNumber: {
      type: STRING,
      allowNull: true,
    },
    password: {
      type: STRING,
      allowNull: true,
      validate: {
        len: [8, 255], // Only validates if not null
      },
    },
    provider: {
      type: ENUM("local", "google", "apple"),
      allowNull: false,
      defaultValue: "local",
    },
    providerId: { type: STRING, allowNull: true },
    avatar: { type: STRING, allowNull: true },
    resetPasswordToken: { type: STRING, allowNull: true },
    resetPasswordExpires: { type: DATE, allowNull: true },
  },
  {
    hooks: {
      beforeValidate: async (user) => {
        if (user.provider === "local" && !user.password) {
          throw new Error("Password is required for local authentication");
        }
      },
      beforeCreate: async (user: UserModel) => {
        if (user.password) {
          user.password = await bcrypt.hash(user.password, 12);
        }
      },
      beforeUpdate: async (user: UserModel) => {
        if (user.changed("password") && user.password) {
          user.password = await bcrypt.hash(user.password, 12);
        }
      },
    },
    tableName: "Users",
  }
);

interface UserModelStatic extends ModelStatic<UserModel> {
  prototype: UserModel;
}

const User = UserModel as unknown as UserModelStatic;

User.prototype.comparePassword = async function (
  this: UserModel,
  candidatePassword: string
): Promise<boolean> {
  if (!this.password) return false;
  return bcrypt.compare(candidatePassword, this.password);
};

export default User;
