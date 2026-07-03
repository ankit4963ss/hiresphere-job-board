import React, { useContext } from 'react';
import { JobContext } from '../context/JobContext';
import { GraduationCap, MapPin, Calendar, Briefcase, ArrowRight } from 'lucide-react';

const Campus = ({ setActivePage, setSearchFilters }) => {
  const { jobs } = useContext(JobContext);
  const campusDrives = jobs.filter((job) => job.placementType === 'On-Campus' || job.driveDate);

  const handleOpenDrive = (jobId) => {
    localStorage.setItem('hiresphere_activejobid', jobId);
    setSearchFilters({
      query: '',
      location: '',
      category: '',
      type: '',
      branch: '',
      batch: '',
      placementType: 'On-Campus',
      onCampusOnly: true
    });
    setActivePage('jobs');
  };

  return (
    <div className="container" style={styles.container}>
      <section style={styles.hero} className="animate-fade-in">
        <div style={styles.heroText}>
          <div style={styles.badge} className="tag tag-accent">
            🎓 Campus Placement Portal
          </div>
          <h1 style={styles.heroTitle}>
            Run on-campus drives, match students,
            <br /> and hire from leading batches.
          </h1>
          <p style={styles.heroSubtitle}>
            Campus lets recruiters manage placement listings while students explore eligible drives by branch, batch, and drive schedule.
          </p>
          <button
            className="btn btn-primary"
            style={styles.heroButton}
            onClick={handleOpenDrive.bind(null, campusDrives[0]?.id)}
            disabled={campusDrives.length === 0}
          >
            {campusDrives.length > 0 ? 'Open Latest Drive' : 'No Drives Available'}
          </button>
        </div>
      </section>

      <section style={styles.section}>
        <div style={styles.sectionHeader}>
          <div>
            <h2 style={styles.sectionTitle}>Upcoming Campus Drives</h2>
            <p style={styles.sectionSubtitle}>Browse the latest placement opportunities for student batches.</p>
          </div>
          <button
            className="btn btn-secondary"
            style={styles.viewAllBtn}
            onClick={() => {
              setSearchFilters({
                query: '',
                location: '',
                category: '',
                type: '',
                branch: '',
                batch: '',
                placementType: 'On-Campus',
                onCampusOnly: true
              });
              setActivePage('jobs');
            }}
          >
            Browse All Drives <ArrowRight size={16} />
          </button>
        </div>

        <div style={styles.driveGrid}>
          {campusDrives.length > 0 ? (
            campusDrives.map((job) => (
              <div
                key={job.id}
                className="glass-card glass-card-hover animate-slide-up"
                style={styles.driveCard}
                onClick={() => handleOpenDrive(job.id)}
              >
                <div style={styles.driveHeader}>
                  <div style={{ ...styles.companyLogo, backgroundColor: job.logoBg }}>{job.logoText}</div>
                  <span className="tag tag-accent" style={styles.driveTag}>{job.placementType || 'On-Campus'}</span>
                </div>
                <div>
                  <h3 style={styles.jobTitle}>{job.title}</h3>
                  <p style={styles.companyName}>{job.company}</p>
                </div>
                <div style={styles.driveMeta}>
                  <span><MapPin size={14} /> {job.location}</span>
                  <span><Calendar size={14} /> {job.driveDate ? new Date(job.driveDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'Flexible'}</span>
                </div>
                <div style={styles.driveBadges}>
                  {(job.eligibleBranches || []).map((branch) => (
                    <span key={branch} className="tag tag-info" style={styles.driveBadge}>
                      {branch}
                    </span>
                  ))}
                  {job.eligibleBatch && (
                    <span className="tag tag-success" style={styles.driveBadge}>
                      Batch {job.eligibleBatch}
                    </span>
                  )}
                </div>
                <div style={styles.driveFooter}>
                  <Briefcase size={14} />
                  <span>{job.type}</span>
                </div>
              </div>
            ))
          ) : (
            <div style={styles.emptyState} className="glass-card">
              <GraduationCap size={32} color="var(--text-muted)" />
              <p style={{ color: 'var(--text-secondary)', marginTop: '12px' }}>No campus drives are available right now.</p>
            </div>
          )}
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
    maxWidth: '760px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  badge: {
    marginBottom: '20px'
  },
  heroTitle: {
    fontSize: '3rem',
    lineHeight: 1.12,
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
    fontSize: '1.05rem',
    color: 'var(--text-secondary)',
    lineHeight: 1.75,
    marginBottom: '28px',
    maxWidth: '620px'
  },
  heroButton: {
    minWidth: '220px'
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
  driveGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '20px'
  },
  driveCard: {
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '18px',
    minHeight: '280px',
    cursor: 'pointer'
  },
  driveHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: '12px'
  },
  companyLogo: {
    width: '42px',
    height: '42px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#ffffff',
    fontWeight: 800,
    fontSize: '1.15rem'
  },
  driveTag: {
    fontSize: '0.72rem'
  },
  jobTitle: {
    fontSize: '1.2rem',
    fontWeight: 700,
    lineHeight: 1.3,
    marginBottom: '6px'
  },
  companyName: {
    color: 'var(--text-secondary)',
    fontSize: '0.95rem',
    marginBottom: '10px'
  },
  driveMeta: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '12px',
    fontSize: '0.9rem',
    color: 'var(--text-secondary)'
  },
  driveBadges: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px'
  },
  driveBadge: {
    fontSize: '0.72rem',
    padding: '4px 10px'
  },
  driveFooter: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    color: 'var(--text-secondary)',
    fontSize: '0.92rem'
  },
  emptyState: {
    padding: '40px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '260px',
    gap: '14px'
  }
};

export default Campus;
