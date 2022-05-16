require('./db/mongoose')
const express = require('express')
const userRouter = require('./routers/user')
const dashboardRouter = require('./routers/dashboard')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')

const app = express()

app.use(express.json())
app.use(bodyParser.json())
app.use(express.urlencoded({extended: false}))
app.use(cookieParser())
app.use(express.static(__dirname + '/public'));
app.use(userRouter)
app.use(dashboardRouter)

app.set("view-engine", "ejs")

app.all('/*', (req, res) => {
  res.send('<h1>404 Page Not Found</h1>')
})
const port = process.env.PORT

app.listen(port, () => {
  console.log('server is listening on port ' + port);
})