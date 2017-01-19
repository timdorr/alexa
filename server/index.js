const chromecast = require('./chromecast')

const express = require('express')
const logger = require('morgan')

const app = express()
const port = process.env.PORT || 3000

app.use(logger('dev'))

app.use('/chromecast', chromecast)

app.listen(port, (err) => {
  if (err) {
    console.error(err)
  } else {
    console.info('==> 🌎  Listening on port %s.', port)
  }
})
