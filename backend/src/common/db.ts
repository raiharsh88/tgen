import pgPromise from "pg-promise";// Create an instance of pg-promise
import config from "../config";
const pgp = pgPromise();

// Set up the database connection configuration


const queryLogger = (e:any) => {
    console.log('Query:', e.query);
};

// Attach the custom logger to the query protocol

const pgConf = config.postgres;
const connectionConfig = {
  host:pgConf.dbHost,
  port: pgConf.dbPort,
  database: pgConf.dbName||'market-data-test',
  user:pgConf.dbUser,
  password:pgConf.dbPassword,
  query(e:any) {
    console.log('QUERY:', e.query);
}
};

// Create the database connection
const db = pgp(connectionConfig);
console.log('db',pgConf.dbName);
export {pgp}
export default db;
