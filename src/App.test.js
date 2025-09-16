import { render, screen, waitFor } from '@testing-library/react';
import App from './App';

jest.mock('react-router-dom');

test('renders without crashing', async () => {
  render(<App />);

  await waitFor(() => {
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });
});
