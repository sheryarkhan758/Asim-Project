// Client-side pagination control. The backend returns all matching plants,
// so Shop slices them and drives this bar. Hidden when there's only one page.
export default function PaginationBar({ page, pageCount, onPageChange }) {
  if (pageCount <= 1) return null;

  const pages = Array.from({ length: pageCount }, (_, i) => i + 1);

  const btn = (active, disabled) => ({
    minWidth: 38,
    padding: '0.4rem 0.6rem',
    borderRadius: 8,
    border: `1px solid ${active ? '#1b7a3d' : '#cdddd2'}`,
    background: active ? '#1b7a3d' : '#fff',
    color: active ? '#fff' : disabled ? '#aab' : '#2f4a38',
    fontWeight: active ? 700 : 500,
    cursor: disabled ? 'default' : 'pointer',
  });

  return (
    <nav
      aria-label="Pagination"
      style={{
        display: 'flex',
        gap: '0.4rem',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: '1.5rem',
        fontFamily: 'sans-serif',
        flexWrap: 'wrap',
      }}
    >
      <button onClick={() => onPageChange(page - 1)} disabled={page <= 1} style={btn(false, page <= 1)}>
        ‹
      </button>
      {pages.map((p) => (
        <button key={p} onClick={() => onPageChange(p)} style={btn(p === page, false)}>
          {p}
        </button>
      ))}
      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page >= pageCount}
        style={btn(false, page >= pageCount)}
      >
        ›
      </button>
    </nav>
  );
}
