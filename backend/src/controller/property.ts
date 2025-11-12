import { Op } from "sequelize";
import type {WhereOptions} from "sequelize";
import type { Request, Response, NextFunction } from "express";

import { Image, Property } from "../models/property.js";
import User from "../models/user.js";

interface SearchQuery {
  address?: string;
  minPrice?: string;
  maxPrice?: string;
  bedrooms?: string;
  bathrooms?: string;
  status?: string;
}

interface PropertyWhereClause {
  location?: {
    [Op.like]: string;
  };
  price?: {
    [Op.gte]?: number;
    [Op.lte]?: number;
  };
  bedRoomNo?: {
    [Op.gte]: number;
  };
  bathRoomNo?: {
    [Op.gte]: number;
  };
  status?: string;
}

export const addProperties = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const {
    propertyAddress,
    price,
    propertyType,
    description,
    bathRoomNo,
    bedRoomNo,
    status,
  } = req.body;
  const images = req.files;
  console.log(images);

  const user = req.session.user;

  if (!user) {
    return res.status(401).json({
      message: "User not loggedIn",
    });
  }

  try {
    const property = await Property.create({
      location: propertyAddress,
      price: price,
      propertyType: propertyType,
      description: description,
      bedRoomNo: bedRoomNo,
      bathRoomNo: bathRoomNo,
      status: status,
      userId: user.id || 1,
    });
    console.log("Property is working now");

    if (req.files && Array.isArray(req.files)) {
      const imagesArr = req.files?.map((file) => ({
        url: `../images/${file.filename}`,
        propertyId: property.id,
      }));

      await Image.bulkCreate(imagesArr);
    } else {
      console.log("No images uploaded");
    }
    console.log("Successful I can sleep", property);
  } catch (e) {
    console.log(e);
  }

  res.status(200).json({
    address: propertyAddress,
    price: price,
    type: propertyType,
    desc: description,
    images: images ? images : "There are no images uploaded",
  });
};

export const editProperties = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const propertyId = req.params.id;
  const {
    propertyAddress,
    price,
    propertyType,
    description,
    bathRoomNo,
    bedRoomNo,
    status,
  } = req.body;
  const images = req.files;

  const property = await Property.findByPk(propertyId);

  if (!property) {
    return res.status(404).json({ message: "No property found." });
  }

  property.set({
    location: propertyAddress,
    price: price,
    propertyType: propertyType,
    description: description,
    bedRoomNo: bedRoomNo,
    bathRoomNo: bathRoomNo,
    status: status,
  });

  await property.save();
  console.log("Property is updated");

  if (images && Array.isArray(images)) {
    await Image.destroy({ where: { propertyId: property.id } });

    const newImages = images.map((file) => ({
      url: `../images/${file.filename}`,
      propertyId: property.id,
    }));

    await Image.bulkCreate(newImages);
    console.log("Images updated successfully");
  } else {
    console.log("No new images uploaded");
  }
  res.status(200).json({
    message: "Successfully updated property",
  });
};

export const getProperties = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const properties = await Property.findAll({
      include: [
        {
          model: Image,
          as: "images",
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json(properties);
  } catch (e) {
    console.log(e);
    res.status(500).json({
      message: "An error occurred",
    });
  }
};

export const getProperty = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const id = req.params.id;
  try {
    const property = await Property.findByPk(id, {
      include: [
        {
          model: Image,
          as: "images",
        },
        {
          model: User,
          as: "agent",
          attributes: ["name", "email", "phoneNumber"],
        },
      ],
    });
    return res.status(200).json({ property: property });
  } catch (e: any) {
    console.log(e);
    return res.status(500).json({
      message: "An error occurred",
      error: e.message,
    });
  }
};

export const deleteProperty = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const id = req.params.id;
  try {
    console.log(id);
    const property = await Property.findByPk(id);

    if (!property) {
      return res.status(404).json({ message: "No property found." });
    }

    await property.destroy();

    return res.status(200).json({
      message: "Successfully deleted property",
    });
  } catch (e: any) {
    console.log(e);
    return res.status(500).json({
      message: "An error occurred",
      error: e.message,
    });
  }
};

export const searchProperties = async (
  req: Request<{}, {}, {}, SearchQuery>,
  res: Response,
  next: NextFunction
): Promise<Response> => {
  try {
    const { address, minPrice, maxPrice, bedrooms, bathrooms, status } = req.query;
    
    const where: PropertyWhereClause = {};

    if (address) {
      where.location = { [Op.like]: `%${address}%` };
    }

    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) {
        const parsedMinPrice = parseInt(minPrice, 10);
        if (!isNaN(parsedMinPrice)) {
          where.price[Op.gte] = parsedMinPrice;
        }
      }
      if (maxPrice) {
        const parsedMaxPrice = parseInt(maxPrice, 10);
        if (!isNaN(parsedMaxPrice)) {
          where.price[Op.lte] = parsedMaxPrice;
        }
      }
    }

    if (bedrooms) {
      const parsedBedrooms = parseInt(bedrooms, 10);
      if (!isNaN(parsedBedrooms)) {
        where.bedRoomNo = { [Op.gte]: parsedBedrooms };
      }
    }

    if (bathrooms) {
      const parsedBathrooms = parseInt(bathrooms, 10);
      if (!isNaN(parsedBathrooms)) {
        where.bathRoomNo = { [Op.gte]: parsedBathrooms };
      }
    }

    if (status) {
      where.status = status;
    }

    const properties = await Property.findAll({
      where: where as WhereOptions,
      include: [
        {
          model: Image,
          as: 'images',
        },
      ],
    });

    return res.json(properties);
  } catch (e) {
    console.error('Error searching properties:', e);
    const errorMessage = e instanceof Error ? e.message : 'Unknown error occurred';
    return res.status(500).json({
      message: 'An error occurred while searching properties',
      error: errorMessage,
    });
  }
}