import { theme } from '../styles/theme.js';

// The confirm-order action. Disabled while placing or when the form is invalid.
export default function PlaceOrderBtn({ onClick, disabled, placing }) {
  const inactive = disabled || placing;
  return (
    <button
      className="ff-btn"
      onClick={onClick}
      disabled={inactive}
      style={{
        width: '100%',
        padding: '0.95rem',
        borderRadius: theme.radius.pill,
        border: 'none',
        background: inactive ? theme.color.primaryLight : theme.color.primary,
        color: '#fff',
        fontSize: '1.05rem',
        fontWeight: 700,
        fontFamily: theme.font.body,
        cursor: inactive ? 'default' : 'pointer',
        boxShadow: inactive ? 'none' : theme.shadow.glow,
        opacity: inactive ? 0.75 : 1,
      }}
    >
      {placing ? 'Placing order…' : 'Place order (Cash on Delivery)'}
    </button>
  );
}
