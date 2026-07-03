import useCountUp from '../../hooks/useCountUp.js';
import { theme } from '../../styles/theme.js';

// A single animated statistic. `start` is passed from a parent that watches
// scroll visibility, so all numbers count up together the first time the row
// appears on screen.
export default function StatCounter({ value, prefix = '', suffix = '', label, start = true, light = false }) {
  const n = useCountUp(value, { start });
  return (
    <div style={{ textAlign: 'center' }}>
      <div
        style={{
          fontFamily: theme.font.head,
          fontWeight: 800,
          fontSize: 'clamp(1.8rem, 4vw, 2.6rem)',
          color: light ? '#fff' : theme.color.primary,
          lineHeight: 1.1,
        }}
      >
        {prefix}
        {n.toLocaleString()}
        {suffix}
      </div>
      <div
        style={{
          marginTop: '0.35rem',
          fontSize: '0.9rem',
          fontWeight: 600,
          color: light ? 'rgba(255,255,255,0.85)' : theme.color.muted,
        }}
      >
        {label}
      </div>
    </div>
  );
}
