import React, { useContext, useState } from 'react';
import { JobContext } from '../context/JobContext';
import { Bookmark, FileText, ChevronRight, Mail, Phone, Calendar, ArrowRight, UserCheck, CheckCircle2, UserPlus, Info } from 'lucide-react';

const Dashboard = ({ setActivePage }) => {
  const {
    userType,
    jobs,
    applications,
    bookmarks,
    toggleBookmark,
    updateApplicationStatus
  } = useContext(JobContext);

  const [expandedAppId, setExpandedAppId] = useState(null);

  // CANDIDATE SELECTORS
  const savedJobs = jobs.filter(job => bookmarks.includes(job.id));
  
  // Kanban columns configuration
  const kanbanColumns = [
    { title: 'Applied', status: 'Applied', color: 'var(--accent)' },
    { title: 'In Review', status: 'Reviewing', color: 'var(--info)' },
    { title: 'Interviewing', status: 'Interviewing', color: 'var(--warning)' },
    { title: 'Offered 🎉', status: 'Offered', color: 'var(--success)' }
  ];

  const getApplicationsByStatus = (status) => {
    return applications.filter(app => app.status === status);
  };

  // EMPLOYER SELECTORS
  // Employer sees applicants for all jobs or jobs they posted
  // For this local demo, we show all applicants and group them by job
  const handleStatusChange = (appId, newStatus) => {
    updateApplicationStatus(appId, newStatus);
  };

  const toggleExpandApplicant = (appId) => {
    setExpandedAppId(prev => (prev === appId ? null : appId));
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="container" style={styles.container}>
      {/* Dashboard Title Banner */}
      <div style={styles.pageHeader}>
        <div>
          <h1 style={styles.pageTitle}>
            {userType === 'candidate' ? 'Candidate Dashboard' : 'Employer Workspace'}
          </h1>
          <p style={styles.pageSubtitle}>
            {userType === 'candidate'
              ? 'Manage your job applications and saved bookmarks.'
              : 'Review applicants, screen credentials, and update pipeline stages.'}
          </p>
        </div>
      </div>

      {/* ================= CANDIDATE DASHBOARD VIEW ================= */}
      {userType === 'candidate' && (
        <div style={styles.candidateGrid}>
          
          {/* Left Column: Kanban Board of Applications */}
          <div style={styles.boardColumn}>
            <h2 style={styles.sectionTitle}>Application Pipeline</h2>
            
            <div style={styles.kanbanBoard}>
              {kanbanColumns.map(col => {
                const columnApps = getApplicationsByStatus(col.status);
                return (
                  <div key={col.title} style={styles.kanbanCol} className="glass-card">
                    {/* Header */}
                    <div style={{ ...styles.kanbanColHeader, borderBottom: `2px solid ${col.color}` }}>
                      <span style={styles.colTitle}>{col.title}</span>
                      <span style={{ ...styles.colCount, backgroundColor: `${col.color}20`, color: col.color }}>
                        {columnApps.length}
                      </span>
                    </div>

                    {/* Cards Container */}
                    <div style={styles.kanbanColCards}>
                      {columnApps.length > 0 ? (
                        columnApps.map(app => {
                          const associatedJob = jobs.find(j => j.id === app.jobId);
                          return (
                            <div key={app.id} style={styles.kanbanCard} className="glass-card animate-slide-up">
                              <h4 style={styles.kanbanCardRole}>{app.role}</h4>
                              <p style={styles.kanbanCardCompany}>
                                {associatedJob ? associatedJob.company : 'Engineering Company'}
                              </p>
                              
                              <div style={styles.kanbanCardFooter}>
                                <div style={styles.kanbanCardDate}>
                                  <Calendar size={12} color="var(--text-muted)" />
                                  <span>{formatDate(app.appliedDate)}</span>
                                </div>
                                <span className="tag" style={{
                                  fontSize: '0.62rem',
                                  padding: '2px 6px',
                                  backgroundColor: `${col.color}15`,
                                  color: col.color
                                }}>
                                  {app.status}
                                </span>
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <div style={styles.emptyKanbanCol}>
                          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Empty stage</p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Bookmarks Sidebar */}
          <div style={styles.sidebarColumn}>
            <h2 style={styles.sectionTitle}>Saved Opportunities</h2>
            <div style={styles.bookmarksContainer}>
              {savedJobs.length > 0 ? (
                savedJobs.map(job => (
                  <div
                    key={job.id}
                    onClick={() => {
                      localStorage.setItem('hiresphere_activejobid', job.id);
                      setActivePage('jobs');
                    }}
                    style={styles.bookmarkCard}
                    className="glass-card glass-card-hover animate-slide-up"
                  >
                    <div style={styles.bookmarkLeft}>
                      <div style={{ ...styles.bookmarkLogo, backgroundColor: job.logoBg }}>
                        {job.logoText}
                      </div>
                      <div>
                        <h4 style={styles.bookmarkTitle}>{job.title}</h4>
                        <p style={styles.bookmarkCompany}>{job.company} • <span style={{ color: 'var(--success)' }}>{job.salary}</span></p>
                      </div>
                    </div>
                    <ChevronRight size={18} color="var(--text-secondary)" />
                  </div>
                ))
              ) : (
                <div style={styles.emptyBookmarks} className="glass-card">
                  <Bookmark size={32} color="var(--text-muted)" style={{ marginBottom: '12px' }} />
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>No saved jobs</p>
                  <button
                    onClick={() => setActivePage('jobs')}
                    className="btn btn-secondary"
                    style={{ marginTop: '14px', fontSize: '0.82rem' }}
                  >
                    Browse Directory
                  </button>
                </div>
              )}
            </div>
          </div>

        </div>
      )}

      {/* ================= EMPLOYER WORKSPACE VIEW ================= */}
      {userType === 'employer' && (
        <div style={styles.employerLayout}>
          <div style={styles.sectionHeaderRow}>
            <h2 style={styles.sectionTitle}>Review Candidates ({applications.length})</h2>
            <button onClick={() => setActivePage('post-job')} className="btn btn-primary" style={{ fontSize: '0.88rem' }}>
              <UserPlus size={16} /> Post a New Role
            </button>
          </div>

          {applications.length > 0 ? (
            <div style={styles.applicantsList}>
              {applications.map((app) => {
                const associatedJob = jobs.find(j => j.id === app.jobId);
                const isExpanded = expandedAppId === app.id;

                return (
                  <div
                    key={app.id}
                    style={styles.applicantCard}
                    className="glass-card animate-slide-up"
                  >
                    {/* Collapsed view summary */}
                    <div
                      onClick={() => toggleExpandApplicant(app.id)}
                      style={styles.applicantSummary}
                    >
                      <div style={styles.summaryLeft}>
                        {/* Avatar Simulation */}
                        <div style={styles.avatar}>
                          {app.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h4 style={styles.candidateName}>{app.name}</h4>
                          <p style={styles.appliedJobLabel}>
                            Applied for: <strong>{app.role}</strong>{' '}
                            {associatedJob && <span style={{ color: 'var(--text-muted)' }}>at {associatedJob.company}</span>}
                          </p>
                        </div>
                      </div>

                      <div style={styles.summaryRight} onClick={(e) => e.stopPropagation()}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Stage:</span>
                          <select
                            value={app.status}
                            onChange={(e) => handleStatusChange(app.id, e.target.value)}
                            style={styles.statusDropdown}
                            className="input-field"
                          >
                            <option value="Applied">Applied</option>
                            <option value="Reviewing">Reviewing</option>
                            <option value="Interviewing">Interviewing</option>
                            <option value="Offered">Offered</option>
                          </select>
                        </div>
                        <button
                          onClick={() => toggleExpandApplicant(app.id)}
                          style={styles.expandTrigger}
                          className="btn-secondary"
                        >
                          <ChevronRight
                            size={16}
                            style={{
                              transform: isExpanded ? 'rotate(90deg)' : 'none',
                              transition: 'transform var(--transition-fast)'
                            }}
                          />
                        </button>
                      </div>
                    </div>

                    {/* Expanded details section */}
                    {isExpanded && (
                      <div style={styles.applicantDetails} className="animate-fade-in">
                        {/* Contacts and Links */}
                        <div style={styles.detailsRow}>
                          <div style={styles.detailItem}>
                            <Mail size={14} color="var(--text-muted)" />
                            <a href={`mailto:${app.email}`} style={styles.linkText}>
                              {app.email}
                            </a>
                          </div>
                          <div style={styles.detailItem}>
                            <Calendar size={14} color="var(--text-muted)" />
                            <span>Submitted: {formatDate(app.appliedDate)}</span>
                          </div>
                          {app.portfolioUrl && (
                            <div style={styles.detailItem}>
                              <FileText size={14} color="var(--text-muted)" />
                              <a href={app.portfolioUrl} target="_blank" rel="noopener noreferrer" style={styles.linkText}>
                                Portfolio
                              </a>
                            </div>
                          )}
                          {app.githubUrl && (
                            <div style={styles.detailItem}>
                              <FileText size={14} color="var(--text-muted)" />
                              <a href={app.githubUrl} target="_blank" rel="noopener noreferrer" style={styles.linkText}>
                                GitHub
                              </a>
                            </div>
                          )}
                        </div>

                        {/* Resume File */}
                        <div style={styles.resumeDisplay} className="glass-card">
                          <FileText size={18} color="var(--accent)" />
                          <div style={{ flex: 1 }}>
                            <span style={styles.resumeLabelText}>Resume Attachment</span>
                            <span style={styles.resumeFileName}>{app.resumeName}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => alert(`Simulating file download: ${app.resumeName}`)}
                            className="btn btn-secondary"
                            style={{ padding: '6px 12px', fontSize: '0.78rem' }}
                          >
                            Download CV
                          </button>
                        </div>

                        {/* Cover Letter message */}
                        {app.coverLetter && (
                          <div style={styles.coverLetterBox}>
                            <h5 style={styles.coverLetterHeading}>Introduction Message</h5>
                            <p style={styles.coverLetterText}>{app.coverLetter}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div style={styles.emptyApplicants} className="glass-card">
              <Info size={36} color="var(--text-muted)" style={{ marginBottom: '12px' }} />
              <h3>No Applications Yet</h3>
              <p style={{ color: 'var(--text-secondary)', marginTop: '8px', maxWidth: '360px' }}>
                Job seekers will show up here once they apply to your listings. Use "Candidate" mode to submit mock applications.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    paddingBottom: '80px'
  },
  pageHeader: {
    marginBottom: '32px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  pageTitle: {
    fontSize: '2.25rem',
    fontWeight: 800,
    fontFamily: 'var(--font-display)',
    marginBottom: '8px'
  },
  pageSubtitle: {
    color: 'var(--text-secondary)',
    fontSize: '1rem'
  },
  candidateGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 340px',
    gap: '32px',
    alignItems: 'flex-start',
    width: '100%',
    '@media (max-width: 1024px)': {
      gridTemplateColumns: '1fr'
    }
  },
  boardColumn: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  sectionTitle: {
    fontSize: '1.25rem',
    fontWeight: 700,
    fontFamily: 'var(--font-display)',
    color: 'var(--text-primary)'
  },
  kanbanBoard: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '16px',
    width: '100%',
    overflowX: 'auto',
    paddingBottom: '12px',
    '@media (max-width: 768px)': {
      gridTemplateColumns: 'repeat(4, 260px)'
    }
  },
  kanbanCol: {
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '14px',
    minHeight: '440px',
    backgroundColor: 'var(--bg-secondary)',
    borderRadius: 'var(--radius-lg)'
  },
  kanbanColHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: '10px',
    marginBottom: '4px'
  },
  colTitle: {
    fontWeight: 700,
    fontSize: '0.88rem',
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
    color: 'var(--text-primary)'
  },
  colCount: {
    fontSize: '0.75rem',
    fontWeight: 700,
    padding: '2px 8px',
    borderRadius: '9999px'
  },
  kanbanColCards: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    flex: 1
  },
  kanbanCard: {
    padding: '16px',
    backgroundColor: 'var(--bg-tertiary)',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    borderRadius: 'var(--radius-md)'
  },
  kanbanCardRole: {
    fontSize: '0.92rem',
    fontWeight: 700,
    lineHeight: 1.25,
    color: 'var(--text-primary)'
  },
  kanbanCardCompany: {
    fontSize: '0.8rem',
    color: 'var(--text-secondary)',
    fontWeight: 500
  },
  kanbanCardFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTop: '1px solid var(--card-border)',
    paddingTop: '8px',
    marginTop: '4px'
  },
  kanbanCardDate: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    fontSize: '0.75rem',
    color: 'var(--text-muted)'
  },
  emptyKanbanCol: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '1px dashed var(--card-border)',
    borderRadius: 'var(--radius-md)'
  },
  sidebarColumn: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  bookmarksContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  bookmarkCard: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px',
    cursor: 'pointer'
  },
  bookmarkLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  bookmarkLogo: {
    width: '36px',
    height: '36px',
    borderRadius: '6px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#ffffff',
    fontWeight: 800,
    fontSize: '1rem'
  },
  bookmarkTitle: {
    fontSize: '0.94rem',
    fontWeight: 700,
    lineHeight: 1.2
  },
  bookmarkCompany: {
    fontSize: '0.8rem',
    color: 'var(--text-secondary)',
    marginTop: '2px'
  },
  emptyBookmarks: {
    padding: '30px 20px',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  employerLayout: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px'
  },
  sectionHeaderRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '1px solid var(--card-border)',
    paddingBottom: '12px'
  },
  applicantsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '14px'
  },
  applicantCard: {
    borderRadius: 'var(--radius-lg)',
    overflow: 'hidden',
    borderWidth: '1px',
    borderStyle: 'solid'
  },
  applicantSummary: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px 24px',
    cursor: 'pointer',
    flexWrap: 'wrap',
    gap: '16px',
    transition: 'background-color var(--transition-fast)',
    '&:hover': {
      backgroundColor: 'var(--card-bg-hover)'
    }
  },
  summaryLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px'
  },
  avatar: {
    width: '44px',
    height: '44px',
    borderRadius: '50%',
    backgroundColor: 'var(--accent)',
    color: '#ffffff',
    fontWeight: 800,
    fontSize: '1.25rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: 'var(--shadow-sm)'
  },
  candidateName: {
    fontSize: '1.08rem',
    fontWeight: 700,
    color: 'var(--text-primary)'
  },
  appliedJobLabel: {
    fontSize: '0.86rem',
    color: 'var(--text-secondary)',
    marginTop: '2px'
  },
  summaryRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px'
  },
  statusDropdown: {
    padding: '6px 32px 6px 12px',
    fontSize: '0.84rem',
    borderRadius: '8px',
    height: '34px',
    width: '140px',
    backgroundColor: 'var(--bg-tertiary)',
    borderColor: 'var(--card-border)'
  },
  expandTrigger: {
    width: '32px',
    height: '32px',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '1px solid var(--card-border)',
    background: 'transparent',
    cursor: 'pointer',
    color: 'var(--text-secondary)'
  },
  applicantDetails: {
    padding: '24px',
    borderTop: '1px solid var(--card-border)',
    backgroundColor: 'rgba(255, 255, 255, 0.01)',
    display: 'flex',
    flexDirection: 'column',
    gap: '18px'
  },
  detailsRow: {
    display: 'flex',
    gap: '24px',
    flexWrap: 'wrap',
    fontSize: '0.88rem',
    color: 'var(--text-secondary)'
  },
  detailItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  linkText: {
    color: 'var(--accent)',
    fontWeight: 500,
    '&:hover': {
      textDecoration: 'underline'
    }
  },
  resumeDisplay: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 18px',
    borderRadius: '10px',
    backgroundColor: 'var(--bg-tertiary)',
    border: '1px solid var(--card-border)',
    maxWidth: '480px'
  },
  resumeLabelText: {
    display: 'block',
    fontSize: '0.72rem',
    color: 'var(--text-muted)',
    fontWeight: 600,
    textTransform: 'uppercase'
  },
  resumeFileName: {
    display: 'block',
    fontSize: '0.86rem',
    fontWeight: 600,
    color: 'var(--text-primary)'
  },
  coverLetterBox: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    maxWidth: '680px'
  },
  coverLetterHeading: {
    fontSize: '0.9rem',
    fontWeight: 700,
    color: 'var(--text-primary)'
  },
  coverLetterText: {
    fontSize: '0.92rem',
    color: 'var(--text-secondary)',
    lineHeight: 1.5,
    backgroundColor: 'var(--bg-primary)',
    padding: '12px 16px',
    borderRadius: '8px',
    border: '1px solid var(--card-border)',
    whiteSpace: 'pre-wrap'
  },
  emptyApplicants: {
    padding: '60px 40px',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  }
};

export default Dashboard;
