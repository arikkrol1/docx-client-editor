// @ts-check

(async () => {
  process.on('unhandledRejection', (reason, p) => {
    console.log('Unhandled Rejection at: Promise', p, 'reason:', reason)
  })

  const express = require('express')
  const app = express()
  const config = require('config')

  const PORT = 8080
  
  
  const router = require('./router').initRouter()
  
  try {
    app.use(router)
    app.get('/status', (req, res) => {
      res.status(200).send({
        'Status': `OK`
      })
    })
    
    app.listen(PORT, () => logger.info(`Editor service is up and running on port ${PORT}`))
  } catch (err) {
    logger.error(`Failed to start Editor service:`, err)
    return err
  }
})()
