import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import API from '../services/api';
import { Award, BookOpen, User, Calendar, ShieldAlert, Sparkles, MapPin, Bus, CreditCard, CheckCircle, Users, Bell, FileText, Layers } from 'lucide-react';

const StudentDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [profile, setProfile] = useState(null);
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(false);

  // Profile Wizard form fields
  const [isHosteler, setIsHosteler] = useState(false);
  const [transportType, setTransportType] = useState('None');
  const [villageName, setVillageName] = useState('');
  const [aadhaarCardNo, setAadhaarCardNo] = useState('');
  const [enrolledCourse, setEnrolledCourse] = useState('General Sciences');
  const [lastYearMarks, setLastYearMarks] = useState('');
  const [gender, setGender] = useState('Male');

  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  const [fees, setFees] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'Term Fee Overdue Notice', content: 'Your tuition fees for the Spring 2026 Semester are due by Friday next week. Please complete payment under the Fee Details tab.', date: 'May 26, 2026', read: false, type: 'warning' },
    { id: 2, title: 'Syllabus Catalog Uploaded', content: 'The updated course syllabi and subject catalogs for Computer Science, Arts, and Sciences have been updated. View them in the Syllabus Pattern tab.', date: 'May 25, 2026', read: false, type: 'info' },
    { id: 3, title: 'Summer Holiday Notice', content: 'The summer holiday rescheduled dates are now active. Check the timeline in the Academic Calendar tab.', date: 'May 22, 2026', read: true, type: 'info' }
  ]);

  const fetchProfileAndGrades = async () => {
    setLoading(true);
    try {
      const profileRes = await API.get('/api/student/profile');
      setProfile(profileRes.data);

      // Prepopulate form fields if they already exist
      if (profileRes.data) {
        setIsHosteler(profileRes.data.isHosteler || false);
        setTransportType(profileRes.data.transportType || 'None');
        setVillageName(profileRes.data.villageName || '');
        setAadhaarCardNo(profileRes.data.aadhaarCardNo || '');
        setEnrolledCourse(profileRes.data.enrolledCourse || 'General Sciences');
        setLastYearMarks(profileRes.data.lastYearMarks !== null && profileRes.data.lastYearMarks !== undefined ? profileRes.data.lastYearMarks : '');
        setGender(profileRes.data.gender || 'Male');
      }

      const gradesRes = await API.get('/api/student/grades');
      setGrades(gradesRes.data);

      const feesRes = await API.get('/api/student/fees');
      setFees(feesRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileAndGrades();
  }, [activeTab]);

  const safeFees = fees || [];
  const totalTuitionPaid = safeFees.reduce((sum, f) => sum + (f.tuitionFee || 0.0), 0.0);
  const totalSportsPaid = safeFees.reduce((sum, f) => sum + (f.sportsFee || 0.0), 0.0);
  const totalLabPaid = safeFees.reduce((sum, f) => sum + (f.labFee || 0.0), 0.0);
  const totalAccessoriesPaid = safeFees.reduce((sum, f) => sum + (f.schoolAccessoriesFee || 0.0), 0.0);
  const totalTransportPaid = safeFees.reduce((sum, f) => sum + (f.transportFee || 0.0), 0.0);
  const totalHostelPaid = safeFees.reduce((sum, f) => sum + (f.hostelFee || 0.0), 0.0);
  const totalOtherPaid = safeFees.reduce((sum, f) => sum + (f.otherCharges || 0.0), 0.0);

  const isFeeCleared = Math.max(0, (profile?.totalBilledAmount || 0.0) - safeFees.reduce((acc, curr) => acc + (curr.amountPaid || 0), 0)) <= 0;

  const getLastPaymentDate = () => {
    if (safeFees.length === 0) return 'June 05, 2026';
    const dates = safeFees.map(f => new Date(f.paymentDate).getTime());
    const lastDate = new Date(Math.max(...dates));
    return lastDate.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');
    setSubmitting(true);

    // Frontend validation
    if (!villageName.trim()) {
      setFormError('Village/City Name is required.');
      setSubmitting(false);
      return;
    }
    if (!/^\d{12}$/.test(aadhaarCardNo)) {
      setFormError('Aadhaar Card Number must be exactly 12 digits.');
      setSubmitting(false);
      return;
    }
    const marksNum = parseFloat(lastYearMarks);
    if (isNaN(marksNum) || marksNum < 0 || marksNum > 100) {
      setFormError('Last Year Marks must be a percentage between 0 and 100.');
      setSubmitting(false);
      return;
    }

    try {
      const response = await API.post('/api/student/profile', {
        isHosteler,
        transportType,
        villageName,
        aadhaarCardNo,
        enrolledCourse,
        lastYearMarks: marksNum,
        gender
      });

      setFormSuccess('Profile completed and saved successfully!');
      setProfile(response.data);
    } catch (err) {
      setFormError(err.response?.data || 'Failed to submit profile.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="app-container">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="main-content">
        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem' }}>
            <p style={{ color: 'var(--text-muted)' }}>Loading student profile ledger...</p>
          </div>
        ) : profile && !profile.profileCompleted ? (
          // PROFILE COMPLETION WIZARD
          <div className="animate-fade-in" style={{ maxWidth: '800px', margin: '0 auto', padding: '1.5rem 0' }}>
            <div className="page-header" style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(59, 130, 246, 0.1)', color: 'var(--color-primary)', width: '48px', height: '48px', borderRadius: '50%', marginBottom: '1rem' }}>
                <Sparkles size={24} />
              </div>
              <h1 className="page-title">Complete Your Student Profile</h1>
              <p className="page-subtitle">Please verify your details and provide the required information below to unlock the dashboard</p>
            </div>

            {formError && (
              <div style={{
                background: 'rgba(239, 68, 68, 0.15)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                color: '#fca5a5',
                padding: '0.85rem',
                borderRadius: '8px',
                marginBottom: '1.5rem',
                fontSize: '0.875rem'
              }}>
                {formError}
              </div>
            )}

            <form onSubmit={handleProfileSubmit} className="glass-card" style={{ padding: '2rem' }}>
              {/* Pre-fetched Section */}
              <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--color-primary)', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>
                1. Pre-fetched Administrative Records (Read Only)
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '2rem' }}>
                <div className="form-group">
                  <label className="form-label" style={{ color: 'var(--text-muted)' }}>Full Name</label>
                  <input type="text" value={profile.name || ''} disabled style={{ opacity: 0.6, cursor: 'not-allowed', background: 'rgba(255,255,255,0.02)' }} />
                </div>
                <div className="form-group">
                  <label className="form-label" style={{ color: 'var(--text-muted)' }}>Roll Number</label>
                  <input type="text" value={profile.rollNumber || ''} disabled style={{ opacity: 0.6, cursor: 'not-allowed', background: 'rgba(255,255,255,0.02)' }} />
                </div>
                <div className="form-group">
                  <label className="form-label" style={{ color: 'var(--text-muted)' }}>Registered Phone Number</label>
                  <input type="text" value={profile.user?.phoneNumber || ''} disabled style={{ opacity: 0.6, cursor: 'not-allowed', background: 'rgba(255,255,255,0.02)' }} />
                </div>
                <div className="form-group">
                  <label className="form-label" style={{ color: 'var(--text-muted)' }}>Registered Email</label>
                  <input type="text" value={profile.user?.email || ''} disabled style={{ opacity: 0.6, cursor: 'not-allowed', background: 'rgba(255,255,255,0.02)' }} />
                </div>
                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label className="form-label" style={{ color: 'var(--text-muted)' }}>Assigned Grade Level</label>
                  <input type="text" value={profile.gradeLevel || ''} disabled style={{ opacity: 0.6, cursor: 'not-allowed', background: 'rgba(255,255,255,0.02)' }} />
                </div>
              </div>

              {/* Input Fields */}
              <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--color-secondary)', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>
                2. Mandatory Student Demographics
              </h3>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                <div className="form-group">
                  <label className="form-label">Aadhaar Card Number (12 Digits)</label>
                  <div style={{ position: 'relative' }}>
                    <CreditCard size={15} style={{ position: 'absolute', left: '12px', top: '15px', color: 'var(--text-muted)' }} />
                    <input 
                      type="text" 
                      placeholder="e.g. 123456789012" 
                      value={aadhaarCardNo} 
                      onChange={(e) => setAadhaarCardNo(e.target.value.replace(/\D/g, '').slice(0, 12))} 
                      required 
                      style={{ paddingLeft: '2.5rem', width: '100%' }}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Gender Identity</label>
                  <select value={gender} onChange={(e) => setGender(e.target.value)} style={{ width: '100%' }}>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Village/City Name</label>
                  <div style={{ position: 'relative' }}>
                    <MapPin size={15} style={{ position: 'absolute', left: '12px', top: '15px', color: 'var(--text-muted)' }} />
                    <input 
                      type="text" 
                      placeholder="e.g. Rampur" 
                      value={villageName} 
                      onChange={(e) => setVillageName(e.target.value)} 
                      required 
                      style={{ paddingLeft: '2.5rem', width: '100%' }}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Enrolled Academic Course</label>
                  <select value={enrolledCourse} onChange={(e) => setEnrolledCourse(e.target.value)} style={{ width: '100%' }}>
                    <option value="General Sciences">General Sciences</option>
                    <option value="Computer Science & IT">Computer Science & IT</option>
                    <option value="Commerce & Economics">Commerce & Economics</option>
                    <option value="Arts & Humanities">Arts & Humanities</option>
                  </select>
                </div>

                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label className="form-label">Last Year Marks Obtained (%)</label>
                  <div style={{ position: 'relative' }}>
                    <Award size={15} style={{ position: 'absolute', left: '12px', top: '15px', color: 'var(--text-muted)' }} />
                    <input 
                      type="number" 
                      step="0.01" 
                      min="0" 
                      max="100" 
                      placeholder="e.g. 87.50 (Allocates your Class Section)" 
                      value={lastYearMarks} 
                      onChange={(e) => setLastYearMarks(e.target.value)} 
                      required 
                      style={{ paddingLeft: '2.5rem', width: '100%' }}
                    />
                  </div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginTop: '0.25rem' }}>
                    Section allocation rules: 85%+ gets Section A, 60%-84.9% gets Section B, &lt;60% gets Section C.
                  </span>
                </div>

                <div className="form-group" style={{ gridColumn: 'span 2', display: 'flex', gap: '2rem', marginTop: '0.5rem', background: 'rgba(255,255,255,0.01)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--glass-border)' }}>
                  <div>
                    <label className="form-label" style={{ marginBottom: '0.25rem' }}>Housing Status</label>
                    <div style={{ display: 'flex', gap: '1rem', marginTop: '0.25rem' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer' }}>
                        <input type="radio" checked={isHosteler} onChange={() => setIsHosteler(true)} />
                        <span>Hosteler (On-Campus)</span>
                      </label>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer' }}>
                        <input type="radio" checked={!isHosteler} onChange={() => setIsHosteler(false)} />
                        <span>Day Scholar</span>
                      </label>
                    </div>
                  </div>

                  <div style={{ flex: 1 }}>
                    <label className="form-label" style={{ marginBottom: '0.25rem' }}>Transport Method</label>
                    <select value={transportType} onChange={(e) => setTransportType(e.target.value)} style={{ width: '100%' }}>
                      <option value="School Transport">School Transport</option>
                      <option value="Own Transport">Own Transport / Private</option>
                      <option value="None">None (Pedestrian / Local)</option>
                    </select>
                  </div>
                </div>
              </div>

              <button 
                type="submit" 
                className="btn btn-primary" 
                style={{ width: '100%', marginTop: '2rem', padding: '0.8rem' }}
                disabled={submitting}
              >
                <span>{submitting ? 'Processing Allocation...' : 'Save & Submit Profile'}</span>
              </button>
            </form>
          </div>
        ) : (
          // STANDARD STUDENT DASHBOARD
          activeTab === 'dashboard' && (
            <div className="animate-fade-in">
              <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                  <h1 className="page-title">Welcome Back, {profile?.name || 'Student'}!</h1>
                  <p className="page-subtitle">Academic Year Term: Spring 2026</p>
                </div>
                <div style={{ position: 'relative' }}>
                  <button 
                    onClick={() => setShowNotifications(!showNotifications)}
                    style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      color: 'var(--text-primary)',
                      padding: '0.65rem',
                      borderRadius: '50%',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      position: 'relative',
                      transition: 'all 0.2s'
                    }}
                  >
                    <Bell size={20} />
                    {notifications.filter(n => !n.read).length > 0 && (
                      <span style={{
                        position: 'absolute',
                        top: '-5px',
                        right: '-5px',
                        background: 'var(--color-primary)',
                        color: 'white',
                        fontSize: '0.7rem',
                        fontWeight: 'bold',
                        borderRadius: '50%',
                        width: '18px',
                        height: '18px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 0 10px rgba(168,85,247,0.5)'
                      }}>
                        {notifications.filter(n => !n.read).length}
                      </span>
                    )}
                  </button>
                </div>
              </div>

              {/* Notifications Panel */}
              {showNotifications && (
                <div className="glass-card animate-fade-in" style={{ padding: '1.25rem', marginBottom: '2rem', border: '1px solid rgba(168, 85, 247, 0.3)', background: 'rgba(168, 85, 247, 0.03)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '0.5rem' }}>
                    <h3 style={{ fontSize: '0.95rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
                      <Bell size={16} style={{ color: 'var(--color-primary)' }} />
                      <span>Notifications & Student Alerts</span>
                    </h3>
                    <button 
                      onClick={() => {
                        setNotifications(notifications.map(n => ({ ...n, read: true })));
                      }}
                      style={{ background: 'none', border: 'none', color: 'var(--color-primary)', fontSize: '0.8rem', cursor: 'pointer', fontWeight: 500 }}
                    >
                      Mark all as read
                    </button>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {notifications.map(n => (
                      <div 
                        key={n.id} 
                        style={{ 
                          padding: '0.8rem', 
                          borderRadius: '6px', 
                          background: n.read ? 'rgba(255,255,255,0.01)' : 'rgba(168, 85, 247, 0.05)',
                          border: n.read ? '1px solid rgba(255,255,255,0.05)' : '1px solid rgba(168, 85, 247, 0.15)',
                          position: 'relative'
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem', alignItems: 'center' }}>
                          <span style={{ fontWeight: 600, fontSize: '0.875rem', color: n.type === 'warning' ? '#fca5a5' : 'var(--text-primary)' }}>{n.title}</span>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{n.date}</span>
                        </div>
                        <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', margin: 0 }}>{n.content}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Student Header Badge Alerts */}
              <div className="stats-grid">
                <div className="glass-card stat-card">
                  <div className="stat-info">
                    <span className="stat-value">{grades.length}</span>
                    <span className="stat-label">Graded Subjects</span>
                  </div>
                  <div className="stat-icon">
                    <BookOpen size={24} />
                  </div>
                </div>

                <div className="glass-card stat-card">
                  <div className="stat-info">
                    <span className="stat-value" style={{ color: 'var(--color-primary)' }}>
                      {profile?.section || 'Section C'}
                    </span>
                    <span className="stat-label">Allocated Class Section</span>
                  </div>
                  <div className="stat-icon" style={{ color: 'var(--color-primary)' }}>
                    <CheckCircle size={24} />
                  </div>
                </div>

                <div className="glass-card stat-card">
                  <div className="stat-info">
                    <span className="stat-value">{profile?.lastYearMarks}%</span>
                    <span className="stat-label">Last Year Marks</span>
                  </div>
                  <div className="stat-icon" style={{ color: 'var(--color-secondary)' }}>
                    <Award size={24} />
                  </div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', flexWrap: 'wrap', marginTop: '2rem' }}>
                {/* Profile Card */}
                <div className="glass-card">
                  <h2 style={{ fontSize: '1.15rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}>
                    <User size={18} style={{ color: 'var(--color-primary)' }} />
                    <span>Detailed Student Profile</span>
                  </h2>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.4rem' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>Full Name:</span>
                      <span style={{ fontWeight: 600 }}>{profile?.name}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.4rem' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>Roll Number:</span>
                      <span className="badge badge-primary">{profile?.rollNumber}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.4rem' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>Grade Level:</span>
                      <span>{profile?.gradeLevel}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.4rem' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>Gender:</span>
                      <span>{profile?.gender}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.4rem' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>Aadhaar Card:</span>
                      <span>{profile?.aadhaarCardNo}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.4rem' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>Enrolled Course:</span>
                      <span style={{ fontWeight: 500 }}>{profile?.enrolledCourse}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.4rem' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>Housing:</span>
                      <span>{profile?.isHosteler ? 'Hosteler' : 'Day Scholar'}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.4rem' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>Transport Method:</span>
                      <span>{profile?.transportType}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.4rem' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>Village/City:</span>
                      <span>{profile?.villageName}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.4rem' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>School Email:</span>
                      <span style={{ color: 'var(--text-muted)' }}>{profile?.user?.email}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>Phone Number:</span>
                      <span>{profile?.user?.phoneNumber}</span>
                    </div>
                  </div>
                </div>

                {/* Evaluations Card */}
                <div className="glass-card">
                  <h2 style={{ fontSize: '1.15rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}>
                    <Award size={18} style={{ color: 'var(--color-secondary)' }} />
                    <span>Recent Evaluations</span>
                  </h2>

                  {grades.length === 0 ? (
                    <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '2rem' }}>No evaluations recorded yet.</p>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      {grades.slice(0, 5).map((grade) => (
                        <div key={grade.id} style={{ display: 'flex', justifyContent: 'space-between', background: 'rgba(255,255,255,0.02)', padding: '0.75rem', borderRadius: '6px', border: '1px solid var(--glass-border)' }}>
                          <div>
                            <span style={{ fontWeight: 600, display: 'block', fontSize: '0.9rem' }}>{grade.subject}</span>
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{grade.remarks}</span>
                          </div>
                          <span className="badge badge-success" style={{ alignSelf: 'center', fontSize: '0.8rem' }}>{grade.marks}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Family & Contact Card */}
                <div className="glass-card" style={{ gridColumn: 'span 2' }}>
                  <h2 style={{ fontSize: '1.15rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}>
                    <Users size={18} style={{ color: 'var(--color-success)' }} />
                    <span>Family & Contact Details</span>
                  </h2>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
                    <div style={{ background: 'rgba(255,255,255,0.01)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--glass-border)' }}>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.25rem' }}>Father's Details</span>
                      <span style={{ fontWeight: 600, display: 'block' }}>{profile?.fatherName || 'Not Provided'}</span>
                      {profile?.parentProfession && (
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginTop: '0.25rem' }}>
                          Profession: {profile.parentProfession}
                        </span>
                      )}
                    </div>
                    <div style={{ background: 'rgba(255,255,255,0.01)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--glass-border)' }}>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.25rem' }}>Mother's Details</span>
                      <span style={{ fontWeight: 600, display: 'block' }}>{profile?.motherName || 'Not Provided'}</span>
                    </div>
                    <div style={{ background: 'rgba(255,255,255,0.01)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--glass-border)' }}>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.25rem' }}>Siblings Info</span>
                      <span style={{ fontWeight: 600, display: 'block' }}>{profile?.siblings || 'None'}</span>
                    </div>
                  </div>
                  <div style={{ marginTop: '1rem', padding: '0.75rem', background: 'rgba(59, 130, 246, 0.05)', borderRadius: '6px', border: '1px solid rgba(59, 130, 246, 0.15)', display: 'inline-block' }}>
                    <span style={{ fontSize: '0.85rem', color: 'var(--color-primary)', fontWeight: 500 }}>
                      Emergency Contact Phone: {profile?.parentPhoneNo || 'Not Provided'}
                    </span>
                  </div>
                </div>

              </div>
            </div>
          )
        )}

        {/* Grades Tab */}
        {activeTab === 'mygrades' && profile?.profileCompleted && (
          <div className="animate-fade-in">
            <div className="page-header">
              <div>
                <h1 className="page-title">Academic Grade Ledger</h1>
                <p className="page-subtitle">Consolidated view of all registered evaluations</p>
              </div>
            </div>

            <div className="glass-card">
              {grades.length === 0 ? (
                <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '2rem' }}>No grade evaluations issued yet.</p>
              ) : (
                <div className="table-container">
                  <table>
                    <thead>
                      <tr>
                        <th>Subject / Course</th>
                        <th>Grade Obtained</th>
                        <th>Instructor Remarks</th>
                      </tr>
                    </thead>
                    <tbody>
                      {grades.map((grade) => (
                        <tr key={grade.id}>
                          <td style={{ fontWeight: 600 }}>{grade.subject}</td>
                          <td>
                            <span className="badge badge-success" style={{ fontSize: '0.8rem' }}>{grade.marks}</span>
                          </td>
                          <td style={{ color: 'var(--text-secondary)' }}>{grade.remarks}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Fees Tab */}
        {activeTab === 'fees' && profile?.profileCompleted && (
          <div className="animate-fade-in">
            <div className="page-header">
              <div>
                <h1 className="page-title">Term Fee Ledger</h1>
                <p className="page-subtitle">Detailed breakdown of active tuition, hostel, and auxiliary billing</p>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
              {/* Fee summary card */}
              <div className="glass-card" style={{ height: 'fit-content' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <CreditCard size={18} style={{ color: 'var(--color-primary)' }} />
                  <span>Fee Summary</span>
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.5rem' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Term Billed Amount:</span>
                    <span style={{ fontWeight: 600 }}>Rs. {(profile?.totalBilledAmount || 0.0).toFixed(2)}</span>
                  </div>

                  {/* Itemized Billed Fee Breakdown */}
                  {(profile?.totalBilledAmount || 0.0) > 0 && (
                    <div style={{ 
                      background: 'rgba(255, 255, 255, 0.02)', 
                      padding: '0.85rem', 
                      borderRadius: '8px', 
                      border: '1px solid rgba(255,255,255,0.06)', 
                      fontSize: '0.82rem', 
                      display: 'flex', 
                      flexDirection: 'column', 
                      gap: '0.5rem',
                      marginTop: '-0.25rem',
                      marginBottom: '0.25rem'
                    }}>
                      <div style={{ display: 'flex', flexDirection: 'column', borderBottom: '1px dotted rgba(255,255,255,0.05)', paddingBottom: '6px', gap: '3px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                          <span style={{ fontWeight: 500 }}>Tuition Fee:</span>
                          <span style={{ fontWeight: 600 }}>Rs. {(profile?.billedTuitionFee || 0.0).toFixed(2)}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                          <span>Paid: Rs. {totalTuitionPaid.toFixed(2)}</span>
                          <span style={{ 
                            color: Math.max(0, (profile?.billedTuitionFee || 0.0) - totalTuitionPaid) > 0 ? '#fca5a5' : 'var(--color-success)', 
                            fontWeight: 600 
                          }}>
                            Outstanding: Rs. {Math.max(0, (profile?.billedTuitionFee || 0.0) - totalTuitionPaid).toFixed(2)}
                          </span>
                        </div>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', borderBottom: '1px dotted rgba(255,255,255,0.05)', paddingBottom: '6px', gap: '3px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                          <span style={{ fontWeight: 500 }}>Sports Fee:</span>
                          <span style={{ fontWeight: 600 }}>Rs. {(profile?.billedSportsFee || 0.0).toFixed(2)}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                          <span>Paid: Rs. {totalSportsPaid.toFixed(2)}</span>
                          <span style={{ 
                            color: Math.max(0, (profile?.billedSportsFee || 0.0) - totalSportsPaid) > 0 ? '#fca5a5' : 'var(--color-success)', 
                            fontWeight: 600 
                          }}>
                            Outstanding: Rs. {Math.max(0, (profile?.billedSportsFee || 0.0) - totalSportsPaid).toFixed(2)}
                          </span>
                        </div>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', borderBottom: '1px dotted rgba(255,255,255,0.05)', paddingBottom: '6px', gap: '3px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                          <span style={{ fontWeight: 500 }}>Lab Fee:</span>
                          <span style={{ fontWeight: 600 }}>Rs. {(profile?.billedLabFee || 0.0).toFixed(2)}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                          <span>Paid: Rs. {totalLabPaid.toFixed(2)}</span>
                          <span style={{ 
                            color: Math.max(0, (profile?.billedLabFee || 0.0) - totalLabPaid) > 0 ? '#fca5a5' : 'var(--color-success)', 
                            fontWeight: 600 
                          }}>
                            Outstanding: Rs. {Math.max(0, (profile?.billedLabFee || 0.0) - totalLabPaid).toFixed(2)}
                          </span>
                        </div>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', borderBottom: '1px dotted rgba(255,255,255,0.05)', paddingBottom: '6px', gap: '3px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                          <span style={{ fontWeight: 500 }}>School Accessories:</span>
                          <span style={{ fontWeight: 600 }}>Rs. {(profile?.billedSchoolAccessoriesFee || 0.0).toFixed(2)}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                          <span>Paid: Rs. {totalAccessoriesPaid.toFixed(2)}</span>
                          <span style={{ 
                            color: Math.max(0, (profile?.billedSchoolAccessoriesFee || 0.0) - totalAccessoriesPaid) > 0 ? '#fca5a5' : 'var(--color-success)', 
                            fontWeight: 600 
                          }}>
                            Outstanding: Rs. {Math.max(0, (profile?.billedSchoolAccessoriesFee || 0.0) - totalAccessoriesPaid).toFixed(2)}
                          </span>
                        </div>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', borderBottom: '1px dotted rgba(255,255,255,0.05)', paddingBottom: '6px', gap: '3px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                          <span style={{ fontWeight: 500 }}>Transport Fee:</span>
                          <span style={{ fontWeight: 600 }}>Rs. {(profile?.billedTransportFee || 0.0).toFixed(2)}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                          <span>Paid: Rs. {totalTransportPaid.toFixed(2)}</span>
                          <span style={{ 
                            color: Math.max(0, (profile?.billedTransportFee || 0.0) - totalTransportPaid) > 0 ? '#fca5a5' : 'var(--color-success)', 
                            fontWeight: 600 
                          }}>
                            Outstanding: Rs. {Math.max(0, (profile?.billedTransportFee || 0.0) - totalTransportPaid).toFixed(2)}
                          </span>
                        </div>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', borderBottom: '1px dotted rgba(255,255,255,0.05)', paddingBottom: '6px', gap: '3px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                          <span style={{ fontWeight: 500 }}>Hostel Fee:</span>
                          <span style={{ fontWeight: 600 }}>Rs. {(profile?.billedHostelFee || 0.0).toFixed(2)}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                          <span>Paid: Rs. {totalHostelPaid.toFixed(2)}</span>
                          <span style={{ 
                            color: Math.max(0, (profile?.billedHostelFee || 0.0) - totalHostelPaid) > 0 ? '#fca5a5' : 'var(--color-success)', 
                            fontWeight: 600 
                          }}>
                            Outstanding: Rs. {Math.max(0, (profile?.billedHostelFee || 0.0) - totalHostelPaid).toFixed(2)}
                          </span>
                        </div>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                          <span style={{ fontWeight: 500 }}>Other Extra Charges:</span>
                          <span style={{ fontWeight: 600 }}>Rs. {(profile?.billedOtherCharges || 0.0).toFixed(2)}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                          <span>Paid: Rs. {totalOtherPaid.toFixed(2)}</span>
                          <span style={{ 
                            color: Math.max(0, (profile?.billedOtherCharges || 0.0) - totalOtherPaid) > 0 ? '#fca5a5' : 'var(--color-success)', 
                            fontWeight: 600 
                          }}>
                            Outstanding: Rs. {Math.max(0, (profile?.billedOtherCharges || 0.0) - totalOtherPaid).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.5rem' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Total Paid to Date:</span>
                    <span style={{ fontWeight: 600, color: 'var(--color-success)' }}>
                      Rs. {fees.reduce((acc, curr) => acc + (curr.amountPaid || 0), 0).toFixed(2)}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.5rem' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Outstanding Balance:</span>
                    <span style={{ fontWeight: 700, color: '#fca5a5' }}>
                      Rs. {Math.max(0, (profile?.totalBilledAmount || 0.0) - fees.reduce((acc, curr) => acc + (curr.amountPaid || 0), 0)).toFixed(2)}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.5rem' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Term Due Date:</span>
                    <span style={{ fontWeight: 600 }}>{getLastPaymentDate()}</span>
                  </div>
                </div>
              </div>

              {/* Billing ledger table */}
              <div className="glass-card">
                <h3 style={{ fontSize: '1.05rem', fontWeight: 600, marginBottom: '1.25rem' }}>Deposited Receipts History</h3>
                {fees.length === 0 ? (
                  <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '2rem' }}>No fee transactions recorded by the administrator yet.</p>
                ) : (
                  <div className="table-container">
                    <table>
                      <thead>
                        <tr>
                          <th>Period</th>
                          <th>Category / Remarks</th>
                          <th>Date Processed</th>
                          <th>Amount Paid</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {fees.map((record) => (
                          <tr key={record.id}>
                            <td style={{ fontWeight: 600 }}>{record.month} {record.year}</td>
                            <td style={{ color: 'var(--text-secondary)' }}>
                              <div>{record.remarks || 'Fee Payment'}</div>
                              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginTop: '6px' }}>
                                {(record.tuitionFee || 0) > 0 && <span style={{ background: 'rgba(59, 130, 246, 0.1)', color: 'var(--color-primary)', padding: '2px 6px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 500 }}>Tuition: Rs. {record.tuitionFee.toFixed(2)}</span>}
                                {(record.sportsFee || 0) > 0 && <span style={{ background: 'rgba(236, 72, 153, 0.1)', color: 'var(--color-secondary)', padding: '2px 6px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 500 }}>Sports: Rs. {record.sportsFee.toFixed(2)}</span>}
                                {(record.labFee || 0) > 0 && <span style={{ background: 'rgba(16, 185, 129, 0.1)', color: 'var(--color-success)', padding: '2px 6px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 500 }}>Lab: Rs. {record.labFee.toFixed(2)}</span>}
                                {(record.schoolAccessoriesFee || 0) > 0 && <span style={{ background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', padding: '2px 6px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 500 }}>Access.: Rs. {record.schoolAccessoriesFee.toFixed(2)}</span>}
                                {(record.transportFee || 0) > 0 && <span style={{ background: 'rgba(139, 92, 246, 0.1)', color: '#8b5cf6', padding: '2px 6px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 500 }}>Trans.: Rs. {record.transportFee.toFixed(2)}</span>}
                                {(record.hostelFee || 0) > 0 && <span style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', padding: '2px 6px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 500 }}>Hostel: Rs. {record.hostelFee.toFixed(2)}</span>}
                                {(record.otherCharges || 0) > 0 && <span style={{ background: 'rgba(107, 114, 128, 0.1)', color: 'var(--text-muted)', padding: '2px 6px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 500 }}>Other: Rs. {record.otherCharges.toFixed(2)}</span>}
                              </div>
                            </td>
                            <td>{new Date(record.paymentDate).toLocaleDateString()}</td>
                            <td style={{ fontWeight: 600, color: 'var(--color-success)' }}>
                              Rs. {record.amountPaid?.toFixed(2)}
                            </td>
                            <td><span className="badge badge-success">Paid</span></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Course Details Tab */}
        {activeTab === 'courses' && profile?.profileCompleted && (
          <div className="animate-fade-in">
            <div className="page-header">
              <div>
                <h1 className="page-title">My Registered Course Modules</h1>
                <p className="page-subtitle">View instructors, syllabus timelines, and credit assignments</p>
              </div>
            </div>

            <div className="glass-card" style={{ marginBottom: '2rem' }}>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1.5rem' }}>
                <BookOpen size={24} style={{ color: 'var(--color-primary)' }} />
                <div>
                  <h2 style={{ fontSize: '1.25rem', fontWeight: 600, margin: 0 }}>{profile?.enrolledCourse || 'General Sciences'}</h2>
                  <span className="badge badge-primary" style={{ marginTop: '0.25rem', display: 'inline-block' }}>Enrolled</span>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginTop: '1.5rem' }}>
                <div style={{ background: 'rgba(255,255,255,0.01)', padding: '1.25rem', borderRadius: '8px', border: '1px solid var(--glass-border)' }}>
                  <h3 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--color-primary)' }}>Introduction to DBMS</h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>Database structures, SQL syntax, normalizations, and transaction management.</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    <span>Instructor: Dr. Sarah Connor</span>
                    <span>Classroom: Room 402, Science Block</span>
                    <span>Credits: 4 Credits</span>
                  </div>
                </div>

                <div style={{ background: 'rgba(255,255,255,0.01)', padding: '1.25rem', borderRadius: '8px', border: '1px solid var(--glass-border)' }}>
                  <h3 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--color-secondary)' }}>Object-Oriented Design</h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>OOP design principles, class architecture, polymorphic relationships, and patterns.</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    <span>Instructor: Prof. Charles Xavier</span>
                    <span>Classroom: Room 109, Tech Lab</span>
                    <span>Credits: 3 Credits</span>
                  </div>
                </div>

                <div style={{ background: 'rgba(255,255,255,0.01)', padding: '1.25rem', borderRadius: '8px', border: '1px solid var(--glass-border)' }}>
                  <h3 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--color-success)' }}>Modern Operating Systems</h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>Process scheduling, memory paging, file systems, and threads coordination.</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    <span>Instructor: Dr. Richard Feynman</span>
                    <span>Classroom: Auditorium 2, Main Block</span>
                    <span>Credits: 4 Credits</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Result Report Tab */}
        {activeTab === 'result_report' && profile?.profileCompleted && (
          <div className="animate-fade-in">
            <div className="page-header">
              <div>
                <h1 className="page-title">Grade Performance & Results Report</h1>
                <p className="page-subtitle">Cumulative Performance Index (CGPA) and Subject Scorecard</p>
              </div>
              <button className="btn btn-primary" onClick={() => window.print()}>
                <FileText size={16} />
                <span>Print Scorecard</span>
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>
              <div className="glass-card" style={{ height: 'fit-content' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem' }}>Performance Summary</h3>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '1.5rem 0' }}>
                  <div style={{
                    width: '120px',
                    height: '120px',
                    borderRadius: '50%',
                    border: '5px solid var(--color-primary)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'rgba(255,255,255,0.02)'
                  }}>
                    <span style={{ fontSize: '1.75rem', fontWeight: 800 }}>8.75</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>out of 10.0</span>
                  </div>
                  <span style={{ marginTop: '1rem', fontWeight: 600, color: 'var(--color-primary)' }}>First Class with Distinction</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.875rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.4rem' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Passed Credits:</span>
                    <span style={{ fontWeight: 600 }}>11 / 11</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Enrolled Term:</span>
                    <span>Spring Semester 2026</span>
                  </div>
                </div>
              </div>

              <div className="glass-card">
                <h3 style={{ fontSize: '1.05rem', fontWeight: 600, marginBottom: '1.25rem' }}>Semester Grade Sheet</h3>
                <div className="table-container">
                  <table>
                    <thead>
                      <tr>
                        <th>Subject Title</th>
                        <th>Credits</th>
                        <th>Grade</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td style={{ fontWeight: 600 }}>Introduction to DBMS</td>
                        <td>4</td>
                        <td>A+ (91/100)</td>
                        <td><span className="badge badge-success">Pass</span></td>
                      </tr>
                      <tr>
                        <td style={{ fontWeight: 600 }}>Object-Oriented Design</td>
                        <td>3</td>
                        <td>A (86/100)</td>
                        <td><span className="badge badge-success">Pass</span></td>
                      </tr>
                      <tr>
                        <td style={{ fontWeight: 600 }}>Modern Operating Systems</td>
                        <td>4</td>
                        <td>B (72/100)</td>
                        <td><span className="badge badge-success">Pass</span></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Syllabus Pattern Tab */}
        {activeTab === 'syllabus' && profile?.profileCompleted && (
          <div className="animate-fade-in">
            <div className="page-header">
              <div>
                <h1 className="page-title">Syllabus Pattern & Structure</h1>
                <p className="page-subtitle">Core curricular structures and grading rubrics for {profile?.enrolledCourse || 'General Sciences'}</p>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
              <div className="glass-card">
                <h3 style={{ fontSize: '1.05rem', fontWeight: 600, marginBottom: '1.25rem' }}>Curriculum Topic Index</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ background: 'rgba(255,255,255,0.01)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--glass-border)' }}>
                    <span className="badge badge-primary" style={{ marginBottom: '0.5rem' }}>Unit 1: Fundamentals</span>
                    <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Introduction to core system abstractions. Overview of relational algebra, object patterns, and basic OS scheduling processes.</p>
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.01)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--glass-border)' }}>
                    <span className="badge badge-primary" style={{ marginBottom: '0.5rem' }}>Unit 2: Intermediate Abstractions</span>
                    <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Normalized relational tables, index keys, polymorphism, process sync strategies, and heap/stack architecture mapping.</p>
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.01)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--glass-border)' }}>
                    <span className="badge badge-primary" style={{ marginBottom: '0.5rem' }}>Unit 3: Comprehensive Deployment</span>
                    <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Designing enterprise databases, multithreaded design programs, memory page tables, and file I/O operations.</p>
                  </div>
                </div>
              </div>

              <div className="glass-card" style={{ height: 'fit-content' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1.25rem' }}>Exam Evaluation Rubrics</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.875rem' }}>Midterm Written:</span>
                    <span style={{ fontWeight: 600, color: 'var(--color-primary)' }}>30% Weight</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.875rem' }}>Class Quizzes & Labs:</span>
                    <span style={{ fontWeight: 600, color: 'var(--color-secondary)' }}>20% Weight</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.875rem' }}>End Semester Finals:</span>
                    <span style={{ fontWeight: 600, color: 'var(--color-success)' }}>50% Weight</span>
                  </div>
                  <div style={{ padding: '0.75rem', background: 'rgba(255,255,255,0.02)', borderRadius: '6px', fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                    Note: A minimum score of 40% in final examinations is required to pass the module catalog course.
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Academic Calendar Tab */}
        {activeTab === 'calendar' && profile?.profileCompleted && (
          <div className="animate-fade-in">
            <div className="page-header">
              <div>
                <h1 className="page-title">Academic Calendar & Events</h1>
                <p className="page-subtitle">Milestones schedule, exam dates, and term holiday markers</p>
              </div>
            </div>

            <div className="glass-card">
              <h3 style={{ fontSize: '1.05rem', fontWeight: 600, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Calendar size={18} style={{ color: 'var(--color-primary)' }} />
                <span>Active Semester Term Schedule (Spring 2026)</span>
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', borderLeft: '2px solid rgba(168, 85, 247, 0.3)', paddingLeft: '1.5rem', marginLeft: '0.5rem' }}>
                <div style={{ position: 'relative' }}>
                  <div style={{ position: 'absolute', top: '4px', left: '-29px', width: '10px', height: '10px', borderRadius: '50%', background: 'var(--color-primary)' }}></div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--color-primary)', fontWeight: 600 }}>June 01, 2026</span>
                  <h4 style={{ margin: '0.25rem 0 0.15rem 0', fontSize: '0.95rem', fontWeight: 600 }}>Midterm Examinations Start</h4>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Term assessments will run for all classes from June 01 to June 07.</p>
                </div>

                <div style={{ position: 'relative' }}>
                  <div style={{ position: 'absolute', top: '4px', left: '-29px', width: '10px', height: '10px', borderRadius: '50%', background: 'var(--color-secondary)' }}></div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--color-secondary)', fontWeight: 600 }}>June 15, 2026</span>
                  <h4 style={{ margin: '0.25rem 0 0.15rem 0', fontSize: '0.95rem', fontWeight: 600 }}>Rescheduled Summer Break Begins</h4>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>School will close early for the summer break, reopening on July 10.</p>
                </div>

                <div style={{ position: 'relative' }}>
                  <div style={{ position: 'absolute', top: '4px', left: '-29px', width: '10px', height: '10px', borderRadius: '50%', background: 'var(--color-success)' }}></div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--color-success)', fontWeight: 600 }}>July 12, 2026</span>
                  <h4 style={{ margin: '0.25rem 0 0.15rem 0', fontSize: '0.95rem', fontWeight: 600 }}>Term Project Submission</h4>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Final project submissions for DBMS and Object-Oriented Software Design modules due.</p>
                </div>

                <div style={{ position: 'relative' }}>
                  <div style={{ position: 'absolute', top: '4px', left: '-29px', width: '10px', height: '10px', borderRadius: '50%', background: '#60a5fa' }}></div>
                  <span style={{ fontSize: '0.8rem', color: '#60a5fa', fontWeight: 600 }}>July 20, 2026</span>
                  <h4 style={{ margin: '0.25rem 0 0.15rem 0', fontSize: '0.95rem', fontWeight: 600 }}>End Semester Final Examinations</h4>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Final exams will run until July 28, followed by term results declaration.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* My Timetable Tab */}
        {activeTab === 'timetable' && profile?.profileCompleted && (
          <div className="animate-fade-in">
            <div className="page-header">
              <div>
                <h1 className="page-title">My Class Timetable</h1>
                <p className="page-subtitle">Weekly period schedule and classroom lecture routing hours</p>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
              <div className="glass-card">
                <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem', fontWeight: 600 }}>Active Weekly Schedule</h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                  Your classroom schedule and study hours assigned by the administration.
                </p>
                <div style={{ background: 'rgba(168, 85, 247, 0.05)', borderLeft: '4px solid var(--color-primary)', padding: '1.25rem', borderRadius: '6px', whiteSpace: 'pre-wrap', lineHeight: 1.6, fontFamily: 'monospace', fontSize: '0.95rem' }}>
                  {profile?.timetable || "No custom timetable scheduled yet by the administration. Defaulting to general class hours."}
                </div>
              </div>

              <div className="glass-card">
                <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem', fontWeight: 600 }}>General Class Hours</h2>
                <div className="table-container">
                  <table>
                    <thead>
                      <tr>
                        <th>Period</th>
                        <th>Monday - Wednesday</th>
                        <th>Thursday - Friday</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td><strong>Period 1</strong></td>
                        <td>08:30 AM - 09:30 AM</td>
                        <td>09:00 AM - 10:00 AM</td>
                      </tr>
                      <tr>
                        <td><strong>Period 2</strong></td>
                        <td>09:30 AM - 10:30 AM</td>
                        <td>10:00 AM - 11:00 AM</td>
                      </tr>
                      <tr style={{ background: 'rgba(255,255,255,0.02)' }}>
                        <td><strong>Recess Break</strong></td>
                        <td>10:30 AM - 11:00 AM</td>
                        <td>11:00 AM - 11:30 AM</td>
                      </tr>
                      <tr>
                        <td><strong>Period 3</strong></td>
                        <td>11:00 AM - 12:00 PM</td>
                        <td>11:30 AM - 12:30 PM</td>
                      </tr>
                      <tr>
                        <td><strong>Period 4</strong></td>
                        <td>12:00 PM - 01:00 PM</td>
                        <td>12:30 PM - 01:30 PM</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default StudentDashboard;
