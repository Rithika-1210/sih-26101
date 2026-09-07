/**
 * StatLearn AI — Competency Engine Service (React Compatible)
 */

window.CompetencyEngine = (function() {

  const DOMAINS = {
    statistical: {
      id: 'statistical',
      label: 'Statistical Competencies',
      shortLabel: 'Statistical',
      emoji: '📊',
      color: 'blue',
      colorHex: '#3b82f6',
      description: 'Survey design, national accounts, CPI/WPI, SDG indicator tracking, SDMX, data validation'
    },
    technical: {
      id: 'technical',
      label: 'Technical & Data Science',
      shortLabel: 'Technical',
      emoji: '💻',
      color: 'purple',
      colorHex: '#8b5cf6',
      description: 'Python, R, SQL, Machine Learning, GIS spatial analysis, cloud computing, big data'
    },
    digital_gov: {
      id: 'digital_gov',
      label: 'Digital Governance & Security',
      shortLabel: 'Digital Gov',
      emoji: '🏛️',
      color: 'teal',
      colorHex: '#14b8a6',
      description: 'Cybersecurity, DPDP Act 2023, India Stack, MeghRaj cloud, open data, e-Governance'
    },
    behavioural: {
      id: 'behavioural',
      label: 'Behavioural & Leadership',
      shortLabel: 'Behavioural',
      emoji: '🤝',
      color: 'saffron',
      colorHex: '#FF9933',
      description: 'Leadership, ethics, communication, project management, decision-making'
    }
  };

  const REQUIRED_LEVELS = {
    'Statistical Officer': { statistical: 4.5, technical: 3.5, digital_gov: 3.0, behavioural: 3.5 },
    'Deputy Director':    { statistical: 4.0, technical: 4.0, digital_gov: 4.0, behavioural: 4.5 },
    'Director':           { statistical: 4.0, technical: 3.5, digital_gov: 4.5, behavioural: 5.0 },
    'Data Analyst':        { statistical: 3.5, technical: 4.5, digital_gov: 3.5, behavioural: 3.0 },
    'Field Investigator':  { statistical: 3.5, technical: 2.5, digital_gov: 3.0, behavioural: 3.5 },
    'Research Officer':    { statistical: 4.5, technical: 4.0, digital_gov: 3.5, behavioural: 3.5 },
    'default':             { statistical: 4.0, technical: 3.5, digital_gov: 3.5, behavioural: 3.5 }
  };

  const QUESTIONS = {
    statistical: [
      { id: 's1', skill: 'survey_design', q: 'How experienced are you in designing sampling frames for large-scale national sample surveys (e.g. NSSO/PLFS)?', opts: ['No experience (0/5)', 'Basic concept knowledge (1-2/5)', 'Have assisted in sample selection (3/5)', 'Can independently design stratified samples (4/5)', 'Expert / Have published survey methodologies (5/5)'] },
      { id: 's2', q: 'What is your proficiency in compiling Consumer Price Index (CPI) and Wholesale Price Index (WPI) inflation series?', opts: ['Novice / No exposure', 'Understand weighting diagrams & Laspeyres formula', 'Can process raw price schedules from field units', 'Proficient in index revision & seasonal adjustments', 'Expert in national index compilation'] },
      { id: 's3', q: 'Rate your capability in SDG (Sustainable Development Goals) National Indicator Framework (NIF) tracking.', opts: ['Unfamiliar with NIF', 'Know basic 17 SDG goals', 'Can map departmental statistics to SDG targets', 'Regularly compute NIF metadata & indicator values', 'Lead SDG data auditing & reporting'] },
      { id: 's4', q: 'How comfortable are you using SDMX (Statistical Data and Metadata eXchange) standards for international data sharing?', opts: ['Never used SDMX', 'Understand data structure definitions (DSDs)', 'Can validate SDMX-ML XML structures', 'Can build SDMX data registries & APIs', 'Lead international SDMX compliance'] },
      { id: 's5', q: 'What is your level of expertise in National Accounts Statistics (GDP, GVA compilation)?', opts: ['Basic macroeconomic understanding', 'Know production/income/expenditure approaches', 'Can estimate sector GVA using benchmark data', 'Can compile quarterly GDP estimates', 'Expert in System of National Accounts (SNA 2008)'] },
      { id: 's6', q: 'Rate your ability to perform statistical imputation for missing data in large official datasets.', opts: ['No experience', 'Understand mean/hot-deck imputation', 'Can implement KNN & regression imputation', 'Use multiple imputation (MICE) in R/Python', 'Design statistical imputation protocols for official statistics'] },
      { id: 's7', q: 'How proficient are you in Data Quality Assessment Frameworks (DQAF) used by IMF/UN?', opts: ['No knowledge', 'Familiar with DQAF dimensions', 'Apply DQAF checklists on survey data', 'Conduct independent data quality audits', 'Formulate institutional data quality standards'] },
      { id: 's8', q: 'Rate your experience with Census data processing and demographic estimation methods.', opts: ['Novice', 'Can query tabular census reports', 'Process raw microdata files', 'Apply cohort-component population projections', 'Lead demographic analysis for policy formulation'] }
    ],
    technical: [
      { id: 't1', skill: 'python', q: 'What is your proficiency level in Python programming for statistical data analysis (pandas, numpy, scipy)?', opts: ['No Python knowledge', 'Can write basic scripts and data loops', 'Proficient with pandas, cleaning & aggregations', 'Can build machine learning pipelines (scikit-learn)', 'Expert — develop packages & production pipelines'] },
      { id: 't2', skill: 'r_lang', q: 'Rate your experience in R statistical programming and ggplot2 data visualization.', opts: ['No R knowledge', 'Basic syntax & read CSV files', 'Write tidyverse data wrangling scripts', 'Perform advanced econometric modeling & forecasting', 'Create R Shiny interactive statistical web dashboards'] },
      { id: 't3', skill: 'sql', q: 'How competent are you in writing SQL queries for relational databases (PostgreSQL/MySQL)?', opts: ['No SQL knowledge', 'Basic SELECT & WHERE queries', 'JOINs, GROUP BY & aggregations', 'Subqueries, window functions & indexing', 'Database architecture, performance tuning & stored procedures'] },
      { id: 't4', skill: 'gis', q: 'Rate your capability in GIS spatial analysis (QGIS / ArcGIS / GeoPandas) for official statistics.', opts: ['No GIS experience', 'Can overlay points on maps', 'Can create chloropleth boundary maps', 'Perform spatial join, spatial autocorrelation (Moran I)', 'Build spatial sampling models & satellite data integration'] },
      { id: 't5', skill: 'ai_ml', q: 'How experienced are you in applying Machine Learning algorithms to official survey dataset anomaly detection?', opts: ['No ML knowledge', 'Understand supervised vs unsupervised learning', 'Can train Random Forest / XGBoost classifiers', 'Implement NLP / Computer Vision on satellite imagery', 'Expert ML engineer in government data systems'] },
      { id: 't6', skill: 'cloud', q: 'What is your comfort level working with cloud computing platforms (MeghRaj / AWS / Azure / GCP)?', opts: ['No cloud experience', 'Can log into cloud VMs & storage buckets', 'Can configure virtual environments & container apps', 'Deploy scalable API microservices on cloud', 'Cloud architect for government enterprise systems'] },
      { id: 't7', skill: 'big_data', q: 'Rate your ability to process Big Data using Apache Spark / PySpark or Distributed Computing.', opts: ['No experience', 'Theoretical understanding of Hadoop/Spark', 'Can write PySpark dataframes transformations', 'Optimize Spark jobs on large distributed clusters', 'Design Big Data pipelines for national censuses'] },
      { id: 't8', skill: 'apis', q: 'How experienced are you in developing and consuming REST APIs for automated data exchange?', opts: ['No API experience', 'Can fetch API endpoints using curl/Postman', 'Can parse JSON/XML from public APIs', 'Can build FastApi/Flask microservices with auth', 'Design national open data API portals'] }
    ],
    digital_gov: [
      { id: 'g1', q: 'How well do you understand the Digital Personal Data Protection (DPDP) Act 2023 compliance requirements?', opts: ['Unaware of DPDP Act', 'Basic awareness of data fiduciaries & principal rights', 'Can implement anonymization & consent protocols', 'Conduct Data Protection Impact Assessments (DPIA)', 'Formulate departmental data protection policies'] },
      { id: 'g2', q: 'Rate your awareness of Cybersecurity protocols (CERT-In guidelines, ISO 27001) for government portals.', opts: ['No cyber training', 'Follow basic password & phishing guidelines', 'Understand web app vulnerability patching & OWASP Top 10', 'Can manage security audits & penetration tests', 'Lead Cyber Security Operations Center (CSOC)'] },
      { id: 'g3', q: 'What is your understanding of India Stack (Aadhaar API, DigiLocker, UPI, e-Sign)?', opts: ['User awareness only', 'Know integration points for e-governance', 'Can specify India Stack functional requirements', 'Can integrate APIs into digital workflow applications', 'Architect national digital public infrastructure (DPI)'] },
      { id: 'g4', q: 'How proficient are you in implementing Open Government Data (OGD Platform India — data.gov.in) standards?', opts: ['Never published on data.gov.in', 'Know machine-readable format requirements (CSV/JSON)', 'Can prepare datasets & metadata tags for publication', 'Manage automated dataset publishing pipelines', 'Formulate open data policy frameworks'] },
      { id: 'g5', q: 'Rate your knowledge of MeghRaj (GI Cloud) and NIC National Data Centre hosting policies.', opts: ['Unfamiliar', 'Know cloud procurement process', 'Can configure cloud server instances', 'Manage cloud security architecture & failovers', 'Enterprise cloud strategy advisor'] },
      { id: 'g6', q: 'How experienced are you with e-Office, GeM, and Digital Administrative Systems?', opts: ['Basic user', 'Proficient user of all file & workflow features', 'Manage admin workflows & user permissions', 'Department administrator / master trainer', 'Lead e-Governance digital transformation'] },
      { id: 'g7', q: 'Rate your capability in implementing Statistical Anonymization (k-anonymity, l-diversity, differential privacy).', opts: ['No experience', 'Understand privacy risks in microdata', 'Can suppress identifiers & apply global recoding', 'Compute k-anonymity metrics on survey files', 'Implement differential privacy algorithms'] },
      { id: 'g8', q: 'What is your understanding of Government IT Audits & STQC Certification processes?', opts: ['No knowledge', 'Know STQC testing scope', 'Can prepare application compliance documentation', 'Manage vulnerability remediation for audit clearance', 'Lead IT audit compliance operations'] }
    ],
    behavioural: [
      { id: 'b1', q: 'How effectively do you communicate complex statistical findings to non-statistical policymakers?', opts: ['Struggle with non-technical explanations', 'Can explain basic charts & tables', 'Create clear executive summaries & infographics', 'Deliver compelling data stories & policy briefings', 'Master communicator / Media spokesperson for official statistics'] },
      { id: 'b2', q: 'Rate your skills in leading cross-functional survey teams under strict deadlines.', opts: ['Team member only', 'Can coordinate small team tasks', 'Manage multi-member survey field teams', 'Lead large inter-departmental statistical projects', 'Director level project portfolio manager'] },
      { id: 'b3', q: 'How actively do you practice ethical standards and integrity in statistical compilation & reporting?', opts: ['Basic awareness of code of conduct', 'Strict adherence to official statistics ethics', 'Ensure unbiased & tamper-proof data workflows', 'Champion statistical transparency & auditability', 'Formulate national statistical ethics frameworks'] },
      { id: 'b4', q: 'Rate your problem-solving adaptability when field data collection encounters unforeseen obstacles.', opts: ['Require detailed step-by-step guidance', 'Can follow contingency plans', 'Develop quick pragmatic solutions in field scenarios', 'Design robust risk-mitigation survey protocols', 'Strategic crisis manager for national data operations'] },
      { id: 'b5', q: 'How effectively do you mentor junior statistical officers in analytical & data skills?', opts: ['Focus only on personal work', 'Informally answer peer questions', 'Regularly mentor junior staff', 'Conduct structured internal training workshops', 'Lead capacity building programs across ministries'] },
      { id: 'b6', q: 'Rate your capability in inter-ministerial negotiation and stakeholder collaboration.', opts: ['No inter-agency experience', 'Represent department in working meetings', 'Negotiate data sharing agreements across ministries', 'Chair inter-ministerial statistical committees', 'Represent India in international statistical bodies'] },
      { id: 'b7', q: 'How proactive are you in adopting new technology tools for workflow automation?', opts: ['Prefer traditional methods', 'Adopt tools when mandated', 'Actively test new software tools for team productivity', 'Champion digital transformation initiatives', 'Drive institutional innovation roadmap'] },
      { id: 'b8', q: 'Rate your time management and project tracking capabilities for multi-phase survey operations.', opts: ['Often need deadline extensions', 'Consistently meet assigned deadlines', 'Create Gantt charts & monitor critical paths', 'Manage complex project portfolios with multiple teams', 'Master project management professional'] }
    ]
  };

  // Helper methods
  function loadScores() {
    try {
      const data = localStorage.getItem('statlearn_scores');
      return data ? JSON.parse(data) : {};
    } catch(e) { return {}; }
  }

  function saveScores(scores) {
    try {
      localStorage.setItem('statlearn_scores', JSON.stringify(scores));
    } catch(e) {}
  }

  function scoreAssessment(domainKey, answers) {
    if (!answers || !answers.length) return 0;
    const valid = answers.filter(a => a >= 0);
    if (!valid.length) return 0;
    const sum = valid.reduce((acc, curr) => acc + (curr + 1), 0); // 1 to 5 scale
    const avg = sum / answers.length;
    return parseFloat(avg.toFixed(2));
  }

  function computeGaps(scores = {}, role = 'Statistical Officer') {
    const targets = REQUIRED_LEVELS[role] || REQUIRED_LEVELS.default;
    const results = {};

    Object.keys(DOMAINS).forEach(key => {
      const current = scores[key] !== undefined ? scores[key] : 0;
      const required = targets[key] || 3.5;
      const gap = Math.max(0, parseFloat((required - current).toFixed(2)));
      const pct_current = Math.round((current / 5) * 100);
      const pct_required = Math.round((required / 5) * 100);

      results[key] = {
        domainKey: key,
        label: DOMAINS[key].label,
        shortLabel: DOMAINS[key].shortLabel,
        current,
        required,
        gap,
        pct_current,
        pct_required,
        status: gap === 0 ? 'met' : gap <= 1.0 ? 'partial' : 'critical'
      };
    });

    return results;
  }

  function getCompetencyLevel(score) {
    if (score >= 4.5) return { label: 'Expert', color: 'green', desc: 'Can lead and innovate' };
    if (score >= 3.5) return { label: 'Advanced', color: 'blue', desc: 'Proficient independent worker' };
    if (score >= 2.5) return { label: 'Intermediate', color: 'saffron', desc: 'Needs occasional guidance' };
    if (score > 0)    return { label: 'Beginner', color: 'red', desc: 'Requires fundamental training' };
    return { label: 'Not Assessed', color: 'red', desc: 'No assessment taken' };
  }

  function overallScore(scores) {
    const keys = Object.keys(DOMAINS);
    const valid = keys.filter(k => scores[k] !== undefined);
    if (!valid.length) return 0;
    const total = valid.reduce((sum, k) => sum + (scores[k] * 20), 0);
    return Math.round(total / valid.length);
  }

  return {
    DOMAINS, REQUIRED_LEVELS, QUESTIONS,
    loadScores, saveScores, scoreAssessment, computeGaps,
    getCompetencyLevel, overallScore
  };

})();
