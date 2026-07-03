export default function Footer() {
  return (
    <footer
      style={{
        marginTop: 'auto',
        padding: '1.5rem',
        borderTop: '1px solid #e2e8e4',
        textAlign: 'center',
        color: '#667',
        fontFamily: 'sans-serif',
        fontSize: '0.9rem',
      }}
    >
      <p style={{ margin: 0 }}>
        🌿 FloraFetch — Online Plant Marketplace · Cash on Delivery across Pakistan
      </p>
      <p style={{ margin: '0.25rem 0 0' }}>
        © {new Date().getFullYear()} FloraFetch · CS519 Spring 2026
      </p>
    </footer>
  );
}
