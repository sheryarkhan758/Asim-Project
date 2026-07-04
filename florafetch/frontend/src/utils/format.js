// Format a numeric PKR price like the spec's "Green Total", e.g. 1200 -> "Rs 1,200".
export function formatPKR(amount) {
  const n = Number(amount) || 0;
  return `Rs ${n.toLocaleString('en-PK')}`;
}

// Format a date/datetime string for display; returns '' for empty/invalid input.
export function formatDate(value) {
  if (!value) return '';
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? '' : d.toLocaleDateString();
}
