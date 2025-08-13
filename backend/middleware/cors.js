import cors from 'cors';

console.log('CLIENT_PORT:', process.env.CLIENT_PORT);
const corsOptions = {
    origin: process.env.CLIENT_PORT || 'http://localhost:5173',
    credentials: true,
};

export default cors(corsOptions);