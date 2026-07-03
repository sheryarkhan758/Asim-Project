import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar.jsx';
import Footer from './Footer.jsx';
import Loading from './Loading.jsx';
import RouteTransition from './RouteTransition.jsx';

// Global chrome wrapped around every route. The Suspense boundary here lets
// lazy-loaded route chunks stream in while the navbar/footer stay put.
export default function Layout() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <main style={{ flex: 1 }}>
        <Suspense fallback={<Loading />}>
          <RouteTransition>
            <Outlet />
          </RouteTransition>
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
