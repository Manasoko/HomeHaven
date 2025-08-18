import Sequelize from "sequelize";
import sequelize from "../utils/database.js";
import User from "./user.js";

export const Property = sequelize.define(
    "Property",
    {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true,
        },
        price: { type: Sequelize.INTEGER, allowNull: false },
        location: { type: Sequelize.STRING, allowNull: false },
        description: { type: Sequelize.STRING, allowNull: false },
        propertyType: { type: Sequelize.STRING },
        bedRoomNo: { type: Sequelize.INTEGER, allowNull: true },
        bathRoomNo: { type: Sequelize.INTEGER, allowNull: true },
        status: { type: Sequelize.STRING, allowNull: false, defaultValue: "for sale" },
        userId: {
            type: Sequelize.INTEGER,
            reference: {
                model: User,
                key: "id",
            },
            onDelete: "CASCADE",
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

export const Image = sequelize.define(
    "Image",
    {
        url: { type: Sequelize.STRING, allowNull: false },
        propertyId: {
            type: Sequelize.INTEGER,
            reference: {
                model: Property,
                key: "id",
            },
            onDelete: "CASCADE",
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
