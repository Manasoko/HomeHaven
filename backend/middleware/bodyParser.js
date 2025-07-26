import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';

export default [
    bodyParser.json(),
    bodyParser.urlencoded({ extended: false }),
    cookieParser(),
];
