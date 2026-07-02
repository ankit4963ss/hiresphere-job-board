import React, { useState, useContext } from 'react';
import { JobContext } from '../context/JobContext';
import { X, ArrowRight, ArrowLeft, Upload, CheckCircle, FileText, Globe } from 'lucide-react';
import confetti from 'canvas-confetti';

const Github = ({ size = 18, ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const ApplyModal = ({ job, onClose }) => {
  const { applyToJob } = useContext(JobContext);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    portfolioUrl: '',
    githubUrl: '',
    coverLetter: '',
    resumeName: ''
  });

  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const triggerConfetti = () => {
    const duration = 2 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 1100 };

    function randomInRange(min, max) {
      return Math.random() * (max - min) + min;
    }

    const interval = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      // since particles fall down, start a bit higher than random
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);
  };

  const handleNextStep = () => {
    const newErrors = {};
    if (step === 1) {
      if (!formData.name.trim()) newErrors.name = 'Full name is required';
      if (!formData.email.trim()) {
        newErrors.email = 'Email address is required';
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = 'Please enter a valid email address';
      }
      if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    } else if (step === 2) {
      if (!formData.resumeName) newErrors.resume = 'Please upload a resume';
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

  const handleMockResumeUpload = () => {
    setFormData(prev => ({ ...prev, resumeName: `${formData.name.replace(/\s+/g, '_') || 'candidate'}_resume_revised.pdf` }));
    if (errors.resume) {
      setErrors(prev => ({ ...prev, resume: '' }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    applyToJob(job.id, formData);
    triggerConfetti();
    setStep(5); // Success step
  };

  if (!job) return null;

  return (
    <div style={styles.modalOverlay} className="animate-fade-in">
      <div style={styles.modalContent} className="glass-card animate-slide-up">
        {/* Header (Hidden on success) */}
        {step < 5 && (
          <div style={styles.modalHeader}>
            <div>
              <h3 style={styles.modalTitle}>Apply to {job.company}</h3>
              <p style={styles.modalSubtitle}>{job.title}</p>
            </div>
            <button onClick={onClose} style={styles.closeBtn} className="btn-secondary">
              <X size={18} />
            </button>
          </div>
        )}

        {/* Step Progress Tracker */}
        {step < 5 && (
          <div style={styles.progressTracker}>
            {[1, 2, 3, 4].map(s => (
              <React.Fragment key={s}>
                <div
                  style={{
                    ...styles.progressNode,
                    backgroundColor: step >= s ? 'var(--accent)' : 'var(--bg-tertiary)',
                    borderColor: step === s ? 'var(--text-primary)' : 'var(--card-border)',
                    color: step >= s ? '#ffffff' : 'var(--text-secondary)'
                  }}
                >
                  {s}
                </div>
                {s < 4 && (
                  <div
                    style={{
                      ...styles.progressLine,
                      backgroundColor: step > s ? 'var(--accent)' : 'var(--card-border)'
                    }}
                  ></div>
                )}
              </React.Fragment>
            ))}
          </div>
        )}

        {/* Modal Forms Body */}
        <form onSubmit={handleSubmit} style={styles.formBody}>
          
          {/* STEP 1: Personal Details */}
          {step === 1 && (
            <div style={styles.stepContainer} className="animate-fade-in">
              <h4 style={styles.stepHeading}>1. Contact Information</h4>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="John Doe"
                  className="input-field"
                />
                {errors.name && <span style={styles.errorText}>{errors.name}</span>}
              </div>
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="john.doe@example.com"
                  className="input-field"
                />
                {errors.email && <span style={styles.errorText}>{errors.email}</span>}
              </div>
              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="+1 (555) 019-2834"
                  className="input-field"
                />
                {errors.phone && <span style={styles.errorText}>{errors.phone}</span>}
              </div>
            </div>
          )}

          {/* STEP 2: Resume & Links */}
          {step === 2 && (
            <div style={styles.stepContainer} className="animate-fade-in">
              <h4 style={styles.stepHeading}>2. Credentials & Profiles</h4>
              
              {/* Uploader UI */}
              <div className="form-group">
                <label className="form-label">Resume / CV</label>
                <div style={styles.uploadBox} className="glass-card" onClick={handleMockResumeUpload}>
                  <Upload size={24} color="var(--accent)" style={{ marginBottom: '8px' }} />
                  <span style={styles.uploadText}>Click to attach a simulated PDF</span>
                  <span style={styles.uploadSubtext}>Supports PDF, DOCX up to 5MB</span>
                </div>
                {formData.resumeName && (
                  <div style={styles.resumeBadge} className="glass-card">
                    <FileText size={16} color="var(--accent)" />
                    <span style={styles.resumeName}>{formData.resumeName}</span>
                  </div>
                )}
                {errors.resume && <span style={styles.errorText}>{errors.resume}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">
                  <Globe size={14} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
                  Portfolio Website (Optional)
                </label>
                <input
                  type="url"
                  name="portfolioUrl"
                  value={formData.portfolioUrl}
                  onChange={handleInputChange}
                  placeholder="https://johndoe.dev"
                  className="input-field"
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  <Github size={14} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
                  GitHub URL (Optional)
                </label>
                <input
                  type="url"
                  name="githubUrl"
                  value={formData.githubUrl}
                  onChange={handleInputChange}
                  placeholder="https://github.com/johndoe"
                  className="input-field"
                />
              </div>
            </div>
          )}

          {/* STEP 3: Cover Letter */}
          {step === 3 && (
            <div style={styles.stepContainer} className="animate-fade-in">
              <h4 style={styles.stepHeading}>3. Introduce Yourself</h4>
              <div className="form-group">
                <label className="form-label">Cover Letter / Message to Hiring Manager</label>
                <textarea
                  name="coverLetter"
                  value={formData.coverLetter}
                  onChange={handleInputChange}
                  placeholder="Briefly share why you are a great fit for this position..."
                  className="input-field"
                ></textarea>
              </div>
            </div>
          )}

          {/* STEP 4: Review */}
          {step === 4 && (
            <div style={styles.stepContainer} className="animate-fade-in">
              <h4 style={styles.stepHeading}>4. Confirm Details</h4>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '16px' }}>
                Please review your application summary details before submitting.
              </p>
              
              <div style={styles.reviewGrid} className="glass-card">
                <div style={styles.reviewRow}>
                  <span style={styles.reviewLabel}>Full Name:</span>
                  <span style={styles.reviewVal}>{formData.name}</span>
                </div>
                <div style={styles.reviewRow}>
                  <span style={styles.reviewLabel}>Email:</span>
                  <span style={styles.reviewVal}>{formData.email}</span>
                </div>
                <div style={styles.reviewRow}>
                  <span style={styles.reviewLabel}>Phone:</span>
                  <span style={styles.reviewVal}>{formData.phone}</span>
                </div>
                <div style={styles.reviewRow}>
                  <span style={styles.reviewLabel}>Attached CV:</span>
                  <span style={styles.reviewVal}>{formData.resumeName}</span>
                </div>
                {formData.portfolioUrl && (
                  <div style={styles.reviewRow}>
                    <span style={styles.reviewLabel}>Portfolio:</span>
                    <span style={styles.reviewVal}>{formData.portfolioUrl}</span>
                  </div>
                )}
                {formData.githubUrl && (
                  <div style={styles.reviewRow}>
                    <span style={styles.reviewLabel}>GitHub:</span>
                    <span style={styles.reviewVal}>{formData.githubUrl}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* STEP 5: Success Confirmation Screen */}
          {step === 5 && (
            <div style={styles.successContainer} className="animate-fade-in">
              <CheckCircle size={64} color="var(--success)" style={{ marginBottom: '20px' }} />
              <h3 style={styles.successTitle}>Application Submitted!</h3>
              <p style={styles.successText}>
                Your application to **{job.company}** for the **{job.title}** role was successfully delivered. You can track your progress inside the Candidate Dashboard.
              </p>
              <button type="button" onClick={onClose} className="btn btn-primary" style={styles.closeSuccessBtn}>
                Back to Explorer
              </button>
            </div>
          )}

          {/* Footer Controls (Hidden on success) */}
          {step < 5 && (
            <div style={styles.modalFooter}>
              {step > 1 ? (
                <button type="button" onClick={handlePrevStep} className="btn btn-secondary">
                  <ArrowLeft size={16} /> Back
                </button>
              ) : (
                <div></div> /* spacing filler */
              )}

              {step < 4 ? (
                <button type="button" onClick={handleNextStep} className="btn btn-primary">
                  Next <ArrowRight size={16} />
                </button>
              ) : (
                <button type="submit" className="btn btn-primary" style={styles.submitBtn}>
                  Submit Application
                </button>
              )}
            </div>
          )}

        </form>
      </div>
    </div>
  );
};

const styles = {
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(5, 5, 8, 0.75)',
    backdropFilter: 'blur(8px)',
    zIndex: 1000,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px'
  },
  modalContent: {
    width: '100%',
    maxWidth: '560px',
    borderRadius: 'var(--radius-xl)',
    overflow: 'hidden',
    borderWidth: '1px',
    borderStyle: 'solid',
    display: 'flex',
    flexDirection: 'column'
  },
  modalHeader: {
    padding: '24px 28px',
    borderBottom: '1px solid var(--card-border)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    background: 'rgba(255, 255, 255, 0.01)'
  },
  modalTitle: {
    fontSize: '1.25rem',
    fontWeight: 800,
    fontFamily: 'var(--font-display)'
  },
  modalSubtitle: {
    fontSize: '0.88rem',
    color: 'var(--text-secondary)',
    fontWeight: 500,
    marginTop: '2px'
  },
  closeBtn: {
    padding: '8px',
    borderRadius: '8px',
    cursor: 'pointer'
  },
  progressTracker: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px 28px 0 28px'
  },
  progressNode: {
    width: '28px',
    height: '28px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.8rem',
    fontWeight: 700,
    border: '2px solid transparent',
    transition: 'all var(--transition-normal)'
  },
  progressLine: {
    height: '2px',
    flex: 1,
    margin: '0 8px',
    transition: 'all var(--transition-normal)'
  },
  formBody: {
    padding: '28px'
  },
  stepContainer: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '260px'
  },
  stepHeading: {
    fontSize: '1.05rem',
    fontWeight: 700,
    fontFamily: 'var(--font-display)',
    marginBottom: '16px',
    color: 'var(--text-primary)'
  },
  uploadBox: {
    padding: '30px 20px',
    borderRadius: 'var(--radius-md)',
    border: '2px dashed var(--card-border)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    textAlign: 'center',
    transition: 'all var(--transition-normal)'
  },
  uploadText: {
    fontSize: '0.92rem',
    fontWeight: 600,
    color: 'var(--text-primary)',
    marginTop: '8px'
  },
  uploadSubtext: {
    fontSize: '0.75rem',
    color: 'var(--text-muted)',
    marginTop: '2px'
  },
  resumeBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 14px',
    borderRadius: '8px',
    border: '1px solid var(--card-border)',
    marginTop: '10px',
    width: 'fit-content'
  },
  resumeName: {
    fontSize: '0.85rem',
    fontWeight: 500,
    color: 'var(--text-primary)'
  },
  errorText: {
    color: 'var(--danger)',
    fontSize: '0.78rem',
    fontWeight: 500,
    marginTop: '4px'
  },
  reviewGrid: {
    padding: '16px',
    border: '1px solid var(--card-border)',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px'
  },
  reviewRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.9rem',
    borderBottom: '1px solid rgba(255, 255, 255, 0.02)',
    paddingBottom: '6px'
  },
  reviewLabel: {
    color: 'var(--text-secondary)',
    fontWeight: 500
  },
  reviewVal: {
    fontWeight: 600,
    color: 'var(--text-primary)'
  },
  successContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    padding: '30px 10px',
    minHeight: '260px'
  },
  successTitle: {
    fontSize: '1.5rem',
    fontWeight: 800,
    fontFamily: 'var(--font-display)',
    marginBottom: '8px'
  },
  successText: {
    color: 'var(--text-secondary)',
    lineHeight: 1.55,
    fontSize: '0.94rem',
    maxWidth: '400px',
    marginBottom: '28px'
  },
  closeSuccessBtn: {
    width: '100%',
    height: '46px',
    borderRadius: '10px'
  },
  modalFooter: {
    borderTop: '1px solid var(--card-border)',
    paddingTop: '20px',
    marginTop: '20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  submitBtn: {
    boxShadow: 'var(--shadow-accent)'
  }
};

export default ApplyModal;
