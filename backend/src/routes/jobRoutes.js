const express = require('express');
const router = express.Router();
const jobController = require('../controllers/jobController');

router.post('/analyze', jobController.analyzeJD);
router.post('/score', jobController.scoreResume);

module.exports = router;
