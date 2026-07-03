import { theme } from '../styles/theme.js';

// Client-side pagination control. The backend returns all matching plants,
// so Shop slices them and drives this bar. Hidden when there's only one page.
export default function PaginationBar({ page, pageCount, onPageChange }) {
  if (pageCount <= 1) return null;

  const pages = Array.from({ length: pageCount }, (_, i) => i + 1);

  const btn = (active, disabled) => ({
    minWidth: 40,
    height: 40,
    padding: '0 0.6rem',
    borderRadius: theme.radius.pill,
    border: `1.5px solid ${active ? theme.color.primary : theme.color.border}`,
    background: active ? theme.color.primary : theme.color.white,
    color: active ? '#fff' : disabled ? theme.color.faint : theme.color.body,
    fontWeight: active ? 700 : 600,
    fontFamily: theme.font.body,
    fontSize: '0.95rem',
    cursor: disabled ? 'default' : 'pointer',
    boxShadow: active ? theme.shadow.sm : 'none',
    opacity: disabled ? 0.55 : 1,
  });

  return (
    <nav
      aria-label="Pagination"
      style={{
        display: 'flex',
        gap: '0.5rem',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: '2rem',
        flexWrap: 'wrap',
      }}
    >
      <button
        className="ff-btn"
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        style={btn(false, page <= 1)}
      >
        ‹
      </button>
      {pages.map((p) => (
        <button key={p} className="ff-btn" onClick={() => onPageChange(p)} style={btn(p === page, false)}>
          {p}
        </button>
      ))}
      <button
        className="ff-btn"
        onClick={() => onPageChange(page + 1)}
        disabled={page >= pageCount}
        style={btn(false, page >= pageCount)}
      >
        ›
      </button>
    </nav>
  );
}
