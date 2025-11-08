import { Sequelize } from 'sequelize';

const sequelize = new Sequelize(
    process.env.DATABASE_NAME || 'homehaven',
    process.env.DATABASE_USER || 'root',
    process.env.DATABASE_PASSWORD || 'password',
    {dialect: 'mysql', host: 'localhost'}
);

export default sequelize;