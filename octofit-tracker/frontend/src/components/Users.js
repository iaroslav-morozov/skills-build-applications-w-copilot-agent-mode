import { useEffect, useState } from 'react';
import { getApiBase } from '../utils/api';

const endpoint = `${getApiBase()}/api/users/`;

function Users() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isActive = true;

    const loadUsers = async () => {
      console.log('Users endpoint:', endpoint);

      try {
        const response = await fetch(endpoint);

        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }

        const data = await response.json();
        console.log('Users fetched data:', data);

        if (isActive) {
          setUsers(Array.isArray(data) ? data : data.results || []);
        }
      } catch (requestError) {
        console.error('Failed to fetch users:', requestError);

        if (isActive) {
          setError(requestError.message);
        }
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    };

    loadUsers();

    return () => {
      isActive = false;
    };
  }, []);

  const filteredUsers = users.filter((user) => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return true;
    }

    return [user.username, user.first_name, user.last_name, user.email, user.team_name]
      .filter(Boolean)
      .some((value) => String(value).toLowerCase().includes(normalizedQuery));
  });

  return (
    <section className="resource-section">
      {/* Section heading */}
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-2">
        <div>
          <h2 className="h2 fw-bold mb-1">Users</h2>
          <p className="resource-meta mb-0">User profiles and team assignments from the backend API.</p>
        </div>
        <span className="badge bg-secondary rounded-pill fs-6">{users.length} users</span>
      </div>

      {/* Bootstrap card with table */}
      <div className="card shadow-sm">
        <div className="card-header py-3">
          <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
            <h5 className="card-title mb-0">Member Directory</h5>
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
              <label htmlFor="users-filter" className="form-label mb-1">Filter users</label>
              <input
                id="users-filter"
                className="form-control"
                type="search"
                placeholder="Search by username, name, email, or team"
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
                <span className="visually-hidden">Loading users...</span>
              </div>
              <span className="text-muted">Loading users…</span>
            </div>
          ) : error ? (
            <div className="alert alert-danger m-3" role="alert">
              <strong>Error:</strong> {error}
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="resource-empty m-3">
              <p className="fw-semibold mb-1">No users match the current filter.</p>
              <p className="mb-0">Update your search or reset filters to view all records.</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">Username</th>
                    <th scope="col">Full Name</th>
                    <th scope="col">Email</th>
                    <th scope="col">Team</th>
                    <th scope="col" className="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user, index) => (
                    <tr key={user.id}>
                      <td className="text-muted">{index + 1}</td>
                      <td className="fw-semibold">{user.username || 'N/A'}</td>
                      <td>
                        {[user.first_name, user.last_name].filter(Boolean).join(' ') || 'N/A'}
                      </td>
                      <td>
                        {user.email ? (
                          <a href={`mailto:${user.email}`} className="link-secondary">
                            {user.email}
                          </a>
                        ) : (
                          'N/A'
                        )}
                      </td>
                      <td>
                        {user.team_name ? (
                          <span className="badge bg-primary">{user.team_name}</span>
                        ) : (
                          <span className="text-muted">Unassigned</span>
                        )}
                      </td>
                      <td className="text-end">
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => setSelectedUser(user)}
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

      {selectedUser && (
        <>
          <div className="modal fade show d-block" tabIndex="-1" role="dialog" aria-modal="true">
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">User Details</h5>
                  <button
                    type="button"
                    className="btn-close"
                    aria-label="Close"
                    onClick={() => setSelectedUser(null)}
                  ></button>
                </div>
                <div className="modal-body">
                  <p><strong>Username:</strong> {selectedUser.username || 'N/A'}</p>
                  <p><strong>Name:</strong> {[selectedUser.first_name, selectedUser.last_name].filter(Boolean).join(' ') || 'N/A'}</p>
                  <p><strong>Email:</strong> {selectedUser.email || 'N/A'}</p>
                  <p className="mb-0"><strong>Team:</strong> {selectedUser.team_name || 'Unassigned'}</p>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setSelectedUser(null)}>
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

export default Users;
