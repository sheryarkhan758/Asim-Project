import { theme } from '../../styles/theme.js';

// Centered, max-width content wrapper used to keep sections aligned.
export default function Container({ as: Tag = 'div', style, children, ...rest }) {
  return (
    <Tag
      style={{
        width: '100%',
        maxWidth: theme.maxWidth,
        margin: '0 auto',
        padding: '0 1.5rem',
        ...style,
      }}
      {...rest}
    >
      {children}
    </Tag>
  );
}
