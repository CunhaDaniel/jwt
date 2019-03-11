const mysql = require('mysql2/promise')

module.exports = async function connect() {
  const conn = await mysql.createConnection({
    connectionLimit : 10,
    connectTimeout  : 60 * 60 * 1000,
    host: 'db4free.net',
    port: 3306,
    user: 'crazylego',
    password: '9nyvwEfV',
    database: 'stenergia'
  }).catch(err => { if (err) throw err })

  return conn;
}
