/**
 * SkillVista — Application Configuration
 * ============================================
 * AI-Enabled Skill Intelligence & Learning Platform
 * for India's Official Statistical System (MoSPI / NSSTA)
 * Integrated with the iGOT Karmayogi Ecosystem
 */

window.CONFIG = {
  // --- Gemini AI ---
  GEMINI_API_KEY: 'YOUR_GEMINI_API_KEY',
  GEMINI_MODEL: 'gemini-3.6-flash',
  GEMINI_API_BASE: 'https://generativelanguage.googleapis.com/v1beta/models',

  // --- App Info ---
  APP_NAME: 'SkillVista',
  APP_TAGLINE: 'AI-Enabled Skill Intelligence & Learning Platform for India\'s Official Statistical System',
  APP_VERSION: '1.0.0',
  MINISTRY: 'Ministry of Statistics & Programme Implementation | NSSTA',
  SHORT_MINISTRY: 'MoSPI / NSSTA',
  SIH_PS: 'SIH26101',


  // --- iGOT Karmayogi ---
  IGOT_BASE_URL: 'https://igot.gov.in',
  IGOT_API_MOCK: true,

  // --- Storage ---
  STORAGE_PREFIX: 'skillvista_',
};

/** Helper to get/set localStorage with prefix */
window.Store = {
  set(key, value) {
    try {
      localStorage.setItem(CONFIG.STORAGE_PREFIX + key, JSON.stringify(value));
    } catch(e) { console.warn('Store.set failed:', e); }
  },
  get(key, fallback = null) {
    try {
      const item = localStorage.getItem(CONFIG.STORAGE_PREFIX + key);
      return item ? JSON.parse(item) : fallback;
    } catch(e) { return fallback; }
  },
  remove(key) {
    localStorage.removeItem(CONFIG.STORAGE_PREFIX + key);
  },
  clear() {
    Object.keys(localStorage)
      .filter(k => k.startsWith(CONFIG.STORAGE_PREFIX))
      .forEach(k => localStorage.removeItem(k));
  }
};
