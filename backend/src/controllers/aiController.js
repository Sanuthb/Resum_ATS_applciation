const aiService = require('../services/aiService');

class AIController {
  async optimizeBulletPoints(req, res) {
    const { bulletPoints, targetKeywords } = req.body;
    try {
      const optimized = await aiService.optimizeResumeBulletPoints(bulletPoints, targetKeywords);
      res.json(optimized);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async generateCoverLetter(req, res) {
    const { resumeContent, jdContent } = req.body;
    try {
      const coverLetter = await aiService.generateCoverLetter(resumeContent, jdContent);
      res.json({ coverLetter });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new AIController();
