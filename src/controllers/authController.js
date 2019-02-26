const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mysql = require('mysql')

const User = require('../models/user');
const authConfig = require('../config/auth')
const pool = require('../midllewares/pool_factory')
const poolConnect = require('../midllewares/pool_connect')


const app = express();

const connection = mysql.createConnection({
  connectionLimit: 10,
  port: 3306,
  host: 'db4free.net',
  user: 'crazylego',
  password: `9nyvwEfV`,
  database: 'stenergia'
});

async function encpryt(password) {
  const hash = await bcrypt.hash(password, 10);
  return hash
}

function checkUsers(email) {
  User.forEach(element => {
    if (element.email === email)
      return true
    else
      return false
  })
}

function getUser(email) {
  let user = {}
  User.forEach(element => {
    if (element.email === email) {
      user = element
    }
  })
  if (user.name)
    return user
  else
    return null
}

const router = express.Router();

app.use(poolConnect(pool))



router.post('/register', async (req, res) => {

  const { email } = req.body

  try {
    if (checkUsers(email))
      return res.status(400).send({ error: 'User already exists' })

    const { nome, password } = req.body;
    const user = {
      nome: nome,
      email: email,
      password: password
    }
    user.password = await encpryt(user.password)
    res.json(user);

  } catch (error) {
    console.log(error)
    return res.status(400).send({ error: 'Registration failed' });
  }
});


router.post('/authenticate', async (req, res) => {
  const { email, password } = req.body

  const user = getUser(email)

  if (!user)
    return res.status(404).send({ error: "User not found" })

  if (!await bcrypt.compare(password, user.password))
    return res.status(404).send({ error: "Password incorrect" })

  user.password = undefined

  const token = jwt.sign({ id: user.id }, authConfig.secret, {
    expiresIn: 60,
  })

  let data = await connection.query('select * from usuarios',(err, results) => {
    data = results
  })

  await new Promise(resolve => setTimeout(resolve, 3000));

  console.log(data)

  res.json(token)
})

module.exports = app => app.use('/auth', router);