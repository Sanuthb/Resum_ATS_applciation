const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');
const { requirePro } = require('../middleware/subscriptionMiddleware');

router.post('/optimize', requirePro, aiController.optimizeBulletPoints);
router.post('/cover-letter', requirePro, aiController.generateCoverLetter);

module.exports = router;
