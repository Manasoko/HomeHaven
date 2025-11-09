import express from 'express';
import cookieParser from 'cookie-parser';

export default [
    express.json(),
    express.urlencoded({ extended: false }),
    cookieParser(),
];
