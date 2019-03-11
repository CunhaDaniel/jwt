const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mysql = require('mysql2/promise')

const CONN = require('../database/connection')
const authConfig = require('../config/auth')
const pool = require('../database/pool_factory')

async function encpryt(password) {
  // console.log(password)
  const hash = await bcrypt.hash(password, 10);
  return hash
}

async function checkUsers(email) {
  const users = await getUser()
  let flag = false
  users.forEach(element => {
    if (element.email == email) {
      flag = true
    }
  });
  return flag;
}

async function getUser() {

  // const rows = []
  // console.log("DELE")
  // await pool.getConnection(async (err, connection) => {
  //   await connection.query('select * from usuarios', (err, resp) => {
  //     if (err) throw err;
  //     // rows = resp
  //     console.log(resp)
  //   })

    // console.log(values)
  // })
  // console.log("Dale")
  const connection = await CONN()

  const [rows] = await connection.query('select * from usuarios')
  connection.end()
  return rows
}

async function getUserByEmail(email) {

  const users = await getUser()

  let user = {}

  users.forEach(element => {
    // console.log(element)
    if (element.email == email) {
      user = element
    }
  })


  return user
}

const router = express.Router();

// app.use(poolConnect(pool))

router.post('/register', async (req, res) => {

  const { email } = req.body

  try {
    if (await checkUsers(email))
      return res.status(400).send({ error: 'User already exists' })

    const { nome, password } = req.body;
    const user = {
      nome: nome,
      email: email,
      password: password
    }
    user.password = await encpryt(user.password)

    const connection = await mysql.createConnection({
      host: 'db4free.net',
      port: 3306,
      user: 'crazylego',
      password: '9nyvwEfV',
      database: 'stenergia'
    }).catch(err => console.log(err))
    await connection.query(`insert into usuarios (email,senha) values ('${user.email}','${user.password}')`).catch(err => console.log(err))

    res.json(user);

  } catch (error) {
    console.log(error)
    return res.status(400).send({ error: 'Registration failed' });
  }
});


router.post('/authenticate', async (req, res) => {
  const { email, password } = req.body

  // await new Promise(resolve => setTimeout(resolve, 5000));
  const user = await getUserByEmail(email)

  // console.log(user)

  if (!user)
    return res.status(404).send({ error: "User not found" })


  // console.log(user)

  const compare = await bcrypt.compare(password, user.senha).catch(err => console.log(err))
  if (!compare)
    return res.status(404).send({ error: "Password incorrect" })

  // user.password = undefined

  const token = jwt.sign({ id: user.id }, authConfig.secret, {
    expiresIn: 60,
  })

  userResp = user
  // userResp.password =undefined
  console.log(token)
  res.json({ token: token })
})

module.exports = app => app.use('/auth', router);