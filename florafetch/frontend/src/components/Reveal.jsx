import useReveal from '../hooks/useReveal.js';

// Wraps children in a scroll-reveal container. As it enters the viewport it
// fades/slides into place (via .ff-reveal + .is-visible). `as` lets callers
// keep the semantic element (section/div) and pass through style/other props.
export default function Reveal({
  as: Tag = 'div',
  className = '',
  style,
  children,
  threshold,
  rootMargin,
  ...rest
}) {
  const [ref, visible] = useReveal({ threshold, rootMargin });

  return (
    <Tag
      ref={ref}
      className={`ff-reveal${visible ? ' is-visible' : ''}${className ? ` ${className}` : ''}`}
      style={style}
      {...rest}
    >
      {children}
    </Tag>
  );
}
