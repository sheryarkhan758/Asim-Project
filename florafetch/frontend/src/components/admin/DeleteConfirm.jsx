import Modal from '../Modal.jsx';
import { theme } from '../../styles/theme.js';

// Confirmation dialog for deleting a plant (DELETE /plants/:id).
export default function DeleteConfirm({ plant, onConfirm, onClose, deleting, error }) {
  return (
    <Modal title="Delete plant" onClose={onClose} width={440}>
      <div
        style={{
          display: 'flex',
          gap: '0.9rem',
          alignItems: 'flex-start',
          background: '#fdecea',
          border: '1px solid #f5c2c0',
          borderRadius: theme.radius.md,
          padding: '1rem 1.1rem',
          marginTop: 0,
        }}
      >
        <div
          style={{
            width: 40,
            height: 40,
            flexShrink: 0,
            borderRadius: theme.radius.md,
            background: '#fbe0dd',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.25rem',
          }}
          aria-hidden="true"
        >
          🗑️
        </div>
        <p style={{ color: theme.color.ink, margin: 0, lineHeight: 1.5 }}>
          Are you sure you want to delete <strong>{plant?.name}</strong>? This can't be undone.
        </p>
      </div>

      {error ? <p style={{ color: theme.color.danger, fontSize: '0.9rem', fontWeight: 600, marginBottom: 0 }}>{error}</p> : null}

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.25rem' }}>
        <button
          onClick={onClose}
          disabled={deleting}
          style={{ padding: '0.65rem 1.3rem', borderRadius: theme.radius.pill, border: `1.5px solid ${theme.color.border}`, background: '#fff', color: theme.color.body, fontWeight: 700, cursor: 'pointer' }}
        >
          Cancel
        </button>
        <button
          className="ff-btn"
          onClick={onConfirm}
          disabled={deleting}
          style={{ padding: '0.65rem 1.6rem', borderRadius: theme.radius.pill, border: 'none', background: deleting ? '#e0a3a0' : theme.color.danger, color: '#fff', fontWeight: 700, cursor: deleting ? 'default' : 'pointer', boxShadow: theme.shadow.sm }}
        >
          {deleting ? 'Deleting…' : 'Delete'}
        </button>
      </div>
    </Modal>
  );
}
