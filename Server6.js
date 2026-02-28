const express = require('express')
const app = express()
const cors = require('cors')
const path = require('path')

require('dotenv').config()
const PORT = process.env.PORT || 8005
app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`)
})
const dbConnect = require('./config/database')
dbConnect()
app.use(cors())
app.use(express.json())

// Serve frontend static files
app.use(express.static(path.join(__dirname, 'frontend')))

const todoRouter = require('./routes/todos')
app.use('/api/v1', todoRouter)

app.get('/login', (req, res) => {
  res.send('<h1>This is the login page</h1>')
})

app.get('/signup', (req, res) => {
  res.send('<h1>This is the signup page</h1>')
})

app.get('/home', (req, res) => {
  res.send('<h1>This is the home page</h1>')
})

// Serve frontend for root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'index.html'))
})
