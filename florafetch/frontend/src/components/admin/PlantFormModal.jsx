import { useState } from 'react';
import Modal from '../Modal.jsx';
import { theme } from '../../styles/theme.js';

const controlStyle = {
  width: '100%',
  boxSizing: 'border-box',
  padding: '0.6rem 0.8rem',
  borderRadius: theme.radius.sm,
  border: `1px solid ${theme.color.border}`,
  fontSize: '0.95rem',
  fontFamily: theme.font.body,
  color: theme.color.ink,
  backgroundColor: theme.color.bgSoft,
};
const labelStyle = {
  display: 'block',
  fontWeight: 700,
  color: theme.color.ink,
  marginBottom: '0.35rem',
  fontSize: '0.82rem',
  textTransform: 'uppercase',
  letterSpacing: '0.03em',
};
const field = { marginBottom: '1rem' };

// Build the initial form state from an existing plant (edit) or blanks (add).
function initialForm(plant) {
  return {
    name: plant?.name ?? '',
    botanical_name: plant?.botanical_name ?? '',
    category_id: plant?.category_id != null ? String(plant.category_id) : '',
    price: plant?.price != null ? String(plant.price) : '',
    size: plant?.size ?? '',
    stock_qty: plant?.stock_qty != null ? String(plant.stock_qty) : '',
    sunlight_req: plant?.sunlight_req ?? '',
    watering_freq: plant?.watering_freq ?? '',
    description: plant?.description ?? '',
    is_pet_friendly: !!plant?.is_pet_friendly,
    is_low_maint: !!plant?.is_low_maint,
  };
}

// Shared add/edit form. Builds a multipart FormData and hands it to onSubmit,
// which the page routes to POST /plants (add) or PUT /plants/:id (edit).
export default function PlantFormModal({ mode, plant, categories, onSubmit, onClose, submitting, error }) {
  const isEdit = mode === 'edit';
  const [form, setForm] = useState(() => initialForm(plant));
  const [imageFile, setImageFile] = useState(null);
  const [localError, setLocalError] = useState('');

  const set = (key) => (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim()) return setLocalError('Name is required.');
    if (form.price === '' || Number.isNaN(Number(form.price))) return setLocalError('A valid price is required.');
    setLocalError('');

    const fd = new FormData();
    fd.append('name', form.name.trim());
    fd.append('price', form.price);
    if (form.category_id) fd.append('category_id', form.category_id);
    fd.append('botanical_name', form.botanical_name.trim());
    fd.append('description', form.description.trim());
    fd.append('size', form.size);
    fd.append('stock_qty', form.stock_qty === '' ? '0' : form.stock_qty);
    fd.append('sunlight_req', form.sunlight_req);
    fd.append('watering_freq', form.watering_freq);
    fd.append('is_pet_friendly', form.is_pet_friendly ? '1' : '0');
    fd.append('is_low_maint', form.is_low_maint ? '1' : '0');
    if (imageFile) fd.append('image', imageFile);

    onSubmit(fd);
  };

  const shownError = localError || error;

  return (
    <Modal title={isEdit ? `Edit ${plant?.name || 'plant'}` : 'Add a new plant'} onClose={onClose} width={620}>
      <form onSubmit={handleSubmit}>
        {/* Name + botanical */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.9rem' }}>
          <div style={field}>
            <label style={labelStyle}>Name *</label>
            <input value={form.name} onChange={set('name')} style={controlStyle} />
          </div>
          <div style={field}>
            <label style={labelStyle}>Botanical name</label>
            <input value={form.botanical_name} onChange={set('botanical_name')} style={controlStyle} />
          </div>
        </div>

        {/* Category + price + stock */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '0.9rem' }}>
          <div style={field}>
            <label style={labelStyle}>Category</label>
            <select className="ff-select" value={form.category_id} onChange={set('category_id')} style={controlStyle}>
              <option value="">Uncategorized</option>
              {categories.map((c) => (
                <option key={c.category_id} value={String(c.category_id)}>{c.name}</option>
              ))}
            </select>
          </div>
          <div style={field}>
            <label style={labelStyle}>Price (Rs) *</label>
            <input type="number" min="0" step="0.01" value={form.price} onChange={set('price')} style={controlStyle} />
          </div>
          <div style={field}>
            <label style={labelStyle}>Stock qty</label>
            <input type="number" min="0" value={form.stock_qty} onChange={set('stock_qty')} style={controlStyle} />
          </div>
        </div>

        {/* Size + sunlight + watering */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '0.9rem' }}>
          <div style={field}>
            <label style={labelStyle}>Size</label>
            <select className="ff-select" value={form.size} onChange={set('size')} style={controlStyle}>
              <option value="">—</option>
              <option value="small">small</option>
              <option value="medium">medium</option>
              <option value="large">large</option>
            </select>
          </div>
          <div style={field}>
            <label style={labelStyle}>Sunlight</label>
            <select className="ff-select" value={form.sunlight_req} onChange={set('sunlight_req')} style={controlStyle}>
              <option value="">—</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>
          <div style={field}>
            <label style={labelStyle}>Watering</label>
            <select className="ff-select" value={form.watering_freq} onChange={set('watering_freq')} style={controlStyle}>
              <option value="">—</option>
              <option value="Daily">Daily</option>
              <option value="Weekly">Weekly</option>
              <option value="Fortnightly">Fortnightly</option>
            </select>
          </div>
        </div>

        {/* Description */}
        <div style={field}>
          <label style={labelStyle}>Description</label>
          <textarea value={form.description} onChange={set('description')} rows={3} style={{ ...controlStyle, resize: 'vertical' }} />
        </div>

        {/* Trait toggles */}
        <div style={{ display: 'flex', gap: '1.5rem', ...field }}>
          <label style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', cursor: 'pointer' }}>
            <input type="checkbox" checked={form.is_low_maint} onChange={set('is_low_maint')} /> Low maintenance
          </label>
          <label style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', cursor: 'pointer' }}>
            <input type="checkbox" checked={form.is_pet_friendly} onChange={set('is_pet_friendly')} /> Pet friendly
          </label>
        </div>

        {/* Image upload */}
        <div style={field}>
          <label style={labelStyle}>Photo {isEdit ? '(leave empty to keep current)' : ''}</label>
          <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] || null)} />
          {isEdit && plant?.image_url && !imageFile ? (
            <div style={{ marginTop: '0.5rem', color: theme.color.muted, fontSize: '0.8rem' }}>Current: {plant.image_url}</div>
          ) : null}
          <div style={{ fontSize: '0.75rem', color: theme.color.muted, marginTop: '0.35rem' }}>JPG/PNG up to 2 MB.</div>
        </div>

        {shownError ? <p style={{ color: theme.color.danger, fontSize: '0.9rem', fontWeight: 600, margin: '0 0 0.75rem' }}>{shownError}</p> : null}

        {/* Actions */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
          <button type="button" onClick={onClose} disabled={submitting} style={{ padding: '0.65rem 1.3rem', borderRadius: theme.radius.pill, border: `1.5px solid ${theme.color.border}`, background: '#fff', color: theme.color.body, fontWeight: 700, cursor: 'pointer' }}>
            Cancel
          </button>
          <button className="ff-btn" type="submit" disabled={submitting} style={{ padding: '0.65rem 1.6rem', borderRadius: theme.radius.pill, border: 'none', background: submitting ? '#7bbf93' : theme.color.primary, color: '#fff', fontWeight: 700, cursor: submitting ? 'default' : 'pointer', boxShadow: theme.shadow.sm }}>
            {submitting ? 'Saving…' : isEdit ? 'Save changes' : 'Add plant'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
