const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const express = require('express');

module.exports = [
    bodyParser.json(),
    bodyParser.urlencoded({ extended: false }),
    cookieParser(),
];
