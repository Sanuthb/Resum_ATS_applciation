const groq = require('../config/groq');

class AIService {
  async analyzeJobDescription(jdText) {
    const prompt = `Extract key skills, technologies, and required experience from this job description. Return as a JSON object with keys: skills, technologies, and focus_areas.\n\nJD: ${jdText}`;
    
    const completion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'llama3-8b-8192',
      response_format: { type: 'json_object' }
    });
    
    const parsed = JSON.parse(completion.choices[0].message.content);
    const skills = Array.isArray(parsed.skills) ? parsed.skills : [];
    const technologies = Array.isArray(parsed.technologies) ? parsed.technologies : [];
    const focus_areas = Array.isArray(parsed.focus_areas) ? parsed.focus_areas : [];
    const keywords = [...skills, ...technologies, ...focus_areas].filter((v, i, a) => a.indexOf(v) === i);
    return { skills, technologies, focus_areas, keywords };
  }

  async optimizeResumeBulletPoints(bulletPoints, targetKeywords) {
    const prompt = `Rewrite these resume bullet points to better align with keywords: ${targetKeywords.join(', ')}. Use active verbs and quantify impact. Return a JSON array of strings.\n\nBullets: ${JSON.stringify(bulletPoints)}`;
    
    const completion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'llama3-70b-8192',
      response_format: { type: 'json_object' }
    });
    
    const res = JSON.parse(completion.choices[0].message.content);
    return Array.isArray(res) ? res : (res.optimized || res.bullets || Object.values(res)[0]);
  }

  async generateCoverLetter(resumeContent, jdContent) {
    const prompt = `Write a tailored cover letter based on this resume and job description. Return a JSON object with a "coverLetter" key.\n\nResume: ${JSON.stringify(resumeContent)}\n\nJD: ${jdContent}`;
    
    const completion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'llama3-70b-8192',
      response_format: { type: 'json_object' }
    });
    
    return JSON.parse(completion.choices[0].message.content).coverLetter;
  }
}

module.exports = new AIService();