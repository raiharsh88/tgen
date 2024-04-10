import dotenv from 'dotenv';

if (process.env.NODE_ENV === 'production') {
    dotenv.config({ path: '.env.prod' });
} else {
    dotenv.config({ path: '.env' });
 
}

const config:any = {};

config.httpPort = (process.env.HTTP_PORT as unknown as number)||5001;
config.cloudMqttUrl = process.env.CLOUDMQTT_URL || 'mqtt://localhost:1883';

config.postgres = {
    dbName: process.env.PG_NAME || 'postgres',
    dbUser: process.env.PG_USER || 'postgres',
    dbPassword: process.env.PG_PASSWORD || 'postgres',
    dbHost: process.env.PG_HOST || 'localhost',
    dbPort: parseInt(process.env.PG_PORT || '5433')

}
export default config

//get user details