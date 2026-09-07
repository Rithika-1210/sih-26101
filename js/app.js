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
      { id: 'dashboard', page: 'dashboard.html', label: 'Dashboard', icon: '📊' },
      { id: 'assessment', page: 'assessment.html', label: 'Competency Assessment', icon: '🎯' },
      { id: 'courses', page: 'courses.html', label: 'iGOT Courses', icon: '📚' },
      { id: 'quiz', page: 'quiz-generator.html', label: 'AI Quiz Generator', icon: '🤖' },
    ];

    if (isAdmin) {
      navItems.push({ id: 'admin', page: 'admin.html', label: 'Admin Analytics', icon: '📈' });
    }

    const normActive = (activePage || 'dashboard').toLowerCase().replace('.html', '');

    setTimeout(initMobileNav, 0);

    return `
      <div class="sidebar-logo">
        <div class="sidebar-logo-icon">🎓</div>
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
          return `
            <a href="${item.page}" class="nav-item ${isActive ? 'active' : ''}">
              <span style="font-size:1.15rem; flex-shrink:0;">${item.icon}</span>
              <span>${item.label}</span>
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
    timeAgo
  };

})();
