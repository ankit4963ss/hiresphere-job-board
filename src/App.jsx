import React, { useState } from 'react';
import { JobProvider } from './context/JobContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import Campus from './pages/Campus';
import Jobs from './pages/Jobs';
import PostJob from './pages/PostJob';
import Dashboard from './pages/Dashboard';

function App() {
  const [activePage, setActivePage] = useState('home');
  const [searchFilters, setSearchFilters] = useState({
    query: '',
    location: '',
    category: '',
    type: '',
    branch: '',
    batch: '',
    placementType: '',
    onCampusOnly: false
  });

  return (
    <JobProvider>
      <Layout activePage={activePage} setActivePage={setActivePage}>
        {activePage === 'home' && (
          <Home
            setActivePage={setActivePage}
            setSearchFilters={setSearchFilters}
          />
        )}
        {activePage === 'campus' && (
          <Campus
            setActivePage={setActivePage}
            setSearchFilters={setSearchFilters}
          />
        )}
        {activePage === 'jobs' && (
          <Jobs
            searchFilters={searchFilters}
            setSearchFilters={setSearchFilters}
          />
        )}
        {activePage === 'post-job' && (
          <PostJob
            setActivePage={setActivePage}
          />
        )}
        {activePage === 'dashboard' && (
          <Dashboard
            setActivePage={setActivePage}
          />
        )}
      </Layout>
    </JobProvider>
  );
}

export default App;
