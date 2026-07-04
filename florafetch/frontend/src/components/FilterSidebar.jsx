import { useEffect, useState } from 'react';
import { getCategories } from '../api/categories.js';
import { theme } from '../styles/theme.js';

const labelStyle = {
  display: 'block',
  fontWeight: 700,
  fontSize: '0.9rem',
  color: theme.color.ink,
  marginBottom: '0.45rem',
};
const controlStyle = {
  width: '100%',
  boxSizing: 'border-box',
  padding: '0.6rem 0.7rem',
  borderRadius: theme.radius.md,
  border: `1.5px solid ${theme.color.border}`,
  fontSize: '0.95rem',
  fontFamily: theme.font.body,
  color: theme.color.ink,
  backgroundColor: theme.color.bgSoft,
};

// Controlled filter panel. `values` come from the URL (Shop owns them); every
// change is reported up via onChange(key, value) using the backend's param
// names (category, low_maint, pet_friendly, min_price, max_price).
export default function FilterSidebar({ values, onChange, onClear }) {
  const [categories, setCategories] = useState([]);

  // Price fields commit on blur / Enter (not every keystroke) to avoid a
  // refetch per character while typing.
  const [minLocal, setMinLocal] = useState(values.min_price);
  const [maxLocal, setMaxLocal] = useState(values.max_price);
  useEffect(() => setMinLocal(values.min_price), [values.min_price]);
  useEffect(() => setMaxLocal(values.max_price), [values.max_price]);

  useEffect(() => {
    let active = true;
    getCategories()
      .then((data) => active && setCategories(data.categories || []))
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  const commit = (key) => (val) => {
    if (val !== values[key]) onChange(key, val);
  };

  const hasFilters =
    values.category || values.low_maint || values.pet_friendly || values.min_price || values.max_price;

  const checkboxLabel = {
    display: 'flex',
    gap: '0.6rem',
    alignItems: 'center',
    cursor: 'pointer',
    fontWeight: 600,
    color: theme.color.body,
    fontSize: '0.95rem',
  };

  return (
    <aside
      style={{
        border: `1px solid ${theme.color.border}`,
        borderRadius: theme.radius.lg,
        padding: '1.35rem',
        background: theme.color.white,
        boxShadow: theme.shadow.sm,
        display: 'flex',
        flexDirection: 'column',
        gap: '1.4rem',
        height: 'fit-content',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.5rem' }}>
        <h3 style={{ margin: 0, color: theme.color.ink, fontSize: '1.15rem' }}>Filters</h3>
        {hasFilters ? (
          <button
            onClick={onClear}
            className="ff-btn"
            style={{
              background: theme.color.primarySoft,
              border: 'none',
              color: theme.color.primary,
              cursor: 'pointer',
              fontSize: '0.8rem',
              fontWeight: 700,
              padding: '0.3rem 0.7rem',
              borderRadius: theme.radius.pill,
            }}
          >
            Clear all
          </button>
        ) : null}
      </div>

      {/* Category */}
      <div>
        <label htmlFor="filter-category" style={labelStyle}>
          Category
        </label>
        <select
          id="filter-category"
          className="ff-select"
          value={values.category}
          onChange={(e) => onChange('category', e.target.value)}
          style={controlStyle}
        >
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c.category_id} value={String(c.category_id)}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* Trait toggles */}
      <div>
        <span style={labelStyle}>Traits</span>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          <label style={checkboxLabel}>
            <input
              type="checkbox"
              checked={values.low_maint}
              onChange={(e) => onChange('low_maint', e.target.checked)}
              style={{ accentColor: theme.color.primary, width: 17, height: 17 }}
            />
            Low Maintenance
          </label>
          <label style={checkboxLabel}>
            <input
              type="checkbox"
              checked={values.pet_friendly}
              onChange={(e) => onChange('pet_friendly', e.target.checked)}
              style={{ accentColor: theme.color.primary, width: 17, height: 17 }}
            />
            Pet Friendly
          </label>
        </div>
      </div>

      {/* Price range */}
      <div>
        <label style={labelStyle}>Price range (Rs)</label>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <input
            type="number"
            min="0"
            placeholder="Min"
            value={minLocal}
            onChange={(e) => setMinLocal(e.target.value)}
            onBlur={() => commit('min_price')(minLocal)}
            onKeyDown={(e) => e.key === 'Enter' && commit('min_price')(minLocal)}
            style={controlStyle}
          />
          <span style={{ color: theme.color.faint }}>-</span>
          <input
            type="number"
            min="0"
            placeholder="Max"
            value={maxLocal}
            onChange={(e) => setMaxLocal(e.target.value)}
            onBlur={() => commit('max_price')(maxLocal)}
            onKeyDown={(e) => e.key === 'Enter' && commit('max_price')(maxLocal)}
            style={controlStyle}
          />
        </div>
      </div>
    </aside>
  );
}
