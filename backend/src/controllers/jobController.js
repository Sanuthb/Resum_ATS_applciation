const aiService = require('../services/aiService');
const scoringService = require('../services/scoringService');
const supabase = require('../config/supabase');

class JobController {
  async analyzeJD(req, res) {
    const { jdContent } = req.body;
    const user_id = req.user.id;
    try {
      const analysis = await aiService.analyzeJobDescription(jdContent);
      
      const { data, error } = await supabase
        .from('job_descriptions')
        .insert([{ 
          content: jdContent, 
          user_id, 
          extracted_keywords: analysis 
        }])
        .select();

      if (error) throw error;
      res.json({ id: data[0].id, analysis });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async scoreResume(req, res) {
    const { resume_id, job_id } = req.body;
    try {
      // Fetch resume and job description from DB
      const [resumeRes, jobRes] = await Promise.all([
        supabase.from('resumes').select('*').eq('id', resume_id).single(),
        supabase.from('job_descriptions').select('*').eq('id', job_id).single()
      ]);

      if (resumeRes.error || jobRes.error) throw new Error('Failed to fetch data');

      const resumeData = resumeRes.data.content;
      const jdKeywords = jobRes.data.extracted_keywords.technical_skills.concat(
        jobRes.data.extracted_keywords.keywords
      );

      const scoringResult = scoringService.calculateScore(resumeData, jdKeywords);
      
      res.json(scoringResult);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new JobController();
