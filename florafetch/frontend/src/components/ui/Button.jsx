import { Link } from 'react-router-dom';
import { styles } from '../../styles/theme.js';

// One button, three looks (primary | ghost | light). Renders an internal
// <Link> when `to` is set, an <a> when `href` is set, otherwise a <button>.
// Always carries the shared hover/press micro-motion via `ff-btn`.
const VARIANTS = {
  primary: styles.btnPrimary,
  ghost: styles.btnGhost,
  light: styles.btnLight,
};

export default function Button({
  variant = 'primary',
  to,
  href,
  className = '',
  style,
  children,
  shine = false,
  ...rest
}) {
  const base = VARIANTS[variant] || styles.btnPrimary;
  const cls = `ff-btn${shine ? ' ff-shine' : ''}${className ? ` ${className}` : ''}`;
  const merged = { ...base, ...style };

  if (to) {
    return (
      <Link to={to} className={cls} style={merged} {...rest}>
        {children}
      </Link>
    );
  }
  if (href) {
    return (
      <a href={href} className={cls} style={merged} {...rest}>
        {children}
      </a>
    );
  }
  return (
    <button className={cls} style={merged} {...rest}>
      {children}
    </button>
  );
}
