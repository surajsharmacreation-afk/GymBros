import React, { useState, useEffect } from 'react';
import { 
  Users, 
  UserCheck, 
  UserX, 
  Layers, 
  Search, 
  CheckCircle, 
  Trash2, 
  ShieldCheck, 
  RefreshCw,
  Phone,
  Mail,
  Calendar,
  Zap,
  Clock,
  Sparkles
} from 'lucide-react';
import API from '../api';

export default function AdminDashboard() {
  const [stats, setStats] = useState({});
  const [members, setMembers] = useState([]);
  const [plans, setPlans] = useState([]);
  const [selectedPlans, setSelectedPlans] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [statsRes, membersRes] = await Promise.all([
        API.get('/admin/dashboard-stats'),
        API.get('/admin/members')
      ]);
      setStats(statsRes.data);
      setMembers(membersRes.data);
    } catch (err) {
      console.error('Failed to load admin stats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    setPlans([
      { name: 'Basic Starter' },
      { name: 'Pro Quarterly' },
      { name: 'Elite Annual' }
    ]);
  }, []);

  const handleAssignPlan = async (memberId, planNameParam = null) => {
    const planName = planNameParam || selectedPlans[memberId];
    if (!planName) return alert('Kripya plan select karein!');

    try {
      setActionLoading(true);
      await API.put('/admin/assign-plan', { memberId, planName });
      alert(`✅ Membership plan "${planName}" successfully activated!`);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Plan assign karne mein error aaya');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteMember = async (memberId, memberName) => {
    if (!window.confirm(`Kya aap sach me ${memberName} ko remove karna chahte hain?`)) return;

    try {
      await API.delete(`/admin/member/${memberId}`);
      alert('Member removed successfully');
      fetchData();
    } catch (err) {
      alert('Failed to delete member');
    }
  };

  const pendingRequests = members.filter((m) => m.requestedPlan);

  const filteredMembers = members.filter((m) =>
    m.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.phone?.includes(searchTerm)
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Header Banner */}
      <div className="glass-panel" style={{ padding: '24px 28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#c084fc', fontSize: '12px', fontWeight: '800', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '6px' }}>
            <ShieldCheck size={16} /> Central Administrative Control
          </div>
          <h1 style={{ fontSize: 'clamp(22px, 4vw, 30px)', fontWeight: '800', margin: 0, color: '#fff' }}>
            GymBros Manager Console
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '13px', margin: '4px 0 0' }}>
            Live member directories, fee activation status, and pass tenure management.
          </p>
        </div>

        <button
          onClick={fetchData}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 18px', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', color: '#cbd5e1', borderRadius: '12px', cursor: 'pointer', fontSize: '13px', fontWeight: '600' }}
        >
          <RefreshCw size={15} /> Sync Data
        </button>
      </div>

      {/* KPI Metric Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
        <div className="glass-panel" style={{ padding: '20px', borderLeft: '4px solid #38bdf8' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '12px', color: '#94a3b8', fontWeight: '600', textTransform: 'uppercase' }}>Registered</span>
            <Users size={18} color="#38bdf8" />
          </div>
          <h2 style={{ fontSize: '28px', fontWeight: '800', color: '#fff', margin: '8px 0 0' }}>{stats.totalMembers || 0}</h2>
          <small style={{ color: '#64748b', fontSize: '11px' }}>Total client profiles</small>
        </div>

        <div className="glass-panel" style={{ padding: '20px', borderLeft: '4px solid #4ade80' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '12px', color: '#94a3b8', fontWeight: '600', textTransform: 'uppercase' }}>Active Passes</span>
            <UserCheck size={18} color="#4ade80" />
          </div>
          <h2 style={{ fontSize: '28px', fontWeight: '800', color: '#4ade80', margin: '8px 0 0' }}>{stats.activeMembers || 0}</h2>
          <small style={{ color: '#64748b', fontSize: '11px' }}>Valid paid subscriptions</small>
        </div>

        <div className="glass-panel" style={{ padding: '20px', borderLeft: '4px solid #f87171' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '12px', color: '#94a3b8', fontWeight: '600', textTransform: 'uppercase' }}>Unpaid / Expired</span>
            <UserX size={18} color="#f87171" />
          </div>
          <h2 style={{ fontSize: '28px', fontWeight: '800', color: '#f87171', margin: '8px 0 0' }}>{stats.expiredMembers || 0}</h2>
          <small style={{ color: '#64748b', fontSize: '11px' }}>Requires counter renewal</small>
        </div>

        <div className="glass-panel" style={{ padding: '20px', borderLeft: '4px solid #facc15' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '12px', color: '#94a3b8', fontWeight: '600', textTransform: 'uppercase' }}>Configured Plans</span>
            <Layers size={18} color="#facc15" />
          </div>
          <h2 style={{ fontSize: '28px', fontWeight: '800', color: '#facc15', margin: '8px 0 0' }}>{stats.totalPlans || 3}</h2>
          <small style={{ color: '#64748b', fontSize: '11px' }}>Tier options available</small>
        </div>
      </div>

      {/* Pending Counter Requests Alert Section */}
      {pendingRequests.length > 0 && (
        <div className="pulse-alert" style={{
          background: 'linear-gradient(135deg, rgba(234, 179, 8, 0.16), rgba(168, 85, 247, 0.2))',
          border: '1px solid rgba(234, 179, 8, 0.5)',
          borderRadius: '16px',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Clock size={18} color="#facc15" />
            <h4 style={{ margin: 0, color: '#facc15', fontSize: '15px', fontWeight: '800' }}>
              Pending Counter Approvals ({pendingRequests.length})
            </h4>
          </div>
          <p style={{ margin: 0, fontSize: '12px', color: '#cbd5e1' }}>
            Fee receipt counter par verify karke single click me membership activate karein:
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {pendingRequests.map((pending) => (
              <div 
                key={pending._id} 
                style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  flexWrap: 'wrap', 
                  gap: '12px', 
                  background: 'rgba(15, 23, 42, 0.85)', 
                  padding: '12px 18px', 
                  borderRadius: '12px',
                  border: '1px solid rgba(255, 255, 255, 0.08)'
                }}
              >
                <div>
                  <div style={{ fontWeight: '700', color: '#fff', fontSize: '14px' }}>{pending.name}</div>
                  <div style={{ fontSize: '12px', color: '#94a3b8' }}>
                    {pending.email} • Requested Plan: <b style={{ color: '#c084fc', fontSize: '13px' }}>{pending.requestedPlan}</b>
                  </div>
                </div>

                <button
                  disabled={actionLoading}
                  onClick={() => handleAssignPlan(pending._id, pending.requestedPlan)}
                  className="glow-btn"
                  style={{
                    padding: '8px 16px',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '12px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <Zap size={14} /> Approve & Activate Now
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Directory Management Table */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '14px' }}>
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#fff', margin: 0 }}>Registered Client Registry</h3>
            <p style={{ fontSize: '12px', color: '#94a3b8', margin: '4px 0 0' }}>Assign new memberships upon receiving counter payment.</p>
          </div>

          <div style={{ position: 'relative', width: '100%', maxWidth: '320px' }}>
            <Search size={16} color="#64748b" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Search member by name, email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: '100%', padding: '10px 14px 10px 38px', borderRadius: '10px', background: 'rgba(15, 23, 42, 0.6)', border: '1px solid #334155', color: '#fff', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }}
            />
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>
            <p>Loading members directory...</p>
          </div>
        ) : filteredMembers.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>
            <p>No members found matching your search.</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '650px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)', color: '#94a3b8', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
                  <th style={{ padding: '14px 12px' }}>Member</th>
                  <th style={{ padding: '14px 12px' }}>Current Plan</th>
                  <th style={{ padding: '14px 12px' }}>Validity Status</th>
                  <th style={{ padding: '14px 12px' }}>Expiry Date</th>
                  <th style={{ padding: '14px 12px' }}>Counter Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredMembers.map((m) => {
                  const isActive = m.subscriptionStatus === 'active';
                  return (
                    <tr key={m._id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)', fontSize: '13px' }}>
                      <td style={{ padding: '14px 12px' }}>
                        <div style={{ fontWeight: '700', color: '#fff' }}>{m.name}</div>
                        <div style={{ fontSize: '12px', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                          <Mail size={12} /> {m.email}
                        </div>
                        {m.phone && (
                          <div style={{ fontSize: '11px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                            <Phone size={11} /> {m.phone}
                          </div>
                        )}
                        {m.requestedPlan && (
                          <div style={{ marginTop: '4px' }}>
                            <span style={{ fontSize: '10px', background: 'rgba(234, 179, 8, 0.2)', color: '#facc15', padding: '2px 6px', borderRadius: '4px', fontWeight: '700' }}>
                              ⚡ Requested: {m.requestedPlan}
                            </span>
                          </div>
                        )}
                      </td>

                      <td style={{ padding: '14px 12px', color: '#e2e8f0', fontWeight: '600' }}>
                        {m.membershipPlan?.name || <span style={{ color: '#64748b' }}>None</span>}
                      </td>

                      <td style={{ padding: '14px 12px' }}>
                        <span style={{
                          display: 'inline-block',
                          padding: '4px 10px',
                          borderRadius: '6px',
                          fontSize: '11px',
                          fontWeight: '800',
                          letterSpacing: '0.5px',
                          background: isActive ? 'rgba(34, 197, 94, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                          color: isActive ? '#4ade80' : '#f87171',
                          border: `1px solid ${isActive ? 'rgba(34, 197, 94, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`
                        }}>
                          {isActive ? 'ACTIVE' : 'INACTIVE'}
                        </span>
                      </td>

                      <td style={{ padding: '14px 12px', color: '#cbd5e1' }}>
                        {m.subscriptionExpiry ? (
                          <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <Calendar size={13} color="#94a3b8" />
                            {new Date(m.subscriptionExpiry).toLocaleDateString()}
                          </span>
                        ) : (
                          <span style={{ color: '#64748b' }}>N/A</span>
                        )}
                      </td>

                      <td style={{ padding: '14px 12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <select
                            onChange={(e) => setSelectedPlans({ ...selectedPlans, [m._id]: e.target.value })}
                            defaultValue=""
                            style={{ padding: '6px 10px', borderRadius: '8px', background: 'rgba(15, 23, 42, 0.8)', border: '1px solid #334155', color: '#fff', fontSize: '12px', outline: 'none' }}
                          >
                            <option value="" disabled>Select Plan</option>
                            {plans.map((p, idx) => (
                              <option key={idx} value={p.name}>{p.name}</option>
                            ))}
                          </select>

                          <button
                            onClick={() => handleAssignPlan(m._id)}
                            disabled={actionLoading}
                            className="glow-btn"
                            style={{ padding: '6px 12px', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '12px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                          >
                            <CheckCircle size={13} /> Activate
                          </button>

                          <button
                            onClick={() => handleDeleteMember(m._id, m.name)}
                            style={{ padding: '6px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', color: '#f87171', borderRadius: '8px', cursor: 'pointer' }}
                            title="Delete Member"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}