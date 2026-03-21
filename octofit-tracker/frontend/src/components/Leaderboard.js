import { useEffect, useState } from 'react';

const endpoint = process.env.REACT_APP_CODESPACE_NAME
  ? `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api/leaderboard/`
  : 'http://localhost:8000/api/leaderboard/';

const RANK_BADGES = ['🥇', '🥈', '🥉'];

function Leaderboard() {
  const [entries, setEntries] = useState([]);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isActive = true;

    const loadLeaderboard = async () => {
      console.log('Leaderboard endpoint:', endpoint);

      try {
        const response = await fetch(endpoint);

        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }

        const data = await response.json();
        console.log('Leaderboard fetched data:', data);

        if (isActive) {
          setEntries(Array.isArray(data) ? data : data.results || []);
        }
      } catch (requestError) {
        console.error('Failed to fetch leaderboard:', requestError);

        if (isActive) {
          setError(requestError.message);
        }
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    };

    loadLeaderboard();

    return () => {
      isActive = false;
    };
  }, []);

  const filteredEntries = entries.filter((entry) => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return true;
    }

    return [entry.username, entry.points]
      .filter((value) => value !== null && value !== undefined)
      .some((value) => String(value).toLowerCase().includes(normalizedQuery));
  });

  return (
    <section className="resource-section">
      {/* Section heading */}
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-2">
        <div>
          <h2 className="h2 fw-bold mb-1">Leaderboard</h2>
          <p className="resource-meta mb-0">Competitive standings sourced from the live API.</p>
        </div>
        <span className="badge bg-secondary rounded-pill fs-6">{entries.length} standings</span>
      </div>

      {/* Bootstrap card with table */}
      <div className="card shadow-sm">
        <div className="card-header py-3">
          <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
            <h5 className="card-title mb-0">Top Performers</h5>
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
              <label htmlFor="leaderboard-filter" className="form-label mb-1">Filter leaderboard</label>
              <input
                id="leaderboard-filter"
                className="form-control"
                type="search"
                placeholder="Search by user or points"
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
                <span className="visually-hidden">Loading leaderboard...</span>
              </div>
              <span className="text-muted">Loading leaderboard…</span>
            </div>
          ) : error ? (
            <div className="alert alert-danger m-3" role="alert">
              <strong>Error:</strong> {error}
            </div>
          ) : filteredEntries.length === 0 ? (
            <div className="resource-empty m-3">
              <p className="fw-semibold mb-1">No leaderboard entries match the current filter.</p>
              <p className="mb-0">Update your search or reset filters to view all standings.</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th scope="col">Rank</th>
                    <th scope="col">User</th>
                    <th scope="col">Points</th>
                    <th scope="col" className="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEntries.map((entry, index) => (
                    <tr key={entry.id}>
                      <td>
                        {index < 3 ? (
                          <span className="fs-5">{RANK_BADGES[index]}</span>
                        ) : (
                          <span className="text-muted">#{index + 1}</span>
                        )}
                      </td>
                      <td className="fw-semibold">{entry.username || 'Unknown user'}</td>
                      <td>
                        <span className="badge bg-success fs-6">{entry.points ?? 'N/A'}</span>
                      </td>
                      <td className="text-end">
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => setSelectedEntry({ ...entry, rank: index + 1 })}
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

      {selectedEntry && (
        <>
          <div className="modal fade show d-block" tabIndex="-1" role="dialog" aria-modal="true">
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Leaderboard Entry</h5>
                  <button
                    type="button"
                    className="btn-close"
                    aria-label="Close"
                    onClick={() => setSelectedEntry(null)}
                  ></button>
                </div>
                <div className="modal-body">
                  <p><strong>Rank:</strong> #{selectedEntry.rank}</p>
                  <p><strong>User:</strong> {selectedEntry.username || 'Unknown user'}</p>
                  <p className="mb-0"><strong>Points:</strong> {selectedEntry.points ?? 'N/A'}</p>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setSelectedEntry(null)}>
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

export default Leaderboard;
