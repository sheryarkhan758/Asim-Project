// The 4-stage pipeline; selecting a value calls PUT /orders/:id/status.
const STATUSES = ['Confirmed', 'Quality Check', 'In Transit', 'Delivered'];

const COLOR = {
  Confirmed: '#0d6efd',
  'Quality Check': '#b8860b',
  'In Transit': '#8a5a00',
  Delivered: '#1b7a3d',
};

export default function StatusDropdown({ value, onChange, disabled }) {
  return (
    <select
      value={value}
      disabled={disabled}
      onChange={(e) => onChange(e.target.value)}
      style={{
        padding: '0.4rem 0.6rem',
        borderRadius: 8,
        border: `1px solid ${COLOR[value] || '#cdddd2'}`,
        color: COLOR[value] || '#2f4a38',
        fontWeight: 700,
        fontSize: '0.85rem',
        background: '#fff',
        cursor: disabled ? 'default' : 'pointer',
        opacity: disabled ? 0.6 : 1,
      }}
    >
      {STATUSES.map((s) => (
        <option key={s} value={s}>
          {s}
        </option>
      ))}
    </select>
  );
}
