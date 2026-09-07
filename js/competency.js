/**
 * StatLearn AI — Competency Framework & Assessment Engine
 * Covers: Statistical, Technical, Digital Governance, Behavioural
 */

window.CompetencyEngine = (function() {

  // ---- Competency Framework ----
  const DOMAINS = {
    statistical: {
      id: 'statistical', label: 'Statistical Competencies', emoji: '📊',
      color: 'blue', gradient: 'var(--grad-primary)',
      skills: [
        { id: 'survey_design', label: 'Survey Design & Sampling' },
        { id: 'national_accounts', label: 'National Accounts (GDP/GVA)' },
        { id: 'price_stats', label: 'Price Statistics (CPI/WPI)' },
        { id: 'labour_stats', label: 'Labour & Employment Statistics' },
        { id: 'agri_stats', label: 'Agricultural Statistics' },
        { id: 'sdg_indicators', label: 'SDG Indicators & Monitoring' },
        { id: 'data_quality', label: 'Data Quality Frameworks' },
        { id: 'metadata_standards', label: 'Metadata & SDMX Standards' },
      ]
    },
    technical: {
      id: 'technical', label: 'Technical Competencies', emoji: '💻',
      color: 'purple', gradient: 'var(--grad-purple)',
      skills: [
        { id: 'python', label: 'Python / R Programming' },
        { id: 'sql', label: 'SQL & Database Management' },
        { id: 'data_viz', label: 'Data Visualization Tools' },
        { id: 'ai_ml', label: 'AI / Machine Learning' },
        { id: 'gis', label: 'GIS & Geospatial Analysis' },
        { id: 'cloud', label: 'Cloud Computing (AWS/Azure/GCP)' },
        { id: 'apis', label: 'APIs & Open Data Integration' },
        { id: 'big_data', label: 'Big Data Analytics' },
      ]
    },
    digital_gov: {
      id: 'digital_gov', label: 'Digital Governance', emoji: '🏛️',
      color: 'teal', gradient: 'var(--grad-teal)',
      skills: [
        { id: 'cybersecurity', label: 'Cybersecurity Fundamentals' },
        { id: 'data_privacy', label: 'Data Privacy & Protection' },
        { id: 'digital_infra', label: 'Digital Public Infrastructure' },
        { id: 'e_governance', label: 'e-Governance Frameworks' },
        { id: 'cloud_gov', label: 'Government Cloud (MeghRaj)' },
        { id: 'open_data', label: 'Open Government Data' },
      ]
    },
    behavioural: {
      id: 'behavioural', label: 'Behavioural & Managerial', emoji: '🤝',
      color: 'saffron', gradient: 'var(--grad-saffron)',
      skills: [
        { id: 'leadership', label: 'Leadership & Team Management' },
        { id: 'communication', label: 'Communication & Presentation' },
        { id: 'project_mgmt', label: 'Project Management' },
        { id: 'decision_making', label: 'Decision Making & Problem Solving' },
        { id: 'change_mgmt', label: 'Change Management' },
        { id: 'ethics', label: 'Ethics & Integrity' },
      ]
    }
  };

  // ---- Assessment Questions Per Domain ----
  const QUESTIONS = {
    statistical: [
      {
        q: 'What is the primary purpose of stratified random sampling in a household survey?',
        opts: ['To reduce cost by sampling fewer households','To ensure adequate representation of all population sub-groups','To simplify data collection procedures','To eliminate non-sampling errors'],
        ans: 1, skill: 'survey_design'
      },
      {
        q: 'In the context of National Accounts, GDP at constant prices measures:',
        opts: ['Economic growth adjusted for inflation','Total government expenditure','Market value of all goods at current prices','Sum of wages and salaries in the economy'],
        ans: 0, skill: 'national_accounts'
      },
      {
        q: 'Which index is used to measure retail inflation in India?',
        opts: ['WPI (Wholesale Price Index)','GDP Deflator','CPI (Consumer Price Index)','PPI (Producer Price Index)'],
        ans: 2, skill: 'price_stats'
      },
      {
        q: 'The Labour Force Participation Rate (LFPR) is defined as:',
        opts: ['Number of employed persons / Total population × 100','Labour force / Working-age population × 100','Number of unemployed / Labour force × 100','Employed persons / Working-age population × 100'],
        ans: 1, skill: 'labour_stats'
      },
      {
        q: 'SDMX stands for:',
        opts: ['Statistical Data Markup Exchange','Statistical Data and Metadata eXchange','Structured Data Management eXtension','Standard Data Model eXchange'],
        ans: 1, skill: 'metadata_standards'
      },
      {
        q: 'Which of the following is NOT a dimension of data quality in the IMF Data Quality Assessment Framework?',
        opts: ['Accuracy and reliability','Accessibility and clarity','Profitability and cost efficiency','Integrity and methodological soundness'],
        ans: 2, skill: 'data_quality'
      },
      {
        q: 'SDG Indicator 1.1.1 measures:',
        opts: ['Gender equality in education','Proportion of population below the international poverty line','Access to clean water and sanitation','Child mortality rate'],
        ans: 1, skill: 'sdg_indicators'
      },
      {
        q: 'In agricultural statistics, the concept of "crop cutting experiment" is used to estimate:',
        opts: ['Area under cultivation','Crop yield per hectare','Fertilizer consumption','Irrigation coverage'],
        ans: 1, skill: 'agri_stats'
      },
    ],
    technical: [
      {
        q: 'Which Python library is most commonly used for statistical data analysis and manipulation?',
        opts: ['NumPy','Matplotlib','Pandas','Scikit-learn'],
        ans: 2, skill: 'python'
      },
      {
        q: 'In SQL, which clause is used to filter groups after a GROUP BY operation?',
        opts: ['WHERE','HAVING','FILTER','CONDITION'],
        ans: 1, skill: 'sql'
      },
      {
        q: 'What does API stand for?',
        opts: ['Application Programming Interface','Automated Process Integration','Advanced Programming Infrastructure','Application Process Interoperability'],
        ans: 0, skill: 'apis'
      },
      {
        q: 'In machine learning, overfitting occurs when:',
        opts: ['The model performs poorly on training data','The model learns noise in training data and performs poorly on new data','The model is too simple to capture patterns','The training dataset is too large'],
        ans: 1, skill: 'ai_ml'
      },
      {
        q: 'GIS is primarily used for:',
        opts: ['Managing financial transactions','Analyzing and visualizing geographic/spatial data','Processing satellite communications','Database encryption'],
        ans: 1, skill: 'gis'
      },
      {
        q: 'Which cloud service model provides virtualized computing resources over the internet?',
        opts: ['SaaS (Software as a Service)','PaaS (Platform as a Service)','IaaS (Infrastructure as a Service)','DaaS (Data as a Service)'],
        ans: 2, skill: 'cloud'
      },
      {
        q: 'In data visualization, a "treemap" is best suited for showing:',
        opts: ['Trends over time','Hierarchical data as nested rectangles','Correlations between two variables','Geographic distributions'],
        ans: 1, skill: 'data_viz'
      },
      {
        q: 'Hadoop is primarily associated with:',
        opts: ['Relational database management','Real-time processing of small datasets','Distributed storage and processing of large datasets','Network security management'],
        ans: 2, skill: 'big_data'
      },
    ],
    digital_gov: [
      {
        q: 'What is the primary purpose of MeghRaj (GI Cloud) in India?',
        opts: ['A social media platform for government officials','Government cloud computing infrastructure for ICT services','A cloud-based tax filing system','Government email service'],
        ans: 1, skill: 'cloud_gov'
      },
      {
        q: 'In cybersecurity, a "phishing" attack typically involves:',
        opts: ['Installing malware through USB drives','Deceiving users into revealing sensitive information through fake communications','Disrupting network services through traffic flooding','Unauthorized physical access to servers'],
        ans: 1, skill: 'cybersecurity'
      },
      {
        q: 'India\'s Personal Data Protection framework mandates:',
        opts: ['Sharing all government data publicly','Collecting explicit consent for personal data processing','Storing all data in foreign servers','Unlimited retention of personal data'],
        ans: 1, skill: 'data_privacy'
      },
      {
        q: 'Aadhaar, UPI, and DigiLocker are examples of:',
        opts: ['Private sector fintech innovations','Digital Public Infrastructure (DPI)','Foreign technology imports','State government initiatives'],
        ans: 1, skill: 'digital_infra'
      },
      {
        q: 'The data.gov.in portal is an example of:',
        opts: ['Cybersecurity infrastructure','Open Government Data (OGD) platform','National Payment Gateway','Cloud computing platform'],
        ans: 1, skill: 'open_data'
      },
      {
        q: 'E-Governance primarily aims to:',
        opts: ['Replace all human officials with AI systems','Improve government service delivery through digital technology','Restrict access to government information','Centralize all government decisions'],
        ans: 1, skill: 'e_governance'
      },
    ],
    behavioural: [
      {
        q: 'Which leadership style is most effective during organizational transformation?',
        opts: ['Autocratic leadership with top-down directives','Laissez-faire leadership with complete freedom','Transformational leadership inspiring shared vision','Transactional leadership focusing only on tasks'],
        ans: 2, skill: 'leadership'
      },
      {
        q: 'In project management, the "Triple Constraint" refers to:',
        opts: ['Budget, Team, and Timeline','Scope, Time, and Cost','Quality, Risk, and Communication','Planning, Execution, and Closure'],
        ans: 1, skill: 'project_mgmt'
      },
      {
        q: 'Effective data storytelling requires:',
        opts: ['Using as many charts and graphs as possible','Presenting raw numbers without interpretation','Combining data insights with narrative context for the audience','Using only technical jargon to demonstrate expertise'],
        ans: 2, skill: 'communication'
      },
      {
        q: 'The "Pareto Principle" or 80/20 rule suggests:',
        opts: ['80% of problems have 20% solutions','80% of effects come from 20% of causes','20% of effort produces 80% of output','Both B and C'],
        ans: 3, skill: 'decision_making'
      },
      {
        q: 'Kotter\'s 8-step model is associated with:',
        opts: ['Data quality management','Change management in organizations','Statistical sampling methods','Cybersecurity frameworks'],
        ans: 1, skill: 'change_mgmt'
      },
      {
        q: 'Public service ethics require statistical officials to:',
        opts: ['Release data selectively based on political considerations','Maintain data confidentiality and present objective, unbiased statistics','Modify data to achieve desired policy outcomes','Prioritize speed over accuracy in data release'],
        ans: 1, skill: 'ethics'
      },
    ]
  };

  // ---- Role-Based Required Levels (0-5 scale) ----
  const REQUIRED_LEVELS = {
    'Data Analyst': { statistical: 4, technical: 4, digital_gov: 3, behavioural: 3 },
    'Statistical Officer': { statistical: 5, technical: 3, digital_gov: 3, behavioural: 3 },
    'Deputy Director': { statistical: 4, technical: 3, digital_gov: 4, behavioural: 5 },
    'Director': { statistical: 3, technical: 2, digital_gov: 4, behavioural: 5 },
    'Field Investigator': { statistical: 3, technical: 2, digital_gov: 2, behavioural: 3 },
    'IT Officer': { statistical: 2, technical: 5, digital_gov: 5, behavioural: 3 },
    'Research Officer': { statistical: 5, technical: 4, digital_gov: 3, behavioural: 4 },
    default: { statistical: 3, technical: 3, digital_gov: 3, behavioural: 3 }
  };

  // ---- Scoring ----
  function scoreAssessment(domain, answers) {
    const qs = QUESTIONS[domain];
    let correct = 0;
    answers.forEach((ans, i) => { if (qs[i] && ans === qs[i].ans) correct++; });
    const pct = correct / qs.length;
    // Map 0-1 to 0-5 scale
    return Math.round(pct * 5 * 10) / 10;
  }

  function computeGaps(scores, role) {
    const required = REQUIRED_LEVELS[role] || REQUIRED_LEVELS.default;
    const gaps = {};
    Object.keys(required).forEach(domain => {
      const current = scores[domain] || 0;
      const req = required[domain];
      gaps[domain] = {
        current: current,
        required: req,
        gap: Math.max(0, req - current),
        pct_current: (current / 5) * 100,
        pct_required: (req / 5) * 100,
        label: DOMAINS[domain]?.label || domain,
        status: current >= req ? 'met' : current >= req - 1 ? 'partial' : 'gap'
      };
    });
    return gaps;
  }

  function overallCompetencyScore(scores) {
    const vals = Object.values(scores).filter(v => v > 0);
    if (!vals.length) return 0;
    return Math.round((vals.reduce((a, b) => a + b, 0) / vals.length) * 20);
  }

  function getCompetencyLevel(score5) {
    if (score5 >= 4.5) return { label: 'Expert', color: 'green' };
    if (score5 >= 3.5) return { label: 'Advanced', color: 'blue' };
    if (score5 >= 2.5) return { label: 'Intermediate', color: 'saffron' };
    if (score5 >= 1.5) return { label: 'Beginner', color: 'purple' };
    return { label: 'Novice', color: 'red' };
  }

  // Save / load state
  function saveScores(scores) {
    Store.set('competency_scores', scores);
    Store.set('competency_date', new Date().toISOString());
  }

  function loadScores() {
    return Store.get('competency_scores', {});
  }

  return {
    DOMAINS, QUESTIONS, REQUIRED_LEVELS,
    scoreAssessment, computeGaps, overallCompetencyScore,
    getCompetencyLevel, saveScores, loadScores
  };

})();
