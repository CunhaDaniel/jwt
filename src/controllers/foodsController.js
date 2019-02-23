const express = require('express')
const authMiddleware = require('../midllewares/auth')

const router = express.Router()

router.use(authMiddleware)

router.get('/', (req, res) => {
    res.send({ banana:10,maça:20 });
})

module.exports = app => app.use('/foods', router)