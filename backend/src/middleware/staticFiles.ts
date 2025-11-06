import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default [
    express.static(path.join(__dirname, '../images')),
    express.static(path.join(__dirname, '../profile_images')),
];
