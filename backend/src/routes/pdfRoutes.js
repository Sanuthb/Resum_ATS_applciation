const express = require('express');
const router = express.Router();
const pdfController = require('../controllers/pdfController');

router.post('/generate', pdfController.generateResume);

module.exports = router;
