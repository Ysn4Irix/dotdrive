/**
 * @author Ysn4Irix
 * @email ysn4irix@gmail.com
 * @create date 30-06-2022
 * @modify date 01-07-2022
 * @desc [File.controller]
 */

const File = require("../models/File.model")
const {
  hash,
  compare
} = require("bcrypt")

module.exports = {
  index: (req, res) => {
    res.render("index", {
      title: "dotdrive"
    })
  },
  upload: async (req, res) => {
    if (!req.file) {
      req.flash("error", "File is required! choose a file")
      res.render("index", {
        title: "dotdrive"
      })
      return
    }

    const {
      path,
      originalname,
      size
    } = req.file

    const {
      password
    } = req.body

    const fileData = {
      path,
      originalName: originalname,
      size
    }

    if (password != null && password !== "") {
      fileData.password = await hash(password, 16)
    }

    const file = await File.create(fileData)

    res.render("uploaded", {
      title: "dotdrive",
      fileLink: `${req.headers.origin}/file/${file.id}`
    })
  },
  download: async (req, res) => {
    const {
      id
    } = req.params

    try {
      const file = await File.findById(id)

      const {
        password
      } = req.body

      if (file.password != null) {
        if (password == null) {
          res.render("password", {
            title: "dotdrive"
          })
          return
        }

        if (!(await compare(password, file.password))) {
          req.flash("error", "Incorrect password!")
          res.render("password", {
            title: "dotdrive"
          })
          return
        }
      }
      res.download(file.path, file.originalName)
    } catch {
      res.render("fileNotFound", {
        title: "File not found"
      })
      return
    }

  }
}