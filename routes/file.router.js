const router = require("express").Router()
const file = require("../controllers/file.controller")
const multer = require("multer")

const upload = multer({
    dest: "drive"
})

/* Render index page */
router.get("/", file.index)

/* Upload the file */
router.post("/upload", upload.single("file"), file.upload)

/* Download page */
router.get("/file/:id", file.download)
router.post("/file/:id", file.download)

module.exports = router