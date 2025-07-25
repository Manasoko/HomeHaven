const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

module.exports = [
    bodyParser.json(),
    bodyParser.urlencoded({ extended: false }),
    cookieParser(),
];
