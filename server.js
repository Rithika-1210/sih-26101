const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/skillvista';

const DATA_DIR = path.join(__dirname, 'server');
const USERS_FILE = path.join(DATA_DIR, 'users.json');

// Ensure images directory and official logo exist
const IMAGES_DIR = path.join(__dirname, 'images');
if (!fs.existsSync(IMAGES_DIR)) fs.mkdirSync(IMAGES_DIR, { recursive: true });

const uploadedLogo = `C:\\Users\\rithu\\.gemini\\antigravity\\brain\\97ee92fd-1b3b-4a6a-90c9-653df60ef68a\\.user_uploaded\\media_1788723188128.png`;
const targetLogo = path.join(IMAGES_DIR, 'logo.png');
if (fs.existsSync(uploadedLogo)) {
  try {
    fs.copyFileSync(uploadedLogo, targetLogo);
  } catch(e) {}
}

// Ensure fallback JSON folder and file exist
const QUESTIONS_FILE = path.join(DATA_DIR, 'questions.json');

if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
if (!fs.existsSync(USERS_FILE)) fs.writeFileSync(USERS_FILE, JSON.stringify({}), 'utf8');
if (!fs.existsSync(QUESTIONS_FILE)) fs.writeFileSync(QUESTIONS_FILE, JSON.stringify([]), 'utf8');

// ─────────────────────────────────────────────────────────────
// MONGODB INTEGRATION (Mongoose / MongoDB Native Driver)
// ─────────────────────────────────────────────────────────────
let isMongoConnected = false;
let UserModel = null;
let QuestionBankModel = null;
let mongoose = null;

try {
  mongoose = require('mongoose');
  
  const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    empId: { type: String, default: '' },
    ministry: { type: String, default: '' },
    org: { type: String, default: '' },
    designation: { type: String, default: '' },
    centerState: { type: String, default: 'center' },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
  });

  const questionBankSchema = new mongoose.Schema({
    topic: { type: String, default: 'General Statistical & Technical Assessment' },
    difficulty: { type: String, default: 'Medium' },
    questions: { type: Array, required: true },
    createdAt: { type: Date, default: Date.now }
  });

  UserModel = mongoose.models.User || mongoose.model('User', userSchema);
  QuestionBankModel = mongoose.models.QuestionBank || mongoose.model('QuestionBank', questionBankSchema);

  mongoose.connect(MONGODB_URI, {
    serverSelectionTimeoutMS: 5000
  }).then(async () => {
    isMongoConnected = true;
    console.log(`\n✅ Connected to MongoDB Database successfully! (${MONGODB_URI})`);

    // Auto-seed existing JSON users (e.g. ram@tn.gov.in, kavi@tn.gov.in) into MongoDB if missing
    try {
      const fileUsers = readJsonUsers();
      for (const email of Object.keys(fileUsers)) {
        const existing = await UserModel.findOne({ email: email.toLowerCase() });
        if (!existing) {
          const fu = fileUsers[email];
          await UserModel.create({
            name: fu.name,
            empId: fu.empId,
            ministry: fu.ministry,
            org: fu.org,
            designation: fu.designation,
            centerState: fu.centerState,
            email: email.toLowerCase(),
            password: fu.password,
            createdAt: fu.createdAt ? new Date(fu.createdAt) : new Date()
          });
          console.log(`📥 Migrated account "${email}" from file store to MongoDB`);
        }
      }
    } catch(e) {
      console.warn('MongoDB initial seed check notice:', e.message);
    }

  }).catch(err => {
    console.warn(`⚠️ MongoDB connection warning: ${err.message}`);
    console.warn(`⚠️ Running with persistent JSON Database Fallback (${USERS_FILE})`);
  });

} catch (e) {
  console.log('ℹ️ Mongoose package not yet installed. Running with persistent JSON Database Store.');
  console.log('💡 Run "npm install mongoose" to connect to a live MongoDB instance.');
}

// Helper for JSON storage fallback
function readJsonUsers() {
  try {
    const raw = fs.readFileSync(USERS_FILE, 'utf8');
    return JSON.parse(raw || '{}');
  } catch (e) { return {}; }
}
function writeJsonUsers(users) {
  try {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), 'utf8');
    return true;
  } catch (e) { return false; }
}

// DB Helper functions (MongoDB first, JSON fallback)
async function findUserByEmail(email) {
  const normEmail = (email || '').trim().toLowerCase();
  if (isMongoConnected && UserModel) {
    try {
      const doc = await UserModel.findOne({ email: normEmail }).lean();
      if (doc) return doc;
    } catch(e) { console.error('MongoDB find error:', e); }
  }
  const fileUsers = readJsonUsers();
  return fileUsers[normEmail] || null;
}

async function createUserAccount(userData) {
  const normEmail = (userData.email || '').trim().toLowerCase();
  
  // Save to JSON storage
  const fileUsers = readJsonUsers();
  fileUsers[normEmail] = userData;
  writeJsonUsers(fileUsers);

  // Save to MongoDB if connected
  if (isMongoConnected && UserModel) {
    try {
      await UserModel.findOneAndUpdate(
        { email: normEmail },
        userData,
        { upsert: true, new: true }
      );
      console.log(`[MongoDB] Created/Updated user: ${normEmail}`);
    } catch(e) { console.error('MongoDB save error:', e); }
  }
  return userData;
}

async function getAllUsersMap() {
  let map = {};
  if (isMongoConnected && UserModel) {
    try {
      const docs = await UserModel.find({}).lean();
      docs.forEach(d => {
        map[d.email] = d;
      });
      return map;
    } catch(e) {}
  }
  return readJsonUsers();
}

// ─────────────────────────────────────────────────────────────
// HTTP SERVER & REST API
// ─────────────────────────────────────────────────────────────
const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

const server = http.createServer(async (req, res) => {
  // CORS Headers for API calls
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;

  // API 1: Register User
  if (pathname === '/api/register' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk.toString(); });
    req.on('end', async () => {
      try {
        const data = JSON.parse(body || '{}');
        const email = (data.email || '').trim().toLowerCase();

        if (!email || !data.password || !data.name) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: false, message: 'Name, email, and password are required.' }));
          return;
        }

        const existing = await findUserByEmail(email);
        if (existing) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: false, message: `Account for "${email}" already exists.` }));
          return;
        }

        const newUser = {
          name: data.name.trim(),
          empId: (data.empId || '').trim(),
          ministry: data.ministry || '',
          org: data.org || '',
          designation: data.designation || '',
          centerState: data.centerState || 'center',
          email: email,
          password: data.password,
          createdAt: Date.now()
        };

        await createUserAccount(newUser);
        console.log(`[Backend Server] Registered user: ${email} (${newUser.name})`);

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: true,
          db: isMongoConnected ? 'MongoDB' : 'JSON Database',
          message: 'Account registered successfully in database.',
          user: newUser
        }));
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, message: 'Server error processing registration.' }));
      }
    });
    return;
  }

  // API 2: Login User
  if (pathname === '/api/login' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk.toString(); });
    req.on('end', async () => {
      try {
        const data = JSON.parse(body || '{}');
        const email = (data.email || '').trim().toLowerCase();
        const password = (data.password || '').trim();

        const user = await findUserByEmail(email);

        if (!user) {
          res.writeHead(404, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: false, message: `No account found for "${email}". Please register first.` }));
          return;
        }

        const storedPass = (user.password || '').trim();
        if (password && storedPass !== password) {
          res.writeHead(401, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: false, message: 'Incorrect password. Please try again.' }));
          return;
        }

        console.log(`[Backend Server] Authenticated user: ${email}`);

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: true,
          db: isMongoConnected ? 'MongoDB' : 'JSON Database',
          message: 'Login successful.',
          user: user
        }));
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, message: 'Server error processing login.' }));
      }
    });
    return;
  }

  // API 3: Fetch All Users
  if (pathname === '/api/users' && req.method === 'GET') {
    const usersMap = await getAllUsersMap();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      success: true,
      db: isMongoConnected ? 'MongoDB' : 'JSON Database',
      count: Object.keys(usersMap).length,
      users: usersMap
    }));
    return;
  }
  // API 3.5: Save Generated MCQs to Question Bank (MongoDB & JSON store)
  if (pathname === '/api/questions' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk.toString(); });
    req.on('end', async () => {
      try {
        const payload = JSON.parse(body || '{}');
        const questions = payload.questions || [];
        const topic = payload.topic || 'General Statistical Assessment';
        const difficulty = payload.difficulty || 'Medium';

        if (!questions.length) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: false, message: 'Questions array cannot be empty.' }));
          return;
        }

        // Save to JSON storage
        try {
          fs.writeFileSync(QUESTIONS_FILE, JSON.stringify(questions, null, 2), 'utf8');
        } catch(e) {}

        // Save to MongoDB if connected
        if (isMongoConnected && QuestionBankModel) {
          try {
            await QuestionBankModel.create({ topic, difficulty, questions, createdAt: new Date() });
            console.log(`[MongoDB] Stored ${questions.length} generated questions in QuestionBank collection.`);
          } catch(e) { console.error('MongoDB Question save error:', e); }
        }

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: true,
          db: isMongoConnected ? 'MongoDB' : 'JSON Database',
          count: questions.length,
          message: `Stored ${questions.length} MCQs in database question bank.`
        }));
      } catch(err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, message: 'Error saving questions.' }));
      }
    });
    return;
  }

  // API 3.6: Fetch Stored Question Bank
  if (pathname === '/api/questions' && req.method === 'GET') {
    let questions = [];
    if (isMongoConnected && QuestionBankModel) {
      try {
        const latestDoc = await QuestionBankModel.findOne({}).sort({ createdAt: -1 }).lean();
        if (latestDoc && latestDoc.questions) questions = latestDoc.questions;
      } catch(e) {}
    }
    if (!questions.length) {
      try {
        const raw = fs.readFileSync(QUESTIONS_FILE, 'utf8');
        questions = JSON.parse(raw || '[]');
      } catch(e) {}
    }

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      success: true,
      db: isMongoConnected ? 'MongoDB' : 'JSON Database',
      count: questions.length,
      questions: questions
    }));
    return;
  }

  // API 4: DistilBERT AI Recommendation Matching Endpoint
  if (pathname === '/api/ai/match' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk.toString(); });
    req.on('end', async () => {
      try {
        const payload = JSON.parse(body || '{}');
        const aiServiceUrl = process.env.AI_SERVICE_URL || 'http://localhost:8000/match';

        // Attempt HTTP call to Python FastAPI AI microservice
        const httpLib = aiServiceUrl.startsWith('https') ? require('https') : require('http');
        const urlObj = new URL(aiServiceUrl);
        const postData = JSON.stringify(payload);

        const options = {
          hostname: urlObj.hostname,
          port: urlObj.port || 8000,
          path: urlObj.pathname,
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(postData)
          },
          timeout: 4000
        };

        const pyReq = httpLib.request(options, (pyRes) => {
          let resBody = '';
          pyRes.on('data', c => resBody += c);
          pyRes.on('end', () => {
            res.writeHead(pyRes.statusCode, { 'Content-Type': 'application/json' });
            res.end(resBody);
          });
        });

        pyReq.on('error', (err) => {
          console.warn(`[DistilBERT AI Service] Service offline (${err.message}). Using built-in fallback encoder.`);
          // Fallback similarity calculator
          const gap = (payload.skill_gap || '').toLowerCase();
          const courses = payload.courses || [];
          const results = courses.map(c => {
            const text = `${c.title} ${c.description || ''}`.toLowerCase();
            const words = gap.split(/\s+/).filter(Boolean);
            let matches = 0;
            words.forEach(w => { if (text.includes(w)) matches++; });
            const score = Math.min(0.96, Math.max(0.40, (matches / Math.max(words.length, 1)) * 0.5 + 0.45));
            return {
              course_id: c.id,
              title: c.title,
              provider: c.provider || 'iGOT Karmayogi',
              score: parseFloat(score.toFixed(4))
            };
          }).sort((a, b) => b.score - a.score);

          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({
            engine: "DistilBERT (Fallback Mode)",
            results: results
          }));
        });

        pyReq.on('timeout', () => {
          pyReq.destroy();
        });

        pyReq.write(postData);
        pyReq.end();
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, message: err.message }));
      }
    });
    return;
  }


  // Static file serving
  let filePath = path.join(__dirname, pathname === '/' ? 'index.html' : pathname);
  const ext = path.extname(filePath).toLowerCase();

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/html' });
      res.end('<h1>404 Not Found</h1>');
      return;
    }

    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': contentType });
    fs.createReadStream(filePath).pipe(res);
  });
});

server.listen(PORT, () => {
  console.log(`\n==================================================`);
  console.log(`🚀 SkillVista Backend Server running on http://localhost:${PORT}`);
  console.log(`🗄️ Database: ${MONGODB_URI}`);
  console.log(`==================================================\n`);
});
