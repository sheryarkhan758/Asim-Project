import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getPlants } from '../api/plants.js';
import FilterSidebar from '../components/FilterSidebar.jsx';
import ProductGrid from '../components/ProductGrid.jsx';
import PaginationBar from '../components/PaginationBar.jsx';
import Container from '../components/ui/Container.jsx';
import SectionHeading from '../components/ui/SectionHeading.jsx';
import Button from '../components/ui/Button.jsx';
import { theme } from '../styles/theme.js';

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
    <div className="ff-page" style={{ background: theme.color.bgSoft, minHeight: '70vh', padding: '2.5rem 0 3.5rem' }}>
      <Container>
        <SectionHeading
          eyebrow="Our collection"
          title="Shop plants"
          subtitle="Browse our handpicked greenery — filter by category, care level and budget to find your perfect match."
          align="left"
          style={{ marginBottom: '2rem' }}
        />

        <div className="ff-split-left" style={{ '--ff-aside': '260px' }}>
          <FilterSidebar values={filters} onChange={setFilter} onClear={clearFilters} />

          <div>
            {status === 'loading' && <p style={{ color: theme.color.muted }}>Loading plants…</p>}
            {status === 'error' && (
              <p style={{ color: theme.color.danger }}>Something went wrong loading plants. Please try again.</p>
            )}

            {status === 'ready' && (
              <>
                <p style={{ color: theme.color.muted, fontWeight: 600, margin: '0 0 1.25rem' }}>
                  {plants.length} {plants.length === 1 ? 'plant' : 'plants'} found
                </p>

                {plants.length === 0 ? (
                  <div
                    style={{
                      textAlign: 'center',
                      padding: '3.5rem 1.5rem',
                      border: `1px dashed ${theme.color.border}`,
                      borderRadius: theme.radius.lg,
                      background: theme.color.white,
                      color: theme.color.muted,
                    }}
                  >
                    <div style={{ fontSize: '2.75rem' }}>🌱</div>
                    <p style={{ fontWeight: 700, color: theme.color.ink, margin: '0.5rem 0 1rem' }}>
                      No plants match these filters.
                    </p>
                    <Button onClick={clearFilters} variant="primary">
                      Clear filters
                    </Button>
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
      </Container>
    </div>
  );
}
