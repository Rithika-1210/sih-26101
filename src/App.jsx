/**
 * SkillVista — AI-Enabled Skill Intelligence & Learning Platform
 * for India's Official Statistical System (MoSPI / NSSTA)
 * Integrated with the iGOT Karmayogi Ecosystem
 *
 * Full React 18 Architecture
 */

const { useState, useEffect, useRef, useMemo } = React;

// Main SkillVista Application Root
window.StatLearnApp = function App() {
  const [user, setUser] = useState(() => App.getCurrentUser());
  const [currentPage, setCurrentPage] = useState(() => user ? 'dashboard' : 'login');
  const [scores, setScores] = useState(() => CompetencyEngine.loadScores());
  const [enrolledIds, setEnrolledIds] = useState(() => IgotService.getEnrolled());
  const [completedIds, setCompletedIds] = useState(() => IgotService.getCompleted());
  const [toastMsg, setToastMsg] = useState(null);

  const showToast = (text, type = 'info') => {
    setToastMsg({ text, type, id: Date.now() });
    setTimeout(() => setToastMsg(null), 3500);
  };

  const handleLogin = (role) => {
    const loggedUser = App.login(role);
    setUser(loggedUser);
    setCurrentPage('dashboard');
    showToast(`Welcome to SkillVista, ${loggedUser.name}!`, 'success');
  };

  const handleLogout = () => {
    App.logout();
    setUser(null);
    setCurrentPage('login');
    showToast('Signed out successfully.', 'info');
  };

  const handleUpdateScores = (newScores) => {
    setScores(newScores);
    CompetencyEngine.saveScores(newScores);
  };

  const handleEnroll = (courseId) => {
    IgotService.enroll(courseId);
    setEnrolledIds(IgotService.getEnrolled());
    showToast('Enrolled in iGOT course! Synced with Karmayogi.', 'success');
  };

  const handleComplete = (courseId) => {
    IgotService.complete(courseId);
    setCompletedIds(IgotService.getCompleted());
    showToast('🎉 Course completed! SkillVista competency vector updated.', 'success');
  };

  // If not logged in, render LoginPage
  if (!user || currentPage === 'login') {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div className="app-layout">
      {/* Sidebar Navigation */}
      <Sidebar
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        user={user}
        onLogout={handleLogout}
        onSwitchRole={handleLogin}
      />

      {/* Main Content Area */}
      <main className="main-content">
        <Header currentPage={currentPage} user={user} setCurrentPage={setCurrentPage} onLogout={handleLogout} />

        <div className="page-body">
          {currentPage === 'dashboard' && (
            <DashboardView
              user={user}
              scores={scores}
              enrolledIds={enrolledIds}
              completedIds={completedIds}
              setCurrentPage={setCurrentPage}
            />
          )}
          {currentPage === 'assessment' && (
            <AssessmentView
              user={user}
              scores={scores}
              setScores={handleUpdateScores}
              showToast={showToast}
              setCurrentPage={setCurrentPage}
            />
          )}
          {currentPage === 'quiz' && (
            <QuizGeneratorView showToast={showToast} />
          )}
          {currentPage === 'courses' && (
            <CoursesView
              scores={scores}
              user={user}
              enrolledIds={enrolledIds}
              completedIds={completedIds}
              onEnroll={handleEnroll}
              onComplete={handleComplete}
            />
          )}
          {currentPage === 'igot' && (
            <IgotIntegrationView
              scores={scores}
              user={user}
              enrolledIds={enrolledIds}
              onEnroll={handleEnroll}
            />
          )}
          {currentPage === 'admin' && (
            <AdminAnalyticsView />
          )}
          {currentPage === 'architecture' && (
            <ArchitectureView />
          )}
        </div>
      </main>

      {/* SkillVista Gemini AI Assistant */}
      <ChatbotWidget user={user} scores={scores} />

      {/* Toast Notifications */}
      {toastMsg && (
        <div className={`toast ${toastMsg.type}`} style={{ position: 'fixed', top: '24px', right: '24px', zIndex: 3000 }}>
          <span>{toastMsg.type === 'success' ? '✅' : toastMsg.type === 'error' ? '❌' : 'ℹ️'}</span>
          <span>{toastMsg.text}</span>
        </div>
      )}
    </div>
  );
};

// ==========================================
// LOGIN PAGE COMPONENT (SkillVista Auth)
// ==========================================
function LoginPage({ onLogin }) {
  const [activeRole, setActiveRole] = useState('learner');
  const [email, setEmail] = useState('priya.sharma@mospi.gov.in');
  const [password, setPassword] = useState('••••••••••••');

  const roleDetails = {
    learner: { name: 'Statistical Officer / Learner', desc: 'NSO Officers, Analysts, and Field Investigators seeking competency-based upskilling.', icon: '👨‍💼', color: 'blue' },
    trainer: { name: 'NSSTA Trainer / Faculty', desc: 'NSSTA Faculty & Subject Experts who author AI assessments and track cohort progress.', icon: '🧑‍🏫', color: 'purple' },
    admin: { name: 'MoSPI Administrator', desc: 'DIID & Ministry leadership with workforce analytics and predictive gap dashboards.', icon: '🛡️', color: 'saffron' }
  };

  const handleRoleSelect = (role) => {
    setActiveRole(role);
    if (role === 'learner') setEmail('priya.sharma@mospi.gov.in');
    else if (role === 'admin') setEmail('rajesh.kumar@mospi.gov.in');
    else setEmail('anita.singh@nssta.gov.in');
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-base)', backgroundImage: 'var(--grad-mesh)', display: 'flex', flexDirection: 'column' }}>
      {/* Top Bar */}
      <div className="navbar">
        <div className="navbar-brand">
          <div className="navbar-logo">🎓</div>
          <div>
            <div className="navbar-name">Skill<span>Vista</span></div>
            <div style={{ fontSize: '0.65rem', color: 'var(--saffron-400)', fontWeight: 700 }}>MoSPI · iGOT Karmayogi Ecosystem</div>
          </div>
        </div>
        <div className="navbar-links">
          <span className="badge badge-saffron">SIH 2026 · PS #26101</span>
          <span className="badge badge-blue">Mission Karmayogi</span>
        </div>
      </div>

      {/* Login Hero Container */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '120px 24px 60px' }}>
        <div style={{ width: '100%', maxWidth: '1020px' }}>

          <div className="text-center mb-8">
            <div className="section-tag" style={{ display: 'inline-flex', margin: '0 auto 1rem' }}>
              🏛️ MINISTRY OF STATISTICS & PROGRAMME IMPLEMENTATION
            </div>
            <h1 style={{ fontFamily: 'var(--font-display)', marginBottom: '0.75rem' }}>
              Welcome to <span className="text-gradient">SkillVista</span>
            </h1>
            <p style={{ maxWidth: '580px', margin: '0 auto', fontSize: '1.05rem' }}>
              AI-Enabled Skill Intelligence & Learning Companion for India's Official Statistical System
            </p>
          </div>

          <div className="grid-2" style={{ gap: '2rem', alignItems: 'center' }}>

            {/* Left: Role Selector & Features */}
            <div>
              <h3 style={{ fontSize: '1.125rem', marginBottom: '1rem' }}>Select Role Persona</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem', marginBottom: '1.5rem' }}>
                {Object.entries(roleDetails).map(([rKey, rVal]) => (
                  <div
                    key={rKey}
                    className={`card cursor-pointer ${activeRole === rKey ? `card-glow-${rVal.color}` : ''}`}
                    style={{
                      border: activeRole === rKey ? `2px solid var(--${rVal.color==='saffron'?'saffron':rVal.color==='purple'?'purple':'blue'}-500)` : 'var(--border-glass)',
                      background: activeRole === rKey ? `rgba(${rVal.color==='saffron'?'255,153,51':rVal.color==='purple'?'139,92,246':'59,130,246'},0.08)` : 'var(--glass-bg)',
                      padding: '1rem 1.25rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1rem'
                    }}
                    onClick={() => handleRoleSelect(rKey)}
                  >
                    <div style={{ fontSize: '2rem' }}>{rVal.icon}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--text-primary)' }}>{rVal.name}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>{rVal.desc}</div>
                    </div>
                    {activeRole === rKey && <span className="badge badge-green">Selected</span>}
                  </div>
                ))}
              </div>

              <div style={{ background: 'rgba(255,255,255,0.02)', border: 'var(--border-glass)', borderRadius: 'var(--radius-lg)', padding: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{ fontSize: '1.5rem' }}>🔗</span>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  Integrated with <b>iGOT Karmayogi</b> platform API & <b>FRAC</b> Competency Framework for 4.6M civil servants.
                </div>
              </div>
            </div>

            {/* Right: Sign In Form & SSO */}
            <div className="card" style={{ padding: '2.25rem', background: 'rgba(10,14,26,0.95)', border: 'var(--border-glass)' }}>
              <div style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
                <div style={{ width: '48px', height: '48px', background: 'var(--grad-primary)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', margin: '0 auto 0.75rem' }}>🔐</div>
                <h3 style={{ fontSize: '1.25rem' }}>Sign In to SkillVista</h3>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>Official Access Portal · Government of India</div>
              </div>

              {/* SSO Option */}
              <button
                className="btn w-full mb-4"
                style={{ background: 'linear-gradient(135deg, #1B4F72 0%, #1A8F5E 100%)', color: 'white', justifyContent: 'center', padding: '0.875rem' }}
                onClick={() => onLogin(activeRole)}
              >
                🏛️ Sign in with Parichay / e-Pramaan SSO
              </button>

              <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.78rem', margin: '1rem 0', position: 'relative' }}>
                <span style={{ background: 'var(--bg-primary)', padding: '0 0.75rem', position: 'relative', zIndex: 1 }}>or credentials</span>
                <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: '1px', background: 'rgba(255,255,255,0.07)' }} />
              </div>

              <div className="form-group mb-4">
                <label className="form-label">Government Email ID</label>
                <input
                  type="email"
                  className="form-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="form-group mb-6">
                <label className="form-label">Password</label>
                <input
                  type="password"
                  className="form-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <button className="btn btn-primary w-full btn-lg" onClick={() => onLogin(activeRole)}>
                Sign In as {activeRole === 'learner' ? 'Learner' : activeRole === 'admin' ? 'Admin' : 'Trainer'} →
              </button>

              <div style={{ textAlign: 'center', marginTop: '1.25rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Demo Environment · No password required · Click Sign In
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

// Sidebar Component
function Sidebar({ currentPage, setCurrentPage, user, onLogout, onSwitchRole }) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'assessment', label: 'Competency Assessment', icon: '🎯' },
    { id: 'courses', label: 'iGOT Courses', icon: '📚' },
    { id: 'igot', label: 'iGOT Integration', icon: '🏛️', badge: 'LIVE' },
    { id: 'quiz', label: 'AI Quiz Generator', icon: '🤖' },
    { id: 'architecture', label: 'System Architecture', icon: '⚡' },
  ];

  if (user && (user.role === 'admin' || user.role === 'trainer')) {
    navItems.push({ id: 'admin', label: 'Admin Analytics', icon: '📈' });
  }

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">🎓</div>
        <div>
          <div className="sidebar-logo-text">Skill<span style={{ color: 'var(--saffron-400)' }}>Vista</span></div>
          <div className="sidebar-logo-sub">MoSPI · iGOT Ecosystem</div>
        </div>
      </div>

      <nav className="sidebar-nav">
        <div className="sidebar-section-label">Platform Navigation</div>
        {navItems.map(item => (
          <a
            key={item.id}
            href={`#${item.id}`}
            className={`nav-item ${currentPage === item.id ? 'active' : ''}`}
            onClick={(e) => { e.preventDefault(); setCurrentPage(item.id); }}
          >
            <span style={{ fontSize: '1.1rem' }}>{item.icon}</span>
            <span>{item.label}</span>
            {item.badge && <span className="badge badge-green ml-auto" style={{ fontSize: '0.6rem' }}>{item.badge}</span>}
          </a>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-user">
          <div className="user-avatar">{user ? user.avatar : 'PS'}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="user-name">{user ? user.name : 'Officer'}</div>
            <div className="user-role">{user ? user.designation : 'Learner'}</div>
          </div>
          <button
            onClick={onLogout}
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '1.1rem' }}
            title="Sign Out"
          >
            ⎋
          </button>
        </div>
      </div>
    </aside>
  );
}

// Header Component
function Header({ currentPage, user, onLogout }) {
  const titles = {
    dashboard: 'Learner Dashboard',
    assessment: 'Competency Profiling & Gap Engine',
    quiz: 'Intelligent Assessment & Quiz Engine',
    courses: 'iGOT Karmayogi Learning Pathways',
    igot: 'iGOT Karmayogi Integration Hub',
    admin: 'MoSPI & NSSTA Admin Analytics',
    architecture: 'SkillVista System Architecture'
  };

  return (
    <header className="page-header">
      <div>
        <div className="page-title">{titles[currentPage] || 'SkillVista'}</div>
        <div className="page-subtitle">India's Official Statistical System · {user?.department || 'MoSPI / NSSTA'}</div>
      </div>
      <div className="flex gap-3 align-center">
        <span className="badge badge-blue">FRAC Framework</span>
        <span className="badge badge-saffron">Gemini AI</span>
        <button className="btn btn-ghost btn-sm" onClick={onLogout} title="Logout">Sign Out ⎋</button>
      </div>
    </header>
  );
}

// ==========================================
// 1. COMPETENCY ASSESSMENT VIEW (SkillVista)
// ==========================================
function AssessmentView({ user, scores, setScores, showToast, setCurrentPage }) {
  const [selectedDomain, setSelectedDomain] = useState('statistical');
  const [step, setStep] = useState(1);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [answers, setAnswers] = useState([]);

  const domains = CompetencyEngine.DOMAINS;
  const questions = CompetencyEngine.QUESTIONS[selectedDomain] || [];

  const handleStart = (domainKey) => {
    setSelectedDomain(domainKey);
    const qs = CompetencyEngine.QUESTIONS[domainKey] || [];
    setAnswers(new Array(qs.length).fill(-1));
    setCurrentQIndex(0);
    setStep(2);
  };

  const handleSelectAnswer = (optIndex) => {
    const updated = [...answers];
    updated[currentQIndex] = optIndex;
    setAnswers(updated);
  };

  const handleNext = () => {
    if (currentQIndex < questions.length - 1) {
      setCurrentQIndex(prev => prev + 1);
    } else {
      const score = CompetencyEngine.scoreAssessment(selectedDomain, answers);
      const updatedScores = { ...scores, [selectedDomain]: score };
      setScores(updatedScores);
      showToast(`🎉 ${domains[selectedDomain].shortLabel} Assessment Complete! Score: ${Math.round(score * 20)}%`, 'success');
      setStep(3);
    }
  };

  const handlePrev = () => {
    if (currentQIndex > 0) setCurrentQIndex(prev => prev - 1);
  };

  const handleReset = () => {
    setScores({});
    setStep(1);
    showToast('Assessment scores reset.', 'info');
  };

  const currentGaps = useMemo(() => {
    return CompetencyEngine.computeGaps(scores, user?.designation || 'Statistical Officer');
  }, [scores, user]);

  return (
    <div>
      {/* Stepper Header */}
      <div className="card mb-6" style={{ background: 'var(--glass-bg)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
            <div style={{ opacity: step === 1 ? 1 : 0.6, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span className={`badge ${step === 1 ? 'badge-blue' : 'badge-green'}`}>1</span>
              <span className="font-semibold">Select Domain</span>
            </div>
            <span>→</span>
            <div style={{ opacity: step === 2 ? 1 : 0.6, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span className={`badge ${step === 2 ? 'badge-blue' : 'badge-green'}`}>2</span>
              <span className="font-semibold">Assessment</span>
            </div>
            <span>→</span>
            <div style={{ opacity: step === 3 ? 1 : 0.6, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span className={`badge ${step === 3 ? 'badge-blue' : 'badge-green'}`}>3</span>
              <span className="font-semibold">Skill Gap Analysis</span>
            </div>
          </div>
          {Object.keys(scores).length > 0 && (
            <button className="btn btn-outline btn-sm" onClick={handleReset}>Reset Profile</button>
          )}
        </div>
      </div>

      {/* PHASE 1: DOMAIN SELECTION */}
      {step === 1 && (
        <div>
          <div className="card mb-6">
            <h3 className="mb-2">🎯 FRAC Competency Profiling</h3>
            <p>Assess your skills against FRAC & NSSTA TPAC role target benchmarks for <b>{user?.designation || 'Statistical Officer'}</b>.</p>
          </div>

          <div className="grid-4 mb-6">
            {Object.entries(domains).map(([key, domain]) => {
              const hasScore = scores[key] !== undefined;
              const isSel = selectedDomain === key;
              return (
                <div
                  key={key}
                  className={`card cursor-pointer ${isSel ? 'card-glow-blue' : ''}`}
                  style={{
                    border: isSel ? '2px solid var(--blue-500)' : 'var(--border-glass)',
                    textAlign: 'center',
                    padding: '1.5rem'
                  }}
                  onClick={() => setSelectedDomain(key)}
                >
                  <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>{domain.emoji}</div>
                  <h4 style={{ fontSize: '1rem', marginBottom: '0.25rem' }}>{domain.label}</h4>
                  <div className="text-muted" style={{ fontSize: '0.8rem', marginBottom: '0.75rem' }}>
                    {CompetencyEngine.QUESTIONS[key].length} Questions
                  </div>
                  {hasScore ? (
                    <span className="badge badge-green">✓ {Math.round(scores[key] * 20)}% Score</span>
                  ) : (
                    <span className="badge badge-blue">Pending Assessment</span>
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex-center">
            <button className="btn btn-primary btn-lg" onClick={() => handleStart(selectedDomain)}>
              Start {domains[selectedDomain].shortLabel} Assessment →
            </button>
          </div>
        </div>
      )}

      {/* PHASE 2: QUESTIONS */}
      {step === 2 && (
        <div style={{ maxWidth: '720px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <span className="badge badge-blue">{domains[selectedDomain].emoji} {domains[selectedDomain].label}</span>
            <span className="text-muted" style={{ fontSize: '0.875rem' }}>
              Question {currentQIndex + 1} of {questions.length}
            </span>
          </div>

          {/* Progress bar */}
          <div style={{ display: 'flex', gap: '4px', marginBottom: '1.5rem' }}>
            {questions.map((_, i) => (
              <div
                key={i}
                style={{
                  flex: 1,
                  height: '4px',
                  borderRadius: '99px',
                  background: i < currentQIndex ? 'var(--blue-500)' : i === currentQIndex ? 'var(--saffron-500)' : 'rgba(255,255,255,0.1)'
                }}
              />
            ))}
          </div>

          {/* Question Card */}
          <div className="question-card mb-6">
            <div className="question-text">
              {currentQIndex + 1}. {questions[currentQIndex]?.q}
            </div>

            <div>
              {questions[currentQIndex]?.opts.map((opt, optIndex) => {
                const isSelected = answers[currentQIndex] === optIndex;
                return (
                  <div
                    key={optIndex}
                    className={`answer-option ${isSelected ? 'selected' : ''}`}
                    onClick={() => handleSelectAnswer(optIndex)}
                  >
                    <div className="answer-radio" />
                    <span>{['A','B','C','D','E'][optIndex]}. {opt}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Controls */}
          <div className="flex-between">
            <button className="btn btn-ghost" onClick={handlePrev} disabled={currentQIndex === 0}>
              ← Previous
            </button>
            <button
              className="btn btn-primary"
              onClick={handleNext}
              disabled={answers[currentQIndex] === -1 || answers[currentQIndex] === undefined}
            >
              {currentQIndex === questions.length - 1 ? 'Submit & Calculate Vector ✓' : 'Next →'}
            </button>
          </div>
        </div>
      )}

      {/* PHASE 3: RESULTS & GAP ANALYSIS */}
      {step === 3 && (
        <div>
          <div className="card mb-6 text-center" style={{ background: 'linear-gradient(135deg, rgba(59,130,246,0.1), rgba(139,92,246,0.05))', padding: '2.5rem' }}>
            <div style={{ fontSize: '3.5rem', marginBottom: '0.5rem' }}>🏆</div>
            <h2 className="mb-2">SkillVista Competency Profile Calculated!</h2>
            <p className="mb-4">Competency vector computed against <b>{user?.designation || 'Statistical Officer'}</b> role targets.</p>
            <div className="flex-center gap-3 flex-wrap">
              <button className="btn btn-primary" onClick={() => setCurrentPage('dashboard')}>Learner Dashboard</button>
              <button className="btn btn-saffron" onClick={() => setCurrentPage('courses')}>Personalised iGOT Pathways</button>
              <button className="btn btn-outline" onClick={() => setStep(1)}>Assess Another Domain</button>
            </div>
          </div>

          <div className="grid-4 mb-6">
            {Object.entries(domains).map(([key, domain]) => {
              const score = scores[key];
              const pct = score !== undefined ? Math.round(score * 20) : 0;
              const lvl = CompetencyEngine.getCompetencyLevel(score || 0);
              return (
                <div key={key} className="card text-center" style={{ borderTop: `3px solid ${domain.colorHex}` }}>
                  <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{domain.emoji}</div>
                  <div className="text-muted" style={{ fontSize: '0.8rem', marginBottom: '0.5rem' }}>{domain.shortLabel}</div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: '2.25rem', fontWeight: 800, color: domain.colorHex }}>
                    {score !== undefined ? `${pct}%` : 'Pending'}
                  </div>
                  <div className="progress-track mt-2 mb-2">
                    <div className={`progress-fill ${domain.color}`} style={{ width: `${pct}%` }} />
                  </div>
                  <span className={`badge badge-${lvl.color}`}>{lvl.label}</span>
                </div>
              );
            })}
          </div>

          <div className="card">
            <h3 className="card-title">🔍 Skill-Gap Vector Analysis</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {Object.entries(currentGaps).map(([key, gap]) => (
                <div key={key} style={{ padding: '1rem', background: 'var(--glass-bg)', border: 'var(--border-glass)', borderRadius: 'var(--radius-md)' }}>
                  <div className="flex-between mb-2">
                    <div style={{ fontWeight: 600 }}>{gap.shortLabel}</div>
                    <div>
                      {gap.gap > 0 ? (
                        <span className="badge badge-saffron">Competency Gap: {gap.gap} / 5</span>
                      ) : (
                        <span className="badge badge-green">✓ Target Benchmark Met</span>
                      )}
                    </div>
                  </div>
                  <div className="flex-between text-muted" style={{ fontSize: '0.8rem' }}>
                    <span>Present Level: {gap.current}/5 ({gap.pct_current}%)</span>
                    <span>Role Target: {gap.required}/5 ({gap.pct_required}%)</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ==========================================
// 2. AI QUIZ & MCQ GENERATOR VIEW (SkillVista)
// ==========================================
function QuizGeneratorView({ showToast }) {
  const [pasteText, setPasteText] = useState('');
  const [file, setFile] = useState(null);
  const [numQuestions, setNumQuestions] = useState(10);
  const [difficulty, setDifficulty] = useState('Medium');
  const [topic, setTopic] = useState('');
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState([]);

  // Quiz Player State
  const [inQuiz, setInQuiz] = useState(false);
  const [quizIndex, setQuizIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [showResults, setShowResults] = useState(false);

  const handleFileUpload = async (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;
    setFile(selectedFile);
    showToast(`File loaded: ${selectedFile.name}`, 'success');
    const text = await GeminiService.extractTextFromFile(selectedFile);
    if (text) setPasteText(text);
  };

  const handleGenerate = async () => {
    if (!pasteText || pasteText.trim().length < 50) {
      showToast('Please enter or upload at least 50 characters of learning material', 'warning');
      return;
    }

    setLoading(true);
    try {
      const generated = await GeminiService.generateMCQs(pasteText, numQuestions, difficulty, topic);
      setQuestions(generated);
      showToast(`Generated ${generated.length} Bloom-tagged MCQs using Gemini AI!`, 'success');
    } catch(err) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const startQuiz = () => {
    setUserAnswers(new Array(questions.length).fill(null));
    setQuizIndex(0);
    setShowResults(false);
    setInQuiz(true);
  };

  const selectQuizAnswer = (letter) => {
    const updated = [...userAnswers];
    updated[quizIndex] = letter;
    setUserAnswers(updated);
  };

  const score = useMemo(() => {
    return userAnswers.filter((ans, idx) => ans === questions[idx]?.correct).length;
  }, [userAnswers, questions]);

  return (
    <div>
      <div className="grid-2 mb-6" style={{ gap: '1.5rem', alignItems: 'start' }}>
        {/* Left Input */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="card">
            <h3 className="card-title">📤 Ingest Learning Material</h3>
            <input
              type="file"
              id="quiz-file-input"
              accept=".pdf,.txt,.doc,.docx"
              onChange={handleFileUpload}
              style={{ display: 'none' }}
            />
            <div
              className="upload-zone"
              onClick={() => document.getElementById('quiz-file-input').click()}
            >
              <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>📄</div>
              <div className="font-bold mb-1">{file ? file.name : 'Upload PDF, PPT, DOCX or Video Text'}</div>
              <div className="text-muted" style={{ fontSize: '0.8rem' }}>SkillVista Ingestion Engine Parses & Vectorizes Chunks</div>
            </div>
          </div>

          <div className="card">
            <h3 className="card-title">✍️ Direct Text Ingestion</h3>
            <textarea
              className="form-textarea"
              rows={6}
              placeholder="Paste training notes, NSSO survey manuals, CPI compilation guidelines, or MoSPI documents..."
              value={pasteText}
              onChange={(e) => setPasteText(e.target.value)}
            />
            <div className="text-right text-muted mt-2" style={{ fontSize: '0.75rem' }}>
              {pasteText.length} characters
            </div>
          </div>

          <div className="card">
            <h3 className="card-title">⚙️ Assessment Generation Controls</h3>
            <div className="grid-2 mb-4">
              <div>
                <label className="form-label">Questions</label>
                <select className="form-select" value={numQuestions} onChange={(e) => setNumQuestions(Number(e.target.value))}>
                  <option value={5}>5 Questions</option>
                  <option value={10}>10 Questions</option>
                  <option value={15}>15 Questions</option>
                </select>
              </div>
              <div>
                <label className="form-label">Difficulty</label>
                <select className="form-select" value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
                  <option value="Easy">Easy (Remember/Understand)</option>
                  <option value="Medium">Medium (Apply/Analyze)</option>
                  <option value="Hard">Hard (Evaluate/Design)</option>
                </select>
              </div>
            </div>
            <div className="mb-4">
              <label className="form-label">Topic Focus (Optional)</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Sampling design, CPI weights, DPDP Act"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
              />
            </div>
            <button className="btn btn-primary w-full" onClick={handleGenerate} disabled={loading}>
              {loading ? '🤖 Gemini Extracting Chunks & MCQs...' : '⚡ Generate Bloom-Tagged MCQs'}
            </button>
          </div>
        </div>

        {/* Right Output */}
        <div>
          {questions.length === 0 ? (
            <div className="card text-center" style={{ padding: '4rem 2rem' }}>
              <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🤖</div>
              <h3>SkillVista AI Assessment Engine Ready</h3>
              <p>Ingest learning materials on the left to generate auto-graded MCQs with citation references.</p>
            </div>
          ) : (
            <div>
              <div className="flex-between mb-4">
                <div>
                  <h3>Generated Items ({questions.length})</h3>
                  <span className="text-muted" style={{ fontSize: '0.8rem' }}>Difficulty: {difficulty} · Citations Included</span>
                </div>
                <div className="flex gap-2">
                  <button className="btn btn-saffron btn-sm" onClick={startQuiz}>▶ Deliver Adaptive Quiz</button>
                </div>
              </div>

              {questions.map((q, idx) => (
                <div key={idx} className="mcq-card mb-4">
                  <div style={{ fontWeight: 600, marginBottom: '0.75rem' }}>
                    Q{idx + 1}. {q.question}
                  </div>
                  <div>
                    {Object.entries(q.options).map(([key, val]) => (
                      <div key={key} className={`mcq-option ${q.correct === key ? 'correct' : ''}`}>
                        <div className="mcq-option-letter">{key}</div>
                        <span>{val}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mcq-explanation mt-2">
                    💡 <b>Explanation & Citation:</b> {q.explanation} {q.citation ? `[${q.citation}]` : ''}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quiz Modal */}
      {inQuiz && (
        <div className="modal-overlay">
          <div className="modal" style={{ maxWidth: '640px' }}>
            {!showResults ? (
              <div>
                <div className="flex-between mb-4">
                  <span className="badge badge-blue">Item {quizIndex + 1} of {questions.length}</span>
                  <button className="btn btn-ghost btn-sm" onClick={() => setInQuiz(false)}>×</button>
                </div>

                <div className="question-text mb-4">{questions[quizIndex]?.question}</div>

                <div>
                  {Object.entries(questions[quizIndex]?.options || {}).map(([key, val]) => {
                    const isSel = userAnswers[quizIndex] === key;
                    return (
                      <div
                        key={key}
                        className={`answer-option ${isSel ? 'selected' : ''}`}
                        onClick={() => selectQuizAnswer(key)}
                      >
                        <div className="answer-radio" />
                        <span><b>{key}.</b> {val}</span>
                      </div>
                    );
                  })}
                </div>

                <div className="flex-between mt-6">
                  <button className="btn btn-ghost" onClick={() => setQuizIndex(i => Math.max(0, i - 1))} disabled={quizIndex === 0}>
                    ← Prev
                  </button>
                  {quizIndex < questions.length - 1 ? (
                    <button className="btn btn-primary" onClick={() => setQuizIndex(i => i + 1)} disabled={!userAnswers[quizIndex]}>
                      Next →
                    </button>
                  ) : (
                    <button className="btn btn-saffron" onClick={() => setShowResults(true)} disabled={!userAnswers[quizIndex]}>
                      Finish Assessment 🏆
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center" style={{ padding: '2rem 1rem' }}>
                <div style={{ fontSize: '3.5rem', marginBottom: '0.5rem' }}>🏆</div>
                <h2 className="mb-2">Assessment Completed!</h2>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '3rem', fontWeight: 800, color: 'var(--green-400)', margin: '1rem 0' }}>
                  {score} / {questions.length}
                </div>
                <p className="mb-6">Score: {Math.round((score / questions.length) * 100)}%</p>
                <div className="flex-center gap-3">
                  <button className="btn btn-primary" onClick={startQuiz}>Retake Assessment</button>
                  <button className="btn btn-outline" onClick={() => setInQuiz(false)}>Close Player</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ==========================================
// 3. DASHBOARD VIEW (SkillVista)
// ==========================================
function DashboardView({ user, scores, enrolledIds, completedIds, setCurrentPage }) {
  const overall = CompetencyEngine.overallScore(scores);

  return (
    <div>
      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card blue">
          <div className="stat-icon blue">📊</div>
          <div className="stat-info">
            <div className="stat-value">{overall}%</div>
            <div className="stat-label">Competency Score</div>
            <div className="stat-change up">↑ SkillVista AI Vector</div>
          </div>
        </div>

        <div className="stat-card green">
          <div className="stat-icon green">✅</div>
          <div className="stat-info">
            <div className="stat-value">{completedIds.length}</div>
            <div className="stat-label">Completed Courses</div>
            <div className="stat-change up">↑ iGOT Progress</div>
          </div>
        </div>

        <div className="stat-card saffron">
          <div className="stat-icon saffron">📚</div>
          <div className="stat-info">
            <div className="stat-value">{enrolledIds.length}</div>
            <div className="stat-label">Enrolled Pathways</div>
            <div className="stat-change up">↑ Active Learning</div>
          </div>
        </div>

        <div className="stat-card purple">
          <div className="stat-icon purple">⏱️</div>
          <div className="stat-info">
            <div className="stat-value">{completedIds.length * 12 + enrolledIds.length * 4}h</div>
            <div className="stat-label">Learning Hours</div>
            <div className="stat-change up">↑ Mission Karmayogi</div>
          </div>
        </div>
      </div>

      <div className="grid-2 mb-6">
        <div className="card">
          <h3 className="card-title">🎯 FRAC Competency Vector</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {Object.entries(CompetencyEngine.DOMAINS).map(([key, dom]) => {
              const val = scores[key] ? Math.round(scores[key] * 20) : 0;
              return (
                <div key={key}>
                  <div className="flex-between mb-1" style={{ fontSize: '0.875rem' }}>
                    <span>{dom.emoji} {dom.shortLabel}</span>
                    <span className="font-bold">{val}%</span>
                  </div>
                  <div className="progress-track">
                    <div className={`progress-fill ${dom.color}`} style={{ width: `${val}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
          <button className="btn btn-outline w-full mt-6" onClick={() => setCurrentPage('assessment')}>
            Update Competency Assessment →
          </button>
        </div>

        <div className="card">
          <h3 className="card-title">🤖 Personalised iGOT Pathways</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {IgotService.COURSES.slice(0, 4).map(c => (
              <div key={c.id} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', background: 'var(--glass-bg)', border: 'var(--border-glass)', borderRadius: 'var(--radius-md)' }}>
                <div style={{ fontSize: '1.25rem' }}>📖</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: '0.85rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.title}</div>
                  <div className="text-muted" style={{ fontSize: '0.72rem' }}>{c.provider} · {c.level}</div>
                </div>
                <a href={c.igot_url} target="_blank" className="btn btn-sm btn-primary" style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem' }}>iGOT ↗</a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 4. COURSES VIEW
// ==========================================
function CoursesView({ scores, user, enrolledIds, completedIds, onEnroll, onComplete }) {
  const [filterDomain, setFilterDomain] = useState('all');

  const filtered = useMemo(() => {
    return IgotService.search('', filterDomain !== 'all' ? { domain: filterDomain } : {});
  }, [filterDomain]);

  return (
    <div>
      <div className="flex gap-2 mb-6" style={{ overflowX: 'auto', paddingBottom: '0.5rem' }}>
        <button className={`btn btn-sm ${filterDomain === 'all' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setFilterDomain('all')}>All Courses</button>
        <button className={`btn btn-sm ${filterDomain === 'statistical' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setFilterDomain('statistical')}>📊 Statistical</button>
        <button className={`btn btn-sm ${filterDomain === 'technical' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setFilterDomain('technical')}>💻 Technical</button>
        <button className={`btn btn-sm ${filterDomain === 'digital_gov' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setFilterDomain('digital_gov')}>🏛️ Digital Gov</button>
        <button className={`btn btn-sm ${filterDomain === 'behavioural' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setFilterDomain('behavioural')}>🤝 Behavioural</button>
      </div>

      <div className="grid-3 mb-6">
        {filtered.map(course => {
          const isDone = completedIds.includes(course.id);
          const isEnrolled = enrolledIds.includes(course.id);
          return (
            <div key={course.id} className="course-card">
              <div className={`course-card-accent ${course.domain === 'statistical' ? 'blue' : course.domain === 'technical' ? 'purple' : course.domain === 'digital_gov' ? 'teal' : 'saffron'}`} />
              <div className="course-card-header">
                <div className="course-icon">📖</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="course-title">{course.title}</div>
                  <div className="course-provider">by {course.provider}</div>
                </div>
              </div>
              <p style={{ fontSize: '0.8rem', minHeight: '40px', margin: '0.5rem 0' }}>{course.description}</p>
              <div className="course-actions">
                <span className="badge badge-blue">{course.level}</span>
                {isDone ? (
                  <span className="badge badge-green">✓ Completed</span>
                ) : isEnrolled ? (
                  <button className="btn btn-outline btn-sm" onClick={() => onComplete(course.id)}>Mark Complete</button>
                ) : (
                  <button className="btn btn-primary btn-sm" onClick={() => onEnroll(course.id)}>+ Enroll</button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ==========================================
// 5. IGOT INTEGRATION VIEW
// ==========================================
function IgotIntegrationView() {
  return (
    <div>
      <div className="card mb-6" style={{ background: 'linear-gradient(135deg, #1B4F72, #1A8F5E)', color: 'white' }}>
        <h2 style={{ color: 'white', marginBottom: '0.5rem' }}>🏛️ iGOT Karmayogi Official Adapter</h2>
        <p style={{ color: 'rgba(255,255,255,0.85)' }}>
          SkillVista acts as an intelligent companion layer over iGOT Karmayogi (serving 4.6M civil servants).
        </p>
        <div className="flex gap-3 mt-4 flex-wrap">
          <a href="https://igot.gov.in/app/home" target="_blank" className="btn btn-sm" style={{ background: 'white', color: '#1B4F72', fontWeight: 700 }}>Open iGOT Platform ↗</a>
          <a href="https://igot.gov.in/app/login" target="_blank" className="btn btn-sm btn-outline" style={{ color: 'white', borderColor: 'white' }}>iGOT SSO Login</a>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 6. ADMIN VIEW
// ==========================================
function AdminAnalyticsView() {
  return (
    <div>
      <div className="stats-grid mb-6">
        <div className="stat-card blue"><div className="stat-value">745</div><div className="stat-label">Total Officers</div></div>
        <div className="stat-card green"><div className="stat-value">68%</div><div className="stat-label">Avg Competency</div></div>
        <div className="stat-card saffron"><div className="stat-value">3,412</div><div className="stat-label">Completions</div></div>
        <div className="stat-card purple"><div className="stat-value">73%</div><div className="stat-label">iGOT Utilization</div></div>
      </div>
    </div>
  );
}

// ==========================================
// 7. SYSTEM ARCHITECTURE SHOWCASE VIEW
// ==========================================
function ArchitectureView() {
  return (
    <div>
      <div className="card mb-6" style={{ background: 'linear-gradient(135deg, rgba(59,130,246,0.12), rgba(139,92,246,0.08))', border: 'var(--border-blue)' }}>
        <h2 className="mb-2">⚡ SkillVista Architecture Overview</h2>
        <p>Solution Architecture for India's Official Statistical System Integrated with iGOT Karmayogi Ecosystem.</p>
      </div>

      <div className="grid-2 mb-6">
        <div className="card">
          <h3 className="card-title">🏛️ Architectural Principles</h3>
          <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.875rem' }}>
            <li><b>Cloud-Native & Event-Driven:</b> Independent microservices with Kafka & REST endpoints.</li>
            <li><b>FRAC Alignment:</b> Mapping roles, activities, and competencies to NSSTA/TPAC standards.</li>
            <li><b>iGOT Adapter Isolation:</b> Upstream changes in Sunbird do not break internal domain models.</li>
            <li><b>Government Security:</b> DPDP Act 2023, Parichay/e-Pramaan SSO, and MeghRaj Cloud compliance.</li>
          </ul>
        </div>

        <div className="card">
          <h3 className="card-title">🤖 AI / ML Pipeline</h3>
          <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.875rem' }}>
            <li><b>Competency Vector Scoring:</b> XGBoost fusion over HR metadata, self-ratings, and quiz telemetry.</li>
            <li><b>Hybrid Recommender:</b> Vector search (Qdrant) + LLM re-ranking (Llama / Sarvam Indic).</li>
            <li><b>MCQ Generation:</b> LayoutLMv3 ingestion ➔ Concept Mining ➔ Bloom-tagged questions with citations.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 8. GEMINI CHATBOT WIDGET
// ==========================================
function ChatbotWidget({ user, scores }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: '👋 Hello! I am SkillVista Assistant. Ask me about your competency gaps, iGOT courses, or statistical concepts!', type: 'bot' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userText = input.trim();
    setInput('');
    setMessages(prev => [...prev, { text: userText, type: 'user' }]);
    setLoading(true);

    try {
      const reply = await GeminiService.chatAssistant(userText);
      setMessages(prev => [...prev, { text: reply, type: 'bot' }]);
    } catch(e) {
      setMessages(prev => [...prev, { text: `⚠️ ${e.message}`, type: 'bot' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chatbot-widget">
      {open && (
        <div className="chatbot-panel">
          <div className="chatbot-header">
            <div className="chatbot-header-info">
              <div className="chatbot-avatar">🤖</div>
              <div>
                <div className="chatbot-name">SkillVista Assistant</div>
                <div className="chatbot-status">Powered by Gemini AI</div>
              </div>
            </div>
            <button className="chatbot-close" onClick={() => setOpen(false)}>×</button>
          </div>

          <div className="chatbot-messages">
            {messages.map((m, idx) => (
              <div key={idx} className={`chat-msg ${m.type}`}>{m.text}</div>
            ))}
            {loading && <div className="chat-msg bot">Thinking...</div>}
          </div>

          <div className="chatbot-input-area">
            <input
              type="text"
              className="chatbot-input"
              placeholder="Ask about courses, skills..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            />
            <button className="chatbot-send" onClick={handleSend}>➤</button>
          </div>
        </div>
      )}

      <button className="chatbot-toggle" onClick={() => setOpen(!open)}>🤖</button>
    </div>
  );
}
