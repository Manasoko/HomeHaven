const express = require('express');
const propertyController = require('../controller/property');

const router = express.Router();

router.post('/add-property', propertyController.addProperties);
router.get('/get-properties', propertyController.getProperties);
router.put('/edit-property/:id', propertyController.editProperties);

module.exports = router;