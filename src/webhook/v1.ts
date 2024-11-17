import express from 'express'

const router = express.Router()

router.get('/', (req, res, next) => {
  console.log('Get v1 REQ.body WebHook')
  console.log(req.body)
  res.send('Get Ok')
})
