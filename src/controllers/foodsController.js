const express = require('express')
const authMiddleware = require('../midllewares/auth')
const router = express.Router()

const Conn = require('../database/connection')

router.use(authMiddleware)

router.get('/frutas', async (req, res) => {
  // const conn = await Conn()

  req.connection.query('select * from remedio', (err, resp) => {
    if (err) throw err
    // console.log(resp)
    res.json(resp)
  })


})

module.exports = app => app.use('/foods', router)