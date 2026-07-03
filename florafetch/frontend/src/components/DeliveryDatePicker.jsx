import { theme } from '../styles/theme.js';

// Requested delivery date. Optional per the API; min is today so past dates
// can't be chosen.
export default function DeliveryDatePicker({ value, onChange, min }) {
  return (
    <div>
      <label
        htmlFor="delivery-date"
        style={{ display: 'block', fontWeight: 700, color: theme.color.ink, marginBottom: '0.6rem' }}
      >
        Preferred delivery date <span style={{ color: theme.color.muted, fontWeight: 400 }}>(optional)</span>
      </label>
      <input
        id="delivery-date"
        type="date"
        value={value}
        min={min}
        onChange={(e) => onChange(e.target.value)}
        style={{
          padding: '0.7rem 0.85rem',
          borderRadius: theme.radius.md,
          border: `1px solid ${theme.color.border}`,
          fontSize: '0.95rem',
          fontFamily: theme.font.body,
          background: theme.color.bgSoft,
          color: theme.color.ink,
        }}
      />
    </div>
  );
}
