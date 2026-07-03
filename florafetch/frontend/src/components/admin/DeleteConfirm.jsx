import Modal from '../Modal.jsx';

// Confirmation dialog for deleting a plant (DELETE /plants/:id).
export default function DeleteConfirm({ plant, onConfirm, onClose, deleting, error }) {
  return (
    <Modal title="Delete plant" onClose={onClose} width={440}>
      <p style={{ color: '#2f4a38', marginTop: 0 }}>
        Are you sure you want to delete <strong>{plant?.name}</strong>? This can't be undone.
      </p>

      {error ? <p style={{ color: '#c0392b', fontSize: '0.9rem' }}>{error}</p> : null}

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
        <button
          onClick={onClose}
          disabled={deleting}
          style={{ padding: '0.6rem 1.2rem', borderRadius: 8, border: '1px solid #cdddd2', background: '#fff', color: '#556', fontWeight: 600, cursor: 'pointer' }}
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          disabled={deleting}
          style={{ padding: '0.6rem 1.4rem', borderRadius: 8, border: 'none', background: deleting ? '#e0a3a0' : '#c0392b', color: '#fff', fontWeight: 700, cursor: deleting ? 'default' : 'pointer' }}
        >
          {deleting ? 'Deleting…' : 'Delete'}
        </button>
      </div>
    </Modal>
  );
}
