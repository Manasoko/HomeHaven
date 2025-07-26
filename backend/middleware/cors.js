import cors from 'cors';

const corsOptions = {
    origin: process.env.CLIENT_PORT,
    credentials: true,
};

export default cors(corsOptions);