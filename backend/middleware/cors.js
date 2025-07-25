const cors = require('cors');

const corsOptions = {
    origin: process.env.CLIENT_PORT,
    credentials: true,
};

module.exports = cors(corsOptions);