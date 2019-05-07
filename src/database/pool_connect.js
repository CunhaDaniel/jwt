module.exports = pool => (req, res, next) => {
  pool.getConnection((err, connection) => {
    if (err) console.log(err)
    console.log('pool => obteve conexao')
    req.connection = connection
    next()
    res.on('finish', () => req.connection.release())
  })
}
