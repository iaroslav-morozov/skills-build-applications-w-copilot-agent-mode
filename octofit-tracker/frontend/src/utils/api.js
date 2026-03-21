/**
 * Returns the API base URL for the backend.
 * In GitHub Codespaces, derives the backend URL from window.location by replacing
 * the frontend port (3000) with the backend port (8000).
 * Falls back to localhost:8000 for local development.
 */
export const getApiBase = () => {
  const { hostname, protocol } = window.location;
  const codespacesMatch = hostname.match(/^(.+)-3000\.app\.github\.dev$/);
  if (codespacesMatch) {
    return `${protocol}//${codespacesMatch[1]}-8000.app.github.dev`;
  }
  return 'http://localhost:8000';
};
