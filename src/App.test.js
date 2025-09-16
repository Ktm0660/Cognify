import { render, screen, waitFor } from '@testing-library/react';
import App from './App';

jest.mock('react-router-dom');

test('renders without crashing', async () => {
  render(<App />);

  expect(screen.getByText(/loading/i)).toBeInTheDocument();

  await waitFor(() => {
    expect(screen.getByText(/login/i)).toBeInTheDocument();
  });
});