import React, { useState, useContext } from 'react';
import { JobContext } from '../context/JobContext';
import { ArrowLeft, ArrowRight, CheckCircle, Briefcase, Plus, Eye, EyeOff, LayoutDashboard } from 'lucide-react';

const PostJob = ({ setActivePage }) => {
  const { addJob } = useContext(JobContext);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    company: '',
    companyWebsite: '',
    logoBg: '#6366F1', // default Indigo
    title: '',
    category: 'Tech',
    location: 'Remote',
    type: 'Full-time',
    experience: 'Senior',
    salary: '',
    description: '',
    responsibilities: '',
    requirements: '',
    benefits: ''
  });

  const [errors, setErrors] = useState({});

  // Preset accent colors for company logo background
  const colorPresets = ['#6366F1', '#F24E1E', '#10B981', '#06B6D4', '#F59E0B', '#EC4899', '#000000', '#7C3AED'];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleNextStep = () => {
    const newErrors = {};
    if (step === 1) {
      if (!formData.company.trim()) newErrors.company = 'Company name is required';
      if (!formData.companyWebsite.trim()) {
        newErrors.companyWebsite = 'Website is required';
      } else if (!/^https?:\/\/\S+\.\S+/.test(formData.companyWebsite)) {
        newErrors.companyWebsite = 'Please enter a valid website URL';
      }
    } else if (step === 2) {
      if (!formData.title.trim()) newErrors.title = 'Job title is required';
      if (!formData.location.trim()) newErrors.location = 'Location description is required';
      if (!formData.salary.trim()) newErrors.salary = 'Salary range is required';
    } else if (step === 3) {
      if (!formData.description.trim()) newErrors.description = 'Job description is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setStep(prev => prev + 1);
  };

  const handlePrevStep = () => {
    setStep(prev => prev - 1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // add job to local storage database context
    addJob(formData);
    setStep(5); // Success step
  };

  return (
    <div className="container" style={styles.container}>
      {/* Page Title */}
      <div style={styles.pageHeader}>
        <h1 style={styles.pageTitle}>Create Job Opportunity</h1>
        <p style={styles.pageSubtitle}>Publish a role to HireSphere's engineering candidate index.</p>
      </div>

      <div style={styles.contentLayout}>
        {/* Form Wizard Panel */}
        <div style={styles.formCard} className="glass-card">
          {/* Step Headers */}
          {step < 5 && (
            <div style={styles.stepIndicator}>
              {['Company', 'Role details', 'Description', 'Preview'].map((label, idx) => {
                const stepNum = idx + 1;
                return (
                  <React.Fragment key={label}>
                    <div style={styles.stepHeaderItem}>
                      <div
                        style={{
                          ...styles.stepNode,
                          backgroundColor: step >= stepNum ? 'var(--accent)' : 'var(--bg-tertiary)',
                          color: step >= stepNum ? '#ffffff' : 'var(--text-secondary)',
                          border: step === stepNum ? '2px solid var(--text-primary)' : '2px solid transparent'
                        }}
                      >
                        {stepNum}
                      </div>
                      <span style={{
                        ...styles.stepLabel,
                        color: step >= stepNum ? 'var(--text-primary)' : 'var(--text-muted)'
                      }}>
                        {label}
                      </span>
                    </div>
                    {stepNum < 4 && <div style={{
                      ...styles.stepDivider,
                      backgroundColor: step > stepNum ? 'var(--accent)' : 'var(--card-border)'
                    }}></div>}
                  </React.Fragment>
                );
              })}
            </div>
          )}

          {/* Form Content */}
          <form onSubmit={handleSubmit} style={styles.form}>
            {/* STEP 1: Company Profile */}
            {step === 1 && (
              <div style={styles.stepWrapper} className="animate-fade-in">
                <h3 style={styles.stepTitle}>1. Company Information</h3>
                
                <div className="form-group">
                  <label className="form-label">Company Name</label>
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                    placeholder="Acme Corp"
                    className="input-field"
                  />
                  {errors.company && <span style={styles.errorText}>{errors.company}</span>}
                </div>

                <div className="form-group">
                  <label className="form-label">Company Website URL</label>
                  <input
                    type="url"
                    name="companyWebsite"
                    value={formData.companyWebsite}
                    onChange={handleInputChange}
                    placeholder="https://acme.co"
                    className="input-field"
                  />
                  {errors.companyWebsite && <span style={styles.errorText}>{errors.companyWebsite}</span>}
                </div>

                <div className="form-group">
                  <label className="form-label">Logo Accent Color</label>
                  <div style={styles.colorPills}>
                    {colorPresets.map(color => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, logoBg: color }))}
                        style={{
                          ...styles.colorPill,
                          backgroundColor: color,
                          transform: formData.logoBg === color ? 'scale(1.18)' : 'none',
                          border: formData.logoBg === color ? '2px solid var(--text-primary)' : '2px solid transparent'
                        }}
                      ></button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: Job Info */}
            {step === 2 && (
              <div style={styles.stepWrapper} className="animate-fade-in">
                <h3 style={styles.stepTitle}>2. Role Specifications</h3>

                <div className="form-group">
                  <label className="form-label">Job Title</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Senior React Developer"
                    className="input-field"
                  />
                  {errors.title && <span style={styles.errorText}>{errors.title}</span>}
                </div>

                <div style={styles.inputRow}>
                  <div className="form-group" style={{ flex: 1 }}>
                    <label className="form-label">Category</label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="input-field"
                    >
                      <option value="Tech">Tech / Engineering</option>
                      <option value="Design">UI/UX Design</option>
                      <option value="Product">Product Management</option>
                      <option value="Marketing">Marketing / Growth</option>
                    </select>
                  </div>

                  <div className="form-group" style={{ flex: 1 }}>
                    <label className="form-label">Job Type</label>
                    <select
                      name="type"
                      value={formData.type}
                      onChange={handleInputChange}
                      className="input-field"
                    >
                      <option value="Full-time">Full-time</option>
                      <option value="Part-time">Part-time</option>
                      <option value="Contract">Contract</option>
                      <option value="Internship">Internship</option>
                    </select>
                  </div>
                </div>

                <div style={styles.inputRow}>
                  <div className="form-group" style={{ flex: 1 }}>
                    <label className="form-label">Experience Level</label>
                    <select
                      name="experience"
                      value={formData.experience}
                      onChange={handleInputChange}
                      className="input-field"
                    >
                      <option value="Entry">Entry / Junior</option>
                      <option value="Mid">Mid Level</option>
                      <option value="Senior">Senior Level</option>
                      <option value="Lead">Lead / Staff</option>
                    </select>
                  </div>

                  <div className="form-group" style={{ flex: 1 }}>
                    <label className="form-label">Salary Range</label>
                    <input
                      type="text"
                      name="salary"
                      value={formData.salary}
                      onChange={handleInputChange}
                      placeholder="e.g. $130,000 - $160,000"
                      className="input-field"
                    />
                    {errors.salary && <span style={styles.errorText}>{errors.salary}</span>}
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Geographic Location</label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="e.g. Remote (Global), San Francisco, CA"
                    className="input-field"
                  />
                  {errors.location && <span style={styles.errorText}>{errors.location}</span>}
                </div>
              </div>
            )}

            {/* STEP 3: Details */}
            {step === 3 && (
              <div style={styles.stepWrapper} className="animate-fade-in">
                <h3 style={styles.stepTitle}>3. Role Description & Bullet Lists</h3>

                <div className="form-group">
                  <label className="form-label">About the Role</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Describe the overall scope and core objectives of the position..."
                    className="input-field"
                  ></textarea>
                  {errors.description && <span style={styles.errorText}>{errors.description}</span>}
                </div>

                <div className="form-group">
                  <label className="form-label">Key Responsibilities (One item per line)</label>
                  <textarea
                    name="responsibilities"
                    value={formData.responsibilities}
                    onChange={handleInputChange}
                    placeholder="Architect layout templates
Write unit test cases
Lead standups"
                    className="input-field"
                    style={{ minHeight: '90px' }}
                  ></textarea>
                </div>

                <div className="form-group">
                  <label className="form-label">Qualifications & Requirements (One item per line)</label>
                  <textarea
                    name="requirements"
                    value={formData.requirements}
                    onChange={handleInputChange}
                    placeholder="3+ years of React development
Excellent communication skills
Proficient in CSS Grid"
                    className="input-field"
                    style={{ minHeight: '90px' }}
                  ></textarea>
                </div>

                <div className="form-group">
                  <label className="form-label">Benefits & Perks (One item per line)</label>
                  <textarea
                    name="benefits"
                    value={formData.benefits}
                    onChange={handleInputChange}
                    placeholder="Unlimited PTO
Comprehensive healthcare
$2000 equipment stipend"
                    className="input-field"
                    style={{ minHeight: '90px' }}
                  ></textarea>
                </div>
              </div>
            )}

            {/* STEP 4: Live Preview */}
            {step === 4 && (
              <div style={styles.stepWrapper} className="animate-fade-in">
                <h3 style={styles.stepTitle}>4. Confirm Listing Details</h3>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '20px' }}>
                  A preview of how your card will appear in search results. Check spelling before posting.
                </p>

                {/* Job Card Simulation Preview */}
                <div style={styles.previewBox} className="glass-card">
                  <div style={styles.previewHeader}>
                    <div style={styles.companyInfo}>
                      <div style={{ ...styles.previewLogo, backgroundColor: formData.logoBg }}>
                        {formData.company ? formData.company.charAt(0).toUpperCase() : 'J'}
                      </div>
                      <div>
                        <h4 style={styles.previewTitle}>{formData.title || 'Untitled Position'}</h4>
                        <p style={styles.previewCompany}>{formData.company || 'Unknown Company'}</p>
                      </div>
                    </div>
                    <span className="tag tag-accent">{formData.type}</span>
                  </div>

                  <div style={styles.previewTags}>
                    <span className="tag tag-info">{formData.experience}</span>
                    <span className="tag tag-success">{formData.location}</span>
                  </div>

                  <div style={styles.previewFooter}>
                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{formData.location}</span>
                    <span style={{ color: 'var(--success)', fontWeight: 700, fontSize: '0.92rem' }}>{formData.salary}</span>
                  </div>
                </div>

                <div style={styles.alertBox} className="glass-card">
                  💡 By submitting this form, your job will be immediately index-pinned to the local dashboard search results list.
                </div>
              </div>
            )}

            {/* STEP 5: Success screen */}
            {step === 5 && (
              <div style={styles.successContainer} className="animate-fade-in">
                <CheckCircle size={64} color="var(--success)" style={{ marginBottom: '20px' }} />
                <h2 style={styles.successTitle}>Job Post Published!</h2>
                <p style={styles.successText}>
                  Your listing for **{formData.title}** at **{formData.company}** is now active and visible to candidates in the job search directories.
                </p>

                <div style={styles.successBtns}>
                  <button
                    type="button"
                    onClick={() => setActivePage('jobs')}
                    className="btn btn-primary"
                  >
                    View in Directory
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setFormData({
                        company: '',
                        companyWebsite: '',
                        logoBg: '#6366F1',
                        title: '',
                        category: 'Tech',
                        location: 'Remote',
                        type: 'Full-time',
                        experience: 'Senior',
                        salary: '',
                        description: '',
                        responsibilities: '',
                        requirements: '',
                        benefits: ''
                      });
                      setStep(1);
                    }}
                    className="btn btn-secondary"
                  >
                    Post Another Job
                  </button>
                </div>
              </div>
            )}

            {/* Footer Navigation Buttons */}
            {step < 5 && (
              <div style={styles.formFooter}>
                {step > 1 ? (
                  <button type="button" onClick={handlePrevStep} className="btn btn-secondary">
                    <ArrowLeft size={16} /> Back
                  </button>
                ) : (
                  <div></div>
                )}

                {step < 4 ? (
                  <button type="button" onClick={handleNextStep} className="btn btn-primary">
                    Next <ArrowRight size={16} />
                  </button>
                ) : (
                  <button type="submit" className="btn btn-primary">
                    <Plus size={16} /> Publish Listing
                  </button>
                )}
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    paddingBottom: '80px',
    maxWidth: '800px'
  },
  pageHeader: {
    marginBottom: '32px'
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
  contentLayout: {
    width: '100%'
  },
  formCard: {
    borderRadius: 'var(--radius-xl)',
    borderWidth: '1px',
    borderStyle: 'solid',
    overflow: 'hidden'
  },
  stepIndicator: {
    display: 'flex',
    padding: '30px 40px 0 40px',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '1px solid var(--card-border)',
    paddingBottom: '24px',
    flexWrap: 'wrap',
    gap: '12px'
  },
  stepHeaderItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
  },
  stepNode: {
    width: '28px',
    height: '28px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.8rem',
    fontWeight: 700,
    transition: 'all var(--transition-normal)'
  },
  stepLabel: {
    fontSize: '0.88rem',
    fontWeight: 600,
    fontFamily: 'var(--font-display)'
  },
  stepDivider: {
    height: '2px',
    flex: 1,
    minWidth: '20px',
    transition: 'all var(--transition-normal)'
  },
  form: {
    padding: '40px'
  },
  stepWrapper: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    minHeight: '340px'
  },
  stepTitle: {
    fontSize: '1.25rem',
    fontWeight: 700,
    fontFamily: 'var(--font-display)',
    color: 'var(--text-primary)',
    marginBottom: '8px'
  },
  colorPills: {
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap'
  },
  colorPill: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    cursor: 'pointer',
    transition: 'transform var(--transition-fast)'
  },
  inputRow: {
    display: 'flex',
    gap: '20px',
    flexWrap: 'wrap'
  },
  previewBox: {
    padding: '24px',
    border: '1px dashed var(--accent)',
    borderRadius: 'var(--radius-lg)',
    backgroundColor: 'var(--bg-primary)'
  },
  previewHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '16px'
  },
  companyInfo: {
    display: 'flex',
    gap: '12px',
    alignItems: 'center'
  },
  previewLogo: {
    width: '40px',
    height: '40px',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#ffffff',
    fontWeight: 800,
    fontSize: '1.2rem'
  },
  previewTitle: {
    fontSize: '1.1rem',
    fontWeight: 700,
    color: 'var(--text-primary)'
  },
  previewCompany: {
    fontSize: '0.85rem',
    color: 'var(--text-secondary)'
  },
  previewTags: {
    display: 'flex',
    gap: '6px',
    marginBottom: '16px'
  },
  previewFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTop: '1px solid var(--card-border)',
    paddingTop: '12px'
  },
  alertBox: {
    padding: '16px',
    borderRadius: 'var(--radius-md)',
    backgroundColor: 'var(--accent-light)',
    border: '1px solid var(--accent)',
    color: 'var(--accent)',
    fontSize: '0.88rem',
    fontWeight: 500,
    lineHeight: 1.4
  },
  errorText: {
    color: 'var(--danger)',
    fontSize: '0.78rem',
    fontWeight: 500,
    marginTop: '4px'
  },
  successContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    padding: '20px 0',
    minHeight: '340px'
  },
  successTitle: {
    fontSize: '1.75rem',
    fontWeight: 800,
    fontFamily: 'var(--font-display)',
    marginBottom: '12px'
  },
  successText: {
    color: 'var(--text-secondary)',
    lineHeight: 1.6,
    fontSize: '0.98rem',
    maxWidth: '460px',
    marginBottom: '32px'
  },
  successBtns: {
    display: 'flex',
    gap: '12px',
    flexWrap: 'wrap',
    width: '100%',
    justifyContent: 'center'
  },
  formFooter: {
    borderTop: '1px solid var(--card-border)',
    paddingTop: '30px',
    marginTop: '30px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  }
};

export default PostJob;
