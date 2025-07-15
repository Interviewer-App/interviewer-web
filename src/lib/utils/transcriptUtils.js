/**
 * Utility functions for processing video call transcripts
 */

export const TranscriptUtils = {
  /**
   * Calculate conversation statistics from transcript
   * @param {Array} transcript - Array of transcript entries
   * @returns {Object} Statistics object
   */
  getConversationStats: (transcript) => {
    const interviewerEntries = transcript.filter(entry => entry.type === 'interviewer');
    const candidateEntries = transcript.filter(entry => entry.type === 'candidate');
    
    const interviewerWordCount = interviewerEntries.reduce((total, entry) => 
      total + entry.text.split(' ').length, 0
    );
    
    const candidateWordCount = candidateEntries.reduce((total, entry) => 
      total + entry.text.split(' ').length, 0
    );
    
    const totalDuration = transcript.length > 0 ? 
      new Date(transcript[transcript.length - 1].timestamp) - new Date(transcript[0].timestamp) : 0;
    
    return {
      totalEntries: transcript.length,
      interviewerEntries: interviewerEntries.length,
      candidateEntries: candidateEntries.length,
      interviewerWordCount,
      candidateWordCount,
      totalWordCount: interviewerWordCount + candidateWordCount,
      speakingRatio: {
        interviewer: interviewerWordCount / (interviewerWordCount + candidateWordCount) || 0,
        candidate: candidateWordCount / (interviewerWordCount + candidateWordCount) || 0
      },
      duration: totalDuration,
      avgWordsPerEntry: (interviewerWordCount + candidateWordCount) / transcript.length || 0
    };
  },

  /**
   * Extract all questions from interviewer in the transcript
   * @param {Array} transcript - Array of transcript entries
   * @returns {Array} Array of potential questions
   */
  extractQuestions: (transcript) => {
    return transcript
      .filter(entry => entry.type === 'interviewer')
      .map(entry => entry.text)
      .filter(text => text.includes('?') || text.toLowerCase().includes('tell me') || text.toLowerCase().includes('what'))
      .map((text, index) => ({
        id: index + 1,
        question: text,
        timestamp: transcript.find(entry => entry.text === text)?.timestamp
      }));
  },

  /**
   * Get conversation turns (who spoke when)
   * @param {Array} transcript - Array of transcript entries
   * @returns {Array} Array of conversation turns
   */
  getConversationTurns: (transcript) => {
    const turns = [];
    let currentSpeaker = null;
    let currentTurn = null;
    
    transcript.forEach((entry, index) => {
      if (entry.type !== currentSpeaker) {
        if (currentTurn) {
          turns.push(currentTurn);
        }
        currentTurn = {
          speaker: entry.type,
          startTime: entry.timestamp,
          entries: [entry],
          wordCount: entry.text.split(' ').length
        };
        currentSpeaker = entry.type;
      } else {
        currentTurn.entries.push(entry);
        currentTurn.wordCount += entry.text.split(' ').length;
      }
      
      if (index === transcript.length - 1 && currentTurn) {
        turns.push(currentTurn);
      }
    });
    
    return turns;
  },

  /**
   * Search for specific keywords in the transcript
   * @param {Array} transcript - Array of transcript entries
   * @param {Array} keywords - Array of keywords to search for
   * @returns {Array} Array of matches with context
   */
  searchKeywords: (transcript, keywords) => {
    const matches = [];
    
    keywords.forEach(keyword => {
      transcript.forEach((entry, index) => {
        if (entry.text.toLowerCase().includes(keyword.toLowerCase())) {
          matches.push({
            keyword,
            speaker: entry.type,
            text: entry.text,
            timestamp: entry.timestamp,
            entryIndex: index,
            context: {
              previous: index > 0 ? transcript[index - 1].text : null,
              next: index < transcript.length - 1 ? transcript[index + 1].text : null
            }
          });
        }
      });
    });
    
    return matches;
  },

  /**
   * Generate a conversation summary
   * @param {Array} transcript - Array of transcript entries
   * @returns {Object} Summary object
   */
  generateSummary: (transcript) => {
    const stats = TranscriptUtils.getConversationStats(transcript);
    const questions = TranscriptUtils.extractQuestions(transcript);
    const turns = TranscriptUtils.getConversationTurns(transcript);
    
    return {
      overview: {
        totalDuration: Math.round(stats.duration / 1000 / 60), // minutes
        totalExchanges: turns.length,
        questionsAsked: questions.length,
        speakingBalance: {
          interviewer: Math.round(stats.speakingRatio.interviewer * 100),
          candidate: Math.round(stats.speakingRatio.candidate * 100)
        }
      },
      keyMetrics: {
        avgResponseLength: stats.candidateWordCount / stats.candidateEntries || 0,
        avgQuestionLength: stats.interviewerWordCount / stats.interviewerEntries || 0,
        conversationFlow: turns.length > 0 ? turns.length / (stats.duration / 1000 / 60) : 0 // turns per minute
      },
      timeline: transcript.map((entry, index) => ({
        sequence: index + 1,
        speaker: entry.type,
        timestamp: new Date(entry.timestamp).toLocaleTimeString(),
        preview: entry.text.substring(0, 50) + (entry.text.length > 50 ? '...' : '')
      }))
    };
  },

  /**
   * Export transcript in different formats
   * @param {Array} transcript - Array of transcript entries
   * @param {String} format - Export format ('json', 'txt', 'csv')
   * @returns {String} Formatted transcript data
   */
  exportAs: (transcript, format = 'json') => {
    switch (format.toLowerCase()) {
      case 'txt':
        return transcript.map(entry => 
          `[${new Date(entry.timestamp).toLocaleTimeString()}] ${entry.type.toUpperCase()}: ${entry.text}`
        ).join('\n');
        
      case 'csv':
        const csvHeader = 'timestamp,speaker,text\n';
        const csvRows = transcript.map(entry => 
          `"${entry.timestamp}","${entry.type}","${entry.text.replace(/"/g, '""')}"`
        ).join('\n');
        return csvHeader + csvRows;
        
      case 'json':
      default:
        return JSON.stringify(transcript, null, 2);
    }
  },

  /**
   * Validate transcript format
   * @param {Array} transcript - Array to validate
   * @returns {Object} Validation result
   */
  validateTranscript: (transcript) => {
    const errors = [];
    const warnings = [];
    
    if (!Array.isArray(transcript)) {
      errors.push('Transcript must be an array');
      return { isValid: false, errors, warnings };
    }
    
    transcript.forEach((entry, index) => {
      if (!entry.type || !['interviewer', 'candidate'].includes(entry.type)) {
        errors.push(`Entry ${index}: Invalid or missing speaker type`);
      }
      
      if (!entry.text || typeof entry.text !== 'string') {
        errors.push(`Entry ${index}: Invalid or missing text`);
      }
      
      if (!entry.timestamp || isNaN(new Date(entry.timestamp).getTime())) {
        errors.push(`Entry ${index}: Invalid or missing timestamp`);
      }
      
      if (entry.text && entry.text.length < 3) {
        warnings.push(`Entry ${index}: Very short text (may be noise)`);
      }
    });
    
    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      entryCount: transcript.length
    };
  }
};

export default TranscriptUtils;
