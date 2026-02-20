const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');

router.post('/optimize', aiController.optimizeBulletPoints);
router.post('/cover-letter', aiController.generateCoverLetter);

module.exports = router;
