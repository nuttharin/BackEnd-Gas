const MongoClient  = require('mongodb').MongoClient ;
const { Pool } = require("pg");

const URL_MONGODB_IOT = process.env.URL_MONGODB +process.env.DATABASE_DATA_IOT ;



// set config Postgres
const connectionStringPostgres = `postgresql://${process.env.DB_POSTGRES_USER}:${process.env.DB_POSTGRES_PASSWORD}@${process.env.DB_POSTGRES_HOST}:${process.env.DB_POSTGRES_PORT}/${process.env.DB_POSTGRES_DATABASE}`;

const pool = new Pool({
    connectionString:  connectionStringPostgres   
});

module.exports = {
    pool,
    MongoClient,
    URL_MONGODB_IOT
}
