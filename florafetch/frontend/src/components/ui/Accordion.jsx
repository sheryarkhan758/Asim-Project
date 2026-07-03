import { useState } from 'react';
import { theme } from '../../styles/theme.js';

// Single-open accordion for FAQ-style content. `items` is [{ q, a }].
// The answer panel animates open with a max-height/opacity transition.
export default function Accordion({ items, defaultOpen = 0 }) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <div
            key={i}
            style={{
              background: '#fff',
              border: `1px solid ${isOpen ? theme.color.primaryLight : theme.color.border}`,
              borderRadius: theme.radius.md,
              boxShadow: isOpen ? theme.shadow.sm : 'none',
              overflow: 'hidden',
              transition: 'border-color 0.25s ease, box-shadow 0.25s ease',
            }}
          >
            <button
              onClick={() => setOpen(isOpen ? -1 : i)}
              aria-expanded={isOpen}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '1rem',
                textAlign: 'left',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                padding: '1.1rem 1.25rem',
                fontFamily: theme.font.body,
                fontWeight: 600,
                fontSize: '1rem',
                color: theme.color.ink,
              }}
            >
              {item.q}
              <span
                aria-hidden="true"
                style={{
                  flexShrink: 0,
                  fontSize: '1.3rem',
                  color: theme.color.primary,
                  transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)',
                  transition: 'transform 0.28s cubic-bezier(0.22, 1, 0.36, 1)',
                }}
              >
                +
              </span>
            </button>
            <div
              style={{
                maxHeight: isOpen ? 320 : 0,
                opacity: isOpen ? 1 : 0,
                transition: 'max-height 0.35s ease, opacity 0.35s ease',
              }}
            >
              <p
                style={{
                  margin: 0,
                  padding: '0 1.25rem 1.2rem',
                  color: theme.color.muted,
                  fontSize: '0.96rem',
                  lineHeight: 1.65,
                }}
              >
                {item.a}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
