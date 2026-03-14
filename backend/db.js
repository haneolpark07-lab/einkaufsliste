const { Pool } = require('pg');
//Pool ist eine Verbindung zur PostgresDQL Datenbank
const pool = new Pool({
    host: process.env.DB_HOST || 'localhost', //das sind die Werte
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || 'einkaufsliste',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
//liest WErte aus Umgebungsvariablen für Docker
});

module.exports = pool;
//macht POol für andere Dateien verfügbar