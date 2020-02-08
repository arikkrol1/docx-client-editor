// @ts-check

const jsZip = require('jszip')
const xml2js = require('xml2js')
const logger = require('../utils/logger')

/**
 * Removing leading BOM char (0xFEFF) if exists
 * @param {string} str 
 * @returns {string}
 */
const removeBOM = (str) => {
  if (str.charCodeAt(0) === 0xFEFF) {
    return str.slice(1) // drop first BOM character
  }
  return str
}

/**
 * @param {ArrayBuffer | Buffer} docBuffer 
 * @returns {Promise<Object.<string, string>>}
 */
const extractXmlFileStrings = async (docBuffer) => {
  logger.info('Starting to extract xml strings from doc buffer')
  const zip = await jsZip.loadAsync(docBuffer)
  
  const res = {}
  for (const fileName of Object.keys(zip.files)) {
    const file = zip.file(fileName)
    const xml = await file.async('string')
    const cleanXml = removeBOM(xml)
    res[fileName] = cleanXml
  }
  // @ts-ignore
  return res
}

/**
 * @param {Object.<string, string>} xmlFilesMap 
 * @returns {Promise<Object.<string, any>>}
 */
const translateXmlsToJsons = async (xmlFilesMap) => {
  const parser = new xml2js.Parser()
  const keys = Object.keys(xmlFilesMap)
  const res = {}
  for (const key of keys) {
    res[key] = await parser.parseStringPromise(xmlFilesMap[key])
  }
  return res
}

/**
 * @param {{buffer: Buffer}} docDocx 
 * @returns {Promise<Object.<string, any>>}
 */
const convertDocxToJson = async (docDocx) => {
  const xmlFilesMap = await extractXmlFileStrings(docDocx.buffer)
  const jsonFilesMap = await translateXmlsToJsons(xmlFilesMap)
  return jsonFilesMap
}

const convertJsonToDocx = (docJson) => {
  // TODO: complete
}


module.exports = {
  convertDocxToJson,
  convertJsonToDocx
}
