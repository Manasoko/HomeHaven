const express = require('express');
const path = require('path');

module.exports = [
    express.static(path.join(__dirname, '../images')),
    express.static(path.join(__dirname, '../profile_images')),
];
