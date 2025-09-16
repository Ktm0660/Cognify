import { render, screen } from '@testing-library/react';
import App from './App';

jest.mock('react-router-dom');

test('renders without crashing', () => {
  const { container } = render(<App />);
  expect(container.firstChild).toBeTruthy();
});
