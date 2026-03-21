import { useState } from 'react';
import './App.css';
import { NavLink, Route, Routes } from 'react-router-dom';

import Activities from './components/Activities';
import Leaderboard from './components/Leaderboard';
import Teams from './components/Teams';
import Users from './components/Users';
import Workouts from './components/Workouts';

const NAV_LINKS = [
  { to: '/', label: 'Users', end: true },
  { to: '/teams', label: 'Teams' },
  { to: '/activities', label: 'Activities' },
  { to: '/leaderboard', label: 'Leaderboard' },
  { to: '/workouts', label: 'Workouts' },
];

function App() {
  const [navExpanded, setNavExpanded] = useState(false);

  return (
    <div className="app-shell">

      {/* Bootstrap Navbar */}
      <nav className="navbar navbar-expand-lg app-navbar">
        <div className="container">
          <span className="navbar-brand d-inline-flex align-items-center gap-2 fw-bold fs-5">
            <img src="/octofitapp-small.png" alt="OctoFit logo" className="app-logo" />
            <span>OctoFit Tracker</span>
          </span>

          <button
            className="navbar-toggler"
            type="button"
            aria-controls="mainNav"
            aria-expanded={navExpanded}
            aria-label="Toggle navigation"
            onClick={() => setNavExpanded((v) => !v)}
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className={`collapse navbar-collapse${navExpanded ? ' show' : ''}`} id="mainNav">
            <ul className="navbar-nav ms-auto gap-lg-1 mt-2 mt-lg-0">
              {NAV_LINKS.map(({ to, label, end }) => (
                <li className="nav-item" key={to}>
                  <NavLink
                    className={({ isActive }) =>
                      `nav-link px-3 py-2 rounded-pill${isActive ? ' active' : ''}`
                    }
                    to={to}
                    end={end || false}
                    onClick={() => setNavExpanded(false)}
                  >
                    {label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </nav>

      {/* Hero banner */}
      <header className="app-hero border-bottom">
        <div className="container py-4">
          <p className="eyebrow mb-2">Fitness Platform</p>
          <h1 className="display-6 fw-bold mb-2">OctoFit Tracker</h1>
          <p className="lead text-secondary mb-0">
            Browse users, teams, activities, leaderboard standings, and personalised workout
            suggestions — all powered by the Django REST Framework backend.
          </p>
        </div>
      </header>

      {/* Page content */}
      <main className="container py-4 py-lg-5">
        <Routes>
          <Route path="/" element={<Users />} />
          <Route path="/teams" element={<Teams />} />
          <Route path="/activities" element={<Activities />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/workouts" element={<Workouts />} />
        </Routes>
      </main>

      {/* Footer */}
      <footer className="border-top py-3 mt-auto">
        <div className="container">
          <p className="text-center resource-meta mb-0">
            OctoFit Tracker &mdash; Powered by Django REST Framework &amp; React
          </p>
        </div>
      </footer>

    </div>
  );
}

export default App;
