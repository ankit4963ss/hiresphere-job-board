import React, { createContext, useState, useEffect } from 'react';
import { initialJobs, initialApplicants } from '../utils/mockData';

export const JobContext = createContext();

export const JobProvider = ({ children }) => {
  // Load initial state from local storage or fallback to mockData
  const [jobs, setJobs] = useState(() => {
    const savedJobs = localStorage.getItem('hiresphere_jobs');
    return savedJobs ? JSON.parse(savedJobs) : initialJobs;
  });

  const [applications, setApplications] = useState(() => {
    const savedApps = localStorage.getItem('hiresphere_applications');
    return savedApps ? JSON.parse(savedApps) : initialApplicants;
  });

  const [bookmarks, setBookmarks] = useState(() => {
    const savedBookmarks = localStorage.getItem('hiresphere_bookmarks');
    return savedBookmarks ? JSON.parse(savedBookmarks) : [];
  });

  const [userType, setUserType] = useState(() => {
    const savedUserType = localStorage.getItem('hiresphere_usertype');
    return savedUserType || 'candidate'; // default to candidate
  });

  const [activeJobId, setActiveJobId] = useState(() => {
    const savedActiveJobId = localStorage.getItem('hiresphere_activejobid');
    return savedActiveJobId || (initialJobs.length > 0 ? initialJobs[0].id : null);
  });

  // Keep localStorage in sync
  useEffect(() => {
    localStorage.setItem('hiresphere_jobs', JSON.stringify(jobs));
  }, [jobs]);

  useEffect(() => {
    localStorage.setItem('hiresphere_applications', JSON.stringify(applications));
  }, [applications]);

  useEffect(() => {
    localStorage.setItem('hiresphere_bookmarks', JSON.stringify(bookmarks));
  }, [bookmarks]);

  useEffect(() => {
    localStorage.setItem('hiresphere_usertype', userType);
  }, [userType]);

  useEffect(() => {
    if (activeJobId) {
      localStorage.setItem('hiresphere_activejobid', activeJobId);
    }
  }, [activeJobId]);

  // Actions
  const addJob = (newJob) => {
    const job = {
      ...newJob,
      id: `job-${Date.now()}`,
      postedDate: new Date().toISOString().split('T')[0],
      logoBg: newJob.logoBg || '#4F46E5',
      logoText: newJob.company ? newJob.company.charAt(0).toUpperCase() : 'J',
      skills: Array.isArray(newJob.skills) ? newJob.skills : newJob.skills.split(',').map(s => s.trim()).filter(Boolean),
      eligibleBranches: Array.isArray(newJob.eligibleBranches)
        ? newJob.eligibleBranches
        : newJob.eligibleBranches?.split(',').map(s => s.trim()).filter(Boolean) || [],
      eligibleBatch: newJob.eligibleBatch || '',
      placementType: newJob.placementType || 'Off-Campus',
      driveDate: newJob.driveDate || '',
      responsibilities: Array.isArray(newJob.responsibilities) ? newJob.responsibilities : newJob.responsibilities.split('\n').map(r => r.trim()).filter(Boolean),
      requirements: Array.isArray(newJob.requirements) ? newJob.requirements : newJob.requirements.split('\n').map(r => r.trim()).filter(Boolean),
      benefits: Array.isArray(newJob.benefits) ? newJob.benefits : newJob.benefits.split('\n').map(b => b.trim()).filter(Boolean),
      featured: false
    };

    setJobs(prevJobs => [job, ...prevJobs]);
    setActiveJobId(job.id);
  };

  const applyToJob = (jobId, appData) => {
    const targetJob = jobs.find(j => j.id === jobId);
    const newApplication = {
      id: `app-${Date.now()}`,
      jobId,
      role: targetJob ? targetJob.title : appData.role,
      name: appData.name,
      email: appData.email,
      coverLetter: appData.coverLetter,
      resumeName: appData.resumeName || 'uploaded_resume.pdf',
      appliedDate: new Date().toISOString().split('T')[0],
      portfolioUrl: appData.portfolioUrl || '',
      githubUrl: appData.githubUrl || '',
      status: 'Applied'
    };

    setApplications(prevApps => [newApplication, ...prevApps]);
  };

  const updateApplicationStatus = (appId, newStatus) => {
    setApplications(prevApps =>
      prevApps.map(app =>
        app.id === appId ? { ...app, status: newStatus } : app
      )
    );
  };

  const toggleBookmark = (jobId) => {
    setBookmarks(prevBookmarks => {
      if (prevBookmarks.includes(jobId)) {
        return prevBookmarks.filter(id => id !== jobId);
      } else {
        return [...prevBookmarks, jobId];
      }
    });
  };

  const toggleUserType = () => {
    setUserType(prev => prev === 'candidate' ? 'employer' : 'candidate');
  };

  const getActiveJob = () => {
    return jobs.find(j => j.id === activeJobId) || jobs[0] || null;
  };

  return (
    <JobContext.Provider
      value={{
        jobs,
        applications,
        bookmarks,
        userType,
        activeJobId,
        setActiveJobId,
        addJob,
        applyToJob,
        updateApplicationStatus,
        toggleBookmark,
        toggleUserType,
        activeJob: getActiveJob()
      }}
    >
      {children}
    </JobContext.Provider>
  );
};
