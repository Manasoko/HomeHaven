const { Image, Property } = require('../models/property');

exports.addProperties = async (req, res, next) => {
    const {propertyAddress, price, propertyType, description} = req.body;
    const images = req.files;
    console.log(images);

    if (!req.session.user) {
        return res.status(401).json({
            message: 'User not loggedIn'
        });
    }

    const userId = req.session.user.id
    console.log(userId);

    try {
        const property = await Property.create({
            location: propertyAddress,
            price: price,
            propertyType: propertyType,
            description: description,
            userId: userId
        });
        console.log('Property is working now');

        if (req.files) {
            const images = req.files.map(file => ({
                url: `../images/${file.filename}`,
                propertyId: property.id
            }));

            await Image.bulkCreate(images);
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
    })
};

exports.getProperties = async (req, res, next) => {
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