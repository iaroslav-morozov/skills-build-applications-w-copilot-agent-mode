import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App';

jest.mock('./components/Activities', () => () => <div>Activities page</div>);
jest.mock('./components/Leaderboard', () => () => <div>Leaderboard page</div>);
jest.mock('./components/Teams', () => () => <div>Teams page</div>);
jest.mock('./components/Users', () => () => <div>Users page</div>);
jest.mock('./components/Workouts', () => () => <div>Workouts page</div>);

test('renders the octofit navigation shell', () => {
  render(
    <MemoryRouter
      future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
      initialEntries={["/"]}
    >
      <App />
    </MemoryRouter>
  );

  expect(
    screen.getByRole('heading', { name: /octofit tracker/i })
  ).toBeInTheDocument();
  expect(screen.getByRole('link', { name: /users/i })).toBeInTheDocument();
  expect(screen.getByText(/users page/i)).toBeInTheDocument();
});
