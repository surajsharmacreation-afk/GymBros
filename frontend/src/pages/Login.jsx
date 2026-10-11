import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, ArrowRight, Sparkles } from 'lucide-react';
import API from '../api';

export default function Login({ setUser }) {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const res = await API.post('/auth/login', formData);
      setUser(res.data.user);
      navigate(res.data.user.role === 'admin' ? '/admin' : '/member');
    } catch (err) {
      setError(err.response?.data?.message || 'Login credentials invalid');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ minHeight: 'calc(80vh - 100px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px 0' }}>
      <div className="glass-panel" style={{ width: '100%', maxWidth: '960px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', overflow: 'hidden' }}>
        
        {/* Left Visual Banner */}
        <div style={{
          position: 'relative',
          padding: '48px 36px',
          background: 'linear-gradient(145deg, rgba(147, 51, 234, 0.4), rgba(15, 12, 28, 0.9)), url("https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1000&q=80") center/cover',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          minHeight: '380px'
        }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(255, 255, 255, 0.12)', backdropFilter: 'blur(8px)', padding: '6px 12px', borderRadius: '30px', fontSize: '12px', fontWeight: '700', color: '#e9d5ff', marginBottom: '20px' }}>
              <Sparkles size={14} /> ELITE FITNESS SUITE
            </div>
            <h1 style={{ fontSize: '32px', fontWeight: '800', lineHeight: 1.2, color: '#fff', marginBottom: '12px' }}>
              Push Limits.<br />Track Performance.
            </h1>
            <p style={{ color: 'rgba(255, 255, 255, 0.75)', fontSize: '14px', lineHeight: 1.6 }}>
              Automated memberships, real-time validity checks, and personalized workout logs in one centralized hub.
            </p>
          </div>

          <div style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.5)' }}>
            IGNOU BCA 6th Semester Project • BCSP-064
          </div>
        </div>

        {/* Right Form Card */}
        <div style={{ padding: '48px 40px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ marginBottom: '28px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#fff', marginBottom: '6px' }}>Welcome Back</h2>
            <p style={{ color: '#94a3b8', fontSize: '14px' }}>Sign in with your registered credentials</p>
          </div>

          {error && (
            <div style={{ padding: '12px 14px', background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '10px', color: '#fca5a5', fontSize: '13px', marginBottom: '20px' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '18px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#cbd5e1', marginBottom: '8px' }}>Email Address</label>
              <div style={{ position: 'relative' }}>
                <Mail size={18} color="#64748b" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="email"
                  required
                  placeholder="admin@gym.com or member email"
                  style={{ width: '100%', padding: '12px 14px 12px 42px', background: 'rgba(15, 23, 42, 0.6)', border: '1px solid #334155', borderRadius: '10px', color: '#fff', fontSize: '14px', outline: 'none' }}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#cbd5e1', marginBottom: '8px' }}>Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={18} color="#64748b" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  style={{ width: '100%', padding: '12px 14px 12px 42px', background: 'rgba(15, 23, 42, 0.6)', border: '1px solid #334155', borderRadius: '10px', color: '#fff', fontSize: '14px', outline: 'none' }}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="glow-btn"
              style={{ width: '100%', padding: '14px', border: 'none', borderRadius: '10px', color: '#fff', fontWeight: '700', fontSize: '15px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
            >
              {submitting ? 'Authenticating...' : 'Sign In'} <ArrowRight size={18} />
            </button>
          </form>

          <p style={{ marginTop: '24px', textAlign: 'center', fontSize: '14px', color: '#94a3b8' }}>
            New to Gym Bros?{' '}
            <Link to="/register" style={{ color: '#c084fc', textDecoration: 'none', fontWeight: '600' }}>
              Create an account
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}