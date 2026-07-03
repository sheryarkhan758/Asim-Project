// Requested delivery date. Optional per the API; min is today so past dates
// can't be chosen.
export default function DeliveryDatePicker({ value, onChange, min }) {
  return (
    <div>
      <label htmlFor="delivery-date" style={{ display: 'block', fontWeight: 700, color: '#2f4a38', marginBottom: '0.6rem' }}>
        Preferred delivery date <span style={{ color: '#889', fontWeight: 400 }}>(optional)</span>
      </label>
      <input
        id="delivery-date"
        type="date"
        value={value}
        min={min}
        onChange={(e) => onChange(e.target.value)}
        style={{
          padding: '0.6rem 0.75rem',
          borderRadius: 8,
          border: '1px solid #cdddd2',
          fontSize: '0.95rem',
          fontFamily: 'inherit',
          background: '#fff',
        }}
      />
    </div>
  );
}
