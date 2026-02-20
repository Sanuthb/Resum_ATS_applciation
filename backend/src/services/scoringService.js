class ScoringService {
  calculateScore(resumeData, jdKeywords) {
    // Basic keyword matching extraction for now
    // In a real app, this would use semantic similarity too
    
    const resumeText = JSON.stringify(resumeData).toLowerCase();
    const matchedKeywords = jdKeywords.filter(keyword => 
      resumeText.includes(keyword.toLowerCase())
    );

    const matchPercentage = (matchedKeywords.length / jdKeywords.length) * 100;
    
    let score = Math.round(matchPercentage);
    
    // Skill alignment boost
    // Formatting check boost
    // Experience relevance boost (mocked for now)
    
    const suggestions = [];
    if (score < 50) suggestions.push('Consider adding more industry-specific technical skills.');
    if (score < 70) suggestions.push('Optimize your bullet points to reflect job responsibilities.');
    if (!resumeText.includes('achieved') && !resumeText.includes('improved')) {
      suggestions.push('Use more impact-focused verbs like "achieved", "led", or "implemented".');
    }

    return {
      score,
      matchedKeywords,
      missingKeywords: jdKeywords.filter(k => !matchedKeywords.includes(k)),
      suggestions
    };
  }
}

module.exports = new ScoringService();
