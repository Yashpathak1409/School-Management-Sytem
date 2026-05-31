import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import API from '../services/api';
import { Award, Users, BookOpen, Plus, ClipboardList, Clock, DollarSign, UserCheck, Bell, User, Save, CheckCircle } from 'lucide-react';

const TeacherDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [students, setStudents] = useState([]);
  const [grades, setGrades] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);

  // Modals
  const [showGradeModal, setShowGradeModal] = useState(false);
  const [showAssignmentModal, setShowAssignmentModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  // Form Fields
  const [gradeForm, setGradeForm] = useState({ subject: 'Mathematics', marks: 'A', remarks: 'Good job!' });
  const [assignmentForm, setAssignmentForm] = useState({ title: '', subject: 'Mathematics', dueDate: '', maxMarks: '100', instructions: '' });
  const [profileForm, setProfileForm] = useState({ name: '', department: 'Mathematics', username: '', email: '', phoneNumber: '', dateOfBirth: '' });
  
  // Attendance state
  const [attendance, setAttendance] = useState({});
  const [attendanceSuccess, setAttendanceSuccess] = useState('');

  // Custom Subject & Roll Number Grades state
  const [customSubjects, setCustomSubjects] = useState(['Mathematics', 'Science', 'Social Studies', 'English Literature', 'Computer Science']);
  const [newSubjectInput, setNewSubjectInput] = useState('');
  const [rollNumberForm, setRollNumberForm] = useState({ rollNumber: '', subject: 'Mathematics', marks: '', remarks: '' });

  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');

  const handleRollNumberGradeSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');
    try {
      await API.post('/api/teacher/grades/by-roll-number', rollNumberForm);
      setFormSuccess(`Grade successfully assigned to student with Roll Number ${rollNumberForm.rollNumber}!`);
      setRollNumberForm({ rollNumber: '', subject: rollNumberForm.subject, marks: '', remarks: '' });
      fetchGrades();
      setTimeout(() => {
        setFormSuccess('');
      }, 3000);
    } catch (err) {
      setFormError(err.response?.data || 'Failed to assign grade. Please check the roll number.');
    }
  };

  const addCustomSubject = (e) => {
    e.preventDefault();
    if (!newSubjectInput.trim()) return;
    const trimmed = newSubjectInput.trim();
    if (customSubjects.includes(trimmed)) {
      setFormError('Subject already exists.');
      return;
    }
    setCustomSubjects(prev => [...prev, trimmed]);
    setRollNumberForm(prev => ({ ...prev, subject: trimmed }));
    setGradeForm(prev => ({ ...prev, subject: trimmed }));
    setAssignmentForm(prev => ({ ...prev, subject: trimmed }));
    setNewSubjectInput('');
    setFormSuccess(`Subject "${trimmed}" added successfully and activated for all forms!`);
    setTimeout(() => {
      setFormSuccess('');
    }, 2000);
  };

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const response = await API.get('/api/teacher/students');
      setStudents(response.data);
      // Populate initial attendance state with 'Present' for all students
      const initialAttendance = {};
      response.data.forEach(student => {
        initialAttendance[student.id] = 'Present';
      });
      setAttendance(initialAttendance);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchGrades = async () => {
    setLoading(true);
    try {
      const response = await API.get('/api/teacher/grades');
      setGrades(response.data);
      if (response.data && response.data.length > 0) {
        const subjectsFromGrades = response.data.map(g => g.subject);
        setCustomSubjects(prev => {
          const merged = new Set([...prev, ...subjectsFromGrades]);
          return Array.from(merged);
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAssignments = async () => {
    setLoading(true);
    try {
      const response = await API.get('/api/teacher/assignments');
      setAssignments(response.data);
      if (response.data && response.data.length > 0) {
        const subjectsFromAssignments = response.data.map(a => a.subject);
        setCustomSubjects(prev => {
          const merged = new Set([...prev, ...subjectsFromAssignments]);
          return Array.from(merged);
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const response = await API.get('/api/teacher/profile');
      setProfile(response.data);
      setProfileForm({
        name: response.data.name || '',
        department: response.data.department || 'Mathematics',
        username: response.data.user?.username || '',
        email: response.data.user?.email || '',
        phoneNumber: response.data.user?.phoneNumber || '',
        dateOfBirth: response.data.user?.dateOfBirth || ''
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'dashboard') fetchStudents();
    if (activeTab === 'grades') fetchGrades();
    if (activeTab === 'assignments') fetchAssignments();
    if (activeTab === 'profile') fetchProfile();
  }, [activeTab]);

  const openGradeModal = (student) => {
    setSelectedStudent(student);
    setShowGradeModal(true);
  };

  const handleGradeSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');
    try {
      await API.post('/api/teacher/grades', {
        studentId: selectedStudent.id.toString(),
        subject: gradeForm.subject,
        marks: gradeForm.marks,
        remarks: gradeForm.remarks,
      });
      setFormSuccess('Grade assigned successfully!');
      setGradeForm({ subject: 'Mathematics', marks: 'A', remarks: 'Good job!' });
      setTimeout(() => {
        setShowGradeModal(false);
        setFormSuccess('');
        if (activeTab === 'grades') fetchGrades();
      }, 1500);
    } catch (err) {
      setFormError(err.response?.data || 'Failed to assign grade.');
    }
  };

  const handleAssignmentSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');
    try {
      await API.post('/api/teacher/assignments', assignmentForm);
      setFormSuccess('Assignment successfully created and assigned!');
      setAssignmentForm({ title: '', subject: 'Mathematics', dueDate: '', maxMarks: '100', instructions: '' });
      setTimeout(() => {
        setShowAssignmentModal(false);
        setFormSuccess('');
        fetchAssignments();
      }, 1500);
    } catch (err) {
      setFormError(err.response?.data || 'Failed to create assignment.');
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');
    try {
      await API.put('/api/teacher/profile', profileForm);
      setFormSuccess('Profile credentials updated successfully!');
      fetchProfile();
      setTimeout(() => {
        setFormSuccess('');
      }, 3000);
    } catch (err) {
      setFormError(err.response?.data || 'Failed to update profile.');
    }
  };

  const handleAttendanceChange = (studentId, status) => {
    setAttendance(prev => ({
      ...prev,
      [studentId]: status
    }));
  };

  const submitAttendance = (e) => {
    e.preventDefault();
    setAttendanceSuccess('Attendance successfully compiled and logged to Registrar portal!');
    setTimeout(() => {
      setAttendanceSuccess('');
    }, 4000);
  };

  return (
    <div className="app-container">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="main-content">
        {activeTab === 'dashboard' && (
          <div className="animate-fade-in">
            <div className="page-header">
              <div>
                <h1 className="page-title">Class Roster</h1>
                <p className="page-subtitle">View your students and assign grades</p>
              </div>
            </div>

            <div className="stats-grid">
              <div className="glass-card stat-card">
                <div className="stat-info">
                  <span className="stat-value">{students.length}</span>
                  <span className="stat-label">My Students</span>
                </div>
                <div className="stat-icon">
                  <Users size={24} />
                </div>
              </div>
              <div className="glass-card stat-card">
                <div className="stat-info">
                  <span className="stat-value">{grades.length || 'Active'}</span>
                  <span className="stat-label">Term Grade Sheet</span>
                </div>
                <div className="stat-icon" style={{ color: 'var(--color-secondary)' }}>
                  <Award size={24} />
                </div>
              </div>
            </div>

            <div className="glass-card">
              <h2 style={{ fontSize: '1.25rem', marginBottom: '1.25rem', fontWeight: 600 }}>Active Roster</h2>
              {loading ? (
                <p>Loading class roster...</p>
              ) : students.length === 0 ? (
                <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '2rem' }}>No student records found.</p>
              ) : (
                <div className="table-container">
                  <table>
                    <thead>
                      <tr>
                        <th>Student Name</th>
                        <th>Roll Number</th>
                        <th>Grade/Class</th>
                        <th>Email</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {students.map((student) => (
                        <tr key={student.id}>
                          <td style={{ fontWeight: 600 }}>{student.name}</td>
                          <td>
                            <span className="badge badge-primary">{student.rollNumber}</span>
                          </td>
                          <td>{student.gradeLevel}</td>
                          <td style={{ color: 'var(--text-secondary)' }}>{student.user?.email}</td>
                          <td>
                            <button className="btn btn-primary" onClick={() => openGradeModal(student)} style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}>
                              <Plus size={14} />
                              <span>Assign Grade</span>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'grades' && (
          <div className="animate-fade-in">
            <div className="page-header">
              <div>
                <h1 className="page-title">Grade Ledger & Report Cards</h1>
                <p className="page-subtitle">Add custom subjects, record marks, and compile report cards</p>
              </div>
            </div>

            {formSuccess && (
              <div style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#a7f3d0', padding: '0.75rem', borderRadius: '6px', marginBottom: '1.5rem' }}>
                {formSuccess}
              </div>
            )}
            {formError && (
              <div style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#fca5a5', padding: '0.75rem', borderRadius: '6px', marginBottom: '1.5rem' }}>
                {formError}
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '2rem', alignItems: 'start' }}>
              {/* Left Column: Form Controls */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {/* Section A: Add Subject */}
                <div className="glass-card" style={{ background: 'rgba(255, 255, 255, 0.01)', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem', color: 'var(--color-primary)' }}>1. Add Custom Subject</h3>
                  <form onSubmit={addCustomSubject} style={{ display: 'flex', gap: '0.5rem' }}>
                    <input 
                      type="text" 
                      placeholder="e.g. Physics, Chemistry" 
                      value={newSubjectInput} 
                      onChange={(e) => setNewSubjectInput(e.target.value)}
                      style={{ flex: 1 }}
                    />
                    <button type="submit" className="btn btn-primary" style={{ padding: '0.6rem 1rem' }}>
                      <Plus size={16} />
                      <span>Add</span>
                    </button>
                  </form>
                </div>

                {/* Section B: Upload / Update Marks */}
                <div className="glass-card" style={{ background: 'rgba(255, 255, 255, 0.01)', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem', color: 'var(--color-secondary)' }}>2. Upload / Update Student Marks</h3>
                  <form onSubmit={handleRollNumberGradeSubmit}>
                    <div className="form-group" style={{ marginBottom: '1rem' }}>
                      <label className="form-label">Student Roll Number</label>
                      <input 
                        type="text" 
                        placeholder="e.g. ROLL-101" 
                        value={rollNumberForm.rollNumber} 
                        onChange={(e) => setRollNumberForm({ ...rollNumberForm, rollNumber: e.target.value })}
                        required 
                      />
                    </div>

                    <div className="form-group" style={{ marginBottom: '1rem' }}>
                      <label className="form-label">Select Subject</label>
                      <select 
                        value={rollNumberForm.subject} 
                        onChange={(e) => setRollNumberForm({ ...rollNumberForm, subject: e.target.value })}
                        style={{ width: '100%' }}
                      >
                        {customSubjects.map(subject => (
                          <option key={subject} value={subject}>{subject}</option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group" style={{ marginBottom: '1rem' }}>
                      <label className="form-label">Marks/Grade</label>
                      <input 
                        type="text" 
                        placeholder="e.g. A+, 95%" 
                        value={rollNumberForm.marks} 
                        onChange={(e) => setRollNumberForm({ ...rollNumberForm, marks: e.target.value })}
                        required 
                      />
                    </div>

                    <div className="form-group" style={{ marginBottom: '1rem' }}>
                      <label className="form-label">Remarks</label>
                      <textarea 
                        rows="2" 
                        placeholder="e.g. Excellent progress this term." 
                        value={rollNumberForm.remarks} 
                        onChange={(e) => setRollNumberForm({ ...rollNumberForm, remarks: e.target.value })}
                        required 
                      />
                    </div>

                    <button type="submit" className="btn btn-primary" style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1rem' }}>
                      <Save size={16} />
                      <span>Upload & Update Marks</span>
                    </button>
                  </form>
                </div>
              </div>

              {/* Right Column: Ledger Table */}
              <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Recorded Grade & Mark Sheets</h3>
                {loading ? (
                  <p>Loading grade records...</p>
                ) : grades.length === 0 ? (
                  <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '2rem' }}>No grade evaluations issued yet.</p>
                ) : (
                  <div className="table-container">
                    <table>
                      <thead>
                        <tr>
                          <th>Student</th>
                          <th>Roll Number</th>
                          <th>Subject</th>
                          <th>Mark / Grade</th>
                          <th>Evaluation Remarks</th>
                        </tr>
                      </thead>
                      <tbody>
                        {grades.map((grade) => (
                          <tr key={grade.id}>
                            <td style={{ fontWeight: 600 }}>{grade.student?.name}</td>
                            <td>
                              <span className="badge badge-primary">{grade.student?.rollNumber}</span>
                            </td>
                            <td>{grade.subject}</td>
                            <td>
                              <span className="badge badge-success" style={{ fontSize: '0.8rem' }}>{grade.marks}</span>
                            </td>
                            <td style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{grade.remarks}</td>
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

        {activeTab === 'assignments' && (
          <div className="animate-fade-in">
            <div className="page-header">
              <div>
                <h1 className="page-title">Course Assignments</h1>
                <p className="page-subtitle">Issue school work, set targets, and manage academic curriculum tasks</p>
              </div>
              <button className="btn btn-primary" onClick={() => setShowAssignmentModal(true)}>
                <Plus size={16} />
                <span>Create Assignment</span>
              </button>
            </div>

            <div className="glass-card">
              <h2 style={{ fontSize: '1.25rem', marginBottom: '1.25rem', fontWeight: 600 }}>Active Assignments</h2>
              {loading ? (
                <p>Loading course assignments...</p>
              ) : assignments.length === 0 ? (
                <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '2rem' }}>No assignments have been assigned yet.</p>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
                  {assignments.map((assignment) => (
                    <div className="glass-card" key={assignment.id} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', border: '1px solid rgba(255, 255, 255, 0.05)', background: 'rgba(255, 255, 255, 0.02)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                          <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)' }}>{assignment.title}</h3>
                          <span className="badge badge-primary" style={{ background: 'rgba(168, 85, 247, 0.15)', color: '#d8b4fe', marginTop: '0.5rem', display: 'inline-block' }}>{assignment.subject}</span>
                        </div>
                        <span className="badge badge-success" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#a7f3d0' }}>Max Marks: {assignment.maxMarks}</span>
                      </div>
                      <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5, flexGrow: 1 }}>{assignment.instructions}</p>
                      <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.05)', paddingTop: '0.75rem', display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        <span>Assigned by: {assignment.teacher?.name}</span>
                        <span style={{ color: '#fca5a5', fontWeight: 600 }}>Due: {assignment.dueDate}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'timetable' && (
          <div className="animate-fade-in">
            <div className="page-header">
              <div>
                <h1 className="page-title">Weekly Timetable</h1>
                <p className="page-subtitle">Educator classroom routing hours and period slot logs</p>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
              <div className="glass-card">
                <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem', fontWeight: 600 }}>Active Classroom Duty Schedule</h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                  Your teaching schedule and duty rooms assigned by the administration.
                </p>
                <div style={{ background: 'rgba(168, 85, 247, 0.05)', borderLeft: '4px solid var(--color-primary)', padding: '1.25rem', borderRadius: '6px', whiteSpace: 'pre-wrap', lineHeight: 1.6, fontFamily: 'monospace', fontSize: '0.95rem' }}>
                  {profile?.timetable || "No custom duty timetable assigned yet. Defaulting to general schedule."}
                </div>
              </div>

              <div className="glass-card">
                <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem', fontWeight: 600 }}>General Periods Routing</h2>
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
                        <td style={{ fontWeight: 600 }}>Period 1 (09:00 - 10:00)</td>
                        <td>Grade 10-A (Mathematics)</td>
                        <td>Grade 9-B (Mathematics)</td>
                      </tr>
                      <tr>
                        <td style={{ fontWeight: 600 }}>Period 2 (10:15 - 11:15)</td>
                        <td>Grade 9-B (Mathematics)</td>
                        <td>Office prep hour</td>
                      </tr>
                      <tr>
                        <td style={{ fontWeight: 600 }}>Period 3 (12:15 - 01:15)</td>
                        <td>Advanced Calculus (Grade 12-C)</td>
                        <td>Advanced Calculus (Grade 12-C)</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'salary' && (
          <div className="animate-fade-in">
            <div className="page-header">
              <div>
                <h1 className="page-title">Salary & Earnings</h1>
                <p className="page-subtitle">Disbursed payroll statements, basic pay structure, and tax deduction metrics</p>
              </div>
            </div>

            <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', marginBottom: '2rem' }}>
              <div className="glass-card stat-card" style={{ borderLeft: '4px solid var(--color-success)' }}>
                <div className="stat-info">
                  <span className="stat-value" style={{ fontSize: '1.4rem' }}>Rs. {((profile?.basicSalary || 45000.0) + (profile?.allowance || 5000.0) - (profile?.deduction || 2000.0)).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  <span className="stat-label">Net Take Home Pay</span>
                </div>
                <div className="stat-icon" style={{ color: 'var(--color-success)' }}>
                  <DollarSign size={20} />
                </div>
              </div>

              <div className="glass-card stat-card">
                <div className="stat-info">
                  <span className="stat-value" style={{ fontSize: '1.4rem' }}>Rs. {(profile?.basicSalary || 45000.0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  <span className="stat-label">Basic Salary</span>
                </div>
                <div className="stat-icon">
                  <DollarSign size={20} />
                </div>
              </div>

              <div className="glass-card stat-card">
                <div className="stat-info">
                  <span className="stat-value" style={{ fontSize: '1.4rem' }}>Rs. {(profile?.allowance || 5000.0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  <span className="stat-label">Allowances</span>
                </div>
                <div className="stat-icon">
                  <Plus size={20} />
                </div>
              </div>

              <div className="glass-card stat-card" style={{ borderLeft: '4px solid #ef4444' }}>
                <div className="stat-info">
                  <span className="stat-value" style={{ fontSize: '1.4rem', color: '#fca5a5' }}>Rs. {(profile?.deduction || 2000.0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  <span className="stat-label">Taxes & PF Deductions</span>
                </div>
                <div className="stat-icon" style={{ color: '#fca5a5' }}>
                  <DollarSign size={20} />
                </div>
              </div>
            </div>

            <div className="glass-card">
              <h2 style={{ fontSize: '1.25rem', marginBottom: '1.25rem', fontWeight: 600 }}>Salary Disbursement History</h2>
              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>Pay Period</th>
                      <th>Basic Pay</th>
                      <th>Allowances</th>
                      <th>Deductions</th>
                      <th>Net Disbursed</th>
                      <th>Disbursement Date</th>
                      <th>Ref Transaction ID</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td style={{ fontWeight: 600 }}>May 2026</td>
                      <td>Rs. {(profile?.basicSalary || 45000.0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                      <td>Rs. {(profile?.allowance || 5000.0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                      <td style={{ color: '#fca5a5' }}>Rs. {(profile?.deduction || 2000.0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                      <td style={{ fontWeight: 600, color: 'var(--color-success)' }}>Rs. {((profile?.basicSalary || 45000.0) + (profile?.allowance || 5000.0) - (profile?.deduction || 2000.0)).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                      <td>May 26, 2026</td>
                      <td style={{ fontFamily: 'monospace', fontSize: '0.85rem' }}>TXN-902174312</td>
                      <td><span className="badge badge-success">Disbursed</span></td>
                    </tr>
                    <tr>
                      <td style={{ fontWeight: 600 }}>April 2026</td>
                      <td>Rs. {(profile?.basicSalary || 45000.0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                      <td>Rs. {(profile?.allowance || 5000.0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                      <td style={{ color: '#fca5a5' }}>Rs. {(profile?.deduction || 2000.0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                      <td style={{ fontWeight: 600, color: 'var(--color-success)' }}>Rs. {((profile?.basicSalary || 45000.0) + (profile?.allowance || 5000.0) - (profile?.deduction || 2000.0)).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                      <td>April 26, 2026</td>
                      <td style={{ fontFamily: 'monospace', fontSize: '0.85rem' }}>TXN-874102941</td>
                      <td><span className="badge badge-success">Disbursed</span></td>
                    </tr>
                    <tr>
                      <td style={{ fontWeight: 600 }}>March 2026</td>
                      <td>Rs. 45,000.00</td>
                      <td>Rs. 5,000.00</td>
                      <td style={{ color: '#fca5a5' }}>Rs. 2,000.00</td>
                      <td style={{ fontWeight: 600, color: 'var(--color-success)' }}>Rs. 48,000.00</td>
                      <td>March 26, 2026</td>
                      <td style={{ fontFamily: 'monospace', fontSize: '0.85rem' }}>TXN-764921094</td>
                      <td><span className="badge badge-success">Disbursed</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'attendance' && (
          <div className="animate-fade-in">
            <div className="page-header">
              <div>
                <h1 className="page-title">Roster Attendance Tracker</h1>
                <p className="page-subtitle">Track classroom attendance logs and compile daily metrics</p>
              </div>
            </div>

            {attendanceSuccess && (
              <div style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#a7f3d0', padding: '0.75rem', borderRadius: '6px', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircle size={18} />
                <span>{attendanceSuccess}</span>
              </div>
            )}

            <div className="glass-card">
              <form onSubmit={submitAttendance}>
                <div className="table-container">
                  <table>
                    <thead>
                      <tr>
                        <th>Student Name</th>
                        <th>Roll Number</th>
                        <th>Grade Level</th>
                        <th style={{ textAlign: 'center' }}>Mark Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {students.map((student) => (
                        <tr key={student.id}>
                          <td style={{ fontWeight: 600 }}>{student.name}</td>
                          <td><span className="badge badge-primary">{student.rollNumber}</span></td>
                          <td>{student.gradeLevel}</td>
                          <td style={{ display: 'flex', justifyContent: 'center', gap: '1rem', border: 'none' }}>
                            <label style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', cursor: 'pointer' }}>
                              <input 
                                type="radio" 
                                name={`attendance-${student.id}`} 
                                checked={attendance[student.id] === 'Present'}
                                onChange={() => handleAttendanceChange(student.id, 'Present')}
                                style={{ accentColor: 'var(--color-success)' }}
                              />
                              <span style={{ fontSize: '0.85rem', color: attendance[student.id] === 'Present' ? 'var(--color-success)' : 'var(--text-muted)' }}>Present</span>
                            </label>
                            <label style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', cursor: 'pointer' }}>
                              <input 
                                type="radio" 
                                name={`attendance-${student.id}`} 
                                checked={attendance[student.id] === 'Absent'}
                                onChange={() => handleAttendanceChange(student.id, 'Absent')}
                                style={{ accentColor: '#fca5a5' }}
                              />
                              <span style={{ fontSize: '0.85rem', color: attendance[student.id] === 'Absent' ? '#fca5a5' : 'var(--text-muted)' }}>Absent</span>
                            </label>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
                  <button type="submit" className="btn btn-primary" style={{ padding: '0.6rem 1.2rem' }}>
                    <Save size={16} />
                    <span>Submit Attendance Ledger</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {activeTab === 'notices' && (
          <div className="animate-fade-in">
            <div className="page-header">
              <div>
                <h1 className="page-title">Department Announcements</h1>
                <p className="page-subtitle">Circular logs, staff updates, and upcoming academic planner notices</p>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div className="glass-card" style={{ background: 'rgba(168, 85, 247, 0.05)', borderLeft: '4px solid #a855f7' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <h3 style={{ fontWeight: 600, color: 'var(--text-primary)' }}>1. Faculty Evaluation Plan & Term Exam Scheduling</h3>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Today at 10:15 AM</span>
                </div>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  The administrative office has scheduled the end-of-term examination reviews. All educators must prepare and upload their respective question pattern sheets to the syllabus console by next Friday. Please coordinate with your department head.
                </p>
              </div>

              <div className="glass-card" style={{ background: 'rgba(59, 130, 246, 0.05)', borderLeft: '4px solid #3b82f6' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <h3 style={{ fontWeight: 600, color: 'var(--text-primary)' }}>2. Annual Science & IT Exhibition</h3>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Yesterday</span>
                </div>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  The Science and IT exhibition date has been finalized for June 12th. Please nominate students from Grade 9 and Grade 10 to demonstrate computer and engineering projects. Let's make this year's exhibits outstanding!
                </p>
              </div>

              <div className="glass-card" style={{ background: 'rgba(251, 191, 36, 0.05)', borderLeft: '4px solid #fbbf24' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <h3 style={{ fontWeight: 600, color: 'var(--text-primary)' }}>3. Parent-Teacher Association Meeting (PTA)</h3>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>May 24, 2026</span>
                </div>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  A PTA general body session will take place this Saturday in the assembly hall. Teachers are requested to be present at their assigned roster seats and maintain records for grades and attendance trends for parents' review.
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="animate-fade-in">
            <div className="page-header">
              <div>
                <h1 className="page-title">My Profile Settings</h1>
                <p className="page-subtitle">Manage your personal credentials, email contacts, and security preferences</p>
              </div>
            </div>

            {formSuccess && (
              <div style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#a7f3d0', padding: '0.75rem', borderRadius: '6px', marginBottom: '1.5rem' }}>
                {formSuccess}
              </div>
            )}
            {formError && (
              <div style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#fca5a5', padding: '0.75rem', borderRadius: '6px', marginBottom: '1.5rem' }}>
                {formError}
              </div>
            )}

            <div className="glass-card" style={{ maxWidth: '700px' }}>
              <form onSubmit={handleProfileSubmit}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                  <div className="form-group">
                    <label className="form-label">Full Name</label>
                    <input 
                      type="text" 
                      value={profileForm.name} 
                      onChange={(e) => setProfileForm(prev => ({ ...prev, name: e.target.value }))}
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Department</label>
                    <input 
                      type="text" 
                      value={profileForm.department} 
                      readOnly 
                      style={{ background: 'rgba(255,255,255,0.02)', color: 'var(--text-muted)', cursor: 'not-allowed' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginTop: '1.25rem' }}>
                  <div className="form-group">
                    <label className="form-label">Username</label>
                    <input 
                      type="text" 
                      value={profileForm.username} 
                      onChange={(e) => setProfileForm(prev => ({ ...prev, username: e.target.value }))}
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email Address</label>
                    <input 
                      type="email" 
                      value={profileForm.email} 
                      onChange={(e) => setProfileForm(prev => ({ ...prev, email: e.target.value }))}
                      required 
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginTop: '1.25rem' }}>
                  <div className="form-group">
                    <label className="form-label">Phone Number (Login ID)</label>
                    <input 
                      type="text" 
                      value={profileForm.phoneNumber} 
                      onChange={(e) => setProfileForm(prev => ({ ...prev, phoneNumber: e.target.value }))}
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Date of Birth (Login Password)</label>
                    <input 
                      type="date" 
                      value={profileForm.dateOfBirth} 
                      onChange={(e) => setProfileForm(prev => ({ ...prev, dateOfBirth: e.target.value }))}
                      required 
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1.5rem' }}>
                  <button type="submit" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1.2rem' }}>
                    <Save size={16} />
                    <span>Save Profile Changes</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>

      {/* Grade Assigner Modal */}
      {showGradeModal && (
        <div className="modal-overlay">
          <div className="glass-card modal-content animate-fade-in">
            <h3 style={{ marginBottom: '1.25rem', fontSize: '1.2rem', fontWeight: 600 }}>
              Issue Academic Grade: <span style={{ color: 'var(--color-primary)' }}>{selectedStudent?.name}</span>
            </h3>

            {formError && <div style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#fca5a5', padding: '0.5rem', borderRadius: '6px', marginBottom: '1rem', fontSize: '0.85rem' }}>{formError}</div>}
            {formSuccess && <div style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#a7f3d0', padding: '0.5rem', borderRadius: '6px', marginBottom: '1rem', fontSize: '0.85rem' }}>{formSuccess}</div>}

            <form onSubmit={handleGradeSubmit}>
              <div className="form-group">
                <label className="form-label">Subject</label>
                <select value={gradeForm.subject} onChange={(e) => setGradeForm({ ...gradeForm, subject: e.target.value })} style={{ width: '100%' }}>
                  {customSubjects.map(subject => (
                    <option key={subject} value={subject}>{subject}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Marks/Grade Obtained</label>
                <input
                  type="text"
                  placeholder="e.g. A+, B, 95%"
                  value={gradeForm.marks}
                  onChange={(e) => setGradeForm({ ...gradeForm, marks: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Instructor Remarks</label>
                <textarea
                  placeholder="Provide brief comments"
                  value={gradeForm.remarks}
                  onChange={(e) => setGradeForm({ ...gradeForm, remarks: e.target.value })}
                  required
                  rows="3"
                />
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem', justifyContent: 'flex-end' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowGradeModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save Evaluation</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Assignment Creator Modal */}
      {showAssignmentModal && (
        <div className="modal-overlay">
          <div className="glass-card modal-content animate-fade-in">
            <h3 style={{ marginBottom: '1.25rem', fontSize: '1.2rem', fontWeight: 600 }}>Create Course Assignment</h3>

            {formError && <div style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#fca5a5', padding: '0.5rem', borderRadius: '6px', marginBottom: '1rem', fontSize: '0.85rem' }}>{formError}</div>}
            {formSuccess && <div style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#a7f3d0', padding: '0.5rem', borderRadius: '6px', marginBottom: '1rem', fontSize: '0.85rem' }}>{formSuccess}</div>}

            <form onSubmit={handleAssignmentSubmit}>
              <div className="form-group">
                <label className="form-label">Assignment Title</label>
                <input 
                  type="text" 
                  placeholder="e.g. Midterm Physics Lab Report" 
                  value={assignmentForm.title} 
                  onChange={(e) => setAssignmentForm({ ...assignmentForm, title: e.target.value })}
                  required 
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Course Subject</label>
                  <select value={assignmentForm.subject} onChange={(e) => setAssignmentForm({ ...assignmentForm, subject: e.target.value })} style={{ width: '100%' }}>
                    {customSubjects.map(subject => (
                      <option key={subject} value={subject}>{subject}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Maximum Marks</label>
                  <input 
                    type="number" 
                    placeholder="100" 
                    value={assignmentForm.maxMarks} 
                    onChange={(e) => setAssignmentForm({ ...assignmentForm, maxMarks: e.target.value })}
                    required 
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Due Date</label>
                <input 
                  type="date" 
                  value={assignmentForm.dueDate} 
                  onChange={(e) => setAssignmentForm({ ...assignmentForm, dueDate: e.target.value })}
                  required 
                />
              </div>

              <div className="form-group">
                <label className="form-label">Task Instructions</label>
                <textarea
                  placeholder="Detail the instructions, topics covered, and submission criteria..."
                  value={assignmentForm.instructions}
                  onChange={(e) => setAssignmentForm({ ...assignmentForm, instructions: e.target.value })}
                  required
                  rows="4"
                />
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem', justifyContent: 'flex-end' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowAssignmentModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Publish Assignment</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherDashboard;
