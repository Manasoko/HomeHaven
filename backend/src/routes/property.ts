import express from 'express';
import * as propertyController from '../controller/property.js';

const router = express.Router();

router.post('/property', propertyController.addProperties);
router.get('/get-properties', propertyController.getProperties);
router.get('/property/:id', propertyController.getProperty);
router.get('/search-properties', propertyController.searchProperties);
router.put('/property/:id', propertyController.editProperties);
router.delete('/property/:id', propertyController.deleteProperty);

export default router;