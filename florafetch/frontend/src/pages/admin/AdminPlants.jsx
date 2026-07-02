import { useCallback, useEffect, useMemo, useState } from 'react';
import { getPlants, createPlant, updatePlant, deletePlant } from '../../api/plants.js';
import { getCategories } from '../../api/categories.js';
import AdminLayout from '../../components/admin/AdminLayout.jsx';
import PlantTable from '../../components/admin/PlantTable.jsx';
import PlantFormModal from '../../components/admin/PlantFormModal.jsx';
import DeleteConfirm from '../../components/admin/DeleteConfirm.jsx';

export default function AdminPlants() {
  const [plants, setPlants] = useState([]);
  const [categories, setCategories] = useState([]);
  const [status, setStatus] = useState('loading'); // loading | ready | error

  const [modal, setModal] = useState(null); // { type: 'add'|'edit'|'delete', plant? }
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [feedback, setFeedback] = useState(null); // { type: 'ok'|'err', text }

  // Reload just the plant list (used after every mutation).
  const loadPlants = useCallback(async () => {
    const data = await getPlants();
    setPlants(data.plants || []);
  }, []);

  useEffect(() => {
    let active = true;
    Promise.all([getPlants(), getCategories()])
      .then(([p, c]) => {
        if (!active) return;
        setPlants(p.plants || []);
        setCategories(c.categories || []);
        setStatus('ready');
      })
      .catch(() => active && setStatus('error'));
    return () => {
      active = false;
    };
  }, []);

  const categoryName = useMemo(() => {
    const map = new Map(categories.map((c) => [c.category_id, c.name]));
    return (id) => map.get(id) || '';
  }, [categories]);

  const closeModal = () => {
    setModal(null);
    setFormError('');
  };

  const flash = (type, text) => {
    setFeedback({ type, text });
    setTimeout(() => setFeedback(null), 4000);
  };

  // Add / edit share one handler that receives the FormData from the modal.
  const handleFormSubmit = async (formData) => {
    setSubmitting(true);
    setFormError('');
    try {
      if (modal.type === 'edit') {
        await updatePlant(modal.plant.plant_id, formData);
        flash('ok', 'Plant updated.');
      } else {
        await createPlant(formData);
        flash('ok', 'Plant added.');
      }
      closeModal();
      await loadPlants();
    } catch (err) {
      setFormError(err.response?.data?.error || 'Could not save the plant.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    setSubmitting(true);
    setFormError('');
    try {
      await deletePlant(modal.plant.plant_id);
      flash('ok', 'Plant deleted.');
      closeModal();
      await loadPlants();
    } catch (err) {
      setFormError(err.response?.data?.error || 'Could not delete the plant.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AdminLayout title="Inventory">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
        <p style={{ color: '#556', margin: 0 }}>
          {status === 'ready' ? `${plants.length} plant${plants.length === 1 ? '' : 's'} in the catalog` : ''}
        </p>
        <button
          onClick={() => { setFormError(''); setModal({ type: 'add' }); }}
          style={{ background: '#1b7a3d', color: '#fff', border: 'none', borderRadius: 8, padding: '0.6rem 1.2rem', fontWeight: 700, cursor: 'pointer' }}
        >
          ＋ Add plant
        </button>
      </div>

      {feedback ? (
        <div
          style={{
            marginBottom: '1rem',
            padding: '0.6rem 0.9rem',
            borderRadius: 8,
            fontSize: '0.9rem',
            background: feedback.type === 'ok' ? '#e8f5ec' : '#fdecea',
            border: `1px solid ${feedback.type === 'ok' ? '#b6ddc2' : '#f5c2c0'}`,
            color: feedback.type === 'ok' ? '#1b7a3d' : '#a1231d',
          }}
        >
          {feedback.text}
        </div>
      ) : null}

      <div style={{ background: '#fff', border: '1px solid #dfe5e0', borderRadius: 12, padding: '1.25rem' }}>
        {status === 'loading' && <p style={{ color: '#667' }}>Loading inventory…</p>}
        {status === 'error' && <p style={{ color: '#c0392b' }}>Could not load inventory.</p>}
        {status === 'ready' &&
          (plants.length === 0 ? (
            <p style={{ color: '#889' }}>No plants yet. Add your first plant to get started.</p>
          ) : (
            <PlantTable
              plants={plants}
              categoryName={categoryName}
              onEdit={(p) => { setFormError(''); setModal({ type: 'edit', plant: p }); }}
              onDelete={(p) => { setFormError(''); setModal({ type: 'delete', plant: p }); }}
            />
          ))}
      </div>

      {/* Add / Edit modal */}
      {modal && (modal.type === 'add' || modal.type === 'edit') ? (
        <PlantFormModal
          mode={modal.type}
          plant={modal.plant}
          categories={categories}
          onSubmit={handleFormSubmit}
          onClose={closeModal}
          submitting={submitting}
          error={formError}
        />
      ) : null}

      {/* Delete confirm */}
      {modal && modal.type === 'delete' ? (
        <DeleteConfirm
          plant={modal.plant}
          onConfirm={handleDelete}
          onClose={closeModal}
          deleting={submitting}
          error={formError}
        />
      ) : null}
    </AdminLayout>
  );
}
