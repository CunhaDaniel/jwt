const express = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const CONN = require('../database/connection')
const authConfig = require('../config/auth')

async function encpryt (password) {
  const hash = await bcrypt.hash(password, 10)
  return hash
}

async function checkUsers (email) {
  const users = await getUser()
  let flag = false
  users.forEach(element => {
    if (element.email === email) {
      flag = true
    }
  })
  return flag
}

async function getUser () {
  const connection = await CONN()

  const [rows] = await connection.query('select * from usuarios')
  connection.end()
  return rows
}

async function getUserByEmail (email) {
  const users = await getUser()
  let user = {}
  users.forEach(element => {
    if (element.email === email) {
      user = element
    }
  })
  return user
}

const router = express.Router()

router.post('/register', async (req, res) => {
  const { email } = req.body

  try {
    if (await checkUsers(email)) {
      return res.status(400).send({ error: 'User already exists' })
    }
    const { nome, password } = req.body
    const user = {
      nome: nome,
      email: email,
      password: password
    }
    user.password = await encpryt(user.password)

    const connection = await CONN()
    await connection.query(`insert into usuarios (email,password,acess_level) values ('${user.email}','${user.password}',1)`).catch(err => console.log(err))

    res.json(user)

  } catch (error) {
    console.log(error)
    return res.status(400).send({ error: 'Registration failed' })
  }
})
router.post('/authenticate', async (req, res) => {
  const { email, password } = req.body
  const user = await getUserByEmail(email)

  if (!user) {
    return res.status(404).send({ error: 'User not found' })
  }
  const compare = await bcrypt.compare(password, user.password).catch(err => console.log(err))
  if (!compare) {
    return res.status(404).send({ error: 'Password incorrect' })
  }
  const token = jwt.sign({ id: user.id }, authConfig.secret, {
    expiresIn: 60 * 60
  })
  user.password = ''
  console.log(user)
  res.json({ token: token, user: user })
})

module.exports = app => app.use('/auth', router)
