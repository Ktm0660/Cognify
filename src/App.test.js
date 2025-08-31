import React from 'react';
import { render, screen } from '@testing-library/react';

// Mock react-router-dom to avoid dependency on actual implementation
jest.mock('react-router-dom', () => {
  const React = require('react');
  return {
    BrowserRouter: ({ children }) => <div>{children}</div>,
    Routes: ({ children }) => <div>{children}</div>,
    Route: ({ element }) => element,
    Navigate: () => null,
    NavLink: ({ children }) => <div>{children}</div>,
    useNavigate: () => jest.fn(),
  };
}, { virtual: true });

// Mock Firebase modules used in App
jest.mock('./firebase', () => ({
  auth: {},
  db: {},
}));

jest.mock('firebase/auth', () => ({
  onAuthStateChanged: (_auth, callback) => {
    // Immediately invoke callback with no user
    callback(null);
    return () => {};
  },
  signOut: jest.fn(),
}));

jest.mock('firebase/firestore', () => ({
  doc: jest.fn(),
  getDoc: jest.fn(),
}));

// Import App after mocks are set up
const App = require('./App').default;

test('renders header logo', () => {
  render(<App />);
  const headerElement = screen.getByText(/Game Theory Central/i);
  expect(headerElement).toBeInTheDocument();
});

