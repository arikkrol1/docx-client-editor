// @ts-check

const express = require('express')
const config = require('config')
const bodyParser = require('body-parser')
const logger = require('./utils/logger')
const jsonParser = bodyParser.json({ 'limit': '30mb' })
const multer = require('multer')
const upload = multer({
  'storage': multer.memoryStorage(),
  'limits': {
    'fileSize': config.get('multer.limits.fileSize')
  }
})

const saveAsDocx = (req, res) => {
  console.log(req.body)
}

const loadDocx = async (req, res) => {
  try {
    const file = req.file
    const fileName = file.originalname

    console.log(file)
    

    logger.info(`upload succeeded for ${file.originalname} `)

    res.status(200).send({'filename': `${fileName}`})
  } catch (err) {
    logger.error(err)
    res.status(500).send({'status': 'failed'})
  }
}

const initRouter = () => {
  const router = express.Router()
  router.post(`/save-as-docx`, jsonParser, saveAsDocx)
  router.post(`/load-docx`, upload.single('file'), loadDocx)
  return router
}

module.exports = { initRouter }
