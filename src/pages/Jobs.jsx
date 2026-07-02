import React, { useContext, useState, useEffect } from 'react';
import { JobContext } from '../context/JobContext';
import JobCard from '../components/JobCard';
import JobDetail from '../components/JobDetail';
import ApplyModal from '../components/ApplyModal';
import { Search, MapPin, SlidersHorizontal, RefreshCw, X, ArrowLeft } from 'lucide-react';

const Jobs = ({ searchFilters, setSearchFilters }) => {
  const { jobs, bookmarks, toggleBookmark, applications, activeJobId, setActiveJobId } = useContext(JobContext);
  const [selectedJobForApply, setSelectedJobForApply] = useState(null);
  
  // Mobile panel toggle: 'list' or 'detail'
  const [mobilePane, setMobilePane] = useState('list');

  // Load parent/landing page filters or set defaults
  const [query, setQuery] = useState(searchFilters.query || '');
  const [location, setLocation] = useState(searchFilters.location || '');
  const [category, setCategory] = useState(searchFilters.category || '');
  const [type, setType] = useState(searchFilters.type || '');
  const [experience, setExperience] = useState('');
  const [remoteOnly, setRemoteOnly] = useState(false);

  // Sync state if landing page filters change
  useEffect(() => {
    setQuery(searchFilters.query || '');
    setLocation(searchFilters.location || '');
    setCategory(searchFilters.category || '');
    setType(searchFilters.type || '');
  }, [searchFilters]);

  // Filter listings
  const filteredJobs = jobs.filter((job) => {
    const matchesQuery =
      job.title.toLowerCase().includes(query.toLowerCase()) ||
      job.company.toLowerCase().includes(query.toLowerCase()) ||
      job.skills.some((skill) => skill.toLowerCase().includes(query.toLowerCase()));

    const matchesLocation = job.location.toLowerCase().includes(location.toLowerCase());
    const matchesCategory = category ? job.category === category : true;
    const matchesType = type ? job.type === type : true;
    const matchesExperience = experience ? job.experience === experience : true;
    const matchesRemote = remoteOnly ? job.location.toLowerCase().includes('remote') : true;

    return matchesQuery && matchesLocation && matchesCategory && matchesType && matchesExperience && matchesRemote;
  });

  // Active Job selection helper
  const activeJob = filteredJobs.find((j) => j.id === activeJobId) || filteredJobs[0] || null;

  // Auto-select first matching job on filter update
  useEffect(() => {
    if (filteredJobs.length > 0 && !filteredJobs.some(j => j.id === activeJobId)) {
      setActiveJobId(filteredJobs[0].id);
    }
  }, [query, location, category, type, experience, remoteOnly, filteredJobs, activeJobId, setActiveJobId]);

  const handleResetFilters = () => {
    setQuery('');
    setLocation('');
    setCategory('');
    setType('');
    setExperience('');
    setRemoteOnly(false);
    setSearchFilters({ query: '', location: '', category: '', type: '' });
  };

  const handleJobCardClick = (jobId) => {
    setActiveJobId(jobId);
    setMobilePane('detail');
  };

  const checkIfApplied = (jobId) => {
    return applications.some((app) => app.jobId === jobId);
  };

  return (
    <div className="container" style={styles.container}>
      {/* Search Header Row */}
      <div style={styles.headerRow} className="glass-card">
        <div style={styles.searchGroup}>
          <Search size={18} color="var(--text-muted)" />
          <input
            type="text"
            placeholder="Search by job title, company, or skills..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={styles.searchInput}
          />
        </div>
        <div style={styles.divider}></div>
        <div style={styles.searchGroup}>
          <MapPin size={18} color="var(--text-muted)" />
          <input
            type="text"
            placeholder="Location (e.g. Remote)"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            style={styles.searchInput}
          />
        </div>
      </div>

      {/* Main Layout Grid */}
      <div className="jobs-layout-grid">
        
        {/* Left Column: Filters Sidebar */}
        <aside className="glass-card jobs-filter-sidebar">
          <div style={styles.sidebarHeader}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <SlidersHorizontal size={18} color="var(--accent)" />
              <h3 style={styles.sidebarTitle}>Filters</h3>
            </div>
            <button onClick={handleResetFilters} style={styles.resetBtn} className="btn-secondary">
              <RefreshCw size={14} /> Clear All
            </button>
          </div>

          <div style={styles.filtersList}>
            {/* Category Filter */}
            <div className="form-group">
              <label className="form-label">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="input-field"
              >
                <option value="">All Categories</option>
                <option value="Tech">Tech / Engineering</option>
                <option value="Design">UI/UX Design</option>
                <option value="Product">Product Management</option>
                <option value="Marketing">Marketing / Growth</option>
              </select>
            </div>

            {/* Job Type Filter */}
            <div className="form-group">
              <label className="form-label">Job Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="input-field"
              >
                <option value="">All Types</option>
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
                <option value="Internship">Internship</option>
              </select>
            </div>

            {/* Experience Level Filter */}
            <div className="form-group">
              <label className="form-label">Experience Level</label>
              <select
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                className="input-field"
              >
                <option value="">All Experience Levels</option>
                <option value="Entry">Entry / Junior</option>
                <option value="Mid">Mid Level</option>
                <option value="Senior">Senior Level</option>
                <option value="Lead">Lead / Staff</option>
              </select>
            </div>

            {/* Remote Only Checkbox */}
            <div style={styles.checkboxGroup}>
              <input
                type="checkbox"
                id="remoteOnlyCheckbox"
                checked={remoteOnly}
                onChange={(e) => setRemoteOnly(e.target.checked)}
                style={styles.checkbox}
              />
              <label htmlFor="remoteOnlyCheckbox" style={styles.checkboxLabel}>
                Remote Only
              </label>
            </div>
          </div>
        </aside>

        {/* Directory & Split-Pane Content */}
        <div className={`jobs-split-pane mobile-pane-${mobilePane}`}>
          
          {/* List Section */}
          <div className="jobs-list-pane">
            <div style={styles.listCountBanner}>
              <span>Found <strong>{filteredJobs.length}</strong> matching roles</span>
            </div>
            
            {filteredJobs.length > 0 ? (
              <div style={styles.cardsScrollContainer}>
                {filteredJobs.map((job) => (
                  <JobCard
                    key={job.id}
                    job={job}
                    isActive={activeJob && activeJob.id === job.id}
                    onClick={() => handleJobCardClick(job.id)}
                    isBookmarked={bookmarks.includes(job.id)}
                    onBookmarkToggle={toggleBookmark}
                  />
                ))}
              </div>
            ) : (
              <div style={styles.noJobsState} className="glass-card">
                <h3>No Jobs Found</h3>
                <p style={{ color: 'var(--text-secondary)', marginTop: '8px' }}>
                  Try relaxing your filter query parameters.
                </p>
                <button onClick={handleResetFilters} className="btn btn-secondary" style={{ marginTop: '16px' }}>
                  Reset Filters
                </button>
              </div>
            )}
          </div>

          {/* Details Section */}
          <div className="jobs-detail-pane">
            {/* Mobile Header: Go Back button */}
            <div className="mobile-back-row">
              <button onClick={() => setMobilePane('list')} style={styles.backBtn} className="btn-secondary">
                <ArrowLeft size={16} /> Back to Listings
              </button>
            </div>

            <JobDetail
              job={activeJob}
              isBookmarked={activeJob && bookmarks.includes(activeJob.id)}
              onBookmarkToggle={toggleBookmark}
              hasApplied={activeJob && checkIfApplied(activeJob.id)}
              onApplyClick={() => setSelectedJobForApply(activeJob)}
            />
          </div>

        </div>

      </div>

      {/* Application Wizard Modal popup */}
      {selectedJobForApply && (
        <ApplyModal
          job={selectedJobForApply}
          onClose={() => setSelectedJobForApply(null)}
        />
      )}
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
    paddingBottom: '60px'
  },
  headerRow: {
    display: 'flex',
    padding: '16px 24px',
    alignItems: 'center',
    gap: '16px',
    borderRadius: 'var(--radius-lg)',
    boxShadow: 'var(--shadow-sm)'
  },
  searchGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    flex: 1
  },
  searchInput: {
    border: 'none',
    background: 'transparent',
    color: 'var(--text-primary)',
    fontFamily: 'var(--font-sans)',
    fontSize: '0.96rem',
    outline: 'none',
    width: '100%',
    height: '32px'
  },
  divider: {
    width: '1px',
    height: '24px',
    backgroundColor: 'var(--card-border)'
  },
  layoutGrid: {
    display: 'grid',
    gridTemplateColumns: '280px 1fr',
    gap: '24px',
    alignItems: 'flex-start',
    width: '100%',
    '@media (max-width: 1024px)': {
      gridTemplateColumns: '1fr'
    }
  },
  filterSidebar: {
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    position: 'sticky',
    top: '100px'
  },
  sidebarHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '1px solid var(--card-border)',
    paddingBottom: '12px'
  },
  sidebarTitle: {
    fontSize: '1.15rem',
    fontWeight: 700,
    fontFamily: 'var(--font-display)'
  },
  resetBtn: {
    padding: '6px 12px',
    borderRadius: '8px',
    fontSize: '0.78rem',
    fontWeight: 600
  },
  filtersList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  checkboxGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginTop: '6px'
  },
  checkbox: {
    width: '18px',
    height: '18px',
    accentColor: 'var(--accent)',
    cursor: 'pointer'
  },
  checkboxLabel: {
    fontSize: '0.9rem',
    fontWeight: 500,
    color: 'var(--text-secondary)',
    cursor: 'pointer',
    userSelect: 'none'
  },
  splitPane: {
    display: 'grid',
    gridTemplateColumns: '400px 1fr',
    gap: '24px',
    height: 'calc(100vh - 240px)',
    minHeight: '600px',
    maxHeight: '800px',
    width: '100%',
    overflow: 'hidden'
  },
  listPane: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    height: '100%',
    overflow: 'hidden'
  },
  listCountBanner: {
    fontSize: '0.86rem',
    color: 'var(--text-secondary)',
    paddingLeft: '4px'
  },
  cardsScrollContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '14px',
    overflowY: 'auto',
    flex: 1,
    paddingRight: '6px',
    paddingBottom: '20px'
  },
  noJobsState: {
    padding: '40px',
    textAlign: 'center',
    height: '240px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  detailPane: {
    height: '100%',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column'
  },
  mobileBackRow: {
    display: 'none', // Managed in global media queries
    paddingBottom: '12px'
  },
  backBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 16px',
    borderRadius: '10px'
  }
};

export default Jobs;
