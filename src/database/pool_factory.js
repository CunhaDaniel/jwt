const mysql = require('mysql2')

const pool = mysql.createPool({
  connectionLimit: 1000,
  connectTimeout: 60 * 60 * 1000,
  port: 3306,
  host: 'db4free.net',
  user: 'crazylego',
  password: `9nyvwEfV`,
  database: 'stenergia',
  multipleStatements: true
})

console.log('Pool criado')
pool.on('release', () => console.log('pool => conexao retornada'))

process.on('SIGINT', () =>
  pool.end(err => {
    if (err) return console.log(err)
    console.log('pool => fechado')
    process.exit(0)
  })
)

module.exports = pool
