import { theme } from '../../styles/theme.js';

// Consistent section header: optional eyebrow pill, a display title, and an
// optional supporting line. `align` centers or left-aligns the block.
export default function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = 'center',
  light = false,
  style,
}) {
  const centered = align === 'center';
  return (
    <div
      style={{
        textAlign: align,
        maxWidth: centered ? 640 : undefined,
        margin: centered ? '0 auto' : undefined,
        marginBottom: '2rem',
        ...style,
      }}
    >
      {eyebrow ? (
        <span
          style={{
            display: 'inline-block',
            fontFamily: theme.font.body,
            fontWeight: 700,
            fontSize: '0.72rem',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: light ? '#eaf6ee' : theme.color.primary,
            background: light ? 'rgba(255,255,255,0.16)' : theme.color.primarySoft,
            padding: '0.3rem 0.8rem',
            borderRadius: theme.radius.pill,
            marginBottom: '0.9rem',
          }}
        >
          {eyebrow}
        </span>
      ) : null}
      <h2
        style={{
          margin: 0,
          fontSize: 'clamp(1.6rem, 3vw, 2.1rem)',
          color: light ? '#fff' : theme.color.ink,
          fontWeight: 800,
        }}
      >
        {title}
      </h2>
      {subtitle ? (
        <p
          style={{
            margin: '0.7rem 0 0',
            color: light ? 'rgba(255,255,255,0.9)' : theme.color.muted,
            fontSize: '1.02rem',
            lineHeight: 1.6,
          }}
        >
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}
