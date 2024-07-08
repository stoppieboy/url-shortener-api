const { Pool } = require('pg')

var pool
const ce = process.env.CUSTOM_ENV
console.log('ce:',ce)
if(process.env.CUSTOM_ENV === "vercel"){
    pool = new Pool({
        connectionString: process.env.DB_URL
    })
}else{
    console.log('not here')
    pool = new Pool({
        host: process.env.DB_URL,
        port: 5432,
        user: 'shivam',
        password: '051213',
        database: 'api'
    })
}

pool.connect((err) => {
    if(err) throw err
    console.log("Connected to PostgreSQL successfully")
})

pool.query("CREATE TABLE IF NOT EXISTS url_map(id serial, short_url TEXT PRIMARY KEY, long_url text);")

module.exports = pool;