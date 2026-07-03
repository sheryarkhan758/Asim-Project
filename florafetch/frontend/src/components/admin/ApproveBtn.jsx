// Approve a review (PUT /reviews/:id/approve). Parent handles the call + removal.
export default function ApproveBtn({ onClick, approving }) {
  return (
    <button
      onClick={onClick}
      disabled={approving}
      style={{
        border: 'none',
        borderRadius: 8,
        padding: '0.5rem 1.1rem',
        background: approving ? '#7bbf93' : '#1b7a3d',
        color: '#fff',
        fontWeight: 700,
        fontSize: '0.9rem',
        cursor: approving ? 'default' : 'pointer',
        whiteSpace: 'nowrap',
      }}
    >
      {approving ? 'Approving…' : '✓ Approve'}
    </button>
  );
}
