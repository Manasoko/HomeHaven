import Sequelize from "sequelize";
import sequelize from "../utils/database.js";

const User = sequelize.define(
  "User",
  {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    name: { type: Sequelize.STRING, allowNull: false },
    email: { type: Sequelize.STRING, allowNull: false, unique: true },
    phoneNumber: { type: Sequelize.STRING, allowNull: false },
    password: { type: Sequelize.STRING, allowNull: false },
    profileImage: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    resetPasswordToken: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    resetPasswordExpires: {
      type: Sequelize.DATE,
      allowNull: true,
    },
  },
  {
    hooks: {
      beforeBulkDestroy: async (options) => {
        await sequelize.query("SET @count = 0;");
        await sequelize.query(
          "UPDATE Properties SET id = @count := @count + 1;"
        );
        await sequelize.query("ALTER TABLE Properties AUTO_INCREMENT = 1;");
      },
    },
  }
);

export default User;
