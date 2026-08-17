
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    password2: '',
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await register(form.username, form.email, form.password, form.password2);
      navigate('/');
    } catch (err) {
      const data = err.response?.data;
      const message = data
        ? Object.values(data).flat().join(' ')
        : 'Registration failed. Please try again.';
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h1>Create Account</h1>
        <p className="muted">Set up your private contact book.</p>

        {error && <p className="form-error">{error}</p>}

        <label>
          Username
          <input
            type="text"
            value={form.username}
            onChange={handleChange('username')}
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
          Password
          <input
            type="password"
            value={form.password}
            onChange={handleChange('password')}
          />
        </label>

        <label>
          Confirm Password
          <input
            type="password"
            value={form.password2}
            onChange={handleChange('password2')}
          />
        </label>

        <button type="submit" className="btn-primary" disabled={submitting}>
          {submitting ? 'Creating account…' : 'Register'}
        </button>

        <p className="muted small">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </form>
    </div>
  );
}
