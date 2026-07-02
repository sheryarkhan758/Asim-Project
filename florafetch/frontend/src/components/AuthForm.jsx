import { useState } from 'react';
import ValidationMessages from './ValidationMessages.jsx';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^[0-9+\-\s()]{7,}$/;
const MIN_PASSWORD = 6;

// Field lists per mode. Login authenticates with email + password;
// register collects the fields the backend's POST /auth/register expects
// (full_name, email, password) plus an optional phone and a confirm field.
const FIELDS = {
  login: ['email', 'password'],
  register: ['full_name', 'email', 'phone', 'password', 'confirmPassword'],
};

const LABELS = {
  full_name: 'Full name',
  email: 'Email',
  phone: 'Phone (optional)',
  password: 'Password',
  confirmPassword: 'Confirm password',
};

const TYPES = {
  full_name: 'text',
  email: 'email',
  phone: 'tel',
  password: 'password',
  confirmPassword: 'password',
};

const AUTOCOMPLETE = {
  full_name: 'name',
  email: 'email',
  phone: 'tel',
  password: (mode) => (mode === 'login' ? 'current-password' : 'new-password'),
  confirmPassword: 'new-password',
};

// Pure per-field validation — returns an error string ('' means valid).
function validateField(name, values, mode) {
  const value = values[name] ?? '';
  switch (name) {
    case 'full_name':
      return value.trim() ? '' : 'Full name is required';
    case 'email':
      if (!value.trim()) return 'Email is required';
      return EMAIL_RE.test(value.trim()) ? '' : 'Enter a valid email address';
    case 'phone':
      if (!value.trim()) return ''; // optional
      return PHONE_RE.test(value.trim()) ? '' : 'Enter a valid phone number';
    case 'password':
      if (!value) return 'Password is required';
      return value.length >= MIN_PASSWORD ? '' : `Password must be at least ${MIN_PASSWORD} characters`;
    case 'confirmPassword':
      if (mode !== 'register') return '';
      if (!value) return 'Please confirm your password';
      return value === values.password ? '' : 'Passwords do not match';
    default:
      return '';
  }
}

export default function AuthForm({ mode, onSubmit, apiError, submitting }) {
  const fields = FIELDS[mode];
  const [values, setValues] = useState(() =>
    Object.fromEntries(fields.map((f) => [f, '']))
  );
  const [touched, setTouched] = useState({});

  // Recomputed every render so confirm-password re-checks when password changes.
  const errors = Object.fromEntries(fields.map((f) => [f, validateField(f, values, mode)]));
  const isValid = Object.values(errors).every((e) => !e);

  const handleChange = (name) => (e) => {
    setValues((prev) => ({ ...prev, [name]: e.target.value }));
  };

  const handleBlur = (name) => () => {
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Reveal every field's error on submit.
    setTouched(Object.fromEntries(fields.map((f) => [f, true])));
    if (!isValid) return;
    onSubmit(values);
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <ValidationMessages messages={apiError} variant="banner" />

      {fields.map((name) => {
        const showError = touched[name] && errors[name];
        const autoComplete =
          typeof AUTOCOMPLETE[name] === 'function' ? AUTOCOMPLETE[name](mode) : AUTOCOMPLETE[name];
        return (
          <div key={name} style={{ marginBottom: '1rem' }}>
            <label
              htmlFor={name}
              style={{ display: 'block', marginBottom: '0.3rem', fontWeight: 600, color: '#2f4a38' }}
            >
              {LABELS[name]}
            </label>
            <input
              id={name}
              name={name}
              type={TYPES[name]}
              value={values[name]}
              onChange={handleChange(name)}
              onBlur={handleBlur(name)}
              autoComplete={autoComplete}
              aria-invalid={showError ? 'true' : 'false'}
              style={{
                width: '100%',
                boxSizing: 'border-box',
                padding: '0.6rem 0.75rem',
                borderRadius: 8,
                border: `1px solid ${showError ? '#e0a3a0' : '#cdddd2'}`,
                outlineColor: '#1b7a3d',
                fontSize: '1rem',
                background: '#fff',
              }}
            />
            {showError ? <ValidationMessages messages={errors[name]} variant="field" /> : null}
          </div>
        );
      })}

      <button
        type="submit"
        disabled={submitting}
        style={{
          width: '100%',
          padding: '0.7rem',
          borderRadius: 8,
          border: 'none',
          background: submitting ? '#7bbf93' : '#1b7a3d',
          color: '#fff',
          fontSize: '1rem',
          fontWeight: 700,
          cursor: submitting ? 'default' : 'pointer',
          marginTop: '0.25rem',
        }}
      >
        {submitting
          ? mode === 'login'
            ? 'Signing in…'
            : 'Creating account…'
          : mode === 'login'
            ? 'Sign in'
            : 'Create account'}
      </button>
    </form>
  );
}
