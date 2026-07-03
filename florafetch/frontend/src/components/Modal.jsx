// Generic centered modal with a backdrop. Clicking the backdrop or the × closes
// it (guarded by onClose). Content scrolls if it's taller than the viewport.
export default function Modal({ title, onClose, children, width = 560 }) {
  return (
    <div
      onClick={onClose}
      className="ff-backdrop"
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(20, 51, 31, 0.45)',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        padding: '2rem 1rem',
        zIndex: 1000,
        overflowY: 'auto',
        fontFamily: 'sans-serif',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="ff-modal"
        style={{
          background: '#fff',
          borderRadius: 14,
          width: '100%',
          maxWidth: width,
          boxShadow: '0 20px 50px rgba(0,0,0,0.25)',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '1rem 1.25rem',
            borderBottom: '1px solid #e2e8e4',
          }}
        >
          <h2 style={{ margin: 0, color: '#14331f', fontSize: '1.15rem' }}>{title}</h2>
          <button
            onClick={onClose}
            aria-label="Close"
            style={{ background: 'none', border: 'none', fontSize: '1.4rem', color: '#889', cursor: 'pointer', lineHeight: 1 }}
          >
            ×
          </button>
        </div>
        <div style={{ padding: '1.25rem' }}>{children}</div>
      </div>
    </div>
  );
}
