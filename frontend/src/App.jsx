import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import Lenis from 'lenis';
import { Dumbbell, LogOut, ShieldCheck, User as UserIcon } from 'lucide-react';
import API from './api';

import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import MemberDashboard from './pages/MemberDashboard';

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    API.get('/auth/me')
      .then((res) => setUser(res.data))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));

    return () => lenis.destroy();
  }, []);

  const handleLogout = async () => {
    await API.post('/auth/logout');
    setUser(null);
  };

  if (loading) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: '36px', height: '36px', border: '3px solid #334155', borderTopColor: '#c084fc', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <Router>
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        backdropFilter: 'blur(16px)',
        background: 'rgba(8, 7, 13, 0.85)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
      }}>
        <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
            <div style={{ padding: '6px', background: 'linear-gradient(135deg, #9333ea, #4f46e5)', borderRadius: '10px', display: 'flex' }}>
              <Dumbbell size={20} color="#fff" />
            </div>
            <span style={{ fontSize: '18px', fontWeight: '800', background: 'linear-gradient(90deg, #fff, #c084fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              GYM BROS
            </span>
          </Link>

          <nav style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {user ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(255, 255, 255, 0.05)', padding: '4px 10px', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.08)', fontSize: '12px' }}>
                  {user.role === 'admin' ? <ShieldCheck size={14} color="#c084fc" /> : <UserIcon size={14} color="#a855f7" />}
                  <span style={{ fontWeight: '600', maxWidth: '90px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.name}</span>
                  <span style={{ fontSize: '10px', textTransform: 'uppercase', padding: '1px 5px', background: user.role === 'admin' ? '#9333ea' : '#334155', borderRadius: '4px', fontWeight: '700' }}>
                    {user.role}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'rgba(239, 68, 68, 0.1)', color: '#f87171', border: '1px solid rgba(239, 68, 68, 0.2)', padding: '5px 10px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '12px' }}
                >
                  <LogOut size={13} />
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', gap: '8px' }}>
                <Link to="/login" style={{ color: '#cbd5e1', textDecoration: 'none', padding: '6px 12px', fontSize: '13px', fontWeight: '600' }}>
                  Sign In
                </Link>
                <Link to="/register" className="glow-btn" style={{ color: '#fff', textDecoration: 'none', padding: '6px 14px', borderRadius: '8px', fontSize: '13px', fontWeight: '600' }}>
                  Join
                </Link>
              </div>
            )}
          </nav>
        </div>
      </header>

      <main style={{ maxWidth: '1240px', margin: '0 auto', padding: '16px 12px' }}>
        <Routes>
          <Route path="/" element={user ? (user.role === 'admin' ? <Navigate to="/admin" /> : <Navigate to="/member" />) : <Navigate to="/login" />} />
          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin" element={user && user.role === 'admin' ? <AdminDashboard /> : <Navigate to="/login" />} />
          <Route path="/member" element={user ? <MemberDashboard user={user} /> : <Navigate to="/login" />} />
        </Routes>
      </main>
    </Router>
  );
}