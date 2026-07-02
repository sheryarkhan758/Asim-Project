// The confirm-order action. Disabled while placing or when the form is invalid.
export default function PlaceOrderBtn({ onClick, disabled, placing }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled || placing}
      style={{
        width: '100%',
        padding: '0.85rem',
        borderRadius: 8,
        border: 'none',
        background: disabled || placing ? '#7bbf93' : '#1b7a3d',
        color: '#fff',
        fontSize: '1.05rem',
        fontWeight: 700,
        cursor: disabled || placing ? 'default' : 'pointer',
        fontFamily: 'sans-serif',
      }}
    >
      {placing ? 'Placing order…' : 'Place order (Cash on Delivery)'}
    </button>
  );
}
