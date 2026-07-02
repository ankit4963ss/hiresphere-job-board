import React, { useContext, useState, useEffect } from 'react';
import { JobContext } from '../context/JobContext';
import { Sun, Moon, Briefcase, PlusCircle, LayoutDashboard, Menu, X, ArrowRight } from 'lucide-react';

const Layout = ({ children, activePage, setActivePage }) => {
  const { userType, toggleUserType } = useContext(JobContext);
  const [theme, setTheme] = useState(() => localStorage.getItem('hiresphere_theme') || 'dark');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('hiresphere_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const navItems = [
    { id: 'home', label: 'Explore', icon: Briefcase },
    { id: 'jobs', label: 'Jobs', icon: Briefcase },
    ...(userType === 'employer'
      ? [{ id: 'post-job', label: 'Post Job', icon: PlusCircle }]
      : []),
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', width: '100%' }}>
      {/* Header Nav */}
      <header style={styles.header} className="glass-card animate-fade-in">
        <div className="container" style={styles.navContainer}>
          {/* Logo */}
          <div style={styles.logo} onClick={() => setActivePage('home')}>
            <div style={styles.logoIcon}>
              <Briefcase size={20} color="#ffffff" />
            </div>
            <span>HireSphere</span>
          </div>

          {/* Desktop Nav Items */}
          <nav className="header-nav" style={styles.desktopNav}>
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = activePage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActivePage(item.id)}
                  style={{
                    ...styles.navLink,
                    color: isActive ? 'var(--accent)' : 'var(--text-secondary)',
                    borderBottom: isActive ? '2px solid var(--accent)' : '2px solid transparent'
                  }}
                  className="nav-btn-hover"
                >
                  <Icon size={16} />
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Controls (Theme, Role, Mobile Toggle) */}
          <div style={styles.controls}>
            {/* Role Switcher Toggle */}
            <div style={styles.roleToggleContainer} className="glass-card">
              <button
                onClick={toggleUserType}
                style={{
                  ...styles.roleButton,
                  backgroundColor: userType === 'candidate' ? 'var(--accent)' : 'transparent',
                  color: userType === 'candidate' ? '#ffffff' : 'var(--text-secondary)'
                }}
              >
                Candidate
              </button>
              <button
                onClick={toggleUserType}
                style={{
                  ...styles.roleButton,
                  backgroundColor: userType === 'employer' ? 'var(--accent)' : 'transparent',
                  color: userType === 'employer' ? '#ffffff' : 'var(--text-secondary)'
                }}
              >
                Employer
              </button>
            </div>

            {/* Theme Toggle Button */}
            <button onClick={toggleTheme} style={styles.controlBtn} className="btn-secondary">
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {/* Mobile Menu Icon */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              style={styles.mobileMenuBtn}
              className="btn-secondary mobile-toggle"
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div style={styles.mobileDrawer} className="glass-card animate-slide-up">
            <div style={styles.mobileDrawerContent}>
              {navItems.map(item => {
                const Icon = item.icon;
                const isActive = activePage === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActivePage(item.id);
                      setIsMobileMenuOpen(false);
                    }}
                    style={{
                      ...styles.mobileNavLink,
                      backgroundColor: isActive ? 'var(--accent-light)' : 'transparent',
                      color: isActive ? 'var(--accent)' : 'var(--text-primary)',
                      borderLeft: isActive ? '4px solid var(--accent)' : '4px solid transparent'
                    }}
                  >
                    <Icon size={18} />
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </header>

      {/* Main Content Area */}
      <main style={styles.mainContent} className="animate-fade-in">
        {children}
      </main>

      {/* Footer */}
      <footer style={styles.footer} className="glass-card">
        <div className="container" style={styles.footerContainer}>
          <div style={styles.footerBrand}>
            <div style={styles.logo}>
              <div style={styles.logoIcon}>
                <Briefcase size={18} color="#ffffff" />
              </div>
              <span>HireSphere</span>
            </div>
            <p style={styles.footerDesc}>
              Connecting world-class developers with premium, high-growth technology companies.
            </p>
          </div>

          <div style={styles.footerLinksGroup}>
            <div style={styles.footerLinkCol}>
              <h4 style={styles.footerHeader}>Platform</h4>
              <span style={styles.footerLink} onClick={() => setActivePage('jobs')}>Find Jobs</span>
              <span style={styles.footerLink} onClick={() => setActivePage('dashboard')}>Dashboard</span>
              <span style={styles.footerLink} onClick={() => setActivePage('post-job')}>Post a Job</span>
            </div>
            <div style={styles.footerLinkCol}>
              <h4 style={styles.footerHeader}>Role</h4>
              <span style={styles.footerLink} onClick={toggleUserType}>
                Active: {userType === 'candidate' ? 'Candidate Mode' : 'Employer Mode'}
              </span>
              <span style={styles.footerLink} onClick={toggleTheme}>
                Toggle {theme === 'dark' ? 'Light Theme' : 'Dark Theme'}
              </span>
            </div>
          </div>
        </div>
        <div style={styles.footerBottom}>
          <p>© 2026 HireSphere. Built for excellence. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

const styles = {
  header: {
    position: 'sticky',
    top: 0,
    zIndex: 100,
    borderRadius: '0px 0px 16px 16px',
    borderTop: 'none',
    borderLeft: 'none',
    borderRight: 'none',
    height: '76px',
    display: 'flex',
    alignItems: 'center',
    width: '100%'
  },
  navContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: '100%'
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    cursor: 'pointer',
    fontSize: '1.25rem',
    fontWeight: 800,
    fontFamily: 'var(--font-display)',
    letterSpacing: '-0.03em',
    background: 'var(--accent-gradient)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent'
  },
  logoIcon: {
    width: '32px',
    height: '32px',
    borderRadius: '8px',
    background: 'var(--accent-gradient)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  desktopNav: {
    display: 'flex',
    gap: '24px',
    alignItems: 'center',
    height: '100%',
    '@media (max-width: 768px)': {
      display: 'none'
    }
  },
  navLink: {
    background: 'none',
    border: 'none',
    height: '100%',
    padding: '0 8px',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    fontWeight: 600,
    fontSize: '0.92rem',
    cursor: 'pointer',
    fontFamily: 'var(--font-display)',
    transition: 'all var(--transition-fast)'
  },
  controls: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  roleToggleContainer: {
    display: 'flex',
    padding: '3px',
    borderRadius: '9999px',
    gap: '2px',
    border: '1px solid var(--card-border)'
  },
  roleButton: {
    padding: '6px 14px',
    border: 'none',
    borderRadius: '9999px',
    fontSize: '0.82rem',
    fontWeight: 600,
    cursor: 'pointer',
    fontFamily: 'var(--font-display)',
    transition: 'all var(--transition-normal)'
  },
  controlBtn: {
    width: '38px',
    height: '38px',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '1px solid var(--card-border)',
    background: 'var(--bg-tertiary)',
    color: 'var(--text-primary)',
    cursor: 'pointer',
    transition: 'all var(--transition-fast)'
  },
  mobileMenuBtn: {
    display: 'none',
    width: '38px',
    height: '38px',
    borderRadius: '10px',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    border: '1px solid var(--card-border)'
  },
  mobileDrawer: {
    position: 'absolute',
    top: '76px',
    left: 0,
    right: 0,
    borderTop: 'none',
    borderLeft: 'none',
    borderRight: 'none',
    borderRadius: '0 0 16px 16px',
    padding: '16px 24px',
    boxShadow: 'var(--shadow-lg)'
  },
  mobileDrawerContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  mobileNavLink: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 16px',
    borderRadius: '10px',
    border: 'none',
    fontSize: '0.98rem',
    fontWeight: 600,
    cursor: 'pointer',
    width: '100%',
    textAlign: 'left',
    fontFamily: 'var(--font-display)',
    transition: 'all var(--transition-fast)'
  },
  mainContent: {
    flex: 1,
    width: '100%',
    padding: '40px 0',
    backgroundColor: 'var(--bg-primary)'
  },
  footer: {
    borderBottom: 'none',
    borderLeft: 'none',
    borderRight: 'none',
    borderRadius: '16px 16px 0 0',
    padding: '48px 0 24px 0',
    width: '100%'
  },
  footerContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '40px',
    flexWrap: 'wrap',
    marginBottom: '32px'
  },
  footerBrand: {
    flex: '1 1 320px'
  },
  footerDesc: {
    color: 'var(--text-secondary)',
    fontSize: '0.92rem',
    marginTop: '16px',
    maxWidth: '340px'
  },
  footerLinksGroup: {
    display: 'flex',
    gap: '64px',
    flexWrap: 'wrap'
  },
  footerLinkCol: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  footerHeader: {
    fontSize: '0.98rem',
    fontWeight: 700,
    marginBottom: '4px',
    fontFamily: 'var(--font-display)'
  },
  footerLink: {
    color: 'var(--text-secondary)',
    fontSize: '0.9rem',
    cursor: 'pointer',
    transition: 'color var(--transition-fast)'
  },
  footerBottom: {
    borderTop: '1px solid var(--card-border)',
    paddingTop: '24px',
    textAlign: 'center',
    color: 'var(--text-muted)',
    fontSize: '0.84rem'
  }
};

export default Layout;
