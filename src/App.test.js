import { render, waitFor } from '@testing-library/react';
import App from './App';

jest.mock('react-router-dom');

test('renders without crashing', async () => {
  const { container } = render(<App />);

  await waitFor(() => {
    expect(container.firstChild).toBeTruthy();
  });
});
