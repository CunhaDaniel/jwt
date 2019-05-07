const express = require('express')
const authMiddleware = require('../midllewares/auth')
const router = express.Router()

router.use(authMiddleware)

router.get('/frutas', async (req, res) => {
  const headers = req.headers
  console.log(req)
  const acess = {
    endpoint: '/frutas',
    ip: headers.origin,
    agent: headers['user-agent']
  }
  const QUERY = `select * from fruits;insert into acess (endpoint,ip,agent) values('${acess.endpoint}','${acess.ip}','${acess.agent}')`
  req.connection.query(QUERY, (err, resp) => {
    if (err) throw err
    console.log(resp)
    res.json(resp)
  })
})

module.exports = app => app.use('/foods', router)
