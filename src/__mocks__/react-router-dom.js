const React = require('react');

const MockAnchor = React.forwardRef(
  ({ children, className, to, href, ...rest }, ref) => {
    const computedClassName =
      typeof className === 'function'
        ? className({ isActive: false, isPending: false, isTransitioning: false })
        : className;

    const resolvedHref = typeof to === 'string' ? to : href || '#';

    return React.createElement(
      'a',
      {
        ...rest,
        ref,
        href: resolvedHref,
        className: computedClassName,
      },
      children,
    );
  },
);

MockAnchor.displayName = 'MockAnchor';

const BrowserRouter = ({ children }) => React.createElement(React.Fragment, null, children);
const MemoryRouter = BrowserRouter;
const Routes = ({ children }) => React.createElement(React.Fragment, null, children);
const Route = ({ element }) => element ?? null;
const Navigate = () => null;
const Outlet = () => null;

const createMockFn = () => (typeof jest !== 'undefined' ? jest.fn() : () => {});

const useNavigate = () => createMockFn();
const useLocation = () => ({ pathname: '/', search: '', hash: '', state: null, key: 'mock-location' });
const useParams = () => ({});

module.exports = {
  BrowserRouter,
  MemoryRouter,
  Routes,
  Route,
  Navigate,
  Link: MockAnchor,
  NavLink: MockAnchor,
  Outlet,
  useNavigate,
  useLocation,
  useParams,
};