const express = require('express');
const propertyController = require('../controller/property');

const router = express.Router();

router.post('/add-property', propertyController.addProperties);
router.get('/get-properties', propertyController.getProperties);

module.exports = router;