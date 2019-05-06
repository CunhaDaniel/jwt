const express = require('express')
const authMiddleware = require('../midllewares/auth')
const router = express.Router()

router.use(authMiddleware)

router.get('/frutas', async (req, res) => {

  req.connection.query('select * from fruits', (err, resp) => {
    if (err) throw err
    console.log(resp)
    res.json(resp)
  })
})

module.exports = app => app.use('/foods', router)
