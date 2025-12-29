import express from 'express'
import * as socialController from '../controllers/socialController.js'
import auth from '../middleware/auth.js'

const router = express.Router()

// Start OAuth flow (redirect) — provider-specific auth must be configured via env
router.get('/start/:provider', auth, socialController.startOAuth)

// Callback endpoint — accepts tokens (dev) or handles real provider callbacks
router.post('/callback/:provider', auth, socialController.callback)

// List connected accounts for current user
router.get('/', auth, socialController.listAccounts)

// Disconnect account
router.post('/disconnect/:provider', auth, socialController.disconnect)

// Manual sync/refresh tokens for a provider
router.post('/refresh/:provider', auth, socialController.sync)

export default router

