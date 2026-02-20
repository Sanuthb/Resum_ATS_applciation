const pdfService = require('../services/pdfService');

class PDFController {
  async generateResume(req, res) {
    const { htmlContent } = req.body;
    try {
      const pdfBuffer = await pdfService.generateResumePDF(htmlContent);
      res.set({
        'Content-Type': 'application/pdf',
        'Content-Length': pdfBuffer.length,
      });
      res.send(pdfBuffer);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new PDFController();
