import { theme } from '../styles/theme.js';

// Care details for a plant: sunlight, watering, trait badges, and description.
const factStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.35rem',
  padding: '1rem',
  border: `1px solid ${theme.color.border}`,
  borderRadius: theme.radius.md,
  background: theme.color.bgSoft,
};
const labelStyle = {
  fontSize: '0.72rem',
  color: theme.color.muted,
  fontWeight: 700,
  textTransform: 'uppercase',
  letterSpacing: '0.06em',
};
const valueStyle = { color: theme.color.ink, fontWeight: 700, fontSize: '1.02rem' };
const badgeStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.35rem',
  fontSize: '0.82rem',
  fontWeight: 700,
  padding: '0.4rem 0.85rem',
  borderRadius: theme.radius.pill,
  background: theme.color.primarySoft,
  color: theme.color.primary,
};

export default function CareGuide({ plant }) {
  return (
    <section
      style={{
        marginTop: '2.5rem',
        background: theme.color.white,
        border: `1px solid ${theme.color.border}`,
        borderRadius: theme.radius.lg,
        boxShadow: theme.shadow.sm,
        padding: 'clamp(1.25rem, 3vw, 2rem)',
      }}
    >
      <h2 style={{ color: theme.color.ink, marginTop: 0, marginBottom: '1.25rem' }}>Care guide</h2>

      {/* Quick-facts grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
          gap: '0.85rem',
          marginBottom: '1.25rem',
        }}
      >
        <div style={factStyle}>
          <span style={labelStyle}>☀️ Sunlight</span>
          <span style={valueStyle}>{plant.sunlight_req || '—'}</span>
        </div>
        <div style={factStyle}>
          <span style={labelStyle}>💧 Watering</span>
          <span style={valueStyle}>{plant.watering_freq || '—'}</span>
        </div>
        <div style={factStyle}>
          <span style={labelStyle}>📏 Size</span>
          <span style={valueStyle}>{plant.size || '—'}</span>
        </div>
      </div>

      {/* Trait badges */}
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
        {plant.is_low_maint ? <span style={badgeStyle}>🌱 Low Maintenance</span> : null}
        {plant.is_pet_friendly ? (
          <span style={badgeStyle}>🐾 Pet Friendly</span>
        ) : (
          <span style={{ ...badgeStyle, background: '#f7ecec', color: theme.color.danger }}>Not Pet Friendly</span>
        )}
      </div>

      {/* Description */}
      {plant.description ? (
        <p style={{ color: theme.color.body, lineHeight: 1.7, maxWidth: 680, margin: 0 }}>{plant.description}</p>
      ) : (
        <p style={{ color: theme.color.muted, margin: 0 }}>No care description available for this plant yet.</p>
      )}
    </section>
  );
}
