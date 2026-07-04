import { Check } from '../ui/BrandIcons.jsx';
import { theme } from '../../styles/theme.js';

// Approve a review (PUT /reviews/:id/approve). Parent handles the call + removal.
export default function ApproveBtn({ onClick, approving }) {
  return (
    <button
      className="ff-btn"
      onClick={onClick}
      disabled={approving}
      style={{
        border: 'none',
        borderRadius: theme.radius.pill,
        padding: '0.55rem 1.3rem',
        background: approving ? '#7bbf93' : theme.color.primary,
        color: '#fff',
        fontWeight: 700,
        fontSize: '0.9rem',
        cursor: approving ? 'default' : 'pointer',
        whiteSpace: 'nowrap',
        boxShadow: theme.shadow.sm,
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.4rem',
      }}
    >
      {approving ? 'Approving…' : (<><Check size={16} color="currentColor" /> Approve</>)}
    </button>
  );
}
