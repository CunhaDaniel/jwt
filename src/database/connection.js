const mysql = require('mysql2/promise')

module.exports = async function connect() {
  const conn = await mysql.createConnection({
    host: 'db4free.net',
    port: 3306,
    user: 'crazylego',
    password: '9nyvwEfV',
    database: 'stenergia'
  }).catch(err => { if (err) throw err })

  return conn;
}
