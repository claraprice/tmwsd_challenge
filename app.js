const express = require('express')
const app = express()
const port = 3000

const messagesRoute = require('./routes/messages')
app.use('/', messagesRoute)

app.listen(port, () => {
  console.log(`TMWSD is listening at http://localhost:${port}`)
})
