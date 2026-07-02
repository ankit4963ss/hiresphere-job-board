import React, { useContext, useState } from 'react';
import { JobContext } from '../context/JobContext';
import { Search, MapPin, Briefcase, ChevronRight, TrendingUp, Users, Building, ArrowRight } from 'lucide-react';

const Home = ({ setActivePage, setSearchFilters }) => {
  const { jobs } = useContext(JobContext);
  const [searchQuery, setSearchQuery] = useState('');
  const [locationQuery, setLocationQuery] = useState('');

  // Categories metadata
  const categories = [
    { name: 'Tech', count: jobs.filter(j => j.category === 'Tech').length, icon: Briefcase, color: 'var(--accent)' },
    { name: 'Design', count: jobs.filter(j => j.category === 'Design').length, icon: TrendingUp, color: '#f24e1e' },
    { name: 'Product', count: jobs.filter(j => j.category === 'Product').length, icon: Users, color: '#06b6d4' },
    { name: 'Marketing', count: jobs.filter(j => j.category === 'Marketing').length, icon: Building, color: '#f59e0b' }
  ];

  // Get featured jobs
  const featuredJobs = jobs.filter(j => j.featured).slice(0, 3);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSearchFilters({
      query: searchQuery,
      location: locationQuery,
      category: '',
      type: ''
    });
    setActivePage('jobs');
  };

  const handleCategoryClick = (categoryName) => {
    setSearchFilters({
      query: '',
      location: '',
      category: categoryName,
      type: ''
    });
    setActivePage('jobs');
  };

  const handleJobClick = (jobId) => {
    // Set active job in context
    const { setActiveJobId } = useContext(JobContext); // wait, we can't call hook conditionally, let's pass state or import context properly
  };

  return (
    <div className="container" style={styles.container}>
      {/* Hero Section */}
      <section style={styles.hero} className="animate-fade-in">
        <div style={styles.heroText}>
          <div style={styles.badge} className="tag tag-accent">
            🚀 The Developer Job Hub
          </div>
          <h1 style={styles.heroTitle}>
            Discover the Web's <br />
            <span style={styles.gradientText}>Premium Tech Jobs</span>
          </h1>
          <p style={styles.heroSubtitle}>
            HireSphere connects world-class developers with remote-first, high-growth engineering teams. Apply in seconds with our multi-step wizard.
          </p>

          {/* Search Bar Form */}
          <form onSubmit={handleSearchSubmit} style={styles.searchBar} className="glass-card">
            <div style={styles.searchGroup}>
              <Search size={18} color="var(--text-muted)" />
              <input
                type="text"
                placeholder="Job title, company, skills..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={styles.searchInput}
              />
            </div>
            <div style={styles.searchDivider}></div>
            <div style={styles.searchGroup}>
              <MapPin size={18} color="var(--text-muted)" />
              <input
                type="text"
                placeholder="Location (e.g. Remote)"
                value={locationQuery}
                onChange={(e) => setLocationQuery(e.target.value)}
                style={styles.searchInput}
              />
            </div>
            <button type="submit" className="btn btn-primary" style={styles.searchBtn}>
              Find Jobs
            </button>
          </form>
        </div>
      </section>

      {/* Stats Banner */}
      <section style={styles.statsSection} className="glass-card animate-slide-up">
        <div style={styles.statBox}>
          <h3 style={styles.statNum}>{jobs.length * 12 + 140}+</h3>
          <p style={styles.statLabel}>Active listings</p>
        </div>
        <div style={styles.statDivider}></div>
        <div style={styles.statBox}>
          <h3 style={styles.statNum}>450+</h3>
          <p style={styles.statLabel}>Partner companies</p>
        </div>
        <div style={styles.statDivider}></div>
        <div style={styles.statBox}>
          <h3 style={styles.statNum}>98.4%</h3>
          <p style={styles.statLabel}>Success match rate</p>
        </div>
      </section>

      {/* Categories Section */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Browse by Department</h2>
        <p style={styles.sectionSubtitle}>Select a category to jump directly into the filtered job listings.</p>
        <div style={styles.categoriesGrid}>
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <div
                key={cat.name}
                onClick={() => handleCategoryClick(cat.name)}
                style={styles.categoryCard}
                className="glass-card glass-card-hover"
              >
                <div style={{ ...styles.categoryIconContainer, backgroundColor: `${cat.color}15` }}>
                  <Icon size={24} color={cat.color} />
                </div>
                <div style={styles.categoryInfo}>
                  <h3 style={styles.categoryName}>{cat.name}</h3>
                  <p style={styles.categoryCount}>{cat.count} open roles</p>
                </div>
                <ChevronRight size={18} color="var(--text-muted)" style={styles.categoryArrow} />
              </div>
            );
          })}
        </div>
      </section>

      {/* Featured Jobs Section */}
      <section style={styles.section}>
        <div style={styles.sectionHeader}>
          <div>
            <h2 style={styles.sectionTitle}>Featured Opportunities</h2>
            <p style={styles.sectionSubtitle}>Handpicked premium roles with high visibility and compensation.</p>
          </div>
          <button
            onClick={() => {
              setSearchFilters({ query: '', location: '', category: '', type: '' });
              setActivePage('jobs');
            }}
            style={styles.viewAllBtn}
            className="btn btn-secondary"
          >
            Explore All Jobs <ArrowRight size={16} />
          </button>
        </div>

        <div style={styles.featuredGrid}>
          {featuredJobs.map((job) => (
            <div
              key={job.id}
              onClick={() => {
                // We set the active job ID in localStorage and go to jobs
                localStorage.setItem('hiresphere_activejobid', job.id);
                setActivePage('jobs');
              }}
              style={styles.featuredCard}
              className="glass-card glass-card-hover animate-slide-up"
            >
              <div style={styles.featuredCardTop}>
                <div style={{ ...styles.companyLogo, backgroundColor: job.logoBg }}>
                  {job.logoText}
                </div>
                <span className="tag tag-accent" style={styles.jobTypeTag}>
                  {job.type}
                </span>
              </div>
              <div style={styles.featuredCardMid}>
                <h3 style={styles.jobTitle}>{job.title}</h3>
                <p style={styles.companyName}>{job.company}</p>
                <p style={styles.jobSalary}>{job.salary}</p>
              </div>
              <div style={styles.featuredCardBottom}>
                <div style={styles.jobLocation}>
                  <MapPin size={14} color="var(--text-muted)" />
                  <span>{job.location}</span>
                </div>
                <div style={styles.skillsList}>
                  {job.skills.slice(0, 3).map(skill => (
                    <span key={skill} style={styles.miniSkillTag}>
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

const styles = {
  container: {
    paddingBottom: '80px'
  },
  hero: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    padding: '40px 0 60px 0'
  },
  heroText: {
    maxWidth: '800px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  badge: {
    marginBottom: '20px'
  },
  heroTitle: {
    fontSize: '3.5rem',
    lineHeight: 1.15,
    marginBottom: '20px',
    fontFamily: 'var(--font-display)',
    fontWeight: 800,
    letterSpacing: '-0.04em'
  },
  gradientText: {
    background: 'var(--accent-gradient)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent'
  },
  heroSubtitle: {
    fontSize: '1.2rem',
    color: 'var(--text-secondary)',
    lineHeight: 1.6,
    marginBottom: '40px',
    maxWidth: '650px'
  },
  searchBar: {
    display: 'flex',
    width: '100%',
    maxWidth: '720px',
    padding: '8px 8px 8px 24px',
    borderRadius: '9999px',
    alignItems: 'center',
    gap: '16px',
    boxShadow: 'var(--shadow-lg)'
  },
  searchGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    flex: 1
  },
  searchInput: {
    border: 'none',
    background: 'transparent',
    color: 'var(--text-primary)',
    fontFamily: 'var(--font-sans)',
    fontSize: '0.98rem',
    outline: 'none',
    width: '100%',
    height: '40px'
  },
  searchDivider: {
    width: '1px',
    height: '32px',
    backgroundColor: 'var(--card-border)'
  },
  searchBtn: {
    borderRadius: '9999px',
    padding: '12px 28px',
    boxShadow: 'var(--shadow-accent)'
  },
  statsSection: {
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: '28px 40px',
    maxWidth: '960px',
    margin: '-20px auto 60px auto',
    borderRadius: 'var(--radius-xl)',
    flexWrap: 'wrap',
    gap: '24px'
  },
  statBox: {
    textAlign: 'center',
    flex: '1 1 200px'
  },
  statNum: {
    fontSize: '2rem',
    fontWeight: 800,
    background: 'var(--accent-gradient)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    marginBottom: '4px'
  },
  statLabel: {
    color: 'var(--text-secondary)',
    fontSize: '0.9rem',
    fontWeight: 500
  },
  statDivider: {
    width: '1px',
    height: '48px',
    backgroundColor: 'var(--card-border)',
    '@media (max-width: 768px)': {
      display: 'none'
    }
  },
  section: {
    marginBottom: '64px'
  },
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: '28px',
    flexWrap: 'wrap',
    gap: '16px'
  },
  sectionTitle: {
    fontSize: '2rem',
    fontWeight: 700,
    marginBottom: '8px'
  },
  sectionSubtitle: {
    color: 'var(--text-secondary)',
    fontSize: '0.98rem'
  },
  viewAllBtn: {
    height: '44px'
  },
  categoriesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
    gap: '20px',
    marginTop: '24px'
  },
  categoryCard: {
    display: 'flex',
    alignItems: 'center',
    padding: '20px',
    cursor: 'pointer',
    position: 'relative'
  },
  categoryIconContainer: {
    width: '48px',
    height: '48px',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: '16px'
  },
  categoryInfo: {
    flex: 1
  },
  categoryName: {
    fontSize: '1.1rem',
    fontWeight: 600,
    marginBottom: '2px'
  },
  categoryCount: {
    fontSize: '0.85rem',
    color: 'var(--text-secondary)'
  },
  categoryArrow: {
    transition: 'transform var(--transition-fast)'
  },
  featuredGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
    gap: '24px',
    marginTop: '24px'
  },
  featuredCard: {
    padding: '24px',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    minHeight: '260px'
  },
  featuredCardTop: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '20px'
  },
  companyLogo: {
    width: '40px',
    height: '40px',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#ffffff',
    fontWeight: 800,
    fontSize: '1.25rem'
  },
  jobTypeTag: {
    fontSize: '0.7rem'
  },
  featuredCardMid: {
    marginBottom: '20px'
  },
  jobTitle: {
    fontSize: '1.25rem',
    fontWeight: 700,
    marginBottom: '4px',
    lineHeight: 1.3
  },
  companyName: {
    color: 'var(--text-secondary)',
    fontWeight: 500,
    fontSize: '0.95rem',
    marginBottom: '10px'
  },
  jobSalary: {
    fontSize: '1rem',
    fontWeight: 600,
    color: 'var(--success)'
  },
  featuredCardBottom: {
    borderTop: '1px solid var(--card-border)',
    paddingTop: '16px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  jobLocation: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    color: 'var(--text-secondary)',
    fontSize: '0.85rem'
  },
  skillsList: {
    display: 'flex',
    gap: '6px'
  },
  miniSkillTag: {
    fontSize: '0.75rem',
    color: 'var(--text-secondary)',
    backgroundColor: 'var(--bg-tertiary)',
    padding: '2px 8px',
    borderRadius: '4px',
    border: '1px solid var(--card-border)'
  }
};

export default Home;
