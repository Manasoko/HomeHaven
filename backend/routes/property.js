import express from 'express';
import * as propertyController from '../controller/property.js';

const router = express.Router();

router.post('/add-property', propertyController.addProperties);
router.get('/get-properties', propertyController.getProperties);
router.put('/edit-property/:id', propertyController.editProperties);

export default router;