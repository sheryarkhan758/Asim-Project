import { theme } from '../../styles/theme.js';

// The 4-stage pipeline; selecting a value calls PUT /orders/:id/status.
const STATUSES = ['Confirmed', 'Quality Check', 'In Transit', 'Delivered'];

const COLOR = {
  Confirmed: '#0d6efd',
  'Quality Check': '#b8860b',
  'In Transit': '#8a5a00',
  Delivered: '#1b7a3d',
};

export default function StatusDropdown({ value, onChange, disabled }) {
  const color = COLOR[value] || theme.color.body;
  return (
    <select
      className="ff-select"
      value={value}
      disabled={disabled}
      onChange={(e) => onChange(e.target.value)}
      style={{
        padding: '0.45rem 0.75rem',
        borderRadius: theme.radius.pill,
        border: `1.5px solid ${color}`,
        color,
        fontWeight: 700,
        fontFamily: theme.font.body,
        fontSize: '0.82rem',
        backgroundColor: theme.color.primarySoft,
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
