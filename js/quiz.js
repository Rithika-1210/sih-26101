/**
 * StatLearn AI — AI Features
 * 1. MCQ Generator (Gemini API)
 * 2. AI Chatbot
 * 3. Course Recommendations via LLM
 */

// ---- Gemini API Helper ----
window.GeminiAI = (function() {

  async function call(prompt, temperature = 0.7) {
    const key = CONFIG.GEMINI_API_KEY;
    if (!key || key === 'YOUR_GEMINI_API_KEY') {
      throw new Error('⚠️ Gemini API key not set. Open js/config.js and replace YOUR_GEMINI_API_KEY with your actual key from https://aistudio.google.com/app/apikey');
    }
    const url = `${CONFIG.GEMINI_API_BASE}/${CONFIG.GEMINI_MODEL}:generateContent?key=${key}`;
    const body = {
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature, maxOutputTokens: 4096 }
    };
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error?.message || `API error ${res.status}`);
    }
    const data = await res.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
  }

  return { call };
})();

// ---- MCQ Generator ----
window.QuizGenerator = (function() {

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
      return await extractFromPDF(file);
    }
    // For DOC/DOCX — read as text (best effort)
    return new Promise((res, rej) => {
      const reader = new FileReader();
      reader.onload = e => res(e.target.result.replace(/[^\x20-\x7E\n]/g,''));
      reader.onerror = rej;
      reader.readAsText(file);
    });
  }

  async function extractFromPDF(file) {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const pdfjsLib = window['pdfjs-dist/build/pdf'];
          if (!pdfjsLib) { resolve(''); return; }
          pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
          const pdf = await pdfjsLib.getDocument({ data: new Uint8Array(e.target.result) }).promise;
          let text = '';
          for (let i = 1; i <= Math.min(pdf.numPages, 20); i++) {
            const page = await pdf.getPage(i);
            const content = await page.getTextContent();
            text += content.items.map(item => item.str).join(' ') + '\n';
          }
          resolve(text);
        } catch(err) {
          resolve('');
        }
      };
      reader.readAsArrayBuffer(file);
    });
  }

  async function generateMCQs(text, numQuestions = 10, difficulty = 'Medium', topic = '') {
    const maxChars = 6000;
    const truncated = text.length > maxChars ? text.slice(0, maxChars) + '...' : text;

    const prompt = `You are an expert educational assessment designer specializing in Indian government statistical training.

Given the following learning material, generate exactly ${numQuestions} high-quality Multiple Choice Questions (MCQs) at ${difficulty} difficulty level.
${topic ? `Focus on the topic: "${topic}"` : ''}

Rules:
- Each question must have exactly 4 options (A, B, C, D)
- Only one option should be correct
- Questions must be based directly on the provided material
- Explanations should be educational and cite the concept from the material
- Avoid trivial or trick questions
- Use clear, professional language suitable for Indian government officials

Return ONLY a valid JSON array with this exact structure (no markdown, no extra text):
[
  {
    "question": "The full question text here?",
    "options": {
      "A": "First option",
      "B": "Second option",
      "C": "Third option",
      "D": "Fourth option"
    },
    "correct": "A",
    "explanation": "Explanation of why A is correct, referencing the material."
  }
]

Learning Material:
---
${truncated}
---

Generate ${numQuestions} MCQs now:`;

    const response = await GeminiAI.call(prompt, 0.5);

    // Extract JSON from response
    let json = response.trim();
    // Remove markdown code fences if present
    json = json.replace(/^```json?\s*/i, '').replace(/\s*```$/i, '').trim();

    try {
      const parsed = JSON.parse(json);
      if (Array.isArray(parsed)) return parsed;
      throw new Error('Response is not an array');
    } catch(e) {
      // Try to extract JSON array from response
      const match = response.match(/\[[\s\S]*\]/);
      if (match) {
        try { return JSON.parse(match[0]); } catch(_) {}
      }
      throw new Error('Failed to parse AI response as JSON. Please try again.');
    }
  }

  return { extractTextFromFile, generateMCQs };
})();

// ---- AI Chatbot ----
window.Chatbot = (function() {

  const SYSTEM_CONTEXT = `You are StatLearn AI Assistant — an intelligent learning support chatbot for MoSPI's AI-enabled Skill Intelligence Platform for India's Official Statistical System.

Your role: Help officials of India's Official Statistical System with:
- Understanding their competency gaps in 4 domains: Statistical, Technical, Digital Governance, Behavioural
- Finding relevant iGOT Karmayogi courses for skill development
- Explaining statistical concepts (GDP, CPI, sampling, SDGs, etc.)
- Navigating the StatLearn AI platform features
- Career development advice for statistical officers
- Information about MoSPI, NSSTA, NSO, and India's statistical ecosystem
- AI, data science, and digital governance concepts

Guidelines:
- Be helpful, professional, and concise (2-4 sentences max per reply)
- Use simple English suitable for government officials
- Mention specific domains when relevant
- Suggest specific iGOT courses when recommending learning
- Reference NSSTA, MoSPI, iGOT Karmayogi appropriately
- Respond in a warm, encouraging tone that motivates learning`;

  const QUICK_REPLIES = [
    'How do I assess my competency?',
    'Recommend Python courses',
    'What is SDG Indicator 1.1.1?',
    'Explain CPI methodology',
    'How to improve my skills?',
    'What courses does iGOT have?',
  ];

  async function chat(userMessage) {
    const prompt = `${SYSTEM_CONTEXT}

User: ${userMessage}
Assistant:`;
    return await GeminiAI.call(prompt, 0.7);
  }

  async function getSkillAdvice(gaps) {
    const gapList = Object.entries(gaps)
      .filter(([,g]) => g.gap > 0)
      .map(([k,g]) => `${g.label}: current ${g.current}/5, required ${g.required}/5`)
      .join('; ');

    const prompt = `${SYSTEM_CONTEXT}

The user has the following competency gaps: ${gapList}

Provide a brief, encouraging 2-3 sentence personalized learning advice message. Mention 1-2 specific actions they can take.
Assistant:`;
    return await GeminiAI.call(prompt, 0.6);
  }

  return { chat, getSkillAdvice, QUICK_REPLIES, SYSTEM_CONTEXT };
})();
