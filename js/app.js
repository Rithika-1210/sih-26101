/**
 * SkillVista — Core Application Utility & Auth Engine
 */

window.App = (function() {

  function login(userOrRole) {
    let user;
    if (typeof userOrRole === 'object' && userOrRole !== null) {
      const name = (userOrRole.name || 'Priya Sharma').trim();
      const parts = name.split(/\s+/);
      const avatar = parts.length >= 2 
        ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
        : name.substring(0, Math.min(2, name.length)).toUpperCase();

      const roleMap = { 'MoSPI Administrator': 'admin', 'NSSTA Faculty': 'trainer' };
      const role = userOrRole.role || roleMap[userOrRole.designation] || 'learner';

      user = {
        id: userOrRole.id || ('usr-' + Math.floor(100000 + Math.random() * 900000)),
        name: name,
        email: userOrRole.email || 'priya.sharma@mospi.gov.in',
        role: role,
        designation: userOrRole.designation || 'Statistical Officer',
        department: userOrRole.ministry || userOrRole.department || 'NSO Survey Operations Division',
        empId: userOrRole.empId || 'MOSPI/2026/00101',
        avatar: avatar || 'PS',
        joined: userOrRole.createdAt ? new Date(userOrRole.createdAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        ssoProvider: userOrRole.ssoProvider || 'Official Portal Login',
        profile: {
          experience: userOrRole.experience || 'Government Service',
          education: userOrRole.education || 'Official Qualification',
          location: userOrRole.centerState === 'state' ? 'State Office' : 'Central HQ'
        }
      };
    } else {
      user = {
        id: 'usr-officer-01',
        name: 'Priya Sharma',
        email: 'priya.sharma@mospi.gov.in',
        role: userOrRole || 'learner',
        designation: 'Statistical Officer',
        department: 'NSO Survey Operations Division',
        empId: 'MOSPI/2026/00101',
        avatar: 'PS',
        joined: new Date().toISOString().split('T')[0],
        ssoProvider: 'Official Portal',
        profile: { experience: 'Government Service', education: 'Official Qualification', location: 'New Delhi' }
      };
    }
    Store.set('current_user', user);
    Store.set('login_time', new Date().toISOString());
    try { localStorage.setItem('sv_session', JSON.stringify(user)); } catch(e) {}
    return user;
  }

  function logout() {
    Store.remove('current_user');
    try { localStorage.removeItem('sv_session'); } catch(e) {}
  }

  function getCurrentUser() {
    let u = Store.get('current_user', null);
    if (!u) {
      try {
        const raw = localStorage.getItem('sv_session');
        if (raw) u = JSON.parse(raw);
      } catch(e) {}
    }
    return u;
  }

  function requireAuth() {
    let u = getCurrentUser();
    if (!u) {
      u = {
        name: 'Priya Sharma',
        email: 'priya.sharma@mospi.gov.in',
        designation: 'Statistical Officer',
        department: 'NSO Survey Operations Division',
        avatar: 'PS',
        role: 'learner'
      };
      Store.set('current_user', u);
      try { localStorage.setItem('sv_session', JSON.stringify(u)); } catch(e) {}
    }
    return u;
  }

  function toggleMobileSidebar(open) {
    const sb = document.getElementById('sidebar');
    if (!sb) return;
    let overlay = document.getElementById('sidebar-overlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'sidebar-overlay';
      overlay.className = 'sidebar-overlay';
      overlay.onclick = () => toggleMobileSidebar(false);
      document.body.appendChild(overlay);
    }

    if (open === undefined) {
      open = !sb.classList.contains('mobile-open');
    }

    if (open) {
      sb.classList.add('mobile-open');
      overlay.classList.add('active');
    } else {
      sb.classList.remove('mobile-open');
      overlay.classList.remove('active');
    }
  }

  function initMobileNav() {
    const header = document.querySelector('.page-header');
    if (header && !header.querySelector('.mobile-menu-btn')) {
      const btn = document.createElement('button');
      btn.className = 'mobile-menu-btn btn-icon';
      btn.setAttribute('title', 'Toggle Navigation Menu');
      btn.onclick = () => toggleMobileSidebar();
      btn.innerHTML = `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>`;
      
      const firstChild = header.firstElementChild;
      if (firstChild) {
        firstChild.style.display = 'flex';
        firstChild.style.alignItems = 'center';
        firstChild.style.gap = '0.75rem';
        firstChild.insertBefore(btn, firstChild.firstElementChild);
      } else {
        header.prepend(btn);
      }
    }
  }

  function getSidebarHTML(activePage = 'dashboard') {
    const u = getCurrentUser() || requireAuth();
    const isAdmin = u && (u.role === 'admin' || u.role === 'trainer' || (u.designation && u.designation.includes('Admin')));

    const navItems = [
      {
        id: 'dashboard',
        page: 'dashboard.html',
        label: 'Dashboard',
        icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="9" rx="1"/><rect x="14" y="3" width="7" height="5" rx="1"/><rect x="14" y="12" width="7" height="9" rx="1"/><rect x="3" y="16" width="7" height="5" rx="1"/></svg>`
      },
      {
        id: 'assessment',
        page: 'assessment.html',
        label: 'Competency Assessment',
        icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>`
      },
      {
        id: 'courses',
        page: 'courses.html',
        label: 'iGOT Courses',
        icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>`
      },
      {
        id: 'quiz',
        page: 'quiz-generator.html',
        label: 'AI Quiz Generator',
        icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a2 2 0 0 1 2 2v2h2a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h2V4a2 2 0 0 1 2-2z"/><circle cx="9" cy="11" r="1"/><circle cx="15" cy="11" r="1"/><path d="M10 15h4"/></svg>`
      },
      {
        id: 'module-assessment',
        page: 'module-assessment.html',
        label: 'Module Assessment',
        icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>`
      },
      {
        id: 'mcq-generator',
        page: 'mcq-generator.html',
        label: 'Subject MCQ Test',
        icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>`
      },
    ];

    if (isAdmin) {
      navItems.push({
        id: 'admin',
        page: 'admin.html',
        label: 'Admin Analytics',
        icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>`
      });
    }

    const normActive = (activePage || 'dashboard').toLowerCase().replace('.html', '');

    setTimeout(initMobileNav, 0);

    return `
      <div class="sidebar-logo">
        <div class="sidebar-logo-icon" style="display:flex;align-items:center;justify-content:center;color:#0D9488;">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
        </div>
        <div style="flex:1;">
          <div class="sidebar-logo-text">Skill<span style="color:#F97316">Vista</span></div>
          <div class="sidebar-logo-sub">MOSPI · IGOT ECOSYSTEM</div>
        </div>
        <button onclick="App.toggleMobileSidebar(false)" class="sidebar-mobile-close" title="Close Menu">×</button>
      </div>

      <nav class="sidebar-nav">
        <div class="sidebar-section-label">PLATFORM NAVIGATION</div>
        ${navItems.map(item => {
          const isActive = (normActive === item.id || normActive === item.page.replace('.html', ''));
          const isIgot = item.id === 'courses';
          const greenStyle = isIgot ? 'color:#10B981 !important; font-weight:700;' : '';
          return `
            <a href="${item.page}" class="nav-item ${isActive ? 'active' : ''}" style="${greenStyle}">
              <span style="display:flex;align-items:center;justify-content:center;width:20px;flex-shrink:0;${isIgot ? 'color:#10B981 !important;' : ''}">${item.icon}</span>
              <span style="${greenStyle}">${item.label}</span>
              ${item.badge ? `<span class="badge badge-green" style="margin-left:auto; font-size:0.6rem; padding:1px 6px; font-weight:700;">${item.badge}</span>` : ''}
            </a>
          `;
        }).join('')}
      </nav>

      <div class="sidebar-footer">
        <div class="sidebar-user ${normActive === 'profile' ? 'active' : ''}" onclick="window.location.href='profile.html'" style="cursor:pointer;" title="Click to view & edit your profile & iGOT certificates">
          <div class="user-avatar" style="background:linear-gradient(135deg,#2563EB,#7C3AED); font-weight:700; overflow:hidden;">
            ${u.photoUrl ? `<img src="${u.photoUrl}" style="width:100%;height:100%;object-fit:cover;">` : (u.avatar || (u.name ? u.name[0].toUpperCase() : 'PS'))}
          </div>
          <div style="flex:1; min-width:0;">
            <div class="user-name" style="white-space:nowrap; overflow:hidden; text-overflow:ellipsis;" title="${u.name || 'Priya Sharma'}">${u.name || 'Priya Sharma'}</div>
            <div class="user-role" style="white-space:nowrap; overflow:hidden; text-overflow:ellipsis;" title="${u.designation || 'Statistical Officer'}">${u.designation || 'Statistical Officer'}</div>
          </div>
          <button onclick="event.stopPropagation(); App.logout(); window.location.href='index.html';" class="sb-logout-btn" title="Sign Out">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
          </button>
        </div>
      </div>
    `;
  }

  function updateProfile(updatedFields) {
    let u = getCurrentUser() || requireAuth();
    Object.assign(u, updatedFields);
    if (updatedFields.department) u.ministry = updatedFields.department;
    if (updatedFields.ministry) u.department = updatedFields.ministry;
    
    if (updatedFields.name) {
      const parts = updatedFields.name.trim().split(/\s+/);
      u.avatar = parts.length >= 2 
        ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
        : updatedFields.name.substring(0, Math.min(2, updatedFields.name.length)).toUpperCase();
    }

    if (!u.profile) u.profile = {};
    if (updatedFields.experience) u.profile.experience = updatedFields.experience;
    if (updatedFields.education) u.profile.education = updatedFields.education;
    if (updatedFields.location) u.profile.location = updatedFields.location;
    if (updatedFields.phone) u.profile.phone = updatedFields.phone;

    Store.set('current_user', u);
    try { localStorage.setItem('sv_session', JSON.stringify(u)); } catch(e) {}
    return u;
  }

  const DEFAULT_CERTIFICATES = [
    {
      id: 'cert-1',
      title: 'Fundamentals of Official Statistics & Data Systems',
      provider: 'NSSTA',
      date: '2026-01-15',
      score: '92%',
      certUrl: 'https://igot.gov.in/app/profile/myCourses',
      photoUrl: '',
      verified: true
    },
    {
      id: 'cert-2',
      title: 'Ethics, Integrity & Anti-Corruption in Governance',
      provider: 'iGOT Karmayogi',
      date: '2025-11-20',
      score: '88%',
      certUrl: 'https://igot.gov.in/app/profile/myCourses',
      photoUrl: '',
      verified: true
    },
    {
      id: 'cert-3',
      title: 'National Accounts Statistics & GDP Estimation',
      provider: 'MoSPI / DIID',
      date: '2025-08-10',
      score: '95%',
      certUrl: 'https://igot.gov.in/app/profile/myCourses',
      photoUrl: '',
      verified: true
    }
  ];

  function getCertificates() {
    try {
      const raw = localStorage.getItem('sv_certificates');
      if (raw) return JSON.parse(raw);
    } catch(e) {}
    try { localStorage.setItem('sv_certificates', JSON.stringify(DEFAULT_CERTIFICATES)); } catch(e) {}
    return DEFAULT_CERTIFICATES;
  }

  function saveCertificates(certs) {
    try { localStorage.setItem('sv_certificates', JSON.stringify(certs)); } catch(e) {}
  }

  function addCertificate(cert) {
    const certs = getCertificates();
    const newCert = {
      id: 'cert-' + Date.now(),
      title: cert.title || 'Official iGOT Course',
      provider: cert.provider || 'iGOT Karmayogi',
      date: cert.date || new Date().toISOString().split('T')[0],
      score: cert.score ? cert.score + '%' : 'Passed',
      certUrl: cert.certUrl || 'https://igot.gov.in/app/profile/myCourses',
      photoUrl: cert.photoUrl || '',
      verified: true
    };
    certs.unshift(newCert);
    saveCertificates(certs);
    return certs;
  }

  function removeCertificate(certId) {
    let certs = getCertificates();
    certs = certs.filter(c => c.id !== certId);
    saveCertificates(certs);
    return certs;
  }

  function formatDate(iso) {
    if (!iso) return '—';
    return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  }

  function timeAgo(iso) {
    const diff = Date.now() - new Date(iso).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'just now';
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  }

  function initUniversalChatbot() {
    let widget = document.querySelector('.chatbot-widget');
    if (!widget) {
      widget = document.createElement('div');
      widget.className = 'chatbot-widget';
      document.body.appendChild(widget);
    }
    
    // Inject clean unified SkillVista widget HTML
    widget.innerHTML = `
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

        <div id="chat-messages-container" class="chatbot-messages"></div>

        <div class="chatbot-input-area">
          <input type="text" id="chat-input-field" class="chatbot-input" placeholder="Ask SkillVista about this page or courses...">
          <button id="chat-send-btn" class="chatbot-send">➤</button>
        </div>
      </div>

      <button id="chatbot-toggle-btn" class="chatbot-toggle" title="Ask SkillVista" style="display:flex;align-items:center;justify-content:center;">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a2 2 0 0 1 2 2v2h2a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h2V4a2 2 0 0 1 2-2z"/><circle cx="9" cy="11" r="1"/><circle cx="15" cy="11" r="1"/><path d="M10 15h4"/></svg>
      </button>
    `;

    bindUniversalChatbotEvents();
  }

  function bindUniversalChatbotEvents() {
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

    // Restore Chat History
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

    // Restore Panel State
    if (isPanelOpen()) {
      panel.classList.remove('hidden');
    } else {
      panel.classList.add('hidden');
    }

    if (chatInput) {
      chatInput.disabled = false;
      chatInput.readOnly = false;
    }

    if (toggleBtn) {
      toggleBtn.onclick = (e) => {
        if (e) e.stopPropagation();
        const nowHidden = panel.classList.contains('hidden');
        if (nowHidden) {
          panel.classList.remove('hidden');
          setPanelOpen(true);
          if (chatInput) setTimeout(() => chatInput.focus(), 50);
        } else {
          panel.classList.add('hidden');
          setPanelOpen(false);
        }
      };
    }

    if (closeBtn) {
      closeBtn.onclick = (e) => {
        if (e) e.stopPropagation();
        panel.classList.add('hidden');
        setPanelOpen(false);
      };
    }

    if (panel) {
      panel.onclick = (e) => e.stopPropagation();
    }

    const sendChatMessage = async () => {
      if (!chatInput || !chatInput.value.trim()) return;
      const text = chatInput.value.trim();
      chatInput.value = '';

      const uMsg = document.createElement('div');
      uMsg.className = 'chat-msg user';
      uMsg.textContent = text;
      msgsContainer.appendChild(uMsg);
      saveHistoryItem('user', text);

      const loadingMsg = document.createElement('div');
      loadingMsg.className = 'chat-msg bot';
      loadingMsg.textContent = 'Analyzing page & generating answer...';
      msgsContainer.appendChild(loadingMsg);
      msgsContainer.scrollTop = msgsContainer.scrollHeight;

      let replyText = '';
      try {
        const u = getCurrentUser() || {};
        const pageContext = {
          pageId: 'standalone',
          pageTitle: document.title || 'SkillVista Page',
          user: { name: u.name, designation: u.designation, ministry: u.department, email: u.email },
          overallScore: 78,
          visibleText: (document.querySelector('.page-body') || document.body).innerText.slice(0, 3000)
        };
        if (window.GeminiService && typeof GeminiService.chatAssistant === 'function') {
          replyText = await GeminiService.chatAssistant(text, pageContext);
        } else {
          replyText = `Based on your current page (**${document.title || 'SkillVista'}**):\n\n` +
                     `Regarding **"${text}"**:\n\n` +
                     `• **Officer**: ${u.name || 'Officer'}\n` +
                     `• **Current View**: ${document.title || 'SkillVista Page'}\n\n` +
                     `👉 [Study Courses on iGOT Karmayogi Portal](https://www.igotkarmayogi.gov.in)`;
        }
      } catch(err) {
        replyText = `Regarding **"${text}"**:\n\n👉 [Study Courses on iGOT Karmayogi Portal](https://www.igotkarmayogi.gov.in)`;
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

  // Auto initialize on DOM ready
  if (typeof window !== 'undefined') {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => setTimeout(initUniversalChatbot, 150));
    } else {
      setTimeout(initUniversalChatbot, 150);
    }
  }

  return {
    login,
    logout,
    getCurrentUser,
    requireAuth,
    getSidebarHTML,
    toggleMobileSidebar,
    initMobileNav,
    updateProfile,
    getCertificates,
    addCertificate,
    removeCertificate,
    formatDate,
    timeAgo,
    initUniversalChatbot
  };

})();

