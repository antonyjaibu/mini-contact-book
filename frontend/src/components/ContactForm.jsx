const API_URL = import.meta.env.VITE_API_URL;
import { useState } from 'react';

const EMPTY = { name: '', email: '', phone: '', company: '' };

export default function ContactForm({ initial, onSubmit, onCancel }) {
  const [form, setForm] = useState(initial || EMPTY);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      setError('Name is required.');
      return;
    }
    setError('');
    setSubmitting(true);
    try {
      await onSubmit(form);
    } catch (err) {
      setError(
        err.response?.data?.name?.[0] ||
          err.response?.data?.detail ||
          'Something went wrong. Please try again.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onCancel}>
      <form
        className="modal contact-form"
        onClick={(e) => e.stopPropagation()}
        onSubmit={handleSubmit}
      >
        <h2>{initial ? 'Edit Contact' : 'New Contact'}</h2>

        {error && <p className="form-error">{error}</p>}

        <label>
          Name
          <input
            type="text"
            value={form.name}
            onChange={handleChange('name')}
            autoFocus
          />
        </label>

        <label>
          Email
          <input
            type="email"
            value={form.email}
            onChange={handleChange('email')}
          />
        </label>

        <label>
          Phone
          <input
            type="text"
            value={form.phone}
            onChange={handleChange('phone')}
          />
        </label>

        <label>
          Company
          <input
            type="text"
            value={form.company}
            onChange={handleChange('company')}
          />
        </label>

        <div className="modal-actions">
          <button type="button" className="btn-secondary" onClick={onCancel}>
            Cancel
          </button>
          <button type="submit" className="btn-primary" disabled={submitting}>
            {submitting ? 'Saving…' : 'Save'}
          </button>
        </div>
      </form>
    </div>
  );
}
