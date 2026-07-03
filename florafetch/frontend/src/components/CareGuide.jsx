// Care details for a plant: sunlight, watering, trait badges, and description.
const factStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.2rem',
  padding: '0.75rem',
  border: '1px solid #e2e8e4',
  borderRadius: 10,
  background: '#fbfdfb',
};
const labelStyle = { fontSize: '0.75rem', color: '#889', fontWeight: 700, textTransform: 'uppercase' };
const valueStyle = { color: '#2f4a38', fontWeight: 600 };
const badgeStyle = {
  fontSize: '0.8rem',
  fontWeight: 700,
  padding: '0.3rem 0.7rem',
  borderRadius: 999,
  background: '#e8f3ea',
  color: '#1b7a3d',
};

export default function CareGuide({ plant }) {
  return (
    <section style={{ marginTop: '2rem', fontFamily: 'sans-serif' }}>
      <h2 style={{ color: '#2f4a38' }}>Care guide</h2>

      {/* Quick-facts grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
          gap: '0.75rem',
          marginBottom: '1rem',
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
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
        {plant.is_low_maint ? <span style={badgeStyle}>🌱 Low Maintenance</span> : null}
        {plant.is_pet_friendly ? (
          <span style={badgeStyle}>🐾 Pet Friendly</span>
        ) : (
          <span style={{ ...badgeStyle, background: '#f4ecec', color: '#a1231d' }}>Not Pet Friendly</span>
        )}
      </div>

      {/* Description */}
      {plant.description ? (
        <p style={{ color: '#445', lineHeight: 1.6, maxWidth: 640 }}>{plant.description}</p>
      ) : (
        <p style={{ color: '#889' }}>No care description available for this plant yet.</p>
      )}
    </section>
  );
}
