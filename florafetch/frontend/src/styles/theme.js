// ============================================================================
// FloraFetch, design tokens
// A single source of truth for colors, typography, spacing, radii and shadows
// so every page/component (which style inline) can stay visually consistent.
// Import what you need: `import { theme, styles } from '../styles/theme.js'`.
// ============================================================================

export const theme = {
  color: {
    primary: '#1b7a3d',
    primaryDark: '#14331f',
    primaryLight: '#2fa15a',
    primarySoft: '#e8f3ea',
    accent: '#c97b3c', // warm terracotta, used sparingly for highlights/stars
    accentSoft: '#fbeee0',
    ink: '#20372a', // primary text on light
    body: '#42564a', // secondary body text
    muted: '#6a7b70', // captions / meta
    faint: '#93a29a',
    border: '#e2e8e4',
    borderSoft: '#eef3ef',
    bg: '#ffffff',
    bgSoft: '#f4f9f5',
    bgTint: '#e8f3ea',
    white: '#ffffff',
    danger: '#c0392b',
    star: '#f2b90c',
  },
  font: {
    head: "'Poppins', system-ui, -apple-system, 'Segoe UI', sans-serif",
    body: "'Inter', system-ui, -apple-system, 'Segoe UI', sans-serif",
  },
  radius: {
    sm: '8px',
    md: '12px',
    lg: '18px',
    xl: '26px',
    pill: '999px',
  },
  shadow: {
    sm: '0 4px 14px rgba(27, 122, 61, 0.06)',
    md: '0 12px 30px rgba(27, 122, 61, 0.10)',
    lg: '0 22px 50px rgba(20, 51, 31, 0.14)',
    glow: '0 10px 30px rgba(27, 122, 61, 0.22)',
  },
  maxWidth: '1160px',
  gradient: {
    hero: 'linear-gradient(135deg, #1b7a3d 0%, #2fa15a 50%, #1b7a3d 100%)',
    soft: 'linear-gradient(160deg, #f2f8f3 0%, #e8f3ea 100%)',
    cta: 'linear-gradient(120deg, #14331f 0%, #1b7a3d 60%, #2fa15a 100%)',
  },
  // Local HD forest photo (served from /public) behind a green overlay so
  // white text stays readable. Apply as `backgroundImage` with cover/center.
  image: {
    forest: '/forest.jpg',
  },
  overlay: {
    // Darker for the big hero, lighter for slimmer interior page headers.
    forest: 'linear-gradient(135deg, rgba(20,51,31,0.84) 0%, rgba(27,122,61,0.66) 50%, rgba(20,51,31,0.88) 100%)',
    forestSoft: 'linear-gradient(135deg, rgba(20,51,31,0.80) 0%, rgba(27,122,61,0.62) 55%, rgba(20,51,31,0.86) 100%)',
  },
};

// Reusable inline-style fragments -------------------------------------------
export const styles = {
  // Centered page container.
  container: {
    width: '100%',
    maxWidth: theme.maxWidth,
    margin: '0 auto',
    padding: '0 1.5rem',
  },
  // Primary solid button.
  btnPrimary: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    background: theme.color.primary,
    color: '#fff',
    fontWeight: 700,
    fontFamily: theme.font.body,
    fontSize: '0.98rem',
    border: 'none',
    borderRadius: theme.radius.pill,
    padding: '0.8rem 1.6rem',
    cursor: 'pointer',
    textDecoration: 'none',
    boxShadow: theme.shadow.sm,
  },
  // Outlined / ghost button.
  btnGhost: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    background: 'transparent',
    color: theme.color.primary,
    fontWeight: 700,
    fontFamily: theme.font.body,
    fontSize: '0.98rem',
    border: `1.5px solid ${theme.color.primary}`,
    borderRadius: theme.radius.pill,
    padding: '0.8rem 1.6rem',
    cursor: 'pointer',
    textDecoration: 'none',
  },
  // White button (for dark/gradient backgrounds).
  btnLight: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    background: '#fff',
    color: theme.color.primary,
    fontWeight: 700,
    fontFamily: theme.font.body,
    fontSize: '0.98rem',
    border: 'none',
    borderRadius: theme.radius.pill,
    padding: '0.8rem 1.6rem',
    cursor: 'pointer',
    textDecoration: 'none',
  },
  // Standard white surface card.
  card: {
    background: '#fff',
    border: `1px solid ${theme.color.border}`,
    borderRadius: theme.radius.lg,
    boxShadow: theme.shadow.sm,
  },
  // Small pill label above a section title.
  eyebrow: {
    display: 'inline-block',
    fontFamily: theme.font.body,
    fontWeight: 700,
    fontSize: '0.72rem',
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    color: theme.color.primary,
    background: theme.color.primarySoft,
    padding: '0.3rem 0.8rem',
    borderRadius: theme.radius.pill,
  },
};

// A vertical rhythm helper for full-bleed sections.
export const sectionPad = { padding: '3.5rem 0' };
