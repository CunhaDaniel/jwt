const connection = require('./connection')

module.exports = connection.query('select * from usuarios', (err, users, fields) => {
  if (err) throw (err)
  return users
})
