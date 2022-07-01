const notFound = (req, res, next) => {
  return res.render("404", {
    title: "Not found"
  })
}

const errorHandler = (error, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode
  res.status(statusCode)
  console.log(error.message)
  console.log(error.stack)
  /* process.env.NODE_ENV === "production" ? console.log(error.stack) : "⛔⛔" */
}

module.exports = {
  notFound,
  errorHandler,
}