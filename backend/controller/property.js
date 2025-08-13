import {Image, Property} from '../models/property.js';

export const addProperties = async (req, res, next) => {
    const {propertyAddress, price, propertyType, description, bathRoomNo, bedRoomNo} = req.body;
    const images = req.files;
    console.log(images);

    const user = req.session.user;

    if (!user) {
        return res.status(401).json({
            message: 'User not loggedIn'
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
            userId: user.id
        });
        console.log('Property is working now');

        if (req.files) {
            const imagesArr = req.files.map(file => ({
                url: `../images/${file.filename}`,
                propertyId: property.id
            }));

            await Image.bulkCreate(imagesArr);
        } else {
            console.log('No images uploaded');
        }
        console.log('Successful I can sleep', property);
    } catch (e) {
        console.log(e);
    }

    res.status(200).json({
        address: propertyAddress,
        price: price,
        type: propertyType,
        desc: description,
        images: images ? images : 'There are no images uploaded'
    });
};

export const editProperties = async (req, res, next) => {
    const propertyId = req.params.id;
    const {propertyAddress, price, propertyType, description, bathRoomNo, bedRoomNo} = req.body;
    const images = req.files;

    const property = await Property.findByPk(propertyId);

    property.set({
        location: propertyAddress,
        price: price,
        propertyType: propertyType,
        description: description,
        bedRoomNo: bedRoomNo,
        bathRoomNo: bathRoomNo,
    });

    await property.save();
    console.log("Property is updated");

    if (images && images.length > 0) {
        await Image.destroy({where: {propertyId: property.id}});

        const newImages = images.map(file => ({
            url: `../images/${file.filename}`,
            propertyId: property.id
        }));

        await Image.bulkCreate(newImages);
        console.log('Images updated successfully');
    } else {
        console.log('No new images uploaded');
    }
    res.status(200).json({
        message: 'Successfully updated property'
    });
};

export const getProperties = async (req, res, next) => {
    try {
        const properties = await Property.findAll({
            include: [{
                model: Image,
                as: 'images'
            }]
        });

        res.status(200).json({
            properties: properties
        });
    } catch (e) {
        console.log(e);
        res.status(500).json({
            message: 'An error occurred'
        });
    }
};

export const deleteProperty = async (req, res, next) => {
    const id = req.params.id;
    try {
        console.log(id)
        const property = await Property.findByPk(id);
        if (!property) {
            res.status(404).json({
                message: "Property not found",
            });
        }

        await property.destroy()

        return res.status (200).json({
            message: 'Successfully deleted property'
        })
    } catch (e) {
        console.log(e);
        res.status(500).json({
            message: "An error occurred",
            error: e.message
        })
    }
};