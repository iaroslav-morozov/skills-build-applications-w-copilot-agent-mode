import { useEffect, useState } from 'react';

const endpoint = process.env.REACT_APP_CODESPACE_NAME
  ? `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api/teams/`
  : 'http://localhost:8000/api/teams/';

function Teams() {
  const [teams, setTeams] = useState([]);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isActive = true;

    const loadTeams = async () => {
      console.log('Teams endpoint:', endpoint);

      try {
        const response = await fetch(endpoint);

        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }

        const data = await response.json();
        console.log('Teams fetched data:', data);

        if (isActive) {
          setTeams(Array.isArray(data) ? data : data.results || []);
        }
      } catch (requestError) {
        console.error('Failed to fetch teams:', requestError);

        if (isActive) {
          setError(requestError.message);
        }
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    };

    loadTeams();

    return () => {
      isActive = false;
    };
  }, []);

  const filteredTeams = teams.filter((team) => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return true;
    }

    return [team.id, team.name]
      .filter(Boolean)
      .some((value) => String(value).toLowerCase().includes(normalizedQuery));
  });

  return (
    <section className="resource-section">
      {/* Section heading */}
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-2">
        <div>
          <h2 className="h2 fw-bold mb-1">Teams</h2>
          <p className="resource-meta mb-0">Team roster data from the backend API.</p>
        </div>
        <span className="badge bg-secondary rounded-pill fs-6">{teams.length} teams</span>
      </div>

      {/* Bootstrap card with table */}
      <div className="card shadow-sm">
        <div className="card-header py-3">
          <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
            <h5 className="card-title mb-0">Team Directory</h5>
            <a
              href={endpoint}
              className="btn btn-sm btn-outline-secondary"
              target="_blank"
              rel="noopener noreferrer"
            >
              View API
            </a>
          </div>

          <form className="row g-2 align-items-end" onSubmit={(event) => event.preventDefault()}>
            <div className="col-12 col-md-8 col-lg-9">
              <label htmlFor="teams-filter" className="form-label mb-1">Filter teams</label>
              <input
                id="teams-filter"
                className="form-control"
                type="search"
                placeholder="Search by team id or team name"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
            </div>
            <div className="col-12 col-md-4 col-lg-3 d-flex gap-2">
              <button type="button" className="btn btn-primary w-100" onClick={() => setQuery(query.trim())}>
                Apply
              </button>
              <button type="button" className="btn btn-outline-secondary" onClick={() => setQuery('')}>
                Reset
              </button>
            </div>
          </form>
        </div>

        <div className="card-body p-0">
          {loading ? (
            <div className="d-flex justify-content-center align-items-center gap-3 p-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading teams...</span>
              </div>
              <span className="text-muted">Loading teams…</span>
            </div>
          ) : error ? (
            <div className="alert alert-danger m-3" role="alert">
              <strong>Error:</strong> {error}
            </div>
          ) : filteredTeams.length === 0 ? (
            <div className="resource-empty m-3">
              <p className="fw-semibold mb-1">No teams match the current filter.</p>
              <p className="mb-0">Update your search or reset filters to view all records.</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">ID</th>
                    <th scope="col">Team Name</th>
                    <th scope="col" className="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTeams.map((team, index) => (
                    <tr key={team.id}>
                      <td className="text-muted">{index + 1}</td>
                      <td><code>{team.id}</code></td>
                      <td className="fw-semibold">{team.name || 'Unnamed team'}</td>
                      <td className="text-end">
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => setSelectedTeam(team)}
                        >
                          Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="card-footer py-2 px-3">
          <small className="resource-meta">
            API endpoint:{' '}
            <a href={endpoint} className="link-secondary" target="_blank" rel="noopener noreferrer">
              {endpoint}
            </a>
          </small>
        </div>
      </div>

      {selectedTeam && (
        <>
          <div className="modal fade show d-block" tabIndex="-1" role="dialog" aria-modal="true">
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Team Details</h5>
                  <button
                    type="button"
                    className="btn-close"
                    aria-label="Close"
                    onClick={() => setSelectedTeam(null)}
                  ></button>
                </div>
                <div className="modal-body">
                  <p><strong>Team ID:</strong> {selectedTeam.id}</p>
                  <p className="mb-0"><strong>Team Name:</strong> {selectedTeam.name || 'Unnamed team'}</p>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setSelectedTeam(null)}>
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show"></div>
        </>
      )}
    </section>
  );
}

export default Teams;
