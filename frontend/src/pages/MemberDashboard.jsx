import React, { useState, useEffect } from 'react';
import { 
  CreditCard, Activity, Flame, Clock, CheckCircle2, AlertCircle, Send, Zap, Edit3 
} from 'lucide-react';
import API from '../api';

export default function MemberDashboard({ user }) {
  const [exercises, setExercises] = useState([]);
  const [supportMsg, setSupportMsg] = useState('');
  const [supportSending, setSupportSending] = useState(false);
  const [supportSuccess, setSupportSuccess] = useState(false);
  const [requestStatus, setRequestStatus] = useState('');
  
  // Naye user ke liye force onboarding agar profile complete nahi hai
  const [showModal, setShowModal] = useState(!user.isProfileComplete);
  const [vitals, setVitals] = useState({ age: user.age || '', height: user.height || '', weight: user.weight || '' });
  const [savingVitals, setSavingVitals] = useState(false);

  // Aaj ka din nikalne ka logic (0=Sun, 1=Mon... 6=Sat)
  const currentDayNum = new Date().getDay();
  const dayNames = ['Sunday (Rest)', 'Monday (Chest & Triceps)', 'Tuesday (Back & Biceps)', 'Wednesday (Legs & Core)', 'Thursday (Shoulders)', 'Friday (Full Body)', 'Saturday (Cardio/Abs)'];
  const todayLabel = dayNames[currentDayNum];

  useEffect(() => {
    // Agar Sunday hai (0), toh hum default 1 ya koi aur dikha sakte hain, ya empty.
    // Hum Day 1 se 6 tak DB se API hit kar rahe hain. Week 1 assume kiya hai.
    const fetchDay = currentDayNum === 0 ? 1 : currentDayNum; 
    
    API.get(`/exercises/day/1/${fetchDay}`)
      .then((res) => setExercises(res.data))
      .catch(() => setExercises([]));
  }, [currentDayNum]);

  const calculateBMI = () => {
    if (!user.height || !user.weight) return null;
    const heightInMeters = user.height / 100;
    const bmi = (user.weight / (heightInMeters * heightInMeters)).toFixed(1);
    let category = 'Normal';
    if (bmi < 18.5) category = 'Underweight';
    else if (bmi >= 25 && bmi < 29.9) category = 'Overweight';
    else if (bmi >= 30) category = 'Obese';
    return { score: bmi, category };
  };

  const bmiData = calculateBMI();

  const handleUpdateVitals = async (e) => {
    e.preventDefault();
    setSavingVitals(true);
    try {
      await API.put('/profile/update', vitals);
      setShowModal(false);
      window.location.reload(); // Refresh to update user context globally
    } catch (err) {
      alert("Failed to update profile");
    } finally {
      setSavingVitals(false);
    }
  };

  const handleRequestPlan = async (planName) => { /* ... existing request logic ... */ };
  const handleSendSupport = async (e) => { /* ... existing support logic ... */ };

  const isActive = user.subscriptionStatus === 'active';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', position: 'relative' }}>
      
      {/* Top Welcome Banner */}
      <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <div>
          <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', color: '#c084fc', fontWeight: '800' }}>Member Workspace</span>
          <h1 style={{ fontSize: 'clamp(20px, 5vw, 28px)', fontWeight: '800', margin: '4px 0', color: '#fff', wordBreak: 'break-word' }}>
            Welcome back, {user.name}! 🔥
          </h1>
        </div>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 14px', background: isActive ? 'rgba(34, 197, 94, 0.12)' : 'rgba(239, 68, 68, 0.12)', border: `1px solid ${isActive ? 'rgba(34, 197, 94, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`, borderRadius: '10px' }}>
            {isActive ? <CheckCircle2 size={16} color="#4ade80" /> : <AlertCircle size={16} color="#f87171" />}
            <span style={{ fontSize: '12px', fontWeight: '800', color: isActive ? '#4ade80' : '#f87171' }}>
              {isActive ? 'MEMBERSHIP ACTIVE' : 'INACTIVE / UNPAID'}
            </span>
          </div>
        </div>
      </div>

      {/* Vitals Card */}
      <div className="glass-panel" style={{ padding: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Activity size={18} color="#a855f7" />
            <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#fff', margin: 0 }}>Vitals & Health</h3>
          </div>
          <button onClick={() => setShowModal(true)} style={{ background: 'rgba(168, 85, 247, 0.15)', border: '1px solid rgba(168, 85, 247, 0.3)', color: '#c084fc', padding: '4px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: '700', cursor: 'pointer' }}>
            <Edit3 size={12} style={{display: 'inline', marginRight:'4px'}}/> Edit
          </button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '16px' }}>
          <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '10px', borderRadius: '10px', textAlign: 'center' }}>
            <p style={{ margin: 0, fontSize: '11px', color: '#94a3b8' }}>Age</p>
            <h4 style={{ margin: '4px 0 0', fontSize: '16px', color: '#fff' }}>{user.age || '--'}</h4>
          </div>
          <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '10px', borderRadius: '10px', textAlign: 'center' }}>
            <p style={{ margin: 0, fontSize: '11px', color: '#94a3b8' }}>Height</p>
            <h4 style={{ margin: '4px 0 0', fontSize: '16px', color: '#fff' }}>{user.height ? `${user.height} cm` : '--'}</h4>
          </div>
          <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '10px', borderRadius: '10px', textAlign: 'center' }}>
            <p style={{ margin: 0, fontSize: '11px', color: '#94a3b8' }}>Weight</p>
            <h4 style={{ margin: '4px 0 0', fontSize: '16px', color: '#fff' }}>{user.weight ? `${user.weight} kg` : '--'}</h4>
          </div>
        </div>
        <div style={{ padding: '12px', background: 'rgba(168, 85, 247, 0.08)', borderRadius: '10px', border: '1px solid rgba(168, 85, 247, 0.2)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <p style={{ margin: 0, fontSize: '11px', color: '#c084fc', fontWeight: '700' }}>Calculated BMI</p>
            <p style={{ margin: 0, fontSize: '13px', fontWeight: '800', color: '#fff' }}>{bmiData ? `${bmiData.score} (${bmiData.category})` : 'Update profile data'}</p>
          </div>
          <Flame size={20} color="#f59e0b" />
        </div>
      </div>

      {/* Routine Showcase Section (Day-wise) */}
      <div className="glass-panel" style={{ padding: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#fff', margin: 0 }}>Today's Training Program</h3>
            <p style={{ fontSize: '12px', color: '#94a3b8', margin: '4px 0 0' }}>{todayLabel}</p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
          {currentDayNum === 0 ? (
             <p style={{ color: '#4ade80', fontSize: '14px', fontWeight: '600' }}>It's Sunday! Take a rest and recover well. 💤</p>
          ) : exercises.length > 0 ? (
            exercises.map((item) => (
              <div key={item._id} style={{ background: 'rgba(15, 23, 42, 0.5)', border: '1px solid rgba(255, 255, 255, 0.06)', borderRadius: '12px', padding: '14px', display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '10px', textTransform: 'uppercase', padding: '3px 8px', background: 'rgba(168, 85, 247, 0.2)', color: '#c084fc', borderRadius: '6px', width: 'fit-content', marginBottom: '8px' }}>
                  {item.category || 'Strength'}
                </span>
                <h4 style={{ margin: '0 0 4px', fontSize: '14px', color: '#fff' }}>{item.name}</h4>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 'auto', paddingTop: '10px', borderTop: '1px solid rgba(255, 255, 255, 0.05)', fontSize: '11px', color: '#cbd5e1' }}>
                  <span><b>{item.sets}</b> Sets × <b>{item.reps}</b> Reps</span>
                  <span style={{ color: '#94a3b8' }}>{item.durationMinutes} min</span>
                </div>
              </div>
            ))
          ) : (
            <p style={{ color: '#94a3b8', fontSize: '13px' }}>No specific workout mapped for today in the database.</p>
          )}
        </div>
      </div>

      {/* Mandatory Onboarding / Update Modal */}
      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999 }}>
          <div className="glass-panel" style={{ padding: '28px', width: '90%', maxWidth: '350px' }}>
            <h2 style={{ margin: '0 0 8px', color: '#fff', fontSize: '20px', fontWeight: '800' }}>
              {user.isProfileComplete ? 'Update Vitals' : 'Welcome to GymBros! 🎉'}
            </h2>
            <p style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '20px' }}>
              {user.isProfileComplete ? 'Update your current stats.' : 'Please provide your basic physical vitals to unlock your BMI dashboard and workouts.'}
            </p>
            
            <form onSubmit={handleUpdateVitals} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '11px', color: '#cbd5e1', marginBottom: '4px' }}>Age (Years)</label>
                <input type="number" required value={vitals.age} onChange={e => setVitals({...vitals, age: e.target.value})} style={{ width: '100%', padding: '10px', background: 'rgba(15, 23, 42, 0.8)', border: '1px solid #334155', borderRadius: '8px', color: '#fff' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '11px', color: '#cbd5e1', marginBottom: '4px' }}>Height (cm)</label>
                <input type="number" required value={vitals.height} onChange={e => setVitals({...vitals, height: e.target.value})} style={{ width: '100%', padding: '10px', background: 'rgba(15, 23, 42, 0.8)', border: '1px solid #334155', borderRadius: '8px', color: '#fff' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '11px', color: '#cbd5e1', marginBottom: '4px' }}>Weight (kg)</label>
                <input type="number" step="0.1" required value={vitals.weight} onChange={e => setVitals({...vitals, weight: e.target.value})} style={{ width: '100%', padding: '10px', background: 'rgba(15, 23, 42, 0.8)', border: '1px solid #334155', borderRadius: '8px', color: '#fff' }} />
              </div>
              
              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                {/* Agar profile complete hai toh Cancel button dikhega, warna naye user ko form fill karna mandatory hai */}
                {user.isProfileComplete && (
                  <button type="button" onClick={() => setShowModal(false)} style={{ flex: 1, padding: '12px', background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '8px', color: '#fff', cursor: 'pointer' }}>Cancel</button>
                )}
                <button type="submit" disabled={savingVitals} className="glow-btn" style={{ flex: 2, padding: '12px', border: 'none', borderRadius: '8px', color: '#fff', fontWeight: '700', cursor: 'pointer' }}>
                  {savingVitals ? 'Saving...' : 'Save Details'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}