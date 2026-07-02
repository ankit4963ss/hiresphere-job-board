import React from 'react';
import { MapPin, DollarSign, Bookmark, BookmarkCheck, Clock } from 'lucide-react';

const JobCard = ({ job, isActive, onClick, isBookmarked, onBookmarkToggle }) => {
  const handleBookmarkClick = (e) => {
    e.stopPropagation();
    onBookmarkToggle(job.id);
  };

  return (
    <div
      onClick={onClick}
      style={{
        ...styles.card,
        borderColor: isActive ? 'var(--accent)' : 'var(--card-border)',
        backgroundColor: isActive ? 'var(--card-bg-hover)' : 'var(--card-bg)',
        boxShadow: isActive ? 'var(--shadow-lg), var(--shadow-accent)' : 'var(--shadow-sm)',
        transform: isActive ? 'translateY(-1px)' : 'none'
      }}
      className="glass-card glass-card-hover animate-slide-up"
    >
      <div style={styles.cardHeader}>
        <div style={styles.companyInfo}>
          <div style={{ ...styles.companyLogo, backgroundColor: job.logoBg }}>
            {job.logoText}
          </div>
          <div>
            <h4 style={styles.jobTitle}>{job.title}</h4>
            <p style={styles.companyName}>{job.company}</p>
          </div>
        </div>

        <button
          onClick={handleBookmarkClick}
          style={styles.bookmarkBtn}
          className="btn-secondary"
        >
          {isBookmarked ? (
            <BookmarkCheck size={16} color="var(--accent)" />
          ) : (
            <Bookmark size={16} color="var(--text-secondary)" />
          )}
        </button>
      </div>

      <div style={styles.tagsContainer}>
        <span className="tag tag-accent" style={styles.tagItem}>{job.type}</span>
        <span className="tag tag-info" style={styles.tagItem}>{job.experience}</span>
        {job.location.toLowerCase().includes('remote') && (
          <span className="tag tag-success" style={styles.tagItem}>Remote</span>
        )}
      </div>

      <div style={styles.cardFooter}>
        <div style={styles.footerItem}>
          <MapPin size={14} color="var(--text-muted)" />
          <span style={styles.footerText}>{job.location}</span>
        </div>
        <div style={styles.footerItem}>
          <DollarSign size={14} color="var(--success)" />
          <span style={{ ...styles.footerText, color: 'var(--success)', fontWeight: 600 }}>
            {job.salary}
          </span>
        </div>
      </div>
    </div>
  );
};

const styles = {
  card: {
    padding: '20px',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    position: 'relative',
    borderWidth: '1px',
    borderStyle: 'solid',
    transition: 'all var(--transition-normal)'
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: '12px'
  },
  companyInfo: {
    display: 'flex',
    gap: '12px',
    alignItems: 'center'
  },
  companyLogo: {
    width: '44px',
    height: '44px',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#ffffff',
    fontWeight: 800,
    fontSize: '1.3rem'
  },
  jobTitle: {
    fontSize: '1.08rem',
    fontWeight: 700,
    lineHeight: 1.25,
    color: 'var(--text-primary)'
  },
  companyName: {
    fontSize: '0.88rem',
    color: 'var(--text-secondary)',
    fontWeight: 500,
    marginTop: '2px'
  },
  bookmarkBtn: {
    padding: '8px',
    borderRadius: '8px',
    cursor: 'pointer',
    border: '1px solid var(--card-border)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  tagsContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '6px'
  },
  tagItem: {
    fontSize: '0.68rem',
    padding: '3px 8px'
  },
  cardFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTop: '1px solid var(--card-border)',
    paddingTop: '12px',
    marginTop: '4px'
  },
  footerItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px'
  },
  footerText: {
    fontSize: '0.82rem',
    color: 'var(--text-secondary)'
  }
};

export default JobCard;
