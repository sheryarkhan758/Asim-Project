// Saved addresses are stored in the user's `addresses` JSON. We persist an
// array of { label, text } objects, but read defensively so older/other shapes
// (plain strings, arrays of strings, a single object) still display correctly.
export function normalizeAddresses(addresses) {
  const toEntry = (a, i) => {
    if (typeof a === 'string') return a.trim() ? { label: '', text: a.trim() } : null;
    if (a && typeof a === 'object') {
      const text = a.address || a.text || a.full || a.line || '';
      return text ? { label: a.label || a.name || `Address ${i + 1}`, text } : null;
    }
    return null;
  };
  if (!addresses) return [];
  if (Array.isArray(addresses)) return addresses.map(toEntry).filter(Boolean);
  const single = toEntry(addresses, 0);
  return single ? [single] : [];
}
