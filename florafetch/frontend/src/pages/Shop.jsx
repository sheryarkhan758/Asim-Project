import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getPlants } from '../api/plants.js';
import FilterSidebar from '../components/FilterSidebar.jsx';
import ProductGrid from '../components/ProductGrid.jsx';
import PaginationBar from '../components/PaginationBar.jsx';

const PAGE_SIZE = 6;

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [plants, setPlants] = useState([]);
  const [status, setStatus] = useState('loading'); // loading | ready | error

  // --- Filter values derived from the URL (single source of truth). ---
  const filters = useMemo(
    () => ({
      category: searchParams.get('category') || '',
      low_maint: searchParams.get('low_maint') === '1',
      pet_friendly: searchParams.get('pet_friendly') === '1',
      min_price: searchParams.get('min_price') || '',
      max_price: searchParams.get('max_price') || '',
    }),
    [searchParams]
  );
  const page = Math.max(1, Number(searchParams.get('page')) || 1);

  // API query params — only include filters that are actually set.
  const apiParams = useMemo(() => {
    const p = {};
    if (filters.category) p.category = filters.category;
    if (filters.low_maint) p.low_maint = 1;
    if (filters.pet_friendly) p.pet_friendly = 1;
    if (filters.min_price !== '') p.min_price = filters.min_price;
    if (filters.max_price !== '') p.max_price = filters.max_price;
    return p;
  }, [filters]);
  const queryKey = JSON.stringify(apiParams);

  // Fetch whenever the filters (not the page) change — pagination is client-side.
  useEffect(() => {
    let active = true;
    setStatus('loading');
    getPlants(apiParams)
      .then((data) => {
        if (!active) return;
        setPlants(data.plants || []);
        setStatus('ready');
      })
      .catch(() => active && setStatus('error'));
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryKey]);

  // --- URL updates ---
  // Setting a filter resets pagination back to page 1.
  const setFilter = (key, value) => {
    const next = new URLSearchParams(searchParams);
    const empty = value === '' || value === false || value == null;
    if (empty) next.delete(key);
    else next.set(key, value === true ? '1' : String(value));
    next.delete('page');
    setSearchParams(next);
  };

  const clearFilters = () => setSearchParams({});

  const setPage = (n) => {
    const next = new URLSearchParams(searchParams);
    if (n <= 1) next.delete('page');
    else next.set('page', String(n));
    setSearchParams(next);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // --- Client-side pagination ---
  const pageCount = Math.max(1, Math.ceil(plants.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const visible = plants.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  return (
    <div className="ff-page" style={{ fontFamily: 'sans-serif', padding: '1.5rem' }}>
      <h1 style={{ color: '#2f4a38', marginTop: 0 }}>Shop plants</h1>

      <div className="ff-split-left" style={{ '--ff-aside': '240px' }}>
        <FilterSidebar values={filters} onChange={setFilter} onClear={clearFilters} />

        <div>
          {status === 'loading' && <p style={{ color: '#667' }}>Loading plants…</p>}
          {status === 'error' && (
            <p style={{ color: '#c0392b' }}>Something went wrong loading plants. Please try again.</p>
          )}

          {status === 'ready' && (
            <>
              <p style={{ color: '#667', margin: '0 0 1rem' }}>
                {plants.length} {plants.length === 1 ? 'plant' : 'plants'} found
              </p>

              {plants.length === 0 ? (
                <div
                  style={{
                    textAlign: 'center',
                    padding: '3rem 1rem',
                    border: '1px dashed #cdddd2',
                    borderRadius: 12,
                    color: '#667',
                  }}
                >
                  <div style={{ fontSize: '2.5rem' }}>🌱</div>
                  <p style={{ fontWeight: 600, color: '#2f4a38' }}>No plants match these filters.</p>
                  <button
                    onClick={clearFilters}
                    style={{
                      marginTop: '0.5rem',
                      background: '#1b7a3d',
                      color: '#fff',
                      border: 'none',
                      borderRadius: 8,
                      padding: '0.5rem 1rem',
                      cursor: 'pointer',
                      fontWeight: 600,
                    }}
                  >
                    Clear filters
                  </button>
                </div>
              ) : (
                <>
                  <ProductGrid plants={visible} />
                  <PaginationBar page={currentPage} pageCount={pageCount} onPageChange={setPage} />
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
