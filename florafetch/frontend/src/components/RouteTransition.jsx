import { useLocation } from 'react-router-dom';

// Re-mounts (via the location key) and replays a subtle fade-up each time the
// route changes, so navigating between pages feels smooth instead of abrupt.
export default function RouteTransition({ children }) {
  const location = useLocation();
  return (
    <div key={location.pathname} className="ff-page-enter">
      {children}
    </div>
  );
}
