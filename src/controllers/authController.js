const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mysql = require('mysql2/promise')

// const connection = require('../database/connection')
const User = require('../models/user');
const authConfig = require('../config/auth')
const pool = require('../midllewares/pool_factory')
const poolConnect = require('../midllewares/pool_connect')
const app = express();


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

async function getUser(email) {

  try {
    const connection = await mysql.createConnection({
    host: 'db4free.net',
    port: 3306,
    user: 'crazylego',
    password: '9nyvwEfV',
    database: 'stenergia'
    
  });
  const [rows] = await connection.query('select * from usuarios')
  return rows
  } catch (error) {
    throw error;
  }
}

async function getUserByEmail(email){

  const users = await getUser()

  let user = {}

  users.forEach(element => {
    if(element.email == email){
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
    // console.log("MEUOVO")

    const { nome, password } = req.body;
    const user = {
      nome: nome,
      email: email,
      password: password
    }
    user.password = await encpryt(user.password)

    try {
      const connection = await mysql.createConnection({
        host: 'db4free.net',
        port: 3306,
        user: 'crazylego',
        password: '9nyvwEfV',
        database: 'stenergia'
      });
      connection.query(`insert into usuarios (email,senha) values ('${user.email}','${user.password}')`)
    } catch (error) {

    }
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

  console.log(user)

  if (!user)
    return res.status(404).send({ error: "User not found" })

  if (!await bcrypt.compare(password, user.senha))
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