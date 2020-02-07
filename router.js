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

const testJson = (req, res) => {
  console.log(req.body)
}

const handleUpload = async (req, res) => {
  try {
    const file = req.file
    const fileName = file.originalname

    logger.info(`upload succeeded for ${req.file.originalname} `)

    res.status(200).send({'filename': `${fileName}`})
  } catch (err) {
    
    res.status(500).send({'status': 'failed'})
  }
}

const initRouter = () => {
  const router = express.Router()
  router.get(`/test-json`, jsonParser, testJson)
  router.post(`/doc`, upload.single('fileToUpload'), handleUpload)
  return router
}

module.exports = { initRouter }
