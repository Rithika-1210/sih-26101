/**
 * SkillVista — DistilBERT AI Recommendation Client Service
 * Interacts with FastAPI microservice (http://localhost:8000/match) or Node API backend (/api/ai/match)
 */

const DistilBertService = {
  // Service configuration
  config: {
    directUrl: 'http://localhost:8000/match',
    backendUrl: '/api/ai/match',
  },

  /**
   * Match a skill gap against available iGOT Karmayogi courses using DistilBERT semantic embeddings
   * @param {string} skillGap - Identified skill gap (e.g., "Python for Data Analysis & Statistical Sampling")
   * @param {Array} courses - List of course objects [{ id, title, description, provider }]
   * @returns {Promise<Array>} Ranked recommendations with cosine similarity scores
   */
  async matchCourses(skillGap, courses = []) {
    if (!skillGap || !courses.length) return [];

    const payload = {
      skill_gap: skillGap,
      courses: courses.map(c => ({
        id: c.id || c.courseId || '',
        title: c.title || c.name || '',
        description: c.description || c.summary || c.title || '',
        provider: c.provider || 'iGOT Karmayogi'
      }))
    };

    // Strategy 1: Try Python FastAPI directly
    try {
      const response = await fetch(this.config.directUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (response.ok) {
        const data = await response.json();
        console.log('🤖 DistilBERT AI Match (Direct FastAPI):', data);
        return Array.isArray(data) ? data : (data.results || []);
      }
    } catch (e) {
      console.info('ℹ️ Direct FastAPI unavailable, trying Node backend proxy...');
    }

    // Strategy 2: Call Node backend proxy (/api/ai/match)
    try {
      const response = await fetch(this.config.backendUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (response.ok) {
        const data = await response.json();
        console.log('🤖 DistilBERT AI Match (Node Proxy):', data);
        return Array.isArray(data) ? data : (data.results || []);
      }
    } catch (e) {
      console.warn('⚠️ Node proxy AI match offline. Using local semantic matching.');
    }

    // Strategy 3: Local fallback calculation
    return this._localSemanticMatch(skillGap, payload.courses);
  },

  _localSemanticMatch(skillGap, courses) {
    const gapWords = skillGap.toLowerCase().split(/\s+/).filter(w => w.length > 2);
    return courses.map(c => {
      const text = `${c.title} ${c.description}`.toLowerCase();
      let scoreCount = 0;
      gapWords.forEach(w => {
        if (text.includes(w)) scoreCount += 1;
      });
      const rawScore = gapWords.length ? (scoreCount / gapWords.length) : 0.5;
      const score = Math.min(0.96, Math.max(0.42, rawScore * 0.45 + 0.48));
      return {
        course_id: c.id,
        title: c.title,
        provider: c.provider,
        score: parseFloat(score.toFixed(4))
      };
    }).sort((a, b) => b.score - a.score);
  }
};

window.DistilBertService = DistilBertService;
