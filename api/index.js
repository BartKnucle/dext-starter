// INDEX.JS
const express = require('express')
const app = express()

app.get('/', (req, res, next) => {
  res.send('API root')
})

// export the server middleware
module.exports = {
  path: '/api',
  handler: app
}
