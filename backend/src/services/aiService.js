const groq = require('../config/groq');

class AIService {
  async analyzeJobDescription(jdContent) {
    const prompt = `
      Analyze the following job description and extract:
      1. Top 10 key technical skills.
      2. Top 5 soft skills.
      3. Important industry-specific keywords.
      4. A brief summary of the ideal candidate profile.

      Return the result in JSON format with the following keys:
      technical_skills, soft_skills, keywords, ideal_profile.

      Job Description:
      ${jdContent}
    `;

    try {
      const completion = await groq.chat.completions.create({
        messages: [{ role: 'user', content: prompt }],
        model: 'llama-3.3-70b-versatile',
        response_format: { type: 'json_object' },
      });

      return JSON.parse(completion.choices[0].message.content);
    } catch (error) {
      console.error('Error in analyzeJobDescription:', error);
      throw new Error('AI Analysis failed');
    }
  }

  async optimizeResumeBulletPoints(bulletPoints, targetKeywords) {
    const prompt = `
      Rewrite the following resume bullet points to better align with these target keywords: ${targetKeywords.join(', ')}.
      
      Guidelines:
      - Use strong action verbs.
      - Quantify impact where possible (even if you have to use placeholders like [X]%).
      - Maintain the original meaning and factual integrity.
      - Keep them concise and professional.

      Bullet Points:
      ${bulletPoints.map(bp => `- ${bp}`).join('\n')}

      Return the result as a JSON array of optimized strings.
    `;

    try {
      const completion = await groq.chat.completions.create({
        messages: [{ role: 'user', content: prompt }],
        model: 'llama-3.3-70b-versatile',
        response_format: { type: 'json_object' },
      });

      const response = JSON.parse(completion.choices[0].message.content);
      return Array.isArray(response) ? response : response.optimized_bullets;
    } catch (error) {
      console.error('Error in optimizeResume:', error);
      throw new Error('AI Optimization failed');
    }
  }

  async generateCoverLetter(resumeContent, jdContent) {
    const prompt = `
      Generate a professional and tailored cover letter based on the provide resume and job description.
      
      Resume:
      ${JSON.stringify(resumeContent)}

      Job Description:
      ${jdContent}

      Return the cover letter text in a JSON object with the key "cover_letter".
    `;

    try {
      const completion = await groq.chat.completions.create({
        messages: [{ role: 'user', content: prompt }],
        model: 'llama-3.3-70b-versatile',
        response_format: { type: 'json_object' },
      });

      return JSON.parse(completion.choices[0].message.content).cover_letter;
    } catch (error) {
      console.error('Error in generateCoverLetter:', error);
      throw new Error('Cover Letter generation failed');
    }
  }
}

module.exports = new AIService();
