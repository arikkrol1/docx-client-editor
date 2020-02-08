// @ts-check
const winston = require('winston')

const logger = winston.createLogger({
  level: 'info',
  // format: winston.format.json(),
  // defaultMeta: { service: 'user-service' },

  format: winston.format.combine(
    winston.format.errors({ stack: true }), // <-- use errors format
    winston.format.colorize(),
    winston.format.timestamp(),
    winston.format.prettyPrint()
  ),

  transports: [
    // new winston.transports.File({ filename: 'error.log', level: 'error' }),
    // new winston.transports.File({ filename: 'combined.log' })
  ]
})

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }))
}

module.exports = logger
