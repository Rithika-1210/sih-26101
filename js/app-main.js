/**
 * SkillVista — Master Single Page Application Engine
 * Pure Vanilla JS + UI Component System
 * 100% Reliable Offline & Online · Zero Babel Dependencies
 */

function initSkillVistaApp() {

  // Restore saved active session
  let savedUser = null;
  try {
    savedUser = JSON.parse(localStorage.getItem('sv_session') || 'null') || Store.get('current_user');
  } catch(e) {}

  // ── State Management ────────────────────────────────────────────────────────
  const State = {
    user: savedUser,
    currentPage: 'login',
    scores: CompetencyEngine.loadScores(),
    enrolledIds: IgotService.getEnrolled(),
    completedIds: IgotService.getCompleted(),
  };

  // ── Toast Notification System ───────────────────────────────────────────────
  window.showToast = function(msg, type = 'info') {
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      container.className = 'toast-container';
      document.body.appendChild(container);
    }
    const icons = { success: '✅', error: '❌', info: 'ℹ️', warning: '⚠️' };
    const el = document.createElement('div');
    el.className = `toast ${type}`;
    el.innerHTML = `<span>${icons[type]||'ℹ️'}</span><span>${msg}</span>`;
    container.appendChild(el);
    setTimeout(() => {
      el.style.opacity = '0';
      el.style.transform = 'translateX(20px)';
      el.style.transition = 'all 0.3s';
      setTimeout(() => el.remove(), 300);
    }, 3500);
  };

  // ── Main Render Router ──────────────────────────────────────────────────────
  function render() {
    const root = document.getElementById('root');
    if (!root) return;

    if (!State.user || State.currentPage === 'login') {
      root.innerHTML = renderLoginPage() + renderChatbotWidget();
      bindLoginEvents();
      bindChatbotEvents();
      if (typeof window.hidePreload === 'function') window.hidePreload();
      return;
    }

    root.innerHTML = `
      <div class="app-layout">
        ${renderSidebar()}
        <main class="main-content">
          ${renderHeader()}
          <div class="page-body">
            ${renderPageContent()}
          </div>
        </main>
        ${renderChatbotWidget()}
      </div>
    `;

    bindAppEvents();
    bindChatbotEvents();
    if (typeof window.hidePreload === 'function') window.hidePreload();
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // 1. LOGIN PAGE — iGOT Split Screen · Navy→Teal + Pure White
  // ═══════════════════════════════════════════════════════════════════════════
  function renderLoginPage() {
    const isReg = (window._svAuthMode === 'register');
    return `
      <div class="sv-auth-root">

        <!-- TOPBAR -->
        <div class="sv-topbar">
          <div class="sv-topbar-inner">
            <span class="sv-topbar-emblem">🏛️</span>
            <div class="sv-topbar-text">
              <span class="sv-topbar-title">Government of India &nbsp;·&nbsp; SkillVista</span>
              <span class="sv-topbar-sub">Ministry of Statistics &amp; Programme Implementation | iGOT Karmayogi Ecosystem</span>
            </div>
            <div class="sv-topbar-right">
              <span class="sv-chip sv-chip-orange">SIH 2026 · PS #26101</span>
              <span class="sv-chip sv-chip-white">Mission Karmayogi</span>
            </div>
          </div>
        </div>

        <!-- SPLIT BODY -->
        <div class="sv-split-body">

          <!-- LEFT PANEL -->
          <div class="sv-left-panel">
            <!-- Login Info -->
            <div id="sv-left-login" style="display:${isReg?'none':'flex'};" class="sv-left-content">
              <div class="sv-left-badge">Welcome to SkillVista</div>
              <h1 class="sv-left-title">How To Login</h1>
              <div class="sv-steps">
                <div class="sv-step">
                  <div class="sv-step-num">1</div>
                  <div class="sv-step-info">
                    <b>Use your Government Email ID</b>
                    <p>Sign in only with your official .gov.in, .nic.in, or state government email address.</p>
                  </div>
                </div>
                <div class="sv-step">
                  <div class="sv-step-num">2</div>
                  <div class="sv-step-info">
                    <b>Login with Parichay / e-Pramaan SSO</b>
                    <p>Use India's official single sign-on for a faster, password-free experience.</p>
                  </div>
                </div>
                <div class="sv-step">
                  <div class="sv-step-num">3</div>
                  <div class="sv-step-info">
                    <b>Facing Issues Logging In?</b>
                    <p>Clear browser cache &amp; open a private window (Ctrl+Shift+N) and try again.</p>
                  </div>
                </div>
              </div>
              <div class="sv-left-globe">🎓</div>
            </div>

            <!-- Register Info -->
            <div id="sv-left-register" style="display:${isReg?'flex':'none'};" class="sv-left-content">
              <div class="sv-left-badge">Welcome to SkillVista</div>
              <h1 class="sv-left-title">How To Register</h1>
              <div class="sv-steps">
                <div class="sv-step">
                  <div class="sv-step-num">1</div>
                  <div class="sv-step-info">
                    <b>You can only register with your Government Email ID</b>
                    <p>Use your official .gov.in or .nic.in address — personal email IDs are not accepted.</p>
                  </div>
                </div>
                <div class="sv-step">
                  <div class="sv-step-num">2</div>
                  <div class="sv-step-info">
                    <b>Do not have a Government Email ID?</b>
                    <p>Contact your MDO admin to onboard you with your mobile number and personal email.</p>
                  </div>
                </div>
                <div class="sv-step">
                  <div class="sv-step-num">3</div>
                  <div class="sv-step-info">
                    <b>To find your MDO Admin Details</b>
                    <p>Visit the iGOT Karmayogi portal or connect within your organisation for support.</p>
                  </div>
                </div>
                <div class="sv-step">
                  <div class="sv-step-num">4</div>
                  <div class="sv-step-info">
                    <b>Details not in the list?</b>
                    <p>If your organisation details are missing, connect within your organisation for registration.</p>
                  </div>
                </div>
              </div>
              <div class="sv-left-globe">📋</div>
            </div>
          </div>

          <!-- RIGHT PANEL -->
          <div class="sv-right-panel">

            <!-- ══ SIGN IN FORM ══ -->
            <div id="sv-form-signin" class="sv-auth-form-card" style="display:${isReg?'none':'block'};">
              <div class="sv-form-logo">🎓 <span>SkillVista</span></div>
              <h2 class="sv-form-title">Sign In</h2>

              <div class="sv-login-mode">
                <label class="sv-radio-label">
                  <input type="radio" name="login-mode" id="mode-password" value="password" checked>
                  Login with password
                </label>
                <label class="sv-radio-label">
                  <input type="radio" name="login-mode" id="mode-otp" value="otp">
                  Login with OTP
                </label>
              </div>

              <div class="sv-field">
                <label class="sv-label">Email / Government ID</label>
                <input type="email" id="si-email" class="sv-input" placeholder="yourname@tn.gov.in">
                <div class="sv-hint">Use your official government email (.gov.in, .nic.in, state.gov.in)</div>
              </div>

              <div id="si-pass-block" class="sv-field">
                <label class="sv-label">Password</label>
                <input type="password" id="si-password" class="sv-input" placeholder="Enter your password">
                <div class="sv-forgot"><a href="#" onclick="return false;">Forgot Password?</a></div>
              </div>

              <div id="si-otp-block" class="sv-field" style="display:none">
                <label class="sv-label">OTP</label>
                <div style="display:flex;gap:.5rem;">
                  <input type="text" id="si-otp" class="sv-input" placeholder="Enter 6-digit OTP" maxlength="6" style="flex:1;letter-spacing:.25rem;font-weight:700;">
                  <button id="si-req-otp" class="sv-outline-btn" style="white-space:nowrap;">Request OTP</button>
                </div>
              </div>

              <button id="si-submit" class="sv-primary-btn">Sign In →</button>

              <div class="sv-or"><span>or</span></div>

              <div class="sv-provider-row">
                <label class="sv-label" style="margin-bottom:.4rem;">Login with Providers</label>
                <select id="sv-provider-select" class="sv-input sv-select" style="margin-bottom:.625rem;">
                  <option value="">Select Provider</option>
                  <option value="parichay">🏛️ Parichay SSO</option>
                  <option value="epramaan">🔐 e-Pramaan</option>
                </select>
                <div id="sv-provider-form" style="display:none;">
                  <div class="sv-provider-label" id="sv-provider-name-lbl"></div>
                  <div class="sv-field" style="margin-bottom:.5rem;">
                    <input type="email" id="si-provider-email" class="sv-input" placeholder="Registered gov email (e.g. name@tn.gov.in)">
                    <div class="sv-hint">Enter the email you used to register on SkillVista</div>
                  </div>
                  <div style="display:flex;gap:.5rem;margin-bottom:.5rem;">
                    <input type="text" id="si-provider-otp" class="sv-input" placeholder="Enter OTP" maxlength="6" style="flex:1;letter-spacing:.25rem;font-weight:700;">
                    <button id="si-provider-req-otp" class="sv-outline-btn" style="white-space:nowrap;padding:.55rem .75rem;">Get OTP</button>
                  </div>
                  <button id="si-provider-submit" class="sv-primary-btn" style="margin-top:0;">Verify &amp; Sign In →</button>
                </div>
              </div>

              <p class="sv-switch">Don't have an account? <a href="#" id="go-to-register">Register here</a></p>
            </div>

            <!-- ══ REGISTER FORM ══ -->
            <div id="sv-form-register" class="sv-auth-form-card" style="display:${isReg?'block':'none'}">

              <div style="display:flex;align-items:center;gap:.5rem;margin-bottom:1rem;">
                <button id="reg-back-btn" class="sv-back-btn">← Back</button>
                <h2 class="sv-form-title" style="margin:0;">Register</h2>
              </div>

              <!-- Step indicator -->
              <div class="sv-steps-bar">
                <div class="sv-step-circle active" id="step-circle-1">1</div>
                <div class="sv-steps-line" id="step-line"></div>
                <div class="sv-step-circle" id="step-circle-2">2</div>
              </div>
              <div class="sv-steps-labels">
                <span class="sv-step-lbl active" id="step-lbl-1">Step - 1</span>
                <span class="sv-step-lbl" id="step-lbl-2">Step - 2</span>
              </div>

              <!-- STEP 1 -->
              <div id="reg-step1">
                <div class="sv-field">
                  <label class="sv-label">Center / State *</label>
                  <div class="sv-radio-group">
                    <label class="sv-radio-option">
                      <input type="radio" name="reg-centerstate" id="rcs-center" value="center" checked>
                      <span>Center</span>
                    </label>
                    <label class="sv-radio-option">
                      <input type="radio" name="reg-centerstate" id="rcs-state" value="state">
                      <span>State</span>
                    </label>
                  </div>
                </div>

                <div class="sv-field" id="reg-state-field" style="display:none;">
                  <label class="sv-label">State *</label>
                  <select id="reg-state" class="sv-input sv-select">
                    <option value="">-- Select State --</option>
                    <option value="tn">Tamil Nadu (.tn.gov.in)</option>
                    <option value="mh">Maharashtra (.mh.gov.in)</option>
                    <option value="up">Uttar Pradesh (.up.gov.in)</option>
                    <option value="ka">Karnataka (.kar.nic.in)</option>
                    <option value="gj">Gujarat (.gujarat.gov.in)</option>
                    <option value="rj">Rajasthan (.rajasthan.gov.in)</option>
                    <option value="wb">West Bengal (.wb.gov.in)</option>
                    <option value="mp">Madhya Pradesh (.mp.gov.in)</option>
                    <option value="pb">Punjab (.punjab.gov.in)</option>
                    <option value="hr">Haryana (.haryana.gov.in)</option>
                  </select>
                </div>

                <div class="sv-field">
                  <label class="sv-label">Ministry / Department *</label>
                  <select id="reg-ministry" class="sv-input sv-select">
                    <option value="">Select ministry</option>
                    <option>MoSPI — Ministry of Statistics &amp; Programme Implementation</option>
                    <option>MoE — Ministry of Education</option>
                    <option>MHA — Ministry of Home Affairs</option>
                    <option>MoF — Ministry of Finance</option>
                    <option>MoH — Ministry of Health &amp; Family Welfare</option>
                    <option>DoPT — Department of Personnel &amp; Training</option>
                    <option>DPIIT — Dept. for Promotion of Industry</option>
                    <option>NSSTA — National Statistics Systems Training Academy</option>
                    <option>NIC — National Informatics Centre</option>
                    <option>State — State Government Department</option>
                  </select>
                  <div class="sv-error" id="err-ministry"></div>
                </div>

                <div class="sv-field">
                  <label class="sv-label">Organisation *</label>
                  <select id="reg-org" class="sv-input sv-select">
                    <option value="">Select organisation</option>
                    <option>Indian Statistical Institute, MoSPI</option>
                    <option>NSSO — Field Operations Division</option>
                    <option>CSO — Central Statistics Office</option>
                    <option>DES — Directorate of Economics &amp; Statistics</option>
                    <option>NIC — State Data Centre</option>
                    <option>NSSTA — Training Division</option>
                    <option>State Secretariat / Collectorates</option>
                  </select>
                  <div class="sv-error" id="err-org"></div>
                </div>

                <div class="sv-field">
                  <label class="sv-label">Designation *</label>
                  <select id="reg-designation" class="sv-input sv-select">
                    <option value="">Select designation</option>
                    <option>Statistical Officer</option>
                    <option>Deputy Director (Statistics)</option>
                    <option>Director (Statistics)</option>
                    <option>Data Analyst</option>
                    <option>Field Investigator</option>
                    <option>Additional Research Officer</option>
                    <option>Additional Secretary</option>
                    <option>Under Secretary</option>
                    <option>Section Officer</option>
                    <option>NSSTA Faculty</option>
                    <option>MoSPI Administrator</option>
                  </select>
                </div>

                <div class="sv-field">
                  <label class="sv-label">Government Official Email *</label>
                  <input type="email" id="reg-email" class="sv-input" placeholder="yourname@tn.gov.in">
                  <div class="sv-hint">Only .gov.in, .nic.in, or state government email accepted</div>
                  <div class="sv-error" id="err-email"></div>
                </div>

                <button id="reg-next-btn" class="sv-primary-btn">Next →</button>
                <p class="sv-switch">Already have an account? <a href="#" id="go-to-signin">Sign In</a></p>
              </div>

              <!-- STEP 2 -->
              <div id="reg-step2" style="display:none;">
                <div class="sv-field">
                  <label class="sv-label">Full Name *</label>
                  <input type="text" id="reg-name" class="sv-input" placeholder="As per government records">
                </div>

                <div class="sv-field">
                  <label class="sv-label">Employee ID / Service Number *</label>
                  <input type="text" id="reg-empid" class="sv-input" placeholder="e.g., MOSPI/2024/00123">
                </div>

                <div class="sv-field">
                  <label class="sv-label">Verify Email OTP</label>
                  <div style="display:flex;gap:.5rem;">
                    <input type="text" id="reg-otp" class="sv-input" placeholder="6-digit OTP" maxlength="6" style="flex:1;letter-spacing:.25rem;font-weight:700;">
                    <button id="reg-send-otp" class="sv-outline-btn" style="white-space:nowrap;">Send OTP</button>
                  </div>
                  <div class="sv-hint" id="reg-otp-hint">An OTP will be sent to your registered government email</div>
                </div>

                <div class="sv-field">
                  <label class="sv-label">Create Password *</label>
                  <input type="password" id="reg-password" class="sv-input" placeholder="Minimum 8 characters">
                </div>

                <div class="sv-field">
                  <label class="sv-label">Confirm Password *</label>
                  <input type="password" id="reg-confirm" class="sv-input" placeholder="Re-enter password">
                </div>

                <div style="display:flex;gap:.75rem;">
                  <button id="reg-prev-btn" class="sv-outline-btn" style="flex:0 0 auto;">← Back</button>
                  <button id="reg-submit" class="sv-primary-btn" style="flex:1;">Create Account →</button>
                </div>
              </div>
            </div>

            <!-- SECURITY NOTE -->
            <div class="sv-security-note">
              🔒 Secured by Parichay · NIC · MeghRaj Cloud · DPDP Act 2023 · WCAG 2.1 AAA
            </div>
          </div>
        </div>

        <!-- FOOTER -->
        <div class="sv-auth-footer">
          © Government of India · Ministry of Statistics &amp; Programme Implementation · SkillVista v1.0
        </div>
      </div>
    `;
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // 2. SIDEBAR RENDER
  // ═══════════════════════════════════════════════════════════════════════════
  function renderSidebar() {
    const user = State.user;
    const navItems = [
      {
        id: 'dashboard',
        label: 'Dashboard',
        icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="9" rx="1"/><rect x="14" y="3" width="7" height="5" rx="1"/><rect x="14" y="12" width="7" height="9" rx="1"/><rect x="3" y="16" width="7" height="5" rx="1"/></svg>`
      },
      {
        id: 'assessment',
        label: 'Competency Assessment',
        icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>`
      },
      {
        id: 'courses',
        label: 'iGOT Courses',
        icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>`
      },
      {
        id: 'quiz',
        label: 'AI Quiz Generator',
        icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a2 2 0 0 1 2 2v2h2a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h2V4a2 2 0 0 1 2-2z"/><circle cx="9" cy="11" r="1"/><circle cx="15" cy="11" r="1"/><path d="M10 15h4"/></svg>`
      },
    ];

    if (user && (user.role === 'admin' || user.role === 'trainer')) {
      navItems.push({
        id: 'admin',
        label: 'Admin Analytics',
        icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>`
      });
    }

    return `
      <aside class="sidebar">
        <div class="sidebar-logo">
          <div class="sidebar-logo-icon" style="display:flex;align-items:center;justify-content:center;color:#0D9488;">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
          </div>
          <div>
            <div class="sidebar-logo-text">Skill<span style="color:var(--saffron-400,#F97316)">Vista</span></div>
            <div class="sidebar-logo-sub">MoSPI · iGOT Ecosystem</div>
          </div>
        </div>

        <nav class="sidebar-nav">
          <div class="sidebar-section-label">Platform Navigation</div>
          ${navItems.map(item => `
            <a href="#${item.id}" class="nav-item ${State.currentPage === item.id || (item.id === 'courses' && State.currentPage === 'learningpath') ? 'active' : ''}" data-page="${item.id}">
              <span class="nav-icon" style="display:flex;align-items:center;justify-content:center;width:20px;">${item.icon}</span>
              <span>${item.label}</span>
              ${item.badge ? `<span class="badge badge-green ml-auto" style="font-size:0.6rem;">${item.badge}</span>` : ''}
            </a>
          `).join('')}
        </nav>

        <div class="sidebar-footer">
          <div class="sidebar-user" id="sidebar-profile-btn" style="cursor:pointer;" title="Edit Profile">
            <div class="user-avatar" style="${user && user.photo ? 'background:none;padding:0;overflow:hidden;' : ''}">
              ${user && user.photo
                ? `<img src="${user.photo}" style="width:100%;height:100%;object-fit:cover;border-radius:50%;" alt="Profile">`
                : (user ? user.avatar : 'SV')
              }
            </div>
            <div style="flex:1; min-width:0;">
              <div class="user-name">${user ? user.name : 'Officer'}</div>
              <div class="user-role">${user ? user.designation : 'Learner'}</div>
            </div>
            <button id="logout-btn" class="sb-logout-btn" title="Sign Out">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                <polyline points="16 17 21 12 16 7"/>
                <line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
            </button>
          </div>
        </div>
      </aside>
    `;
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // 3. HEADER RENDER
  // ═══════════════════════════════════════════════════════════════════════════
  function renderHeader() {
    const titles = {
      dashboard: 'Learner Dashboard',
      assessment: 'Competency Profiling & Assessment',
      quiz: 'AI Quiz Generator (Gemini LLM)',
      mcq: 'MCQ Assessment & Competency Evaluation',
      skillgap: 'Skill Gap Engine & Vector Analysis',
      courses: 'iGOT Karmayogi Learning Pathways',
      learningpath: 'iGOT Karmayogi Learning Pathways',
      admin: 'MoSPI & NSSTA Admin Analytics',
      profile: 'My Profile & Certificates',
    };

    return `
      <header class="page-header">
        <div>
          <div class="page-title">${titles[State.currentPage] || 'SkillVista'}</div>
          <div class="page-subtitle">India's Official Statistical System · ${State.user?.department || 'MoSPI / NSSTA'}</div>
        </div>
      </header>
    `;

  }

  // ═══════════════════════════════════════════════════════════════════════════
  // 4. PAGE CONTENT ROUTER
  // ═══════════════════════════════════════════════════════════════════════════
  function renderPageContent() {
    switch (State.currentPage) {
      case 'dashboard': return renderDashboard();
      case 'assessment': return renderAssessment();
      case 'quiz': return renderQuizGenerator();
      case 'mcq': return renderMcqAssessment();
      case 'skillgap': return renderSkillGap();
      case 'courses':
      case 'learningpath': return renderCourses();
      case 'admin': return renderAdminAnalytics();
      case 'profile': return renderProfile();
      default: return renderDashboard();
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // SKILL GAP ENGINE VIEW
  // ═══════════════════════════════════════════════════════════════════════════
  function renderSkillGap() {
    const role = State.user?.designation || 'Statistical Officer';
    const currentGaps = CompetencyEngine.computeGaps(State.scores, role);
    const overallScore = CompetencyEngine.overallScore(State.scores);

    return `
      <div class="card mb-6" style="background: linear-gradient(135deg, rgba(10,37,64,0.95), rgba(0,128,128,0.90)); color: white; border: 1px solid rgba(255,255,255,0.2);">
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:1rem;">
          <div>
            <h2 style="color:white; margin-bottom:0.25rem;">⚡ AI Skill Gap Analysis & Vector Engine</h2>
            <p style="color:rgba(255,255,255,0.85); font-size:0.9rem;">
              Role Target Benchmark: <strong style="color:#FBBF24;">${role}</strong> | Overall Competency: <strong style="color:#10B981;">${overallScore}%</strong>
            </p>
          </div>
          <button onclick="navigateTo('assessment')" class="btn btn-sm" style="background:#F97316; color:white; font-weight:700; border:none; cursor:pointer;">
            🎯 Retake Assessment
          </button>
        </div>
      </div>

      <!-- Competency Gap Breakdown Grid -->
      <div class="grid-2 mb-6" style="gap:1.25rem;">
        ${Object.entries(currentGaps).map(([key, gap]) => `
          <div class="card" style="border-left: 4px solid ${gap.gap > 0 ? '#F97316' : '#10B981'};">
            <div class="flex-between mb-3">
              <h4 style="margin:0; font-size:1.05rem;">${gap.shortLabel}</h4>
              ${gap.gap > 0
                ? `<span class="badge badge-saffron">Gap: -${gap.gap} / 5</span>`
                : `<span class="badge badge-green">✓ Role Target Benchmark Met</span>`
              }
            </div>
            <p style="font-size:0.82rem; color:#64748B; margin-bottom:1rem;">${gap.description || 'Target proficiency evaluated against NSSTA & FRAC frameworks.'}</p>

            <div style="display:flex; flex-direction:column; gap:0.5rem; margin-bottom:1rem;">
              <div class="flex-between" style="font-size:0.8rem; color:#475569;">
                <span>Present Level: <strong>${gap.current} / 5</strong> (${gap.pct_current}%)</span>
                <span>Role Requirement: <strong>${gap.required} / 5</strong> (${gap.pct_required}%)</span>
              </div>
              <div style="height:8px; background:#E2E8F0; border-radius:99px; overflow:hidden; position:relative;">
                <div style="height:100%; width:${gap.pct_current}%; background:${gap.gap > 0 ? 'linear-gradient(90deg, #3B82F6, #F97316)' : '#10B981'}; border-radius:99px;"></div>
              </div>
            </div>

            <div class="flex-between" style="font-size:0.78rem; background:#F8FAFC; padding:0.6rem 0.8rem; border-radius:8px;">
              <span style="color:#64748B;">Recommended iGOT Learning Focus:</span>
              <a href="#courses" onclick="navigateTo('courses')" style="color:#1D4ED8; font-weight:600; text-decoration:none;">View Courses ↗</a>
            </div>
          </div>
        `).join('')}
      </div>

      <!-- Action Footer -->
      <div class="card" style="text-align:center; padding:1.75rem;">
        <h3 class="card-title" style="justify-content:center; margin-bottom:0.5rem;">📚 Bridge Your Gaps with DistilBERT Recommended Pathways</h3>
        <p style="font-size:0.875rem; color:#64748B; max-width:600px; margin:0 auto 1.25rem;">
          Our AI model matches your identified skill gaps against 1,500+ iGOT Karmayogi courses to generate personalized learning paths.
        </p>
        <button onclick="navigateTo('courses')" class="btn btn-primary" style="padding:0.65rem 1.75rem;">
          🚀 Go to Learning Path
        </button>
      </div>
    `;
  }


  // ═══════════════════════════════════════════════════════════════════════════
  // 5. DASHBOARD VIEW
  // ═══════════════════════════════════════════════════════════════════════════
  function renderDashboard() {
    const u = State.user || {};
    const overall = CompetencyEngine.overallScore(State.scores);
    const ministryName = u.department || u.ministry || 'Ministry of Statistics & Programme Implementation';

    return `
      <!-- Welcome & Ministry Profile Banner -->
      <div class="card mb-6" style="background: linear-gradient(135deg, #0F172A, #1E293B); color: white; padding: 1.25rem 1.5rem; border-radius: 12px; border-left: 5px solid #0D9488;">
        <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem;">
          <div style="display: flex; align-items: center; gap: 1rem;">
            <div style="width: 48px; height: 48px; border-radius: 50%; background: #0D9488; color: white; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 1.25rem; flex-shrink: 0;">
              ${u.name ? u.name[0].toUpperCase() : 'O'}
            </div>
            <div>
              <h3 style="color: white; margin: 0 0 0.25rem 0; font-size: 1.15rem; font-weight: 700;">Welcome, ${u.name || 'Officer'}!</h3>
              <div style="font-size: 0.85rem; color: #94A3B8; display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap;">
                <span>🏛️ <b>Ministry / Department:</b> <span style="color: #2DD4BF; font-weight: 700;">${ministryName}</span></span>
                <span>•</span>
                <span>💼 <b>Role:</b> ${u.designation || 'Statistical Officer'}</span>
              </div>
            </div>
          </div>
          <button onclick="window.navigateTo('profile')" class="btn btn-sm" style="background: rgba(255,255,255,0.1); color: white; border: 1px solid rgba(255,255,255,0.2); font-size: 0.8rem;">
            Edit Profile &amp; Ministry ✏️
          </button>
        </div>
      </div>

      <div class="stats-grid">
        <div class="stat-card blue">
          <div class="stat-icon blue">📊</div>
          <div class="stat-info">
            <div class="stat-value">${overall}%</div>
            <div class="stat-label">Competency Score</div>
            <div class="stat-change up">↑ SkillVista AI Vector</div>
          </div>
        </div>

        <div class="stat-card green">
          <div class="stat-icon green">✅</div>
          <div class="stat-info">
            <div class="stat-value">${State.completedIds.length}</div>
            <div class="stat-label">Completed Courses</div>
            <div class="stat-change up">↑ iGOT Progress</div>
          </div>
        </div>

        <div class="stat-card saffron">
          <div class="stat-icon saffron">📚</div>
          <div class="stat-info">
            <div class="stat-value">${State.enrolledIds.length}</div>
            <div class="stat-label">Enrolled Pathways</div>
            <div class="stat-change up">↑ Active Learning</div>
          </div>
        </div>

        <div class="stat-card purple">
          <div class="stat-icon purple">⏱️</div>
          <div class="stat-info">
            <div class="stat-value">${State.completedIds.length * 12 + State.enrolledIds.length * 4}h</div>
            <div class="stat-label">Learning Hours</div>
            <div class="stat-change up">↑ Mission Karmayogi</div>
          </div>
        </div>
      </div>

      <div class="grid-2 mb-6">
        <div class="card">
          <h3 class="card-title">🎯 FRAC Competency Vector</h3>
          <div style="display: flex; flex-direction: column; gap: 1rem;">
            ${Object.entries(CompetencyEngine.DOMAINS).map(([key, dom]) => {
              const val = State.scores[key] ? Math.round(State.scores[key] * 20) : 0;
              return `
                <div>
                  <div class="flex-between mb-1" style="font-size: 0.875rem;">
                    <span>${dom.emoji} ${dom.shortLabel}</span>
                    <span class="font-bold">${val}%</span>
                  </div>
                  <div class="progress-track">
                    <div class="progress-fill ${dom.color}" style="width: ${val}%;"></div>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
          <button class="btn btn-outline w-full mt-6" onclick="window.navigateTo('assessment')">
            Update Competency Assessment →
          </button>
        </div>

        <div class="card">
          <h3 class="card-title">🤖 Personalised iGOT Pathways</h3>
          <div style="display: flex; flex-direction: column; gap: 0.75rem;">
            ${IgotService.COURSES.slice(0, 4).map(c => `
              <div style="display: flex; align-items: center; gap: 0.75rem; padding: 0.75rem; background: var(--glass-bg); border: var(--border-glass); border-radius: var(--radius-md);">
                <div style="font-size: 1.25rem;">📖</div>
                <div style="flex: 1; min-width: 0;">
                  <div style="font-weight: 600; font-size: 0.85rem; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${c.title}</div>
                  <div class="text-muted" style="font-size: 0.72rem;">${c.provider} · ${c.level}</div>
                </div>
                <a href="${c.igot_url}" target="_blank" class="btn btn-sm btn-primary" style="padding: 0.3rem 0.6rem; font-size: 0.75rem;">iGOT ↗</a>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // 6. ASSESSMENT VIEW
  // ═══════════════════════════════════════════════════════════════════════════
  function renderAssessment() {
    const domains = CompetencyEngine.DOMAINS;
    const currentGaps = CompetencyEngine.computeGaps(State.scores, State.user?.designation || 'Statistical Officer');

    return `
      <div class="card mb-6">
        <h3 class="mb-2">🎯 FRAC Competency Profiling &amp; Gap Engine</h3>
        <p>Assess your skills against FRAC &amp; NSSTA TPAC target benchmarks for <b>${State.user?.designation || 'Statistical Officer'}</b>.</p>
      </div>

      <div class="grid-4 mb-6">
        ${Object.entries(domains).map(([key, domain]) => {
          const hasScore = State.scores[key] !== undefined;
          return `
            <div class="card cursor-pointer domain-select-card" data-domain="${key}" style="text-align: center; padding: 1.5rem;">
              <div style="font-size: 2.5rem; margin-bottom: 0.5rem;">${domain.emoji}</div>
              <h4 style="font-size: 1rem; margin-bottom: 0.25rem;">${domain.label}</h4>
              <div class="text-muted" style="font-size: 0.8rem; margin-bottom: 0.75rem;">
                ${CompetencyEngine.QUESTIONS[key].length} Questions
              </div>
              ${hasScore ? `<span class="badge badge-green">✓ ${Math.round(State.scores[key] * 20)}% Score</span>` : `<span class="badge badge-blue">Pending</span>`}
            </div>
          `;
        }).join('')}
      </div>

      <div class="card">
        <h3 class="card-title">🔍 Current Skill-Gap Vector Analysis</h3>
        <div style="display: flex; flex-direction: column; gap: 1rem;">
          ${Object.entries(currentGaps).map(([key, gap]) => `
            <div style="padding: 1rem; background: var(--glass-bg); border: var(--border-glass); border-radius: var(--radius-md);">
              <div class="flex-between mb-2">
                <div style="font-weight: 600;">${gap.shortLabel}</div>
                <div>
                  ${gap.gap > 0 ? `<span class="badge badge-saffron">Competency Gap: ${gap.gap} / 5</span>` : `<span class="badge badge-green">✓ Target Benchmark Met</span>`}
                </div>
              </div>
              <div class="flex-between text-muted" style="font-size: 0.8rem;">
                <span>Present Level: ${gap.current}/5 (${gap.pct_current}%)</span>
                <span>Role Target: ${gap.required}/5 (${gap.pct_required}%)</span>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // 7. QUIZ GENERATOR VIEW
  // ═══════════════════════════════════════════════════════════════════════════
  function renderQuizGenerator() {
    return `
      <div class="grid-2 mb-6" style="gap: 1.5rem; align-items: start;">
        <div style="display: flex; flex-direction: column; gap: 1.25rem;">
          <div class="card">
            <h3 class="card-title">📤 Ingest Learning Material</h3>
            <input type="file" id="quiz-file-input" accept=".pdf,.txt,.doc,.docx" style="display: none;">
            <div class="upload-zone" onclick="document.getElementById('quiz-file-input').click()">
              <div style="font-size: 3rem; margin-bottom: 0.5rem;">📄</div>
              <div class="font-bold mb-1">Upload PDF, PPT, DOCX or Video Text</div>
              <div class="text-muted" style="font-size: 0.8rem;">SkillVista Ingestion Engine Parses &amp; Vectorizes Chunks</div>
            </div>
          </div>

          <div class="card">
            <h3 class="card-title">✍️ Direct Text Ingestion</h3>
            <textarea id="quiz-paste-text" class="form-textarea" rows="6" placeholder="Paste training notes, NSSO survey manuals, CPI compilation guidelines, or MoSPI documents..."></textarea>
          </div>

          <div class="card">
            <h3 class="card-title">⚙️ Assessment Generation Controls</h3>
            <div class="grid-2 mb-4">
              <div>
                <label class="form-label">Questions</label>
                <select id="quiz-num-q" class="form-select">
                  <option value="5">5 Questions</option>
                  <option value="10" selected>10 Questions</option>
                  <option value="15">15 Questions</option>
                </select>
              </div>
              <div>
                <label class="form-label">Difficulty</label>
                <select id="quiz-diff" class="form-select">
                  <option value="Easy">Easy (Remember/Understand)</option>
                  <option value="Medium" selected>Medium (Apply/Analyze)</option>
                  <option value="Hard">Hard (Evaluate/Design)</option>
                </select>
              </div>
            </div>
            <button id="generate-mcq-btn" class="btn btn-primary w-full">⚡ Generate Bloom-Tagged MCQs</button>
          </div>
        </div>

        <div id="quiz-output-container">
          <div class="card text-center" style="padding: 4rem 2rem;">
            <div style="font-size: 4rem; margin-bottom: 1rem;">🤖</div>
            <h3>SkillVista AI Assessment Engine Ready</h3>
            <p>Ingest learning materials on the left to generate auto-graded MCQs with citation references.</p>
          </div>
        </div>
      </div>
    `;
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // 7.5 MCQ ASSESSMENT VIEW (Testing & Competency Evaluation Engine)
  // ═══════════════════════════════════════════════════════════════════════════
  function renderMcqAssessment() {
    let questions = [];
    try {
      const raw = localStorage.getItem('sv_question_bank');
      if (raw) questions = JSON.parse(raw);
    } catch(e) {}

    const isAiGenerated = questions && questions.length > 0;

    // Default preset questions if AI Quiz Generator hasn't been run yet
    if (!questions || questions.length === 0) {
      questions = [
        {
          question: "What is the primary purpose of a Python list data structure in statistical programming?",
          options: {
            "A": "To store an ordered, mutable sequence of multiple elements or items",
            "B": "To define custom object-oriented class methods",
            "C": "To handle runtime exception catching across modules",
            "D": "To compile native C code extensions directly"
          },
          correct: "A",
          explanation: "In Python, a list is an ordered, mutable sequence capable of holding heterogeneous data items, essential for handling statistical arrays and collections.",
          bloomLevel: "Understand",
          citation: "Python Official Documentation & MoSPI Data Science Manual"
        },
        {
          question: "In National Accounts Statistics (NAS), how is Gross Domestic Product (GDP) calculated using the Production/Output Method?",
          options: {
            "A": "Sum of Gross Value Added (GVA) at basic prices + Net Taxes on Products",
            "B": "Total Personal Consumption Expenditure + Exports - Imports",
            "C": "Sum of all wages, salaries, rents, and corporate profits",
            "D": "Gross National Disposable Income minus Capital Consumption"
          },
          correct: "A",
          explanation: "GDP at market prices under NAS 2011 series equals the sum of GVA of all resident producer units at basic prices plus taxes on products minus subsidies on products.",
          bloomLevel: "Analyze",
          citation: "NSSTA Guidelines on National Accounts Statistics (Chapter 2)"
        },
        {
          question: "Under the Digital Personal Data Protection (DPDP) Act 2023, what is the primary legal obligation of a Data Fiduciary regarding statistical data collection?",
          options: {
            "A": "Provide clear consent notices and implement reasonable security safeguards",
            "B": "Store all citizen data exclusively in paper format",
            "C": "Share un-anonymized citizen data with private vendors without restriction",
            "D": "Retain personal data permanently without deletion policies"
          },
          correct: "A",
          explanation: "The DPDP Act 2023 mandates that Data Fiduciaries must issue accessible notice, obtain specified consent, and enforce technical safeguards to prevent data breaches.",
          bloomLevel: "Apply",
          citation: "DPDP Act 2023 Statutory Compliance (Section 6 & 8)"
        },
        {
          question: "In NSSO sample survey methodology, what distinguishes Stratified Multi-Stage Sampling from simple random sampling?",
          options: {
            "A": "Population is divided into homogeneous strata before selecting primary sampling units (FSUs/SSUs)",
            "B": "Every individual unit in the country has an equal probability of selection without grouping",
            "C": "Only urban census enumeration blocks are included in sample selection",
            "D": "Sample units are chosen purely based on voluntary officer responses"
          },
          correct: "A",
          explanation: "NSSO sample design stratifies the target frame by rural/urban and socio-economic strata, then selects First Stage Units (villages/blocks) followed by Second Stage Units (households).",
          bloomLevel: "Analyze",
          citation: "NSSO Survey Design & Research Division (SDRD) Manual"
        },
        {
          question: "Which Python pandas function is used to load and parse large statistical CSV survey data into a DataFrame?",
          options: {
            "A": "pd.read_csv()",
            "B": "pd.open_file()",
            "C": "pd.import_table()",
            "D": "pd.fetch_dataset()"
          },
          correct: "A",
          explanation: "pd.read_csv() reads a comma-separated values (CSV) file into a pandas DataFrame, providing parameters for chunksize, encoding, and missing value handling.",
          bloomLevel: "Apply",
          citation: "Python for Statistical Data Processing (Module 3)"
        }
      ];
    }

    return `
      <div class="card mb-6" style="background: linear-gradient(135deg, #0A2540, #1E3A8A); color: white;">
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:1rem;">
          <div>
            <h2 style="color:white; margin-bottom:0.25rem;">📝 MCQ Assessment Engine</h2>
            <p style="color:rgba(255,255,255,0.85); font-size:0.9rem;">
              Evaluating Officer: <strong style="color:#FBBF24;">${State.user?.name || 'Officer'}</strong> | Target Role: <strong>${State.user?.designation || 'Statistical Officer'}</strong>
            </p>
          </div>
          <div style="display:flex; gap:0.5rem; flex-wrap:wrap;">
            ${isAiGenerated
              ? `<span class="badge" style="background:#10B981; color:white; font-size:0.8rem; padding:0.4rem 0.8rem;">🤖 AI Question Bank (${questions.length} Items)</span>`
              : `<span class="badge" style="background:#3B82F6; color:white; font-size:0.8rem; padding:0.4rem 0.8rem;">🏛️ iGOT Preset Question Bank (${questions.length} Items)</span>`
            }
            <button onclick="navigateTo('quiz')" class="btn btn-sm" style="background:rgba(255,255,255,0.2); color:white; border:1px solid rgba(255,255,255,0.4); cursor:pointer;">
              🤖 Generate New Questions with AI
            </button>
          </div>
        </div>
      </div>

      <!-- Course Input & Dynamic Question Loader -->
      <div class="card mb-6" style="border: 2px solid #3B82F6; background: #F8FAFC;">
        <h3 class="card-title mb-2">🎓 Enter or Select Course for Dynamic AI Assessment</h3>
        <p style="font-size:0.88rem; color:#64748B; margin-bottom:1rem;">
          Type any iGOT course or statistical topic below to dynamically generate 10 tailored AI assessment questions using Gemini LLM.
        </p>

        <div style="display:flex; gap:0.75rem; flex-wrap:wrap; align-items:center;">
          <input type="text" id="mcq-course-input" class="form-input" placeholder="Type course name (e.g., Python, GDP Calculation, DPDP Act 2023, Survey Sampling...)" style="flex:1; min-width:260px; padding:0.65rem 1rem;">

          <select id="mcq-course-select" class="form-select" style="flex:1; min-width:240px; padding:0.65rem 1rem;">
            <option value="">-- Or Select from iGOT Courses --</option>
            <option value="Python for Statistical Data Processing">Python for Statistical Data Processing</option>
            <option value="National Accounts Statistics & GDP Estimation">National Accounts Statistics & GDP Estimation</option>
            <option value="DPDP Act 2023 Statutory Compliance">DPDP Act 2023 Statutory Compliance</option>
            <option value="NSSO Sample Survey Methodology & Field Operations">NSSO Sample Survey Methodology & Field Operations</option>
            <option value="Consumer Price Index (CPI) Compilation & Inflation Analytics">Consumer Price Index (CPI) Compilation & Inflation Analytics</option>
            <option value="R Programming for Econometrics & Time-Series">R Programming for Econometrics & Time-Series</option>
            <option value="Open Government Data (OGD) Platform & Metadata Standards">Open Government Data (OGD) Platform & Metadata Standards</option>
          </select>

          <button id="mcq-fetch-course-btn" class="btn btn-primary" style="padding:0.65rem 1.5rem; white-space:nowrap; background:#1D4ED8; font-weight:700; border:none; cursor:pointer;">
            ⚡ Load Course MCQs via Gemini AI
          </button>
        </div>
      </div>

      <!-- Test Form -->
      <div id="mcq-test-container">
        <form id="mcq-test-form">
          <div style="display:flex; flex-direction:column; gap:1.25rem;">
            ${questions.map((q, idx) => `
              <div class="card" style="border-left: 4px solid #1E3A8A;">
                <div style="font-weight:700; font-size:1.05rem; color:#0F172A; margin-bottom:1rem;">
                  <span style="color:#1D4ED8;">Q${idx + 1}.</span> ${q.question}
                  ${q.bloomLevel ? `<span class="badge badge-blue ml-2" style="font-size:0.7rem;">${q.bloomLevel}</span>` : ''}
                </div>

                <div style="display:flex; flex-direction:column; gap:0.65rem;">
                  ${Object.entries(q.options).map(([k, v]) => `
                    <label style="display:flex; align-items:center; gap:0.75rem; padding:0.75rem 1rem; border:1px solid #E2E8F0; border-radius:8px; cursor:pointer; background:#FAF5FF; transition:all 0.2s;">
                      <input type="radio" name="question_${idx}" value="${k}" required style="accent-color:#1D4ED8; width:18px; height:18px;">
                      <span style="font-weight:700; min-width:24px; color:#1E3A8A;">${k}.</span>
                      <span style="font-size:0.92rem; color:#334155;">${v}</span>
                    </label>
                  `).join('')}
                </div>
              </div>
            `).join('')}
          </div>

          <div class="card mt-6" style="text-align:center; padding:1.75rem;">
            <button type="submit" id="mcq-submit-btn" class="btn btn-primary" style="padding:0.8rem 3rem; font-size:1.05rem; font-weight:700; background:#F97316; border:none; cursor:pointer;">
              🚀 Submit Assessment &amp; Evaluate Competency
            </button>
          </div>
        </form>
      </div>

      <!-- Results Container -->
      <div id="mcq-results-container" style="display:none;"></div>
    `;
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // 8. COURSES VIEW
  // ═══════════════════════════════════════════════════════════════════════════
  function renderCourses() {
    const courses = (window.iGOT && window.iGOT.COURSES) ? window.iGOT.COURSES : ((typeof IgotService !== 'undefined' && IgotService.COURSES) ? IgotService.COURSES : []);
    
    return `
      <div class="course-grid" id="main-course-grid" style="display:grid; grid-template-columns:repeat(auto-fill, minmax(320px, 1fr)); gap:1.25rem;">
        ${courses.map(c => `
          <div class="course-card" onclick="window.open('https://www.igotkarmayogi.gov.in', '_blank');" style="background:#FFFFFF; border:1.5px solid #E2E8F0; border-radius:1.25rem; padding:1.5rem; display:flex; flex-direction:column; justify-content:space-between; position:relative; cursor:pointer; transition:transform 0.2s, box-shadow 0.2s; box-shadow:0 4px 20px rgba(15,23,42,0.05);">
            <div>
              <!-- Header: Icon, Title, Provider -->
              <div style="display:flex; gap:0.875rem; align-items:flex-start; margin-bottom:0.875rem;">
                <div style="width:42px; height:42px; border-radius:0.65rem; background:rgba(20,184,166,0.1); border:1px solid rgba(20,184,166,0.25); display:flex; align-items:center; justify-content:center; font-size:1.35rem; flex-shrink:0; margin-top:2px;">📖</div>
                <div>
                  <div style="font-family:var(--font-display, 'Outfit', sans-serif); font-weight:800; font-size:1.08rem; color:#0F172A !important; line-height:1.3; margin-bottom:3px;">${c.title}</div>
                  <div style="font-size:0.8rem; color:#0D9488 !important; font-weight:700;">by ${c.provider}</div>
                </div>
              </div>

              <!-- Description -->
              <p style="font-size:0.85rem; color:#475569 !important; line-height:1.5; margin-bottom:1rem; display:-webkit-box; -webkit-line-clamp:3; -webkit-box-orient:vertical; overflow:hidden; min-height:3.8em;">${c.description}</p>

              <!-- Detailed Metrics Strip: Duration, Rating, Enrolled, Certificate -->
              <div style="display:flex; flex-wrap:wrap; gap:0.5rem 0.85rem; align-items:center; background:#F8FAFC; border:1px solid #F1F5F9; border-radius:0.75rem; padding:0.6rem 0.85rem; margin-bottom:1.25rem; font-size:0.78rem;">
                <span style="display:flex; align-items:center; gap:4px; font-weight:700; color:#0F172A;">⏱️ ${c.duration || '10h'}</span>
                <span style="display:flex; align-items:center; gap:4px; font-weight:700; color:#D97706;">⭐ ${c.rating || 4.8}</span>
                <span style="display:flex; align-items:center; gap:4px; font-weight:600; color:#64748B;">👥 ${c.enrolled ? c.enrolled.toLocaleString() : '12,500'} officers</span>
                <span style="display:flex; align-items:center; gap:4px; font-weight:700; color:#059669;">📜 Verified Cert</span>
              </div>
            </div>

            <!-- Bottom Bar: Level Pill & Official iGOT Action Button -->
            <div style="display:flex; align-items:center; justify-content:space-between; margin-top:auto; padding-top:0.75rem; border-top:1px solid #F1F5F9;">
              <span style="background:rgba(20,184,166,0.12); border:1px solid rgba(20,184,166,0.3); color:#0D9488; font-weight:800; font-size:0.68rem; letter-spacing:0.05em; padding:0.35rem 0.85rem; border-radius:999px; text-transform:uppercase;">${(c.level || 'BEGINNER').toUpperCase()}</span>
              <a href="https://www.igotkarmayogi.gov.in" target="_blank" onclick="event.stopPropagation(); window.open('https://www.igotkarmayogi.gov.in', '_blank');" style="background:linear-gradient(135deg, #0D9488 0%, #14B8A6 100%); color:#FFFFFF !important; font-weight:700; font-size:0.8rem; padding:0.45rem 1.1rem; border-radius:999px; text-decoration:none; display:inline-flex; align-items:center; gap:4px; box-shadow:0 4px 14px rgba(13,148,136,0.35);">iGOT Karmayogi ↗</a>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  window.filterMainCourses = function() {
    const input = document.getElementById('main-course-search');
    if (!input) return;
    const q = input.value.toLowerCase();
    const courses = (window.iGOT && window.iGOT.COURSES) ? window.iGOT.COURSES : [];
    const filtered = courses.filter(c => c.title.toLowerCase().includes(q) || c.provider.toLowerCase().includes(q) || c.description.toLowerCase().includes(q));
    
    const countEl = document.getElementById('main-course-count');
    if (countEl) countEl.textContent = `Showing ${filtered.length} courses`;

    const grid = document.getElementById('main-course-grid');
    if (grid) {
      grid.innerHTML = filtered.map(c => `
        <div class="course-card" onclick="window.open('https://www.igotkarmayogi.gov.in', '_blank');" style="background:rgba(15,23,42,0.7); border:1px solid rgba(255,255,255,0.08); border-radius:1.25rem; padding:1.5rem; display:flex; flex-direction:column; justify-content:space-between; position:relative; cursor:pointer; transition:transform 0.2s, box-shadow 0.2s;">
          <div>
            <div style="display:flex; gap:0.875rem; align-items:flex-start; margin-bottom:0.875rem;">
              <div style="width:36px; height:36px; border-radius:0.5rem; background:rgba(255,255,255,0.06); display:flex; align-items:center; justify-content:center; font-size:1.25rem; flex-shrink:0; margin-top:2px;">📖</div>
              <div>
                <div style="font-family:var(--font-display, 'Outfit', sans-serif); font-weight:700; font-size:1.05rem; color:#FFFFFF; line-height:1.3; margin-bottom:2px;">${c.title}</div>
                <div style="font-size:0.78rem; color:rgba(255,255,255,0.6);">by ${c.provider}</div>
              </div>
            </div>
            <p style="font-size:0.825rem; color:rgba(255,255,255,0.7); line-height:1.5; margin-bottom:1.25rem; display:-webkit-box; -webkit-line-clamp:3; -webkit-box-orient:vertical; overflow:hidden; min-height:3.8em;">${c.description}</p>
          </div>
          <div style="display:flex; align-items:center; justify-content:space-between; margin-top:auto; padding-top:0.5rem;">
            <span style="background:rgba(30,58,138,0.4); border:1px solid rgba(59,130,246,0.35); color:#60A5FA; font-weight:800; font-size:0.68rem; letter-spacing:0.05em; padding:0.3rem 0.85rem; border-radius:999px; text-transform:uppercase;">${(c.level||'BEGINNER').toUpperCase()}</span>
            <a href="https://www.igotkarmayogi.gov.in" target="_blank" onclick="event.stopPropagation(); window.open('https://www.igotkarmayogi.gov.in', '_blank');" style="background:linear-gradient(135deg, #3B82F6 0%, #6366F1 100%); color:white; font-weight:700; font-size:0.78rem; padding:0.45rem 1rem; border-radius:999px; text-decoration:none; display:inline-flex; align-items:center; gap:4px; box-shadow:0 4px 14px rgba(59,130,246,0.35);">iGOT Karmayogi ↗</a>
          </div>
        </div>
      `).join('');
    }
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // 9. iGOT HUB VIEW
  // ═══════════════════════════════════════════════════════════════════════════
  function renderIgotHub() {
    return `
      <div class="card mb-6" style="background: linear-gradient(135deg, #1B4F72, #1A8F5E); color: white;">
        <h2 style="color: white; margin-bottom: 0.5rem;">🏛️ iGOT Karmayogi Official Adapter</h2>
        <p style="color: rgba(255,255,255,0.85);">
          SkillVista acts as an intelligent companion layer over iGOT Karmayogi (serving 4.6M civil servants).
        </p>
        <div class="flex gap-3 mt-4 flex-wrap">
          <a href="https://www.igotkarmayogi.gov.in" target="_blank" class="btn btn-sm" style="background: white; color: #1B4F72; font-weight: 700;">Open iGOT Platform ↗</a>
          <a href="https://www.igotkarmayogi.gov.in" target="_blank" class="btn btn-sm btn-outline" style="color: white; border-color: white;">iGOT SSO Login</a>
        </div>
      </div>
    `;
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // 10. ADMIN VIEW
  // ═══════════════════════════════════════════════════════════════════════════
  function renderAdminAnalytics() {
    return `
      <div class="stats-grid mb-6">
        <div class="stat-card blue"><div class="stat-value">745</div><div class="stat-label">Total Officers</div></div>
        <div class="stat-card green"><div class="stat-value">68%</div><div class="stat-label">Avg Competency</div></div>
        <div class="stat-card saffron"><div class="stat-value">3,412</div><div class="stat-label">Completions</div></div>
        <div class="stat-card purple"><div class="stat-value">73%</div><div class="stat-label">iGOT Utilization</div></div>
      </div>
    `;
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // 11. ARCHITECTURE VIEW
  // ═══════════════════════════════════════════════════════════════════════════
  function renderArchitecture() {
    return `
      <div class="card mb-6" style="background: linear-gradient(135deg, rgba(59,130,246,0.12), rgba(139,92,246,0.08)); border: var(--border-blue);">
        <h2 class="mb-2">⚡ SkillVista System Architecture Overview</h2>
        <p>Solution Architecture for India's Official Statistical System Integrated with iGOT Karmayogi Ecosystem.</p>
      </div>

      <div class="grid-2 mb-6">
        <div class="card">
          <h3 class="card-title">🏛️ Architectural Principles</h3>
          <ul style="display: flex; flex-direction: column; gap: 0.75rem; font-size: 0.875rem;">
            <li><b>Cloud-Native &amp; Event-Driven:</b> Microservices architecture with Kafka event bus &amp; REST APIs.</li>
            <li><b>FRAC Alignment:</b> Mapping roles, activities, and competencies to NSSTA/TPAC standards.</li>
            <li><b>iGOT Adapter Isolation:</b> Upstream changes in Sunbird API do not break internal domain models.</li>
            <li><b>Government Security:</b> DPDP Act 2023, Parichay/e-Pramaan SSO, and MeghRaj Cloud compliance.</li>
          </ul>
        </div>

        <div class="card">
          <h3 class="card-title">🤖 AI / ML Pipeline</h3>
          <ul style="display: flex; flex-direction: column; gap: 0.75rem; font-size: 0.875rem;">
            <li><b>Competency Vector Scoring:</b> XGBoost fusion over HR metadata, self-ratings, and quiz telemetry.</li>
            <li><b>Hybrid Recommender:</b> Vector search (Qdrant) + LLM re-ranking (Llama-3.1 / Sarvam Indic).</li>
            <li><b>MCQ Generation:</b> LayoutLMv3 ingestion ➔ Concept Mining ➔ Bloom-tagged questions with citations.</li>
          </ul>
        </div>
      </div>
    `;
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // 12. PROFILE PAGE
  // ═══════════════════════════════════════════════════════════════════════════
  function renderProfile() {
    const u = State.user || {};
    // Load saved certificates from localStorage
    const certs = JSON.parse(localStorage.getItem('sv_certs_' + (u.email || '')) || '[]');
    const certRows = certs.map((c, i) => `
      <div class="prof-cert-row" data-idx="${i}">
        ${c.image
          ? `<img src="${c.image}" class="prof-cert-thumb" alt="Certificate">`
          : `<div class="prof-cert-icon">🏅</div>`
        }
        <div class="prof-cert-body">
          <div class="prof-cert-title">${c.name}</div>
          <div class="prof-cert-meta">${c.provider} &nbsp;·&nbsp; Completed: ${c.date} ${c.score ? '&nbsp;·&nbsp; Score: <b>' + c.score + '%</b>' : ''}</div>
          ${c.url ? `<a href="${c.url}" target="_blank" class="prof-cert-link">View Certificate ↗</a>` : ''}
        </div>
        <button class="prof-cert-delete" data-idx="${i}" title="Remove">✕</button>
      </div>
    `).join('');

    const profilePhoto = u.photo || localStorage.getItem('sv_photo_' + (u.email || ''));
    return `
      <div class="prof-page">

        <!-- ── HERO BANNER ── -->
        <div class="prof-hero">
          <div class="prof-avatar-wrap" style="cursor:pointer;" title="Upload profile photo" onclick="document.getElementById('prof-photo-input').click()">
            ${profilePhoto
              ? `<img src="${profilePhoto}" class="prof-avatar-big" style="object-fit:cover;" alt="Profile Photo">`
              : `<div class="prof-avatar-big">${u.name ? u.name[0].toUpperCase() : 'U'}</div>`
            }
            <div class="prof-avatar-badge">📷</div>
            <input type="file" id="prof-photo-input" accept="image/*" style="display:none;">
          </div>
          <div class="prof-hero-info">
            <h2 class="prof-hero-name">${u.name || 'Officer'}</h2>
            <div class="prof-hero-sub">${u.designation || ''} ${u.department ? '· ' + u.department : ''}</div>
            <div class="prof-hero-email">${u.email || ''}</div>
            <div style="font-size:0.72rem;color:rgba(255,255,255,0.55);margin-top:0.4rem;">📷 Click the photo to upload / change</div>
          </div>
        </div>

        <div class="prof-grid">

          <!-- ── EDIT PERSONAL DETAILS ── -->
          <div class="card prof-card">
            <h3 class="card-title">👤 Personal Details</h3>
            <div class="prof-field-group">
              <div class="prof-field">
                <label class="prof-label">Full Name</label>
                <input id="prof-name" class="prof-input" type="text" value="${u.name || ''}" placeholder="Your full name">
              </div>
              <div class="prof-field">
                <label class="prof-label">Employee ID</label>
                <input id="prof-empid" class="prof-input" type="text" value="${u.employeeId || ''}" placeholder="e.g. MOSPI/2024/00123">
              </div>
              <div class="prof-field">
                <label class="prof-label">Designation</label>
                <input id="prof-designation" class="prof-input" type="text" value="${u.designation || ''}" placeholder="Your designation">
              </div>
              <div class="prof-field">
                <label class="prof-label">Department / Ministry</label>
                <input id="prof-department" class="prof-input" type="text" value="${u.department || ''}" placeholder="Your ministry or department">
              </div>
              <div class="prof-field">
                <label class="prof-label">Organisation</label>
                <input id="prof-org" class="prof-input" type="text" value="${u.organisation || ''}" placeholder="Your organisation">
              </div>
              <div class="prof-field">
                <label class="prof-label">Official Email</label>
                <input id="prof-email" class="prof-input" type="email" value="${u.email || ''}" placeholder="official@gov.in" readonly style="opacity:0.65; cursor:not-allowed;">
                <div class="prof-hint">Email cannot be changed. Contact admin if needed.</div>
              </div>
              <div class="prof-field">
                <label class="prof-label">Mobile Number</label>
                <input id="prof-mobile" class="prof-input" type="tel" value="${u.mobile || ''}" placeholder="+91 XXXXXXXXXX">
              </div>
              <div class="prof-field">
                <label class="prof-label">State / UT</label>
                <select id="prof-state" class="prof-input">
                  <option value="">Select State</option>
                  ${['Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh','Goa','Gujarat','Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh','Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland','Odisha','Punjab','Rajasthan','Sikkim','Tamil Nadu','Telangana','Tripura','Uttar Pradesh','Uttarakhand','West Bengal','Delhi','Jammu & Kashmir','Ladakh','Puducherry'].map(s => `<option value="${s}" ${u.state === s ? 'selected' : ''}>${s}</option>`).join('')}
                </select>
              </div>
            </div>
            <div class="prof-action-row">
              <button id="prof-save-btn" class="prof-save-btn">💾 Save Changes</button>
              <button id="prof-change-pwd-btn" class="prof-pwd-btn">🔑 Change Password</button>
            </div>
            <!-- Change password panel (hidden by default) -->
            <div id="prof-pwd-panel" style="display:none; margin-top:1rem;">
              <div class="prof-field">
                <label class="prof-label">Current Password</label>
                <input id="prof-cur-pwd" class="prof-input" type="password" placeholder="Current password">
              </div>
              <div class="prof-field">
                <label class="prof-label">New Password</label>
                <input id="prof-new-pwd" class="prof-input" type="password" placeholder="Min 8 characters">
              </div>
              <div class="prof-field">
                <label class="prof-label">Confirm New Password</label>
                <input id="prof-confirm-pwd" class="prof-input" type="password" placeholder="Re-enter new password">
              </div>
              <button id="prof-save-pwd-btn" class="prof-save-btn" style="margin-top:0.5rem;">Update Password</button>
            </div>
          </div>

          <!-- ── iGOT CERTIFICATES ── -->
          <div class="card prof-card">
            <h3 class="card-title">🏅 iGOT Karmayogi Certificates</h3>
            <p style="font-size:0.82rem; color:#475569; margin-bottom:1.25rem;">Add certificates you have completed on the iGOT Karmayogi platform.</p>

            <!-- Add certificate form -->
            <div class="prof-cert-form">
              <div class="prof-field">
                <label class="prof-label">Course / Certificate Name *</label>
                <input id="cert-name" class="prof-input" type="text" placeholder="e.g. Data Governance & Ethics">
              </div>
              <div class="prof-field-row">
                <div class="prof-field">
                  <label class="prof-label">Provider</label>
                  <select id="cert-provider" class="prof-input">
                    <option>iGOT Karmayogi</option>
                    <option>NSSTA</option>
                    <option>LBSNAA</option>
                    <option>NIC Academy</option>
                    <option>MoSPI Training</option>
                    <option>Other</option>
                  </select>
                </div>
                <div class="prof-field">
                  <label class="prof-label">Completion Date *</label>
                  <input id="cert-date" class="prof-input" type="date">
                </div>
              </div>
              <div class="prof-field-row">
                <div class="prof-field">
                  <label class="prof-label">Score / Marks (%)</label>
                  <input id="cert-score" class="prof-input" type="number" min="0" max="100" placeholder="e.g. 85">
                </div>
                <div class="prof-field">
                  <label class="prof-label">Certificate URL (optional)</label>
                  <input id="cert-url" class="prof-input" type="url" placeholder="https://igot.gov.in/cert/...">
                </div>
              </div>
              <div class="prof-field">
                <label class="prof-label">Upload Certificate Photo / Image</label>
                <div class="prof-cert-upload-zone" id="cert-upload-zone" onclick="document.getElementById('cert-photo-input').click()">
                  <input type="file" id="cert-photo-input" accept="image/*" style="display:none;">
                  <div id="cert-photo-preview" class="prof-cert-upload-preview">📄 Click to upload certificate image (JPG/PNG)</div>
                </div>
              </div>
              <button id="cert-add-btn" class="prof-cert-add-btn">+ Add Certificate</button>
            </div>

            <!-- Certificate list -->
            <div id="prof-cert-list" style="margin-top:1.25rem; display:flex; flex-direction:column; gap:0.75rem;">
              ${certs.length === 0
                ? '<div class="prof-cert-empty">🎓 No certificates added yet. Add your iGOT completions above!</div>'
                : certRows
              }
            </div>
          </div>

        </div>
      </div>
    `;
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // 12. CHATBOT WIDGET
  // ═══════════════════════════════════════════════════════════════════════════
  function renderChatbotWidget() {
    return `
      <div class="chatbot-widget">
        <div id="chatbot-panel-el" class="chatbot-panel hidden">
          <div class="chatbot-header">
            <div class="chatbot-header-info">
              <div class="chatbot-avatar" style="display:flex;align-items:center;justify-content:center;">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a2 2 0 0 1 2 2v2h2a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h2V4a2 2 0 0 1 2-2z"/><circle cx="9" cy="11" r="1"/><circle cx="15" cy="11" r="1"/><path d="M10 15h4"/></svg>
              </div>
              <div>
                <div class="chatbot-name" style="font-weight:800;letter-spacing:0.02em;">SkillVista</div>
                <div class="chatbot-status" style="font-size:0.72rem;opacity:0.9;">Live Page Analysis &amp; AI Assistant</div>
              </div>
            </div>
            <button id="chatbot-close-btn" class="chatbot-close">×</button>
          </div>

          <div id="chat-messages-container" class="chatbot-messages">
            <div class="chat-msg bot">👋 Hello! I am <b>SkillVista</b> AI. Ask me anything about what's currently on your screen, your competency gaps, or iGOT Karmayogi courses!</div>
          </div>

          <div class="chatbot-input-area">
            <input type="text" id="chat-input-field" class="chatbot-input" placeholder="Ask SkillVista about this page...">
            <button id="chat-send-btn" class="chatbot-send">➤</button>
          </div>
        </div>

        <button id="chatbot-toggle-btn" class="chatbot-toggle" title="Ask SkillVista" style="display:flex;align-items:center;justify-content:center;">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a2 2 0 0 1 2 2v2h2a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h2V4a2 2 0 0 1 2-2z"/><circle cx="9" cy="11" r="1"/><circle cx="15" cy="11" r="1"/><path d="M10 15h4"/></svg>
        </button>
      </div>
    `;
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // CHATBOT PAGE ANALYSIS & EVENTS (Available on ALL pages)
  // ═══════════════════════════════════════════════════════════════════════════
  function getPageAnalysisContext() {
    const page = State.currentPage || 'dashboard';
    const u = State.user || {};
    const scores = State.scores || {};
    const overall = CompetencyEngine.overallScore(scores);
    const gaps = CompetencyEngine.computeGaps(scores, u.designation || 'Statistical Officer');

    // Extract live visible text from active DOM body
    const pageBody = document.querySelector('.page-body') || document.querySelector('.main-content') || document.body;
    let visibleText = pageBody ? pageBody.innerText.replace(/\s+/g, ' ').trim() : '';
    if (visibleText.length > 3000) visibleText = visibleText.slice(0, 3000) + '...';

    // Extract values of form fields on screen
    const inputs = Array.from(document.querySelectorAll('input, select, textarea'))
      .filter(el => el.id !== 'chat-input-field' && el.value && el.offsetParent !== null)
      .map(el => `${el.id || el.name || 'field'}: "${el.value}"`)
      .join(' | ');

    let pageSummary = '';
    if (!State.user || page === 'login') {
      pageSummary = 'SkillVista Official Government Login & Registration page. Officers sign in with official .gov.in / .nic.in email or Parichay / e-Pramaan SSO.';
    } else if (page === 'dashboard') {
      pageSummary = `Learner Dashboard page. Overall competency score: ${overall}%. Completed courses: ${State.completedIds.length}. Enrolled courses: ${State.enrolledIds.length}. Active role target: ${u.designation || 'Statistical Officer'}.`;
    } else if (page === 'assessment') {
      pageSummary = `Competency Profiling & Assessment page. Present scores: Statistical (${Math.round((scores.statistical||0)*20)}%), Technical (${Math.round((scores.technical||0)*20)}%), Digital Governance (${Math.round((scores.digital_gov||0)*20)}%), Behavioural (${Math.round((scores.behavioural||0)*20)}%).`;
    } else if (page === 'skillgap') {
      const gapDetails = Object.entries(gaps).map(([k, g]) => `${g.shortLabel}: present level ${g.current}/5, role target ${g.required}/5, gap: ${g.gap}`).join('; ');
      pageSummary = `Skill Gap Engine page. Identified Competency Gaps: ${gapDetails}. Overall score: ${overall}%. Role benchmark: ${u.designation || 'Statistical Officer'}.`;
    } else if (page === 'quiz' || page === 'mcq') {
      const textVal = document.getElementById('quiz-paste-text')?.value || '';
      pageSummary = `MCQ Assessment & AI Quiz Generator page. Text material pasted length: ${textVal.length} characters. Material content snippet: "${textVal.slice(0, 400)}".`;
    } else if (page === 'courses' || page === 'learningpath') {
      pageSummary = `iGOT Karmayogi Learning Pathways page. Features 15+ official civil service courses in Statistical Systems, Python, R, SQL, GIS, DPDP Act 2023, and Leadership. Direct link to www.igotkarmayogi.gov.in available for each.`;
    } else if (page === 'admin') {
      pageSummary = `MoSPI & NSSTA Admin Analytics page. Department metrics: 745 Total Officers, 68% Avg Competency Score, 3,412 Course Completions, 73% iGOT Platform Utilization.`;
    } else if (page === 'profile') {
      const certs = JSON.parse(localStorage.getItem('sv_certs_' + (u.email || '')) || '[]');
      pageSummary = `Profile & Certificates page. Officer: ${u.name}, Role: ${u.designation}, Ministry: ${u.ministry || 'MoSPI'}, Completed iGOT Certificates count: ${certs.length}.`;
    } else {
      pageSummary = `Viewing page: ${page}.`;
    }

    return {
      pageId: page,
      pageTitle: (document.querySelector('.page-title')?.textContent || (page.toUpperCase() + ' Page')),
      user: { name: u.name, designation: u.designation, ministry: u.ministry, email: u.email },
      overallScore: overall,
      visibleText: visibleText,
      domInputs: inputs || 'None',
      summary: pageSummary
    };
  }

  function bindChatbotEvents() {
    const toggleBtn = document.getElementById('chatbot-toggle-btn');
    const closeBtn  = document.getElementById('chatbot-close-btn');
    const panel     = document.getElementById('chatbot-panel-el');
    const sendBtn   = document.getElementById('chat-send-btn');
    const chatInput = document.getElementById('chat-input-field');
    const msgsContainer = document.getElementById('chat-messages-container');

    if (!panel || !msgsContainer) return;

    function formatChatReply(t) {
      if (!t) return '';
      return t
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/`([^`]+)`/g, '<code style="background:#F1F5F9;padding:2px 5px;border-radius:4px;font-size:0.85em;">$1</code>')
        .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" style="color:#0D9488;font-weight:700;text-decoration:underline;">$1</a>')
        .replace(/\n/g, '<br>');
    }

    function getHistory() {
      try {
        const raw = localStorage.getItem('sv_chat_history');
        return raw ? JSON.parse(raw) : [];
      } catch(e) { return []; }
    }

    function saveHistoryItem(role, text) {
      try {
        const h = getHistory();
        h.push({ role, text, time: new Date().toISOString() });
        localStorage.setItem('sv_chat_history', JSON.stringify(h));
      } catch(e) {}
    }

    function isPanelOpen() {
      return localStorage.getItem('sv_chat_open') === 'true';
    }

    function setPanelOpen(open) {
      localStorage.setItem('sv_chat_open', open ? 'true' : 'false');
    }

    // ══ RESTORE PERSISTENT CHAT HISTORY ══
    const history = getHistory();
    msgsContainer.innerHTML = '';
    if (history.length > 0) {
      history.forEach(item => {
        const div = document.createElement('div');
        div.className = `chat-msg ${item.role}`;
        if (item.role === 'bot') {
          div.innerHTML = formatChatReply(item.text);
        } else {
          div.textContent = item.text;
        }
        msgsContainer.appendChild(div);
      });
    } else {
      const welcome = "👋 Hello! I am **SkillVista** AI. Ask me anything about what's currently on your screen, your competency gaps, or iGOT Karmayogi courses!";
      const div = document.createElement('div');
      div.className = 'chat-msg bot';
      div.innerHTML = formatChatReply(welcome);
      msgsContainer.appendChild(div);
      saveHistoryItem('bot', welcome);
    }
    msgsContainer.scrollTop = msgsContainer.scrollHeight;

    // ══ RESTORE OPEN PANEL STATE ACROSS NAVIGATION ══
    if (isPanelOpen()) {
      panel.classList.remove('hidden');
    } else {
      panel.classList.add('hidden');
    }

    if (chatInput) {
      chatInput.disabled = false;
      chatInput.readOnly = false;
    }

    if (toggleBtn && panel) toggleBtn.onclick = (e) => {
      if (e) e.stopPropagation();
      const nowHidden = panel.classList.contains('hidden');
      if (nowHidden) {
        panel.classList.remove('hidden');
        setPanelOpen(true);
        if (chatInput) {
          chatInput.disabled = false;
          chatInput.readOnly = false;
          setTimeout(() => chatInput.focus(), 50);
        }
      } else {
        panel.classList.add('hidden');
        setPanelOpen(false);
      }
    };

    if (closeBtn && panel) closeBtn.onclick = (e) => {
      if (e) e.stopPropagation();
      panel.classList.add('hidden');
      setPanelOpen(false);
    };

    if (panel) {
      panel.onclick = (e) => e.stopPropagation();
    }

    const sendChatMessage = async () => {
      if (!chatInput || !chatInput.value.trim()) return;
      const text = chatInput.value.trim();
      chatInput.value = '';

      // Append & Save User Message
      const uMsg = document.createElement('div');
      uMsg.className = 'chat-msg user';
      uMsg.textContent = text;
      msgsContainer.appendChild(uMsg);
      saveHistoryItem('user', text);

      // Loading indicator
      const loadingMsg = document.createElement('div');
      loadingMsg.className = 'chat-msg bot';
      loadingMsg.textContent = 'Analyzing page & generating answer...';
      msgsContainer.appendChild(loadingMsg);
      msgsContainer.scrollTop = msgsContainer.scrollHeight;

      let replyText = '';
      try {
        const pageContext = getPageAnalysisContext();
        replyText = await GeminiService.chatAssistant(text, pageContext);
      } catch(err) {
        replyText = GeminiService.generateSmartPageResponse(text, getPageAnalysisContext());
      }

      loadingMsg.innerHTML = formatChatReply(replyText);
      saveHistoryItem('bot', replyText);
      msgsContainer.scrollTop = msgsContainer.scrollHeight;
    };

    if (sendBtn) sendBtn.onclick = (e) => {
      if (e) e.stopPropagation();
      sendChatMessage();
    };

    if (chatInput) {
      chatInput.onkeydown = (e) => {
        e.stopPropagation();
        if (e.key === 'Enter') {
          e.preventDefault();
          sendChatMessage();
        }
      };
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // AUTH STATE & HELPERS
  // ═══════════════════════════════════════════════════════════════════════════
  let _regOtp = null;
  let _siOtp  = null;

  function isGovEmail(email) {
    if (!email) return false;
    // Allow any standard valid email format (including .gov.in, .nic.in, .in, .com, etc.)
    return /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/i.test(email.trim());
  }

  const DEFAULT_USERS = {
    'officer@mospi.gov.in': {
      name: 'Statistical Officer',
      empId: 'MOSPI/2026/00101',
      ministry: 'MoSPI — Ministry of Statistics & Programme Implementation',
      org: 'CSO — Central Statistics Office',
      designation: 'Statistical Officer',
      centerState: 'center',
      email: 'officer@mospi.gov.in',
      password: 'password123',
      createdAt: Date.now()
    },
    'admin@mospi.gov.in': {
      name: 'MoSPI Administrator',
      empId: 'MOSPI/ADMIN/001',
      ministry: 'MoSPI — Ministry of Statistics & Programme Implementation',
      org: 'NSSTA — Training Division',
      designation: 'MoSPI Administrator',
      role: 'admin',
      centerState: 'center',
      email: 'admin@mospi.gov.in',
      password: 'password123',
      createdAt: Date.now()
    },
    'ram@tn.gov.in': {
      name: 'Ram Kumar',
      empId: 'TN/GOV/2024/4412',
      ministry: 'State — State Government Department',
      org: 'DES — Directorate of Economics & Statistics',
      designation: 'Deputy Director (Statistics)',
      centerState: 'state',
      email: 'ram@tn.gov.in',
      password: 'password123',
      createdAt: Date.now()
    }
  };

  window._sv_users_memory = Object.assign({}, DEFAULT_USERS, window._sv_users_memory || {});

  function getUsers() {
    window._sv_users_memory = Object.assign({}, DEFAULT_USERS, window._sv_users_memory);
    try {
      const raw = localStorage.getItem('sv_users');
      if (raw) {
        const parsed = JSON.parse(raw);
        window._sv_users_memory = Object.assign({}, window._sv_users_memory, parsed);
      }
    } catch(e) {}
    return window._sv_users_memory;
  }

  function saveUsers(u) {
    window._sv_users_memory = Object.assign({}, window._sv_users_memory, u);
    try {
      localStorage.setItem('sv_users', JSON.stringify(window._sv_users_memory));
    } catch(e) {
      console.warn('LocalStorage save failed:', e);
    }
  }

  // Sync user database with Backend Server & MongoDB API (/api/users)
  async function fetchBackendUsers() {
    const endpoints = ['/api/users', 'http://localhost:3000/api/users'];
    for (const url of endpoints) {
      try {
        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          if (data && data.users) {
            const users = getUsers();
            Object.keys(data.users).forEach(email => {
              users[email.toLowerCase()] = Object.assign({}, users[email.toLowerCase()], data.users[email]);
            });
            saveUsers(users);
            break;
          }
        }
      } catch(e) {
        // Continue to next endpoint or offline local store
      }
    }
  }
  fetchBackendUsers();
  function getActiveSession() {
    try { return JSON.parse(localStorage.getItem('sv_session') || 'null'); } catch(e) { return null; }
  }
  function saveSession(u) {
    try { localStorage.setItem('sv_session', JSON.stringify(u)); } catch(e) {}
  }

  function showAuthMode(mode) {
    window._svAuthMode = mode;
    const sl = document.getElementById('sv-left-login');
    const sr = document.getElementById('sv-left-register');
    const sf = document.getElementById('sv-form-signin');
    const rf = document.getElementById('sv-form-register');
    if (!sl || !sr || !sf || !rf) { render(); return; }
    if (mode === 'register') {
      sl.style.display = 'none'; sr.style.display = 'flex';
      sf.style.display = 'none'; rf.style.display = 'block';
      showRegStep(1);
    } else {
      sl.style.display = 'flex'; sr.style.display = 'none';
      sf.style.display = 'block'; rf.style.display = 'none';
    }
    if (typeof window.hidePreload === 'function') window.hidePreload();
  }

  function showRegStep(step) {
    const s1 = document.getElementById('reg-step1');
    const s2 = document.getElementById('reg-step2');
    if (s1) s1.style.display = step === 1 ? 'block' : 'none';
    if (s2) s2.style.display = step === 2 ? 'block' : 'none';
    const c1 = document.getElementById('step-circle-1');
    const c2 = document.getElementById('step-circle-2');
    const l1 = document.getElementById('step-lbl-1');
    const l2 = document.getElementById('step-lbl-2');
    const line = document.getElementById('step-line');
    if (step === 1) {
      if (c1) { c1.classList.add('active'); c1.classList.remove('done'); }
      if (c2) { c2.classList.remove('active'); c2.classList.remove('done'); }
      if (l1) l1.classList.add('active');
      if (l2) l2.classList.remove('active');
      if (line) line.classList.remove('active');
    } else {
      if (c1) { c1.classList.remove('active'); c1.classList.add('done'); }
      if (c2) { c2.classList.add('active'); }
      if (l1) l1.classList.remove('active');
      if (l2) l2.classList.add('active');
      if (line) line.classList.add('active');
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // LOGIN PAGE EVENTS
  // ═══════════════════════════════════════════════════════════════════════════
  function bindLoginEvents() {
    function updateLoginModeUI(mode) {
      const passBlock = document.getElementById('si-pass-block');
      const otpBlock  = document.getElementById('si-otp-block');
      const submitBtn = document.getElementById('si-submit');
      const passRadio = document.getElementById('mode-password');
      const otpRadio  = document.getElementById('mode-otp');

      if (mode === 'otp') {
        if (passBlock) passBlock.style.display = 'none';
        if (otpBlock)  otpBlock.style.display  = 'block';
        if (submitBtn) submitBtn.innerHTML     = 'Verify OTP &amp; Sign In →';
        if (otpRadio)  otpRadio.checked        = true;
      } else {
        if (passBlock) passBlock.style.display = 'block';
        if (otpBlock)  otpBlock.style.display  = 'none';
        if (submitBtn) submitBtn.innerHTML     = 'Sign In →';
        if (passRadio) passRadio.checked       = true;
      }
    }

    const modePassEl = document.getElementById('mode-password');
    const modeOtpEl  = document.getElementById('mode-otp');
    if (modePassEl) {
      modePassEl.addEventListener('change', () => updateLoginModeUI('password'));
      modePassEl.addEventListener('click',  () => updateLoginModeUI('password'));
      if (modePassEl.parentElement) modePassEl.parentElement.addEventListener('click', () => updateLoginModeUI('password'));
    }
    if (modeOtpEl) {
      modeOtpEl.addEventListener('change', () => updateLoginModeUI('otp'));
      modeOtpEl.addEventListener('click',  () => updateLoginModeUI('otp'));
      if (modeOtpEl.parentElement) modeOtpEl.parentElement.addEventListener('click', () => updateLoginModeUI('otp'));
    }

    // Center/State toggle
    const csCenter = document.getElementById('rcs-center');
    const csState  = document.getElementById('rcs-state');
    const stateField = document.getElementById('reg-state-field');
    if (csCenter) csCenter.addEventListener('change', () => { if (stateField) stateField.style.display = 'none'; });
    if (csState)  csState.addEventListener('change',  () => { if (stateField) stateField.style.display = 'block'; });

    // View navigation
    const goToReg    = document.getElementById('go-to-register');
    const goToSignin = document.getElementById('go-to-signin');
    const regBackBtn = document.getElementById('reg-back-btn');
    if (goToReg) {
      goToReg.addEventListener('click', e => {
        e.preventDefault();
        e.stopPropagation();
        showAuthMode('register');
      });
    }
    if (goToSignin) {
      goToSignin.addEventListener('click', e => {
        e.preventDefault();
        e.stopPropagation();
        showAuthMode('signin');
      });
    }
    if (regBackBtn) {
      regBackBtn.addEventListener('click', e => {
        e.preventDefault();
        e.stopPropagation();
        showAuthMode('signin');
      });
    }

    // ───────────────────────────────────────────────────
    // SIGN IN — Password / OTP
    // ───────────────────────────────────────────────────
    const siReqOtp = document.getElementById('si-req-otp');
    if (siReqOtp) siReqOtp.addEventListener('click', () => {
      const email = (document.getElementById('si-email')?.value || '').trim().toLowerCase();
      if (!email) { showToast('Enter your government email to receive OTP.', 'warning'); return; }
      if (!isGovEmail(email)) { showToast('Enter a valid .gov.in or .nic.in email.', 'error'); return; }
      const users = getUsers();
      if (!users[email]) { showToast('No registered account found for this email. Please register first.', 'error'); return; }
      _siOtp = String(Math.floor(100000 + Math.random() * 900000));
      showToast(`📧 OTP sent to ${email} — Demo OTP: ${_siOtp}`, 'info');
    });

    const siSubmit = document.getElementById('si-submit');
    if (siSubmit) siSubmit.addEventListener('click', () => {
      const email    = (document.getElementById('si-email')?.value || '').trim().toLowerCase();
      const password = (document.getElementById('si-password')?.value || '');
      const otp      = (document.getElementById('si-otp')?.value || '').trim();
      const isOtpMode = document.getElementById('mode-otp')?.checked;

      if (!email) { showToast('Please enter your government email.', 'warning'); return; }
      if (!isGovEmail(email)) { showToast('Invalid email. Use your official .gov.in or .nic.in address.', 'error'); return; }

      let users = getUsers();
      if (!users[email]) {
        // Auto-create account if valid email provided
        const namePart = email.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        users[email] = {
          name: namePart || 'Government Officer',
          empId: 'MOSPI/2026/' + Math.floor(1000 + Math.random() * 9000),
          ministry: 'MoSPI — Ministry of Statistics & Programme Implementation',
          org: 'CSO — Central Statistics Office',
          designation: 'Statistical Officer',
          email: email,
          password: password || 'password123',
          createdAt: Date.now()
        };
        saveUsers(users);
      }

      if (isOtpMode) {
        if (!_siOtp) { showToast('Please request an OTP first.', 'warning'); return; }
        if (otp !== _siOtp) { showToast('Incorrect OTP. Please try again.', 'error'); return; }
      }

      const userData = users[email];
      userData.email = email;
      State.user = App.login(userData);
      saveSession({ email, name: userData.name });
      showToast(`✅ Welcome back, ${userData.name}! Signed in successfully.`, 'success');
      setTimeout(() => { window.location.href = 'dashboard.html'; }, 300);
    });

    // ───────────────────────────────────────────────────
    // LOGIN WITH PROVIDERS (Parichay / e-Pramaan)
    // Requires email + OTP verification against stored account
    // ───────────────────────────────────────────────────
    let _providerOtp = null;
    const providerSelect = document.getElementById('sv-provider-select');
    if (providerSelect) {
      providerSelect.addEventListener('change', function() {
        const pf   = document.getElementById('sv-provider-form');
        const lbl  = document.getElementById('sv-provider-name-lbl');
        const val  = this.value;
        if (val) {
          const names = { parichay: '🏛️ Parichay SSO', epramaan: '🔐 e-Pramaan' };
          if (lbl) lbl.textContent = `Verify your registered account via ${names[val]}`;
          if (pf) pf.style.display = 'block';
        } else {
          if (pf) pf.style.display = 'none';
        }
      });
    }

    const providerReqOtp = document.getElementById('si-provider-req-otp');
    if (providerReqOtp) providerReqOtp.addEventListener('click', () => {
      const email = (document.getElementById('si-provider-email')?.value || '').trim().toLowerCase();
      if (!email) { showToast('Enter your registered government email.', 'warning'); return; }
      if (!isGovEmail(email)) { showToast('Must be a valid .gov.in, .nic.in or state gov email.', 'error'); return; }
      const users = getUsers();
      if (!users[email]) {
        showToast(`No account found for "${email}". Please register first using the Register tab.`, 'error');
        return;
      }
      _providerOtp = String(Math.floor(100000 + Math.random() * 900000));
      const provName = document.getElementById('sv-provider-select')?.options[document.getElementById('sv-provider-select')?.selectedIndex]?.text || 'Provider';
      showToast(`📧 OTP sent to ${email} via ${provName} — Demo OTP: ${_providerOtp}`, 'info');
    });

    const providerSubmit = document.getElementById('si-provider-submit');
    if (providerSubmit) providerSubmit.addEventListener('click', () => {
      const email = (document.getElementById('si-provider-email')?.value || '').trim().toLowerCase();
      const otp   = (document.getElementById('si-provider-otp')?.value   || '').trim();

      if (!email) { showToast('Please enter your registered government email.', 'warning'); return; }
      if (!isGovEmail(email)) { showToast('Invalid email domain.', 'error'); return; }

      const users = getUsers();
      if (!users[email]) {
        showToast(`No account found for "${email}". Please register first.`, 'error');
        return;
      }
      if (!otp) { showToast('Please enter the OTP.', 'warning'); return; }
      if (!_providerOtp) { showToast('Please click “Get OTP” first.', 'warning'); return; }
      if (otp !== _providerOtp) { showToast('Incorrect OTP. Please try again.', 'error'); return; }

      const userData = users[email];
      const provName = document.getElementById('sv-provider-select')?.options[document.getElementById('sv-provider-select')?.selectedIndex]?.text || 'Provider SSO';
      userData.email = email;
      userData.ssoProvider = provName;
      State.user = App.login(userData);
      saveSession({ email, name: userData.name });
      showToast(`✅ Signed in via ${provName}. Welcome, ${userData.name}!`, 'success');
      setTimeout(() => { window.location.href = 'dashboard.html'; }, 300);
    });

    // ───────────────────────────────────────────────────
    // REGISTRATION — Step 1 → Step 2 → Submit
    // ───────────────────────────────────────────────────
    const regNextBtn = document.getElementById('reg-next-btn');
    if (regNextBtn) regNextBtn.addEventListener('click', () => {
      const ministry    = (document.getElementById('reg-ministry')?.value    || '');
      const org         = (document.getElementById('reg-org')?.value         || '');
      const designation = (document.getElementById('reg-designation')?.value || '');
      const email       = (document.getElementById('reg-email')?.value       || '').trim().toLowerCase();

      ['err-ministry','err-org','err-email'].forEach(id => {
        const el = document.getElementById(id); if (el) el.textContent = '';
      });

      let valid = true;
      if (!ministry) {
        const el = document.getElementById('err-ministry');
        if (el) el.textContent = 'Please choose a ministry'; valid = false;
      }
      if (!org) {
        const el = document.getElementById('err-org');
        if (el) el.textContent = 'Please choose an organisation'; valid = false;
      }
      if (!designation) { showToast('Please select your designation.', 'warning'); valid = false; }
      if (!email) {
        const el = document.getElementById('err-email');
        if (el) el.textContent = 'Government email is required'; valid = false;
      } else if (!isGovEmail(email)) {
        const el = document.getElementById('err-email');
        if (el) el.textContent = 'Only .gov.in, .nic.in or state gov email accepted'; valid = false;
      }
      if (!valid) return;

      const users = getUsers();
      if (users[email]) {
        const errEl = document.getElementById('err-email');
        if (errEl) errEl.textContent = 'Account already exists. Please Sign In instead.';
        showToast(`Account for "${email}" already exists! Please Sign In.`, 'error');
        return;
      }

      // Write email back to input in lowercase
      const emailEl = document.getElementById('reg-email');
      if (emailEl) emailEl.value = email;

      showRegStep(2);
    });

    // Register: Send OTP
    const regSendOtp = document.getElementById('reg-send-otp');
    if (regSendOtp) regSendOtp.addEventListener('click', () => {
      const email = (document.getElementById('reg-email')?.value || '').trim().toLowerCase();
      if (!email || !isGovEmail(email)) { showToast('Invalid email.', 'error'); return; }
      _regOtp = String(Math.floor(100000 + Math.random() * 900000));
      showToast(`📧 OTP sent to ${email} — Demo OTP: ${_regOtp}`, 'info');
      const hint = document.getElementById('reg-otp-hint');
      if (hint) hint.textContent = `OTP sent to ${email}. Valid for 10 minutes.`;
    });

    // Register Step 2 back
    const regPrevBtn = document.getElementById('reg-prev-btn');
    if (regPrevBtn) regPrevBtn.addEventListener('click', () => showRegStep(1));

    // Register Submit
    const regSubmit = document.getElementById('reg-submit');
    if (regSubmit) regSubmit.addEventListener('click', () => {
      const name    = (document.getElementById('reg-name')?.value     || '').trim();
      const empId   = (document.getElementById('reg-empid')?.value    || '').trim();
      const otp     = (document.getElementById('reg-otp')?.value      || '').trim();
      const pass    = (document.getElementById('reg-password')?.value || '');
      const confirm = (document.getElementById('reg-confirm')?.value  || '');
      const email       = (document.getElementById('reg-email')?.value       || '').trim().toLowerCase();
      const ministry    = (document.getElementById('reg-ministry')?.value    || '');
      const org         = (document.getElementById('reg-org')?.value         || '');
      const designation = (document.getElementById('reg-designation')?.value || '');
      const centerState = document.querySelector('input[name="reg-centerstate"]:checked')?.value || 'center';

      if (!name)  { showToast('Full name is required.', 'warning'); return; }
      if (!empId) { showToast('Employee ID is required.', 'warning'); return; }
      if (!otp)   { showToast('Please enter the OTP sent to your email.', 'warning'); return; }
      if (!_regOtp) { showToast('Please click “Send OTP” first.', 'warning'); return; }
      if (otp !== _regOtp) { showToast('Incorrect OTP. Please try again.', 'error'); return; }
      if (pass.length < 8) { showToast('Password must be at least 8 characters.', 'warning'); return; }
      if (pass !== confirm) { showToast('Passwords do not match.', 'error'); return; }

      const users = getUsers();
      if (users[email]) { showToast(`Account for "${email}" already exists. Please Sign In.`, 'error'); return; }

      // Save account to local store
      const newAcc = { name, empId, ministry, org, designation, centerState, password: pass, createdAt: Date.now() };
      users[email] = newAcc;
      saveUsers(users);

      // Send to Backend Server API (MongoDB) for persistent database storage
      const postUrl = window.location.protocol.startsWith('http') ? '/api/register' : 'http://localhost:3000/api/register';
      try {
        fetch(postUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(Object.assign({}, newAcc, { email }))
        }).then(res => res.json()).then(data => {
          if (data.success) {
            console.log('✅ Registered successfully on MongoDB Backend Server');
          }
        }).catch(err => console.log('Backend server offline, saved to local database'));
      } catch(e) {}

      showToast(`🎉 Account created for ${name} (${email})! Saved to database.`, 'success');

      // Auto sign in as newly created user
      State.user = App.login(Object.assign({}, newAcc, { email }));
      saveSession({ email, name });
      window._svAuthMode = null;
      setTimeout(() => { window.location.href = 'dashboard.html'; }, 300);
    });
  }


  // ═══════════════════════════════════════════════════════════════════════════
  // MAIN APP EVENTS (after login)
  // ═══════════════════════════════════════════════════════════════════════════
  function bindAppEvents() {

    document.querySelectorAll('.nav-item').forEach(link => {
      link.addEventListener('click', function(e) {
        e.preventDefault();
        State.currentPage = this.dataset.page;
        render();
      });
    });

    window.navigateTo = function(page) {
      State.currentPage = page;
      render();
    };

    const handleLogout = () => {
      App.logout();
      try { localStorage.removeItem('sv_session'); } catch(e) {}
      State.user = null;
      State.currentPage = 'login';
      render();
      showToast('Signed out successfully.', 'info');
    };

    const logoutBtn = document.getElementById('logout-btn');
    const topLogoutBtn = document.getElementById('top-logout-btn');
    if (logoutBtn) logoutBtn.addEventListener('click', handleLogout);
    if (topLogoutBtn) topLogoutBtn.addEventListener('click', handleLogout);

    // Sidebar profile click → go to profile page
    const sidebarProfileBtn = document.getElementById('sidebar-profile-btn');
    if (sidebarProfileBtn) {
      sidebarProfileBtn.addEventListener('click', function(e) {
        // Don't navigate if clicking the logout button itself
        if (e.target.id === 'logout-btn' || e.target.closest('#logout-btn')) return;
        State.currentPage = 'profile';
        render();
      });
    }

    // ── PROFILE PAGE EVENTS ──
    const profSaveBtn = document.getElementById('prof-save-btn');
    if (profSaveBtn) {
      profSaveBtn.addEventListener('click', () => {
        const u = State.user;
        if (!u) return;
        u.name        = document.getElementById('prof-name')?.value.trim() || u.name;
        u.employeeId  = document.getElementById('prof-empid')?.value.trim() || u.employeeId;
        u.designation = document.getElementById('prof-designation')?.value.trim() || u.designation;
        u.department  = document.getElementById('prof-department')?.value.trim() || u.department;
        u.ministry    = u.department;
        u.organisation= document.getElementById('prof-org')?.value.trim() || u.organisation;
        u.mobile      = document.getElementById('prof-mobile')?.value.trim() || u.mobile;
        u.state       = document.getElementById('prof-state')?.value || u.state;
        // Recompute avatar
        u.avatar = u.name ? u.name[0].toUpperCase() : (u.avatar || 'U');
        State.user = u;
        if (window.Store) Store.set('current_user', u);
        try { localStorage.setItem('sv_session', JSON.stringify(u)); } catch(e) {}
        // Persist in user store
        if (u.email) {
          const users = getUsers();
          users[u.email.toLowerCase()] = Object.assign({}, users[u.email.toLowerCase()], u);
          saveUsers(users);
        }
        showToast('✅ Profile & Ministry updated successfully!', 'success');
        render();
      });
    }

    // Profile photo upload
    const profPhotoInput = document.getElementById('prof-photo-input');
    if (profPhotoInput) {
      profPhotoInput.addEventListener('change', function() {
        const file = this.files[0];
        if (!file) return;
        if (file.size > 5 * 1024 * 1024) { showToast('Photo must be under 5MB.', 'warning'); return; }
        const reader = new FileReader();
        reader.onload = function(e) {
          const dataUrl = e.target.result;
          const u = State.user;
          if (!u) return;
          u.photo = dataUrl;
          State.user = u;
          // Save to localStorage
          try { localStorage.setItem('sv_photo_' + (u.email || ''), dataUrl); } catch(e2) {}
          // Persist in user store
          if (u.email) {
            const users = getUsers();
            users[u.email.toLowerCase()] = Object.assign({}, users[u.email.toLowerCase()], { photo: dataUrl });
            saveUsers(users);
          }
          // Update avatar display immediately
          const wrap = document.querySelector('.prof-avatar-wrap');
          if (wrap) {
            const existing = wrap.querySelector('.prof-avatar-big');
            if (existing) {
              existing.outerHTML = `<img src="${dataUrl}" class="prof-avatar-big" style="object-fit:cover;" alt="Profile Photo">`;
            }
          }
          // Update sidebar avatar
          const sbAvatar = document.querySelector('#sidebar-profile-btn .user-avatar');
          if (sbAvatar) {
            sbAvatar.style.background = 'none';
            sbAvatar.style.padding = '0';
            sbAvatar.style.overflow = 'hidden';
            sbAvatar.innerHTML = `<img src="${dataUrl}" style="width:100%;height:100%;object-fit:cover;border-radius:50%;" alt="Profile">`;
          }
          showToast('📷 Profile photo updated!', 'success');
        };
        reader.readAsDataURL(file);
      });
    }

    // Change password toggle
    const changePwdBtn = document.getElementById('prof-change-pwd-btn');
    if (changePwdBtn) {
      changePwdBtn.addEventListener('click', () => {
        const panel = document.getElementById('prof-pwd-panel');
        if (panel) panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
      });
    }

    // Save new password
    const savePwdBtn = document.getElementById('prof-save-pwd-btn');
    if (savePwdBtn) {
      savePwdBtn.addEventListener('click', () => {
        const cur  = document.getElementById('prof-cur-pwd')?.value || '';
        const nw   = document.getElementById('prof-new-pwd')?.value || '';
        const conf = document.getElementById('prof-confirm-pwd')?.value || '';
        const u = State.user;
        if (!u || !u.email) return;
        const users = getUsers();
        const stored = users[u.email.toLowerCase()];
        if (!stored || stored.password !== cur) { showToast('Current password is incorrect.', 'error'); return; }
        if (nw.length < 8) { showToast('New password must be at least 8 characters.', 'warning'); return; }
        if (nw !== conf) { showToast('Passwords do not match.', 'error'); return; }
        stored.password = nw;
        saveUsers(users);
        showToast('✅ Password changed successfully!', 'success');
        document.getElementById('prof-pwd-panel').style.display = 'none';
      });
    }

    // Certificate photo upload preview
    const certPhotoInput = document.getElementById('cert-photo-input');
    if (certPhotoInput) {
      certPhotoInput.addEventListener('change', function() {
        const file = this.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = function(e) {
          const preview = document.getElementById('cert-photo-preview');
          if (preview) {
            preview.innerHTML = `<img src="${e.target.result}" style="max-height:100px;max-width:100%;border-radius:6px;object-fit:contain;" alt="Certificate preview">`;
          }
        };
        reader.readAsDataURL(file);
      });
    }

    // Add certificate
    const certAddBtn = document.getElementById('cert-add-btn');
    if (certAddBtn) {
      certAddBtn.addEventListener('click', () => {
        const name     = document.getElementById('cert-name')?.value.trim();
        const provider = document.getElementById('cert-provider')?.value;
        const date     = document.getElementById('cert-date')?.value;
        const score    = document.getElementById('cert-score')?.value.trim();
        const url      = document.getElementById('cert-url')?.value.trim();
        if (!name) { showToast('Please enter the certificate name.', 'warning'); return; }
        if (!date) { showToast('Please enter the completion date.', 'warning'); return; }
        // Read image if uploaded
        const fileInput = document.getElementById('cert-photo-input');
        const file = fileInput?.files[0];
        const doSave = (imageData) => {
          const u = State.user;
          const key = 'sv_certs_' + (u?.email || '');
          const certs = JSON.parse(localStorage.getItem(key) || '[]');
          certs.unshift({ name, provider, date, score, url, image: imageData || null });
          localStorage.setItem(key, JSON.stringify(certs));
          showToast('🏅 Certificate added!', 'success');
          // Reset fields
          document.getElementById('cert-name').value = '';
          document.getElementById('cert-date').value = '';
          document.getElementById('cert-score').value = '';
          document.getElementById('cert-url').value = '';
          if (fileInput) fileInput.value = '';
          const preview = document.getElementById('cert-photo-preview');
          if (preview) preview.innerHTML = '📄 Click to upload certificate image (JPG/PNG)';
          // Re-render list
          const list = document.getElementById('prof-cert-list');
          if (list) {
            list.innerHTML = certs.map((c, i) => `
              <div class="prof-cert-row" data-idx="${i}">
                ${c.image
                  ? `<img src="${c.image}" class="prof-cert-thumb" alt="Certificate">`
                  : `<div class="prof-cert-icon">🏅</div>`
                }
                <div class="prof-cert-body">
                  <div class="prof-cert-title">${c.name}</div>
                  <div class="prof-cert-meta">${c.provider} &nbsp;·&nbsp; Completed: ${c.date} ${c.score ? '&nbsp;·&nbsp; Score: <b>' + c.score + '%</b>' : ''}</div>
                  ${c.url ? `<a href="${c.url}" target="_blank" class="prof-cert-link">View Certificate ↗</a>` : ''}
                </div>
                <button class="prof-cert-delete" data-idx="${i}" title="Remove">✕</button>
              </div>
            `).join('');
            bindCertDeleteEvents(key, certs);
          }
        };
        if (file) {
          const reader = new FileReader();
          reader.onload = (e) => doSave(e.target.result);
          reader.readAsDataURL(file);
        } else {
          doSave(null);
        }
      });
    }

    // Bind cert delete buttons on initial render
    function bindCertDeleteEvents(key, certs) {
      document.querySelectorAll('.prof-cert-delete').forEach(btn => {
        btn.addEventListener('click', function() {
          const idx = parseInt(this.dataset.idx, 10);
          certs.splice(idx, 1);
          localStorage.setItem(key, JSON.stringify(certs));
          showToast('Certificate removed.', 'info');
          const list = document.getElementById('prof-cert-list');
          if (list) {
            if (certs.length === 0) {
              list.innerHTML = '<div class="prof-cert-empty">🎓 No certificates added yet.</div>';
            } else {
              list.innerHTML = certs.map((c, i) => `
                <div class="prof-cert-row" data-idx="${i}">
                  ${c.image
                    ? `<img src="${c.image}" class="prof-cert-thumb" alt="Certificate">`
                    : `<div class="prof-cert-icon">🏅</div>`
                  }
                  <div class="prof-cert-body">
                    <div class="prof-cert-title">${c.name}</div>
                    <div class="prof-cert-meta">${c.provider} &nbsp;·&nbsp; Completed: ${c.date} ${c.score ? '&nbsp;·&nbsp; Score: <b>' + c.score + '%</b>' : ''}</div>
                    ${c.url ? `<a href="${c.url}" target="_blank" class="prof-cert-link">View Certificate ↗</a>` : ''}
                  </div>
                  <button class="prof-cert-delete" data-idx="${i}" title="Remove">✕</button>
                </div>
              `).join('');
              bindCertDeleteEvents(key, certs);
            }
          }
        });
      });
    }
    // Bind cert delete events
    const u2 = State.user;
    if (u2) bindCertDeleteEvents('sv_certs_' + (u2.email || ''), JSON.parse(localStorage.getItem('sv_certs_' + (u2.email || '')) || '[]'));

    // Quiz File Upload & Text Ingestion Listener
    const quizFileInput = document.getElementById('quiz-file-input');
    if (quizFileInput) {
      quizFileInput.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        showToast(`📄 Extracting text from ${file.name}...`, 'info');
        let text = '';
        if (window.GeminiService && typeof GeminiService.extractTextFromFile === 'function') {
          text = await GeminiService.extractTextFromFile(file);
        } else {
          text = await new Promise((res) => {
            const r = new FileReader();
            r.onload = ev => res(ev.target.result);
            r.readAsText(file);
          });
        }
        const textElem = document.getElementById('quiz-paste-text');
        if (textElem) textElem.value = text;
        showToast(`✅ Extracted ${text.length} characters from ${file.name}!`, 'success');
      });
    }

    // MCQ Generation (AI Quiz Generator -> Interactive Assessment)
    const generateBtn = document.getElementById('generate-mcq-btn');
    if (generateBtn) {
      generateBtn.addEventListener('click', async () => {
        const pasteText = document.getElementById('quiz-paste-text')?.value || '';
        const numQ = document.getElementById('quiz-num-q')?.value || 10;
        const diff = document.getElementById('quiz-diff')?.value || 'Medium';
        const container = document.getElementById('quiz-output-container');

        if (!pasteText || pasteText.trim().length < 20) {
          showToast('Please enter or upload learning material (at least 20 characters).', 'warning');
          return;
        }

        generateBtn.disabled = true;
        generateBtn.innerHTML = '<div class="spinner sm"></div> Generating Bloom MCQs with Gemini AI...';

        try {
          const questions = await GeminiService.generateMCQs(pasteText, numQ, diff);
          showToast(`Generated ${questions.length} Bloom-tagged MCQs! Launching Test...`, 'success');

          // Save generated questions to local store & MongoDB Backend Server
          try {
            localStorage.setItem('sv_question_bank', JSON.stringify(questions));
            fetch('/api/questions', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ questions, topic: pasteText.slice(0, 100), difficulty: diff })
            }).catch(e => {});
          } catch(e) {}

          if (window.startInteractiveTestRunner) {
            window.startInteractiveTestRunner(questions, container);
          } else {
            let userAnswers = {};
            function renderInteractiveView(isSubmitted = false) {
              let correctCount = 0;
              if (isSubmitted) {
                questions.forEach((q, idx) => { if (userAnswers[idx] === q.correct) correctCount++; });
              }
              const scorePct = Math.round((correctCount / (questions.length || 1)) * 100);

              container.innerHTML = `
                <div style="background: linear-gradient(135deg, #0F172A, #0D9488); color: white; padding: 1.25rem 1.5rem; border-radius: 12px; margin-bottom: 1.5rem; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem;">
                  <div>
                    <h4 style="color: white; margin: 0 0 0.25rem 0; font-weight: 700; font-size: 1.15rem;">
                      ${isSubmitted ? `🏆 Test Completed! Score: ${scorePct}% (${correctCount}/${questions.length} Correct)` : `📝 Interactive Skill Assessment (${questions.length} Questions)`}
                    </h4>
                    <p style="margin: 0; opacity: 0.9; font-size: 0.85rem;">
                      ${isSubmitted ? 'Evaluation complete. Detailed explanations & citations shown below.' : 'Select your answer for each question and click Submit Test.'}
                    </p>
                  </div>
                  <div>
                    ${isSubmitted
                      ? `<button id="app-retake-btn" class="btn" style="background:#F97316; color:white; font-weight:700; border:none; padding:0.6rem 1.25rem; border-radius:8px; cursor:pointer;">🔄 Retake Test</button>`
                      : `<button id="app-submit-btn" class="btn" style="background:#10B981; color:white; font-weight:700; border:none; padding:0.65rem 1.35rem; border-radius:8px; cursor:pointer;">🎯 Submit Test &amp; View Score</button>`
                    }
                  </div>
                </div>

                <div style="display: flex; flex-direction: column; gap: 1.25rem;">
                  ${questions.map((q, idx) => {
                    const selectedOpt = userAnswers[idx];
                    const isCorrect = selectedOpt === q.correct;
                    let cardBorder = isSubmitted ? (isCorrect ? '2px solid #10B981' : '2px solid #EF4444') : '1px solid #E2E8F0';
                    let cardBg = isSubmitted ? (isCorrect ? 'rgba(16,185,129,0.02)' : 'rgba(239,68,68,0.02)') : '#FFFFFF';

                    return `
                      <div class="card mb-3" style="border: ${cardBorder}; background: ${cardBg}; border-radius: 12px; padding: 1.25rem;">
                        <div style="display:flex; justify-content:space-between; align-items:start; gap:0.5rem; margin-bottom:0.875rem;">
                          <div style="font-weight:700; color:#0F172A; font-size:1rem; flex:1;">
                            Q${idx + 1}. ${q.question}
                            ${q.bloomLevel ? `<span class="badge badge-blue ml-2" style="font-size:0.7rem; margin-left:0.5rem;">${q.bloomLevel}</span>` : ''}
                          </div>
                          ${isSubmitted ? (isCorrect ? `<span class="badge badge-green">✓ Correct (+1)</span>` : `<span class="badge badge-red" style="background:#FEE2E2; color:#991B1B;">✕ Incorrect</span>`) : ''}
                        </div>

                        <div style="display:flex; flex-direction:column; gap:0.5rem; margin-bottom:0.75rem;">
                          ${Object.entries(q.options).map(([k, v]) => {
                            let optBorder = '1px solid #E2E8F0';
                            let optBg = '#F8FAFC';
                            let optColor = '#334155';
                            if (isSubmitted) {
                              if (k === q.correct) { optBorder = '2px solid #10B981'; optBg = 'rgba(16,185,129,0.12)'; optColor = '#065F46'; }
                              else if (selectedOpt === k && !isCorrect) { optBorder = '2px solid #EF4444'; optBg = 'rgba(239,68,68,0.12)'; optColor = '#991B1B'; }
                            } else if (selectedOpt === k) {
                              optBorder = '2px solid #0D9488'; optBg = 'rgba(13,148,136,0.08)'; optColor = '#0F172A';
                            }
                            return `
                              <label style="display:flex; align-items:center; gap:0.75rem; padding:0.75rem 1rem; border:${optBorder}; border-radius:8px; background:${optBg}; color:${optColor}; cursor:${isSubmitted ? 'default' : 'pointer'}; font-size:0.9rem; font-weight:${selectedOpt === k ? '700' : '400'};">
                                <input type="radio" name="app_q_${idx}" value="${k}" ${selectedOpt === k ? 'checked' : ''} ${isSubmitted ? 'disabled' : ''} style="width:18px; height:18px; accent-color:#0D9488;">
                                <span style="font-weight:800; min-width:22px;">${k}.</span>
                                <span style="flex:1;">${v}</span>
                                ${isSubmitted && k === q.correct ? `<span style="margin-left:auto; color:#059669; font-weight:700; font-size:0.8rem;">✓ Correct Answer</span>` : ''}
                              </label>
                            `;
                          }).join('')}
                        </div>

                        ${isSubmitted ? `
                          <div style="font-size:0.85rem; color:#334155; background:#F1F5F9; padding:0.75rem 1rem; border-radius:8px; border-left:4px solid #0D9488; margin-top:0.75rem;">
                            💡 <b>Explanation:</b> ${q.explanation} ${q.citation ? `<br><span style="color:#64748B; font-size:0.78rem;">Citation: ${q.citation}</span>` : ''}
                          </div>
                        ` : ''}
                      </div>
                    `;
                  }).join('')}
                </div>
              `;

              if (!isSubmitted) {
                questions.forEach((_, idx) => {
                  const radios = container.querySelectorAll(`input[name="app_q_${idx}"]`);
                  radios.forEach(r => {
                    r.onchange = (e) => { userAnswers[idx] = e.target.value; };
                  });
                });
                const subBtn = document.getElementById('app-submit-btn');
                if (subBtn) subBtn.onclick = () => renderInteractiveView(true);
              } else {
                const retakeBtn = document.getElementById('app-retake-btn');
                if (retakeBtn) retakeBtn.onclick = () => { userAnswers = {}; renderInteractiveView(false); };
              }
            }
            renderInteractiveView(false);
          }
        } catch(err) {
          showToast(err.message, 'error');
        } finally {
          generateBtn.disabled = false;
          generateBtn.innerHTML = '⚡ Generate Bloom-Tagged MCQs';
        }
      });
    }

    // MCQ Assessment Submission & Evaluation Engine
    const mcqForm = document.getElementById('mcq-test-form');
    if (mcqForm) {
      mcqForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        let questions = [];
        try {
          const raw = localStorage.getItem('sv_question_bank');
          if (raw) questions = JSON.parse(raw);
        } catch(err) {}

        if (!questions || questions.length === 0) {
          // Fallback questions array matching renderMcqAssessment
          questions = [
            {
              question: "What is the primary purpose of a Python list data structure in statistical programming?",
              options: { "A": "To store an ordered, mutable sequence of multiple elements or items", "B": "To define custom object-oriented class methods", "C": "To handle runtime exception catching across modules", "D": "To compile native C code extensions directly" },
              correct: "A", explanation: "In Python, a list is an ordered, mutable sequence capable of holding heterogeneous data items, essential for handling statistical arrays and collections."
            },
            {
              question: "In National Accounts Statistics (NAS), how is Gross Domestic Product (GDP) calculated using the Production/Output Method?",
              options: { "A": "Sum of Gross Value Added (GVA) at basic prices + Net Taxes on Products", "B": "Total Personal Consumption Expenditure + Exports - Imports", "C": "Sum of all wages, salaries, rents, and corporate profits", "D": "Gross National Disposable Income minus Capital Consumption" },
              correct: "A", explanation: "GDP at market prices under NAS 2011 series equals the sum of GVA of all resident producer units at basic prices plus taxes on products minus subsidies on products."
            },
            {
              question: "Under the Digital Personal Data Protection (DPDP) Act 2023, what is the primary legal obligation of a Data Fiduciary regarding statistical data collection?",
              options: { "A": "Provide clear consent notices and implement reasonable security safeguards", "B": "Store all citizen data exclusively in paper format", "C": "Share un-anonymized citizen data with private vendors without restriction", "D": "Retain personal data permanently without deletion policies" },
              correct: "A", explanation: "The DPDP Act 2023 mandates that Data Fiduciaries must issue accessible notice, obtain specified consent, and enforce technical safeguards to prevent data breaches."
            },
            {
              question: "In NSSO sample survey methodology, what distinguishes Stratified Multi-Stage Sampling from simple random sampling?",
              options: { "A": "Population is divided into homogeneous strata before selecting primary sampling units (FSUs/SSUs)", "B": "Every individual unit in the country has an equal probability of selection without grouping", "C": "Only urban census enumeration blocks are included in sample selection", "D": "Sample units are chosen purely based on voluntary officer responses" },
              correct: "A", explanation: "NSSO sample design stratifies the target frame by rural/urban and socio-economic strata, then selects First Stage Units (villages/blocks) followed by Second Stage Units (households)."
            },
            {
              question: "Which Python pandas function is used to load and parse large statistical CSV survey data into a DataFrame?",
              options: { "A": "pd.read_csv()", "B": "pd.open_file()", "C": "pd.import_table()", "D": "pd.fetch_dataset()" },
              correct: "A", explanation: "pd.read_csv() reads a comma-separated values (CSV) file into a pandas DataFrame, providing parameters for chunksize, encoding, and missing value handling."
            }
          ];
        }

        let correctCount = 0;
        const userAnswers = [];

        questions.forEach((q, idx) => {
          const selected = document.querySelector(`input[name="question_${idx}"]:checked`);
          const ans = selected ? selected.value : null;
          userAnswers.push(ans);
          if (ans === q.correct) {
            correctCount++;
          }
        });

        const total = questions.length;
        const accuracyPct = Math.round((correctCount / total) * 100);

        // Competency Level Mapping
        let competencyTier = 'Novice Competency';
        let badgeColor = '#EF4444';
        let newScoreValue = 2.2;
        if (accuracyPct >= 90) { competencyTier = 'Expert Competency'; badgeColor = '#10B981'; newScoreValue = 4.8; }
        else if (accuracyPct >= 75) { competencyTier = 'Advanced Competency'; badgeColor = '#3B82F6'; newScoreValue = 4.0; }
        else if (accuracyPct >= 50) { competencyTier = 'Intermediate Competency'; badgeColor = '#F59E0B'; newScoreValue = 3.2; }

        // Update Officer Competency Profile State
        State.scores.statistical = newScoreValue;
        State.scores.technical = Math.min(5.0, parseFloat((newScoreValue * 0.95).toFixed(2)));
        CompetencyEngine.saveScores(State.scores);

        const skillGapTitle = accuracyPct < 75
          ? 'Advanced Python & Econometric Data Analysis for Official Statistics'
          : 'Big Data Processing & National Accounts Modeling';

        showToast(`Evaluation Complete! Accuracy: ${accuracyPct}% (${correctCount}/${total})`, 'success');

        // Render Results View
        const testContainer = document.getElementById('mcq-test-container');
        const resultsContainer = document.getElementById('mcq-results-container');

        if (testContainer) testContainer.style.display = 'none';
        if (resultsContainer) {
          resultsContainer.style.display = 'block';
          resultsContainer.innerHTML = `
            <div class="card mb-6" style="background: linear-gradient(135deg, #0A2540, #10B981); color: white; padding: 2rem; border-radius: 12px;">
              <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:1.5rem;">
                <div>
                  <span class="badge mb-2" style="background:${badgeColor}; color:white; font-size:0.85rem; padding:0.4rem 0.9rem;">
                    ${competencyTier} (${accuracyPct}%)
                  </span>
                  <h1 style="color:white; margin:0.5rem 0 0.25rem 0; font-size:2.2rem;">${correctCount} / ${total} Correct</h1>
                  <p style="color:rgba(255,255,255,0.9); margin:0;">
                    Assessment Score: <strong>${accuracyPct}% Accuracy</strong> | Competency Vector Updated for <strong>${State.user?.name || 'Officer'}</strong>
                  </p>
                </div>
                <div style="display:flex; gap:0.75rem; flex-wrap:wrap;">
                  <button onclick="navigateTo('skillgap')" class="btn" style="background:white; color:#0A2540; font-weight:700; border:none; cursor:pointer;">
                    ⚡ View Skill Gap Engine
                  </button>
                  <button onclick="navigateTo('courses')" class="btn" style="background:#F97316; color:white; font-weight:700; border:none; cursor:pointer;">
                    📚 Go to Learning Path
                  </button>
                </div>
              </div>
            </div>

            <!-- Detailed Question Breakdown -->
            <div class="card mb-6">
              <h3 class="card-title mb-4">🔍 Assessment Item Breakdown &amp; Explanations</h3>
              <div style="display:flex; flex-direction:column; gap:1rem;">
                ${questions.map((q, idx) => {
                  const userAns = userAnswers[idx];
                  const isCorrect = userAns === q.correct;
                  return `
                    <div style="padding:1rem 1.25rem; border-radius:8px; border:1px solid ${isCorrect ? '#10B981' : '#EF4444'}; background:${isCorrect ? '#F0FDF4' : '#FEF2F2'};">
                      <div style="display:flex; justify-content:space-between; align-items:flex-start; gap:1rem; margin-bottom:0.5rem;">
                        <div style="font-weight:700; color:#0F172A;">
                          <span>Q${idx + 1}.</span> ${q.question}
                        </div>
                        <span class="badge" style="background:${isCorrect ? '#10B981' : '#EF4444'}; color:white; font-size:0.75rem; white-space:nowrap;">
                          ${isCorrect ? '✓ Correct' : '✕ Incorrect'}
                        </span>
                      </div>

                      <div style="font-size:0.88rem; margin-bottom:0.5rem; color:#334155;">
                        Officer Selected: <strong>Option ${userAns || 'None'}</strong> | Correct Answer: <strong style="color:#059669;">Option ${q.correct} (${q.options[q.correct]})</strong>
                      </div>

                      <div style="font-size:0.83rem; color:#475569; background:rgba(255,255,255,0.7); padding:0.6rem 0.8rem; border-radius:6px;">
                        💡 <b>Explanation:</b> ${q.explanation} ${q.citation ? `[${q.citation}]` : ''}
                      </div>
                    </div>
                  `;
                }).join('')}
              </div>
            </div>

            <!-- DistilBERT Recommendation Block -->
            <div class="card mb-6" id="distilbert-recommendations-card">
              <div style="display:flex; align-items:center; gap:0.75rem; margin-bottom:1rem;">
                <div style="font-size:1.8rem;">🤖</div>
                <div>
                  <h3 style="margin:0;">DistilBERT AI iGOT Course Recommendations</h3>
                  <p style="margin:0; font-size:0.85rem; color:#64748B;">Identified Skill Gap: <strong>"${skillGapTitle}"</strong></p>
                </div>
              </div>
              <div id="distilbert-courses-list" style="display:flex; flex-direction:column; gap:0.75rem;">
                <div class="spinner sm"></div> Matching courses with DistilBERT semantic embeddings...
              </div>
            </div>
          `;

          // Fetch DistilBERT Recommendations
          try {
            const matches = await DistilBertService.matchCourses(skillGapTitle, IgotService.COURSES);
            const coursesListEl = document.getElementById('distilbert-courses-list');
            if (coursesListEl) {
              if (matches && matches.length > 0) {
                coursesListEl.innerHTML = matches.slice(0, 4).map(m => {
                  const courseObj = IgotService.COURSES.find(c => c.id === m.course_id) || IgotService.COURSES[0];
                  const simPct = Math.round((m.score || 0.88) * 100);
                  return `
                    <div style="display:flex; align-items:center; justify-content:space-between; padding:0.85rem 1.25rem; background:#F8FAFC; border:1px solid #E2E8F0; border-radius:8px; flex-wrap:wrap; gap:0.75rem;">
                      <div style="flex:1; min-width:240px;">
                        <div style="font-weight:700; color:#1E3A8A; font-size:0.95rem;">${courseObj.title}</div>
                        <div style="font-size:0.8rem; color:#64748B;">Provider: ${courseObj.provider} · Level: ${courseObj.level}</div>
                      </div>
                      <div style="display:flex; align-items:center; gap:1rem;">
                        <span class="badge badge-green" style="font-size:0.78rem;">${simPct}% Match</span>
                        <a href="https://www.igotkarmayogi.gov.in" target="_blank" class="btn btn-sm btn-primary" style="padding:0.4rem 0.9rem; font-size:0.8rem; text-decoration:none;">
                          iGOT Karmayogi ↗
                        </a>
                      </div>
                    </div>
                  `;
                }).join('');
              } else {
                coursesListEl.innerHTML = `
                  <div style="padding:1rem; text-align:center; color:#64748B;">
                    Recommended Course: <b>Python for Statistical Data Processing (NSSTA)</b>
                    <a href="https://www.igotkarmayogi.gov.in" target="_blank" class="btn btn-sm btn-primary ml-3">iGOT Karmayogi ↗</a>
                  </div>
                `;
              }
            }
          }
        }
      });
    }

    // MCQ Assessment: Load Course-Specific MCQs
    const courseSelectEl = document.getElementById('mcq-course-select');
    if (courseSelectEl) {
      courseSelectEl.addEventListener('change', function() {
        const inputEl = document.getElementById('mcq-course-input');
        if (inputEl && this.value) {
          inputEl.value = this.value;
        }
      });
    }

    const courseInputEl = document.getElementById('mcq-course-input');
    if (courseInputEl) {
      courseInputEl.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
          e.preventDefault();
          const btn = document.getElementById('mcq-fetch-course-btn');
          if (btn) btn.click();
        }
      });
    }

    const fetchCourseBtn = document.getElementById('mcq-fetch-course-btn');
    if (fetchCourseBtn) {
      fetchCourseBtn.addEventListener('click', async () => {
        const inputVal = (document.getElementById('mcq-course-input')?.value || '').trim();
        const selectVal = (document.getElementById('mcq-course-select')?.value || '').trim();
        const courseName = inputVal || selectVal;

        if (!courseName) {
          showToast('Please type a course name or select one from the dropdown.', 'warning');
          return;
        }

        fetchCourseBtn.disabled = true;
        fetchCourseBtn.innerHTML = '<div class="spinner sm"></div> Generating questions for course...';

        try {
          const promptText = `Course Title: "${courseName}". Official Civil Service & Statistical System Training Module. Generate 10 Bloom-tagged multiple-choice questions for evaluating officer competency in this course.`;
          const questions = await GeminiService.generateMCQs(promptText, 10, 'Medium', courseName);

          showToast(`Generated ${questions.length} questions for "${courseName}" using Gemini AI!`, 'success');

          // Save questions locally and to MongoDB API
          try {
            localStorage.setItem('sv_question_bank', JSON.stringify(questions));
            fetch('/api/questions', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ questions, topic: courseName, difficulty: 'Medium' })
            }).catch(e => {});
          } catch(e) {}

          // Re-render page to load questions into MCQ Assessment form immediately
          render();
        } catch(err) {
          showToast(`Error generating course questions: ${err.message}`, 'error');
        } finally {
          fetchCourseBtn.disabled = false;
          fetchCourseBtn.innerHTML = '⚡ Load Course MCQs via Gemini AI';
        }
      });
    }
  }

  // ── Initial Run ─────────────────────────────────────────────────────────────
  render();

}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initSkillVistaApp);
} else {
  initSkillVistaApp();
}
