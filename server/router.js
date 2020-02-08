// @ts-check

const express = require('express')
const config = require('config')
const bodyParser = require('body-parser')
const logger = require('./utils/logger')
const docxJsonConverter = require('./handlers/docx-json-converter')
const jsonParser = bodyParser.json({ 'limit': '30mb' })
const multer = require('multer')
const upload = multer({
  'storage': multer.memoryStorage(),
  'limits': {
    'fileSize': config.get('multer.limits.fileSize')
  }
})

/**
 * @param {{name: string, stream:any}} file 
 */
const sendFileStream = (req, res, file) => {
  res.setHeader('Content-disposition', `attachment; filename=${encodeURI(file.name)}`)
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')
  res.setHeader('Access-Control-Expose-Headers', 'Content-Disposition')

  file.stream.on('error', (err) => {
    logger.error('error returning file:', err)
    res.status(500).end()
  })

  file.stream.on('end', () => {
    logger.info('returning file succeeded')
  })

  file.stream.pipe(res)
}

const saveAsDocx = async (req, res) => {
  try {
    const fileData = req.body
    const fileName = fileData['file-name']
    logger.info(`converting file ${fileName} to docx`)
    const docxFileData =  docxJsonConverter.convertJsonToDocx(fileData)
    sendFileStream(req, res, docxFileData)  
  } catch (err) {
    logger.error(err)
    res.status(500).send({ 'status': 'failed' })
  }
}

const loadDocx = async (req, res) => {
  try {
    const file = req.file
    logger.info(`converting file ${file.originalname} to json`)
    const docJson = await docxJsonConverter.convertDocxToJson(file)
    const docData = {
      'file-name': file.originalname,
      'doc-content': docJson
    }
    logger.info(`converting succeeded for ${file.originalname} `)
    res.status(200).send(docData)
  } catch (err) {
    logger.error(err)
    res.status(500).send({ 'status': 'failed' })
  }
}

const initRouter = () => {
  const router = express.Router()
  router.post(`/save-as-docx`, jsonParser, saveAsDocx)
  router.post(`/load-docx`, upload.single('file'), loadDocx)
  return router
}

module.exports = { initRouter }
