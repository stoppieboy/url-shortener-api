const { Pool } = require('pg')
const pool = new Pool({
    host: 'localhost',
    port: 5432,
    user: 'shivam',
    password: '051213',
    database: 'api'
})

module.exports = pool;