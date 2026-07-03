import React from 'react';
import { MapPin, DollarSign, Clock, CheckCircle, Bookmark, BookmarkCheck, Calendar, UserCheck } from 'lucide-react';

const JobDetail = ({ job, isBookmarked, onBookmarkToggle, hasApplied, onApplyClick }) => {
  if (!job) {
    return (
      <div style={styles.noJobSelected} className="glass-card animate-fade-in">
        <Clock size={48} color="var(--text-muted)" style={{ marginBottom: '16px' }} />
        <h3>Select a Job</h3>
        <p style={{ color: 'var(--text-secondary)', marginTop: '8px' }}>
          Choose a listing from the directory to view complete details.
        </p>
      </div>
    );
  }

  // Format posted date
  const formatDate = (dateStr) => {
    if (!dateStr) return 'Recent';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div style={styles.detailContainer} className="glass-card animate-fade-in">
      {/* Sticky Header Panel */}
      <div style={styles.detailHeader}>
        <div style={styles.headerTop}>
          <div style={{ ...styles.companyLogo, backgroundColor: job.logoBg }}>
            {job.logoText}
          </div>
          <div style={styles.headerText}>
            <h2 style={styles.jobTitle}>{job.title}</h2>
            <p style={styles.companyName}>{job.company}</p>
          </div>
        </div>

        {/* Action Row */}
        <div style={styles.actionRow}>
          <button onClick={onApplyClick} className="btn btn-primary" style={styles.applyBtn}>
            {hasApplied ? 'Apply Again' : 'Apply Now'}
          </button>

          <button
            onClick={() => onBookmarkToggle(job.id)}
            style={styles.bookmarkBtn}
            className="btn btn-secondary"
          >
            {isBookmarked ? (
              <>
                <BookmarkCheck size={18} color="var(--accent)" />
                <span>Saved</span>
              </>
            ) : (
              <>
                <Bookmark size={18} color="var(--text-secondary)" />
                <span>Save Job</span>
              </>
            )}
          </button>
        </div>

        {/* Quick Meta Stats Grid */}
        <div style={styles.metaGrid}>
          <div style={styles.metaBox}>
            <MapPin size={16} color="var(--text-muted)" />
            <div>
              <span style={styles.metaLabel}>Location</span>
              <span style={styles.metaValue}>{job.location}</span>
            </div>
          </div>
          <div style={styles.metaBox}>
            <DollarSign size={16} color="var(--success)" />
            <div>
              <span style={styles.metaLabel}>Compensation</span>
              <span style={styles.metaValue} className="text-success">{job.salary}</span>
            </div>
          </div>
          <div style={styles.metaBox}>
            <Calendar size={16} color="var(--text-muted)" />
            <div>
              <span style={styles.metaLabel}>Date Posted</span>
              <span style={styles.metaValue}>{formatDate(job.postedDate)}</span>
            </div>
          </div>
          <div style={styles.metaBox}>
            <Clock size={16} color="var(--info)" />
            <div>
              <span style={styles.metaLabel}>Job Type</span>
              <span style={styles.metaValue}>{job.type} / {job.experience}</span>
            </div>
          </div>
          <div style={styles.metaBox}>
            <UserCheck size={16} color="var(--accent)" />
            <div>
              <span style={styles.metaLabel}>Placement Type</span>
              <span style={styles.metaValue}>{job.placementType || 'Off-Campus'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Body */}
      <div style={styles.detailBody}>
        {/* Job Fit Section */}
        <div style={styles.section}>
          <h3 style={styles.sectionHeading}>Eligible Candidates</h3>
          <div style={styles.badgeRow}>
            {job.eligibleBranches?.map((branch) => (
              <span key={branch} className="tag tag-info" style={styles.badgeItem}>
                {branch}
              </span>
            ))}
            {job.eligibleBatch && (
              <span className="tag tag-success" style={styles.badgeItem}>
                Batch {job.eligibleBatch}
              </span>
            )}
            {job.driveDate && (
              <span className="tag tag-accent" style={styles.badgeItem}>
                Drive on {formatDate(job.driveDate)}
              </span>
            )}
          </div>
        </div>

        {/* Description Section */}
        <div style={styles.section}>
          <h3 style={styles.sectionHeading}>About the Opportunity</h3>
          <p style={styles.paragraph}>{job.description}</p>
        </div>

        {/* Responsibilities Section */}
        {job.responsibilities && job.responsibilities.length > 0 && (
          <div style={styles.section}>
            <h3 style={styles.sectionHeading}>Key Responsibilities</h3>
            <ul style={styles.list}>
              {job.responsibilities.map((item, index) => (
                <li key={index} style={styles.listItem}>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Requirements Section */}
        {job.requirements && job.requirements.length > 0 && (
          <div style={styles.section}>
            <h3 style={styles.sectionHeading}>Qualifications & Skills</h3>
            <ul style={styles.list}>
              {job.requirements.map((item, index) => (
                <li key={index} style={styles.listItem}>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Benefits Section */}
        {job.benefits && job.benefits.length > 0 && (
          <div style={styles.section}>
            <h3 style={styles.sectionHeading}>Perks & Benefits</h3>
            <ul style={styles.list}>
              {job.benefits.map((item, index) => (
                <li key={index} style={{ ...styles.listItem, listStyleType: 'square' }}>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  noJobSelected: {
    height: '100%',
    minHeight: '400px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    padding: '40px'
  },
  detailContainer: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    borderStyle: 'solid',
    borderWidth: '1px'
  },
  detailHeader: {
    padding: '30px',
    borderBottom: '1px solid var(--card-border)',
    background: 'rgba(255, 255, 255, 0.01)',
    display: 'flex',
    flexDirection: 'column',
    gap: '24px'
  },
  headerTop: {
    display: 'flex',
    gap: '20px',
    alignItems: 'center'
  },
  companyLogo: {
    width: '64px',
    height: '64px',
    borderRadius: '14px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#ffffff',
    fontWeight: 800,
    fontSize: '2rem'
  },
  headerText: {
    flex: 1
  },
  jobTitle: {
    fontSize: '1.75rem',
    fontWeight: 800,
    lineHeight: 1.2,
    color: 'var(--text-primary)',
    fontFamily: 'var(--font-display)'
  },
  companyName: {
    fontSize: '1.1rem',
    color: 'var(--text-secondary)',
    fontWeight: 500,
    marginTop: '4px'
  },
  actionRow: {
    display: 'flex',
    gap: '12px',
    alignItems: 'center'
  },
  applyBtn: {
    flex: 1,
    height: '46px',
    fontSize: '1rem',
    borderRadius: '10px'
  },
  appliedBtn: {
    flex: 1,
    height: '46px',
    fontSize: '1rem',
    borderRadius: '10px',
    cursor: 'not-allowed',
    opacity: 0.8,
    display: 'inline-flex',
    gap: '8px',
    alignItems: 'center',
    justifyContent: 'center'
  },
  bookmarkBtn: {
    height: '46px',
    padding: '0 20px',
    borderRadius: '10px',
    fontSize: '0.95rem'
  },
  metaGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
    gap: '16px',
    backgroundColor: 'var(--bg-primary)',
    padding: '16px',
    borderRadius: 'var(--radius-md)',
    border: '1px solid var(--card-border)'
  },
  metaBox: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  metaLabel: {
    display: 'block',
    fontSize: '0.75rem',
    color: 'var(--text-muted)',
    textTransform: 'uppercase',
    fontWeight: 600,
    letterSpacing: '0.02em'
  },
  metaValue: {
    display: 'block',
    fontSize: '0.88rem',
    fontWeight: 600,
    color: 'var(--text-primary)'
  },
  detailBody: {
    padding: '30px',
    overflowY: 'auto',
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '28px'
  },
  section: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  sectionHeading: {
    fontSize: '1.25rem',
    fontWeight: 700,
    fontFamily: 'var(--font-display)',
    position: 'relative',
    paddingBottom: '6px',
    color: 'var(--text-primary)'
  },
  paragraph: {
    color: 'var(--text-secondary)',
    lineHeight: 1.6,
    fontSize: '0.98rem'
  },
  list: {
    paddingLeft: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  listItem: {
    color: 'var(--text-secondary)',
    lineHeight: 1.5,
    fontSize: '0.95rem'
  }
};

export default JobDetail;
