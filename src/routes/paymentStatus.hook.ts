import express from 'express'
import { webHook } from '@/controllers/hook.payment.controller'

const router = express.Router()


router.post('/webhook', webHook)


export default router
