/**
 * StatLearn AI — iGOT Karmayogi Service for React
 */

window.IgotService = (function() {

  const COURSES = [
    // Statistical Competencies
    { id: 'igot-stat-101', title: 'Fundamentals of Official Statistics & Data Systems', provider: 'NSSTA', domain: 'statistical', level: 'Beginner', duration: '12 hours', rating: 4.8, enrolled: 12450, description: 'Core principles of Official Statistics, Fundamental Principles of Official Statistics (FPOS), Indian Statistical System architecture.', igot_url: 'https://www.igotkarmayogi.gov.in' },
    { id: 'igot-stat-102', title: 'National Accounts Statistics & GDP Estimation', provider: 'MoSPI / DIID', domain: 'statistical', level: 'Intermediate', duration: '20 hours', rating: 4.9, enrolled: 8920, description: 'Comprehensive guide to System of National Accounts (SNA 2008), GVA calculations, baseline revisions, and quarterly GDP compilation.', igot_url: 'https://www.igotkarmayogi.gov.in' },
    { id: 'igot-stat-103', title: 'Consumer Price Index (CPI) & WPI Methodology', provider: 'NSO Price Statistics', domain: 'statistical', level: 'Intermediate', duration: '15 hours', rating: 4.7, enrolled: 6310, description: 'Basket weighting, price collection protocols, Laspeyres index methodology, geometric mean calculations, and CPI revision guidelines.', igot_url: 'https://www.igotkarmayogi.gov.in' },
    { id: 'igot-stat-104', title: 'SDG Indicator Monitoring & National Reporting', provider: 'MoSPI SDG Unit', domain: 'statistical', level: 'Advanced', duration: '18 hours', rating: 4.8, enrolled: 5120, description: 'Tracking 300+ National Indicator Framework (NIF) indicators, metadata standards, UN SDG alignment, and state monitoring dashboards.', igot_url: 'https://www.igotkarmayogi.gov.in' },
    { id: 'igot-stat-105', title: 'Sampling Methods in Large-Scale National Surveys', provider: 'NSO Survey Design', domain: 'statistical', level: 'Advanced', duration: '25 hours', rating: 4.9, enrolled: 9840, description: 'Stratified multi-stage sampling, FSU selection, weight generation, non-sampling error estimation, and PLFS survey design.', igot_url: 'https://www.igotkarmayogi.gov.in' },

    // Technical & Data Science
    { id: 'igot-tech-201', title: 'Python for Statistical Data Processing & Analytics', provider: 'iGOT Tech Faculty', domain: 'technical', level: 'Beginner', duration: '16 hours', rating: 4.8, enrolled: 18200, description: 'Hands-on Python scripting, Pandas dataframes, NumPy vectorization, data cleaning, and statistical aggregations for official data.', igot_url: 'https://www.igotkarmayogi.gov.in' },
    { id: 'igot-tech-202', title: 'R Programming for Econometrics & Forecasting', provider: 'NSSTA Data Science', domain: 'technical', level: 'Intermediate', duration: '22 hours', rating: 4.9, enrolled: 11400, description: 'Tidyverse data wrangling, ARIMA time-series modeling, seasonal adjustment (X-13ARIMA-SEATS), and ggplot2 visualization.', igot_url: 'https://www.igotkarmayogi.gov.in' },
    { id: 'igot-tech-203', title: 'SQL & Database Architecture for Government Datasets', provider: 'NIC Academy', domain: 'technical', level: 'Beginner', duration: '14 hours', rating: 4.7, enrolled: 15600, description: 'Relational database fundamentals, SQL querying, complex joins, window functions, indexing, and data security.', igot_url: 'https://www.igotkarmayogi.gov.in' },
    { id: 'igot-tech-204', title: 'Applied Machine Learning in Official Statistics', provider: 'iGOT AI Division', domain: 'technical', level: 'Advanced', duration: '28 hours', rating: 4.9, enrolled: 7800, description: 'Automated survey anomaly detection, random forests for imputation, satellite image classification for crop area estimation.', igot_url: 'https://www.igotkarmayogi.gov.in' },
    { id: 'igot-tech-205', title: 'GIS & Spatial Analysis for Statistical Mapping', provider: 'Survey of India / NSSTA', domain: 'technical', level: 'Intermediate', duration: '18 hours', rating: 4.8, enrolled: 8300, description: 'QGIS desktop analysis, spatial joins, demographic thematic mapping, remote sensing data integration, and GeoPandas python pipelines.', igot_url: 'https://www.igotkarmayogi.gov.in' },

    // Digital Governance & Security
    { id: 'igot-gov-301', title: 'Digital Personal Data Protection (DPDP) Act 2023 Compliance', provider: 'MeitY / iGOT', domain: 'digital_gov', level: 'Beginner', duration: '8 hours', rating: 4.9, enrolled: 24500, description: 'Statutory compliance requirements of DPDP Act 2023, data fiduciary obligations, consent architecture, and microdata anonymization.', igot_url: 'https://www.igotkarmayogi.gov.in' },
    { id: 'igot-gov-302', title: 'Cybersecurity Fundamentals & CERT-In Compliance', provider: 'NCIIPC / NIC', domain: 'digital_gov', level: 'Beginner', duration: '10 hours', rating: 4.8, enrolled: 31200, description: 'Cyber threat landscape, phishing prevention, secure web application practices, data encryption standards, and incident response.', igot_url: 'https://www.igotkarmayogi.gov.in' },
    { id: 'igot-gov-303', title: 'Open Government Data (OGD) Publishing Standards', provider: 'National Informatics Centre', domain: 'digital_gov', level: 'Intermediate', duration: '12 hours', rating: 4.7, enrolled: 9400, description: 'Publishing machine-readable datasets on data.gov.in, API specification standards, metadata tagging, and data governance.', igot_url: 'https://www.igotkarmayogi.gov.in' },
    { id: 'igot-gov-304', title: 'India Stack & Digital Public Infrastructure (DPI)', provider: 'MeitY / Digital India', domain: 'digital_gov', level: 'Intermediate', duration: '14 hours', rating: 4.9, enrolled: 19800, description: 'Aadhaar authentication APIs, DigiLocker integration, e-Sign, and digital identity architecture for public service delivery.', igot_url: 'https://www.igotkarmayogi.gov.in' },

    // Behavioural & Leadership
    { id: 'igot-beh-401', title: 'Ethics, Integrity & Anti-Corruption in Public Service', provider: 'DoPT Karmayogi', domain: 'behavioural', level: 'Beginner', duration: '6 hours', rating: 4.9, enrolled: 45000, description: 'Central Civil Services (Conduct) Rules, ethical decision-making, conflict of interest, transparency, and anti-corruption measures.', igot_url: 'https://www.igotkarmayogi.gov.in' },
    { id: 'igot-beh-402', title: 'Effective Communication of Statistical & Policy Insights', provider: 'LBSNAA / NSSTA', domain: 'behavioural', level: 'Intermediate', duration: '10 hours', rating: 4.8, enrolled: 12800, description: 'Translating complex statistical findings into clear executive summaries, data storytelling for cabinet notes, and media briefings.', igot_url: 'https://www.igotkarmayogi.gov.in' },
    { id: 'igot-beh-403', title: 'Project Management & Leadership for Survey Operations', provider: 'IIM Bangalore / DoPT', domain: 'behavioural', level: 'Advanced', duration: '20 hours', rating: 4.9, enrolled: 8600, description: 'Managing large survey teams, milestone tracking, resource budgeting, field crisis resolution, and inter-agency coordination.', igot_url: 'https://www.igotkarmayogi.gov.in' }

  ];

  function getEnrolled() {
    try { return JSON.parse(localStorage.getItem('statlearn_enrolled') || '[]'); } catch(e) { return []; }
  }

  function getCompleted() {
    try { return JSON.parse(localStorage.getItem('statlearn_completed') || '[]'); } catch(e) { return []; }
  }

  function enroll(courseId) {
    const current = getEnrolled();
    if (!current.includes(courseId)) {
      current.push(courseId);
      localStorage.setItem('statlearn_enrolled', JSON.stringify(current));
    }
  }

  function complete(courseId) {
    const enrolled = getEnrolled();
    const completed = getCompleted();
    if (!completed.includes(courseId)) {
      completed.push(courseId);
      localStorage.setItem('statlearn_completed', JSON.stringify(completed));
    }
  }

  function search(query = '', filters = {}) {
    let list = [...COURSES];
    if (query) {
      const q = query.toLowerCase();
      list = list.filter(c => c.title.toLowerCase().includes(q) || c.description.toLowerCase().includes(q) || c.provider.toLowerCase().includes(q));
    }
    if (filters.domain) list = list.filter(c => c.domain === filters.domain);
    if (filters.level) list = list.filter(c => c.level === filters.level);
    return list;
  }

  return { COURSES, getEnrolled, getCompleted, enroll, complete, search };
})();
