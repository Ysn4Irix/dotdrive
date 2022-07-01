require("dotenv").config()
const express = require("express")
const path = require("path")
const logger = require("morgan")
const {
  connect,
  connection
} = require("mongoose")
const flash = require("express-flash")
const session = require("express-session")
const responseTime = require("response-time")
const hidePowerdby = require("hide-powered-by")

const file = require("./routes/file.router")
const middlewares = require("./helpers/middlewares")
const app = express()

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
app.set('trust proxy', 1)

app.use(express.static(path.join(__dirname, 'public')))
app.use(logger("dev"))
app.use(flash())
app.use(hidePowerdby())
app.use(responseTime())
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: true,
      maxAge: 6000
    }
  })
)
app.use(
  express.urlencoded({
    extended: true
  })
)

app.use("/", file)

app.use(middlewares.notFound)
app.use(middlewares.errorHandler)

connect(process.env.MONGODB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})

connection.on("connected", () => {
  console.log("🎉 mongoose connected to db")
})

connection.on("error", (err) => {
  console.log("mongoose connection error.", err.message)
})

connection.on("disconnected", () => {
  console.log("mongoose connection is disconnected.")
})

const port = process.env.PORT || 4000
const server = app.listen(port, () => {
  console.log(`🚀 server started => listening on PORT: ${port} with processId: ${process.pid}`)
})

process.on("SIGINT", () => {
  console.info("SIGINT signal received.")
  console.log("server is closing.")
  server.close(() => {
    console.log("server closed.")
    connection.close(false, () => {
      process.exit(0)
    })
  })
})

process.on("SIGTERM", () => {
  console.info("SIGTERM signal received.")
  console.log("server is closed.")
  server.close(() => {
    console.log("server closed.")
    connection.close(false, () => {
      process.exit(0)
    })
  })
})

module.exports = app