const mysql = require('mysql'); // necessary libray 

const pool = mysql.createPool({
  connectionLimit: 10,
  port: 3306,
  host: 'db4free.net',
  user: 'crazylego',
  password: `9nyvwEfV`,
  database: 'stenergia'
});

console.log("Pool criado");
pool.on('release', () => console.log('pool => conexao retornada'));

process.on('SIGINT', () =>
  pool.end(err => {
    if (err) return console.log(err);
    console.log('pool => fechado')
    process.exit(0)
  })
)

module.exports = pool;