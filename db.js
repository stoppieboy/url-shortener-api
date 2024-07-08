const { Pool } = require('pg')

var pool
if(process.env.CUSTOM_ENV === "vercel"){
    pool = new Pool({
        connectionString: process.env.DB_URL
    })
}else{
    pool = new Pool({
        host: process.env.DB_URL,
        port: 5432,
        user: 'shivam',
        password: '051213',
        database: 'api'
    })
}

module.exports = pool;