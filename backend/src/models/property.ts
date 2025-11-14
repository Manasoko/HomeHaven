import {Model, INTEGER, STRING} from "sequelize";
import type {
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
} from "sequelize";
import sequelize from "../utils/database.js";
import User from "./user.js";

interface PropertyModel
  extends Model<
    InferAttributes<PropertyModel>,
    InferCreationAttributes<PropertyModel>
  > {
  id: CreationOptional<number>;
  price: number;
  address: string;
  description: string;
  propertyType: string | null;
  bedRoomNo: number | null;
  bathRoomNo: number | null;
  status: string;
  userId: number;
}

interface ImageModel
  extends Model<
    InferAttributes<ImageModel>,
    InferCreationAttributes<ImageModel>
  > {
  id: CreationOptional<number>;
  url: string;
  propertyId: number;
}

export const Property = sequelize.define<PropertyModel>(
    "Property",
    {
        id: {
            type: INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true,
        },
        price: { type: INTEGER, allowNull: false },
        address: { type: STRING, allowNull: false },
        description: { type: STRING, allowNull: false },
        propertyType: { type: STRING },
        bedRoomNo: { type: INTEGER, allowNull: true },
        bathRoomNo: { type: INTEGER, allowNull: true },
        status: { type: STRING, allowNull: false, defaultValue: "for sale" },
        userId: {
            type: INTEGER,
            references: {
                model: User,
                key: "id",
            },
            onDelete: "CASCADE",
        },
    }
);

export const Image = sequelize.define<ImageModel>(
    "Image",
    {
        id: {
            type: INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true,
        },
        url: { type: STRING, allowNull: false },
        propertyId: {
            type: INTEGER,
            references: {
                model: Property,
                key: "id",
            },
            onDelete: "CASCADE",
        },
    }
);
