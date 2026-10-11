import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';

export default function Register() {
  const [formData, setFormData] = useState({ 
    name: '', 
    email: '', 
    password: '', 
    phone: '',
    adminSecret: '' // Optional, sirf aapke liye
  });
  const [showAdminSecret, setShowAdminSecret] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/auth/register', formData);
      alert('Account successfully created! Please log in.');
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: 'auto', padding: '24px', background: '#1e293b', color: '#fff', borderRadius: '10px' }}>
      <h3 style={{ margin: '0 0 15px' }}>Create Gym Member Account</h3>
      {error && <p style={{ color: '#f87171', fontSize: '14px' }}>{error}</p>}
      
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '12px' }}>
          <label style={{ fontSize: '13px', color: '#94a3b8' }}>Full Name</label>
          <input 
            type="text" 
            required 
            style={{ width: '100%', padding: '10px', borderRadius: '6px', background: '#0f172a', border: '1px solid #334155', color: '#fff', boxSizing: 'border-box' }} 
            onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
          />
        </div>

        <div style={{ marginBottom: '12px' }}>
          <label style={{ fontSize: '13px', color: '#94a3b8' }}>Email</label>
          <input 
            type="email" 
            required 
            style={{ width: '100%', padding: '10px', borderRadius: '6px', background: '#0f172a', border: '1px solid #334155', color: '#fff', boxSizing: 'border-box' }} 
            onChange={(e) => setFormData({ ...formData, email: e.target.value })} 
          />
        </div>

        <div style={{ marginBottom: '12px' }}>
          <label style={{ fontSize: '13px', color: '#94a3b8' }}>Password</label>
          <input 
            type="password" 
            required 
            style={{ width: '100%', padding: '10px', borderRadius: '6px', background: '#0f172a', border: '1px solid #334155', color: '#fff', boxSizing: 'border-box' }} 
            onChange={(e) => setFormData({ ...formData, password: e.target.value })} 
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ fontSize: '13px', color: '#94a3b8' }}>Phone Number</label>
          <input 
            type="text" 
            style={{ width: '100%', padding: '10px', borderRadius: '6px', background: '#0f172a', border: '1px solid #334155', color: '#fff', boxSizing: 'border-box' }} 
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })} 
          />
        </div>

        {/* Hidden Admin Passcode Toggle */}
        <div style={{ marginBottom: '15px' }}>
          <span 
            onClick={() => setShowAdminSecret(!showAdminSecret)} 
            style={{ fontSize: '12px', color: '#38bdf8', cursor: 'pointer', textDecoration: 'underline' }}
          >
            {showAdminSecret ? "Hide Admin Secret" : "Are you Gym Owner/Admin?"}
          </span>
          {showAdminSecret && (
            <input 
              type="password" 
              placeholder="Enter Admin Passcode" 
              style={{ width: '100%', marginTop: '8px', padding: '10px', borderRadius: '6px', background: '#0f172a', border: '1px solid #facc15', color: '#fff', boxSizing: 'border-box' }} 
              onChange={(e) => setFormData({ ...formData, adminSecret: e.target.value })} 
            />
          )}
        </div>

        <button type="submit" style={{ width: '100%', padding: '12px', background: '#10b981', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
          Create Account
        </button>
      </form>
    </div>
  );
}