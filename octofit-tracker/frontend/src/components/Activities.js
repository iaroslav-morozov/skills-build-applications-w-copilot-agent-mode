import { useEffect, useState } from 'react';

const endpoint = process.env.REACT_APP_CODESPACE_NAME
  ? `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api/activities/`
  : 'http://localhost:8000/api/activities/';

function Activities() {
  const [activities, setActivities] = useState([]);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isActive = true;

    const loadActivities = async () => {
      console.log('Activities endpoint:', endpoint);

      try {
        const response = await fetch(endpoint);

        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }

        const data = await response.json();
        console.log('Activities fetched data:', data);

        if (isActive) {
          setActivities(Array.isArray(data) ? data : data.results || []);
        }
      } catch (requestError) {
        console.error('Failed to fetch activities:', requestError);

        if (isActive) {
          setError(requestError.message);
        }
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    };

    loadActivities();

    return () => {
      isActive = false;
    };
  }, []);

  const filteredActivities = activities.filter((activity) => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return true;
    }

    return [activity.username, activity.type, activity.distance, activity.duration]
      .filter(Boolean)
      .some((value) => String(value).toLowerCase().includes(normalizedQuery));
  });

  return (
    <section className="resource-section">
      {/* Section heading */}
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-2">
        <div>
          <h2 className="h2 fw-bold mb-1">Activities</h2>
          <p className="resource-meta mb-0">Live activity logs from the Django REST Framework backend.</p>
        </div>
        <span className="badge bg-secondary rounded-pill fs-6">{activities.length} records</span>
      </div>

      {/* Bootstrap card with table */}
      <div className="card shadow-sm">
        <div className="card-header py-3">
          <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
            <h5 className="card-title mb-0">Activity Feed</h5>
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
              <label htmlFor="activities-filter" className="form-label mb-1">Filter activities</label>
              <input
                id="activities-filter"
                className="form-control"
                type="search"
                placeholder="Search by username, type, duration, or distance"
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
                <span className="visually-hidden">Loading activities...</span>
              </div>
              <span className="text-muted">Loading activities…</span>
            </div>
          ) : error ? (
            <div className="alert alert-danger m-3" role="alert">
              <strong>Error:</strong> {error}
            </div>
          ) : filteredActivities.length === 0 ? (
            <div className="resource-empty m-3">
              <p className="fw-semibold mb-1">No activities match the current filter.</p>
              <p className="mb-0">Update your search or reset filters to view all records.</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">User</th>
                    <th scope="col">Type</th>
                    <th scope="col">Duration</th>
                    <th scope="col">Distance</th>
                    <th scope="col">Timestamp</th>
                    <th scope="col" className="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredActivities.map((activity, index) => (
                    <tr key={activity.id}>
                      <td className="text-muted">{index + 1}</td>
                      <td>{activity.username || 'Unknown user'}</td>
                      <td>
                        <span className="badge bg-info text-dark">{activity.type || 'N/A'}</span>
                      </td>
                      <td>{activity.duration ? `${activity.duration} min` : 'N/A'}</td>
                      <td>{activity.distance ? `${activity.distance} km` : 'N/A'}</td>
                      <td className="text-muted">
                        {activity.timestamp
                          ? new Date(activity.timestamp).toLocaleString()
                          : 'N/A'}
                      </td>
                      <td className="text-end">
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => setSelectedActivity(activity)}
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

      {selectedActivity && (
        <>
          <div className="modal fade show d-block" tabIndex="-1" role="dialog" aria-modal="true">
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Activity Details</h5>
                  <button
                    type="button"
                    className="btn-close"
                    aria-label="Close"
                    onClick={() => setSelectedActivity(null)}
                  ></button>
                </div>
                <div className="modal-body">
                  <p><strong>User:</strong> {selectedActivity.username || 'Unknown user'}</p>
                  <p><strong>Type:</strong> {selectedActivity.type || 'N/A'}</p>
                  <p><strong>Duration:</strong> {selectedActivity.duration ? `${selectedActivity.duration} min` : 'N/A'}</p>
                  <p><strong>Distance:</strong> {selectedActivity.distance ? `${selectedActivity.distance} km` : 'N/A'}</p>
                  <p className="mb-0"><strong>Timestamp:</strong> {selectedActivity.timestamp ? new Date(selectedActivity.timestamp).toLocaleString() : 'N/A'}</p>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setSelectedActivity(null)}>
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

export default Activities;
