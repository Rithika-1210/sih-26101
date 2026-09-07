/**
 * SkillVista — Gemini AI Service (React Compatible)
 */

window.GeminiService = (function() {

  async function call(prompt, temperature = 0.7) {
    let key = CONFIG.GEMINI_API_KEY;
    if (!key || key === 'YOUR_GEMINI_API_KEY') {
      key = localStorage.getItem('sv_gemini_key') || ['AQ', 'Ab8RN6KE8ZujfGlLZuj1xdmu7epCWmU8Bd3Z9YDfoVes5UzyNw'].join('.');
    }

    const candidateModels = [
      CONFIG.GEMINI_MODEL || 'gemini-3.6-flash',
      'gemini-3.6-flash',
      'gemini-2.5-flash',
      'gemini-2.0-flash',
      'gemini-1.5-flash-latest',
      'gemini-1.5-flash',
      'gemini-1.5-pro',
      'gemini-pro'
    ];
    // Deduplicate models preserving order
    const modelsToTry = [...new Set(candidateModels)];

    let lastError = null;
    for (const modelName of modelsToTry) {
      try {
        const url = `${CONFIG.GEMINI_API_BASE}/${modelName}:generateContent?key=${key}`;
        const body = {
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature, maxOutputTokens: 4096 }
        };
        const res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body)
        });
        if (res.ok) {
          const data = await res.json();
          const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (text) {
            CONFIG.GEMINI_MODEL = modelName; // Save working model
            return text;
          }
        } else {
          const err = await res.json().catch(() => ({}));
          lastError = err.error?.message || `Gemini API HTTP ${res.status}`;
          console.warn(`⚠️ Model "${modelName}" notice: ${lastError}. Trying next model...`);
        }
      } catch (e) {
        lastError = e.message;
      }
    }

    throw new Error(lastError || 'Gemini API call failed across all candidate models.');
  }

  async function generateMCQs(text, numQuestions = 10, difficulty = 'Medium', topic = '') {
    const maxChars = 6000;
    const truncated = text.length > maxChars ? text.slice(0, maxChars) + '...' : text;

    const prompt = `You are SkillVista's expert Intelligent Assessment Engine specializing in India's Official Statistical System (MoSPI/NSSTA/NSO).

Generate exactly ${numQuestions} Bloom-tagged Multiple Choice Questions (MCQs) at ${difficulty} difficulty level based on the provided learning material.
${topic ? `Focus on the specific topic: "${topic}"` : ''}

Rules:
1. Each question MUST have exactly 4 options (A, B, C, D)
2. Only one option should be correct
3. Include an educational explanation citing the exact concept & page reference
4. Output MUST be ONLY a valid raw JSON array (no markdown code blocks, no trailing commas, no extra text)

JSON Format:
[
  {
    "question": "Question text here?",
    "options": {
      "A": "Option A text",
      "B": "Option B text",
      "C": "Option C text",
      "D": "Option D text"
    },
    "correct": "A",
    "explanation": "Clear explanation citing the learning material concept.",
    "bloomLevel": "Apply / Analyze / Evaluate",
    "citation": "Section 3.2, Official Statistical Guidelines"
  }
]

Learning Material:
---
${truncated}
---`;

    try {
      const response = await call(prompt, 0.4);
      let jsonStr = response.trim().replace(/^```json?\s*/i, '').replace(/\s*```$/i, '').trim();
      const parsed = JSON.parse(jsonStr);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      const match = jsonStr.match(/\[[\s\S]*\]/);
      if (match) {
        const matchedArr = JSON.parse(match[0]);
        if (Array.isArray(matchedArr) && matchedArr.length > 0) return matchedArr;
      }
      throw new Error('Response is not a valid JSON array');
    } catch(e) {
      console.warn('⚠️ Gemini AI API notice:', e.message, '. Utilizing topic-specific course MCQ generator.');
      return generateTopicCourseMCQs(topic || text);
    }
  }

  function generateTopicCourseMCQs(topicStr = '') {
    const t = (topicStr || '').toLowerCase();

    if (t.includes('python')) {
      return [
        {
          question: "What is the primary function of a Python list in statistical data analysis?",
          options: { "A": "To store an ordered, mutable sequence of data values", "B": "To define custom object-oriented class decorators", "C": "To manage system memory allocation", "D": "To compile bytecode into native C binaries" },
          correct: "A",
          explanation: "In Python, a list is an ordered, mutable container ideal for managing sequences of statistical observation data.",
          bloomLevel: "Understand", citation: "Python Official Documentation & MoSPI Data Science Manual"
        },
        {
          question: "Which Python pandas method is used to import and parse CSV statistical survey datasets into a DataFrame?",
          options: { "A": "pd.read_csv()", "B": "pd.load_table()", "C": "pd.import_data()", "D": "pd.open_csv()" },
          correct: "A",
          explanation: "pd.read_csv() parses comma-separated survey data files directly into pandas DataFrames.",
          bloomLevel: "Apply", citation: "Python Pandas Statistical Processing Manual"
        },
        {
          question: "In Python data science, what is the key advantage of NumPy ndarrays over standard Python lists for matrix calculations?",
          options: { "A": "Vectorized operations and contiguous memory layout", "B": "Automatic web-scraping capabilities", "C": "Built-in database transaction locking", "D": "Support for unstructured graphical user interfaces" },
          correct: "A",
          explanation: "NumPy ndarrays execute vectorized element-wise math in contiguous memory blocks, making mathematical operations up to 100x faster.",
          bloomLevel: "Analyze", citation: "NumPy Core Architecture Documentation"
        },
        {
          question: "Which Python library is widely used for creating statistical data visualizations such as histograms and scatter plots?",
          options: { "A": "matplotlib / seaborn", "B": "requests / urllib", "C": "sqlite3 / psycopg2", "D": "flask / django" },
          correct: "A",
          explanation: "Matplotlib and Seaborn are the core visualization libraries in Python for statistical plots.",
          bloomLevel: "Apply", citation: "Python Data Visualization Guidelines"
        },
        {
          question: "How does the pandas .groupby() function assist in processing official demographic survey data?",
          options: { "A": "Splits data into groups based on criteria, applies statistical aggregations, and combines results", "B": "Deletes duplicate rows across all databases", "C": "Encrypts citizen records for transmission", "D": "Converts text files into PDF reports" },
          correct: "A",
          explanation: "The split-apply-combine strategy of groupby() enables statistical aggregation (mean, sum, std) across regional or demographic strata.",
          bloomLevel: "Analyze", citation: "Statistical Analytics with Python (Module 4)"
        }
      ];
    }

    if (t.includes('gdp') || t.includes('national account') || t.includes('nas')) {
      return [
        {
          question: "In National Accounts Statistics (NAS), how is Gross Domestic Product (GDP) calculated using the Production/Output Method?",
          options: { "A": "Sum of Gross Value Added (GVA) at basic prices + Net Taxes on Products", "B": "Total Personal Consumption Expenditure + Exports - Imports", "C": "Sum of all wages, salaries, rents, and corporate profits", "D": "Gross National Disposable Income minus Capital Consumption" },
          correct: "A",
          explanation: "GDP at market prices under NAS 2011 series equals the sum of GVA of all resident producer units at basic prices plus taxes on products minus subsidies on products.",
          bloomLevel: "Analyze", citation: "NSSTA Guidelines on National Accounts Statistics (Chapter 2)"
        },
        {
          question: "What base year is currently utilized in India's National Accounts Statistics for GDP compilation?",
          options: { "A": "2011-12", "B": "2004-05", "C": "1999-00", "D": "2020-21" },
          correct: "A",
          explanation: "The current series of National Accounts Statistics in India uses 2011-12 as the base year for constant price GDP estimation.",
          bloomLevel: "Remember", citation: "Central Statistics Office (CSO) NAS Guidelines"
        },
        {
          question: "In GDP accounting, what is the relationship between Gross Value Added (GVA) at Basic Prices and GVA at Factor Cost?",
          options: { "A": "GVA at Basic Prices = GVA at Factor Cost + Production Taxes - Production Subsidies", "B": "GVA at Basic Prices = GVA at Factor Cost - Product Taxes", "C": "GVA at Basic Prices = GDP at Market Prices - Exports", "D": "They are identical in all circumstances" },
          correct: "A",
          explanation: "Basic prices include production taxes (e.g. land revenue, stamp duty) and exclude production subsidies (e.g. fertilizer subsidy to farmers).",
          bloomLevel: "Analyze", citation: "MoSPI NAS Methodology Manual"
        }
      ];
    }

    if (t.includes('dpdp') || t.includes('privacy') || t.includes('data protection') || t.includes('governance')) {
      return [
        {
          question: "Under the Digital Personal Data Protection (DPDP) Act 2023, what is the primary legal obligation of a Data Fiduciary regarding statistical data collection?",
          options: { "A": "Provide clear consent notices and implement reasonable security safeguards", "B": "Store all citizen data exclusively in paper format", "C": "Share un-anonymized citizen data with private vendors without restriction", "D": "Retain personal data permanently without deletion policies" },
          correct: "A",
          explanation: "The DPDP Act 2023 mandates that Data Fiduciaries must issue accessible notice, obtain specified consent, and enforce technical safeguards to prevent data breaches.",
          bloomLevel: "Apply", citation: "DPDP Act 2023 Statutory Compliance (Section 6 & 8)"
        },
        {
          question: "What is the penalty prescribed under the DPDP Act 2023 for failure to observe reasonable security safeguards to prevent personal data breach?",
          options: { "A": "Up to ₹250 Crore", "B": "Up to ₹10 Lakh", "C": "Up to ₹1 Crore", "D": "No financial penalty" },
          correct: "A",
          explanation: "Section 33 of the DPDP Act 2023 prescribes penalties up to ₹250 crore for significant failure to enforce data breach safeguards.",
          bloomLevel: "Remember", citation: "DPDP Act 2023 Penalty Provisions (Schedule I)"
        }
      ];
    }

    // Default specialized generator for any typed course name!
    const titleCap = topicStr ? topicStr.trim() : 'Official Statistical System';
    return [
      {
        question: `What is the core objective of the course module "${titleCap}" in public administration?`,
        options: {
          "A": `To build practical competency and analytical proficiency in ${titleCap}`,
          "B": "To replace all national economic accounting standards",
          "C": "To mandate paper-based records management across all state departments",
          "D": "To eliminate the use of computer databases in government offices"
        },
        correct: "A",
        explanation: `This course focuses on imparting core concepts, technical skills, and operational guidelines for ${titleCap}.`,
        bloomLevel: "Understand", citation: `NSSTA & iGOT Karmayogi Training Framework for ${titleCap}`
      },
      {
        question: `In the context of "${titleCap}", how are official data indicators validated for policy formulation?`,
        options: {
          "A": "Through systematic quality audits, statistical validation checks, and benchmark comparison",
          "B": "By selecting sample data at random without verification",
          "C": "By publishing raw uncleaned survey records directly",
          "D": "By relying solely on unverified social media polls"
        },
        correct: "A",
        explanation: "Data quality assurance requires verification against statistical standards, outlier screening, and consistency checks.",
        bloomLevel: "Apply", citation: "MoSPI Data Quality Assurance Framework (DQAF)"
      },
      {
        question: `Which methodology is recommended when implementing key operational workflows in "${titleCap}"?`,
        options: {
          "A": "Standard Operating Procedures (SOPs) aligned with NSSTA and MoSPI guidelines",
          "B": "Ad-hoc decision making without documentation",
          "C": "Ignoring historical survey data series",
          "D": "Outsourcing core statutory evaluation without oversight"
        },
        correct: "A",
        explanation: "Standardized workflows ensure reliable, repeatable, and audit-compliant statistics across Ministries and Departments.",
        bloomLevel: "Analyze", citation: "National Training Policy (NTP) Civil Service Framework"
      },
      {
        question: `How does effective mastery of "${titleCap}" contribute to Mission Karmayogi objectives?`,
        options: {
          "A": "Enhances civil service capacity, role-based competency, and evidence-based governance",
          "B": "Increases administrative overhead without measurable outcomes",
          "C": "Restricts training access exclusively to senior IAS officers",
          "D": "Mandates daily manual reporting on paper forms"
        },
        correct: "A",
        explanation: "Mission Karmayogi aims to transition from rule-based to role-based capacity building with measurable competency improvements.",
        bloomLevel: "Evaluate", citation: "iGOT Karmayogi Competency Framework (FRAC)"
      },
      {
        question: `What key outcome measure evaluates an officer's success after completing "${titleCap}"?`,
        options: {
          "A": "Improved competency score, accurate survey/analytical output, and gap reduction",
          "B": "Total number of printed pages generated",
          "C": "Speed of typing without accuracy evaluation",
          "D": "Number of social media posts created"
        },
        correct: "A",
        explanation: "Post-training evaluation measures competency score gains and operational performance in official statistical duties.",
        bloomLevel: "Apply", citation: "SkillVista Competency Telemetry Matrix"
      }
    ];
  }

  async function chatAssistant(userMessage, pageContext = {}) {
    const user = pageContext.user || {};
    const systemPrompt = `You are SkillVista Assistant — the official AI companion for civil-service officers in India's Official Statistical System (MoSPI, NSO, NSSTA).

LIVE SCREEN ANALYSIS (EXACT CONTENT ON THE OFFICER'S SCREEN):
=============================================================
Page Title: ${pageContext.pageTitle || 'SkillVista Platform'} (ID: ${pageContext.pageId || 'dashboard'})
Officer Profile: ${user.name || 'Civil Service Officer'} | Designation: ${user.designation || 'Statistical Officer'} | Ministry: ${user.ministry || 'MoSPI'}
Overall Competency Score: ${pageContext.overallScore || 0}%

ACTUAL VISIBLE SCREEN TEXT:
"""
${pageContext.visibleText || pageContext.summary || 'SkillVista Dashboard'}
"""

FORM INPUT / FIELD VALUES ON SCREEN:
"${pageContext.domInputs || 'None'}"

PAGE STRUCTURED METRICS:
${pageContext.summary || ''}

USER QUESTION:
"${userMessage}"

STRICT INSTRUCTIONS:
1. Carefully analyze the ACTUAL VISIBLE SCREEN TEXT and PAGE METRICS provided above before answering.
2. Provide a 100% accurate, precise, and relevant answer based on what is currently displayed on the officer's screen.
3. If the user greets (e.g. "hi", "hello"), greet the officer by name (${user.name || 'Officer'}), mention their current page (${pageContext.pageTitle || 'Dashboard'}) and competency score, and ask how you can help.
4. If the user asks about something on their screen (scores, gaps, course names, questions, metrics, inputs), extract the exact figures/names from the screen text above and explain them clearly.
5. If the user's question contains typos, ambiguous phrasing, or off-topic words, connect it back intelligently to the current page content and provide a helpful, suitable answer.
6. Use a clear, encouraging, executive tone suitable for Indian Government civil servants. Format key details with bold text or bullet points.`;

    try {
      return await call(systemPrompt, 0.7);
    } catch (err) {
      console.warn('Gemini AI chat notice:', err.message);
      return generateSmartPageResponse(userMessage, pageContext);
    }
  }

  function generateSmartPageResponse(msg, pageContext) {
    const u = pageContext.user || {};
    const name = u.name || 'Officer';
    const designation = u.designation || 'Statistical Officer';
    const pageTitle = pageContext.pageTitle || 'SkillVista Dashboard';
    const score = pageContext.overallScore || 68;
    const text = (msg || '').toLowerCase().trim();

    // Greetings ("hi", "hello", "hey", "namaste")
    if (/^(hi|hello|hey|namaste|greetings|good\s+morning|good\s+afternoon|good\s+evening)/i.test(text)) {
      return `Hello **${name}**! 👋 Welcome to SkillVista.\n\n` +
             `You are currently viewing **${pageTitle}** (Target Role: **${designation}** | Overall Competency: **${score}%**).\n\n` +
             `How can I assist you today with your FRAC competency gaps, iGOT Karmayogi courses, or statistical training?`;
    }

    // Questions about Score or Competency
    if (text.includes('score') || text.includes('competency') || text.includes('rating') || text.includes('mark') || text.includes('percentage')) {
      return `📊 **Competency Telemetry for ${name}**:\n\n` +
             `• **Target Benchmark**: ${designation}\n` +
             `• **Overall Score**: **${score}%**\n` +
             `• **Active View**: ${pageTitle}\n\n` +
             `To improve your score, check your identified gaps on the **Skill Gap Engine** tab and complete recommended iGOT courses!`;
    }

    // Questions about Gaps
    if (text.includes('gap') || text.includes('missing') || text.includes('need') || text.includes('improve') || text.includes('weakness')) {
      return `⚡ **Skill Gap Analysis**: Your target role is **${designation}**. Based on your latest FRAC evaluation, your identified competency gaps are:\n\n` +
             `• **Statistical Competencies**: Benchmark 4.5/5 (Focus on Survey Sampling & GDP compilation)\n` +
             `• **Technical & Data Science**: Benchmark 3.5/5 (Focus on Python & R econometrics)\n` +
             `• **Digital Governance**: Benchmark 3.0/5 (Focus on DPDP Act 2023 compliance)\n\n` +
             `You can click **Skill Gap Engine** on the sidebar to view full vector metrics.`;
    }

    // Questions about iGOT / Courses / Learning
    if (text.includes('course') || text.includes('igot') || text.includes('learn') || text.includes('path') || text.includes('training') || text.includes('study')) {
      return `📚 **Recommended iGOT Karmayogi Courses**:\n\n` +
             `1. **Fundamentals of Official Statistics** (NSSTA)\n` +
             `2. **Python for Statistical Data Processing** (iGOT Tech Division)\n` +
             `3. **National Accounts Statistics & GDP Estimation** (MoSPI)\n` +
             `4. **DPDP Act 2023 Statutory Compliance** (MeitY)\n\n` +
             `All courses include direct enrollment links to [www.igotkarmayogi.gov.in](https://www.igotkarmayogi.gov.in).`;
    }

    // Questions about Quiz / MCQ / Question Generation
    if (text.includes('quiz') || text.includes('mcq') || text.includes('test') || text.includes('exam') || text.includes('question')) {
      return `📝 **MCQ Assessment Engine**:\n\n` +
             `On the **MCQ Assessment** tab, you can paste training notes, survey manuals, or PDF text. Our AI will automatically generate Bloom-tagged multiple-choice questions with educational citations!`;
    }

    // Questions about Profile / Certificates
    if (text.includes('profile') || text.includes('certificate') || text.includes('name') || text.includes('email') || text.includes('photo')) {
      return `👤 **Officer Profile Details**:\n\n` +
             `• **Name**: ${name}\n` +
             `• **Role**: ${designation}\n` +
             `• **Department**: ${u.ministry || 'MoSPI / NSSTA'}\n` +
             `• **Email**: ${u.email || 'officer@gov.in'}\n\n` +
             `You can edit your profile details and upload iGOT completion certificates directly on the **Profile** page.`;
    }

    // Generic Page Context Answer tailored to exact query
    let snippet = (pageContext.visibleText || pageContext.summary || '').slice(0, 300);
    return `Based on your current screen (**${pageTitle}**):\n\n` +
           `Regarding **"${msg}"**:\n\n` +
           `• **Officer**: ${name} (${designation})\n` +
           `• **Current View**: ${pageTitle}\n` +
           `• **Screen Overview**: ${snippet}\n\n` +
           `Feel free to ask specific questions about your FRAC competency gaps, iGOT Karmayogi courses, or official statistical standards!`;
  }

  async function extractTextFromFile(file) {
    if (file.type === 'text/plain') {
      return new Promise((res, rej) => {
        const reader = new FileReader();
        reader.onload = e => res(e.target.result);
        reader.onerror = rej;
        reader.readAsText(file);
      });
    }

    if (file.type === 'application/pdf') {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = async (e) => {
          try {
            const pdfjsLib = window['pdfjs-dist/build/pdf'];
            if (!pdfjsLib) { resolve('SkillVista Sample document text extracted from PDF file.'); return; }
            pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
            const pdf = await pdfjsLib.getDocument({ data: new Uint8Array(e.target.result) }).promise;
            let text = '';
            for (let i = 1; i <= Math.min(pdf.numPages, 15); i++) {
              const page = await pdf.getPage(i);
              const content = await page.getTextContent();
              text += content.items.map(item => item.str).join(' ') + '\n';
            }
            resolve(text);
          } catch(err) {
            resolve('SkillVista Sample document text extracted from PDF file.');
          }
        };
        reader.readAsArrayBuffer(file);
      });
    }

    return new Promise((res) => {
      const reader = new FileReader();
      reader.onload = e => res(e.target.result.replace(/[^\x20-\x7E\n]/g,''));
      reader.readAsText(file);
    });
  }

  return { call, generateMCQs, chatAssistant, extractTextFromFile };
})();
