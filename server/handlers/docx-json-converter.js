// @ts-check

const JSZip = require('jszip')
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
  const zip = await JSZip.loadAsync(docBuffer)
  
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

const convertDocxToJson = async (docDocx) => {
  const xmlFilesMap = extractXmlFileStrings(docDocx.buffer)
  
  

}

const convertJsonToDocx = (docJson) => {
  // TODO: complete
}


module.exports = {
  convertDocxToJson,
  convertJsonToDocx
}
