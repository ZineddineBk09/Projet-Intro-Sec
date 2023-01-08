// create a simple express app that connect to my sql database
const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const mysql = require('mysql')
const cors = require('cors')
require('dotenv').config()

// parse application/json
app.use(bodyParser.json())
app.use(cors())

// create database connection
const conn = mysql.createConnection({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DB,
})

// connect to database
conn.connect((err) => {
  if (err) throw err
  console.log('Mysql Connected...')
})

// API
// login
app.post('/api/login', (req, res) => {
  let data = { email: req.body.email, password: req.body.password }
  console.log(data)

  if (data.email && data.password) {
    // write first sql query that let sql injection
    let sql = `SELECT * FROM USERS WHERE email = '${data.email}' AND password = '${data.password}'`
    let sql_ = `SELECT * FROM USERS WHERE email = ? AND password = ?`
    console.log('sql', sql)
    try {
      let query = conn.query(sql, [data.password], (err, result) => {
        console.log('result query', result)
        if (err) {
          // avoid server crash
          return res.send(
            JSON.stringify({ status: 500, error: err, response: null })
          )
        }
        res.send(JSON.stringify({ status: 200, error: null, response: result }))
      })
    } catch (err) {
      console.log('-----------------------------2-----------------------')
      console.log(err)
    }
  }
})

// get comments
app.get('/api/comment/getComments', (req, res) => {
  let sql = 'SELECT * FROM comments'
  let query = conn.query(sql, (err, results) => {
    if (err) throw err
    res.send(JSON.stringify({ status: 200, error: null, response: results }))
  })
})

// create comment
app.post('/api/comment/createComment', (req, res) => {
  let data = { comment: req.body.comment }
  console.log('Request Body: ', req.body)

  if (data.comment) {
    // write first sql query that let sql injection
    let sql = `INSERT INTO comments (comment) VALUES (?)`
    try {
      let query = conn.query(sql, [data.comment], (err, result) => {
        console.log('result query', result)
        if (err) {
          // avoid server crash
          return res.send(
            JSON.stringify({ status: 500, error: err, response: null })
          )
        }
        res.send(JSON.stringify({ status: 200, error: null, response: result }))
      })
    } catch (err) {
      console.log('-----------------------------2-----------------------')
      console.log(err)
    }
  }
})

// serve static files
app.use(express.static('public'))

// PAGES
// index page
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html')
})

// login page
app.get('/login', (req, res) => {
  res.sendFile(__dirname + '/public/login.html')
})

// xss page
// login page
app.get('/xss', (req, res) => {
  res.sendFile(__dirname + '/public/xss.html')
})

// start server
app.listen(3000, () => {
  console.log('Server started on port 3000...')
})
