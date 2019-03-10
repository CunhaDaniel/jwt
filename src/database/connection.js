const mysql = require('mysql')

module.exports = await mysql.createConnection({
  host: 'db4free.net',
  port: 3306,
  user: 'crazylego',
  password: '9nyvwEfV',
  database: 'stenergia'
});
