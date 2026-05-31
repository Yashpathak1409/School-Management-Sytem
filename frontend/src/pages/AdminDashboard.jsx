import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import API from '../services/api';
import { Plus, Trash2, Users, UserCheck, Activity, Award, BookOpen, Edit, DollarSign, Clock } from 'lucide-react';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState({ totalStudents: 0, totalTeachers: 0, totalUsers: 0 });
  const [students, setStudents] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(false);

  // Modals
  const [showStudentModal, setShowStudentModal] = useState(false);
  const [showTeacherModal, setShowTeacherModal] = useState(false);
  const [showEditStudentModal, setShowEditStudentModal] = useState(false);
  const [showEditTeacherModal, setShowEditTeacherModal] = useState(false);

  // Form Fields - Extended with parent and sibling details
  const [studentForm, setStudentForm] = useState({ 
    username: '', 
    email: '', 
    name: '', 
    rollNumber: '', 
    gradeLevel: 'Grade 10',
    phoneNumber: '',
    dateOfBirth: '',
    fatherName: '',
    motherName: '',
    parentPhoneNo: '',
    parentProfession: '',
    siblings: ''
  });

  const [editingStudent, setEditingStudent] = useState(null);
  const [editingTeacher, setEditingTeacher] = useState(null);
  
  const [teacherForm, setTeacherForm] = useState({ 
    username: '', 
    email: '', 
    name: '', 
    department: 'Mathematics',
    phoneNumber: '',
    dateOfBirth: ''
  });
  
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');

  const [salaryInputs, setSalaryInputs] = useState({});
  const [timeMgmtTab, setTimeMgmtTab] = useState('class');
  const [timeClassForm, setTimeClassForm] = useState({ gradeLevel: 'Grade 10-A', timetable: '' });
  const [timeTeacherForm, setTimeTeacherForm] = useState({ id: '', timetable: '' });
  const [timeStudentForm, setTimeStudentForm] = useState({ id: '', timetable: '' });

  // Fee Management States
  const [feeRecords, setFeeRecords] = useState([]);
  const [feeForm, setFeeForm] = useState({
    rollNumber: '',
    tuitionFee: '',
    sportsFee: '',
    labFee: '',
    schoolAccessoriesFee: '',
    transportFee: '',
    hostelFee: '',
    otherCharges: '',
    month: 'January',
    year: '2026',
    remarks: 'Tuition & Academic Fees',
    periodType: '1 Month'
  });
  const [feeFormError, setFeeFormError] = useState('');
  const [feeFormSuccess, setFeeFormSuccess] = useState('');
  const [submittingFee, setSubmittingFee] = useState(false);

  const fetchFees = async () => {
    setLoading(true);
    try {
      const response = await API.get('/api/admin/fees');
      setFeeRecords(response.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFeeAction = async (actionType) => {
    setFeeFormError('');
    setFeeFormSuccess('');
    setSubmittingFee(true);

    if (!feeForm.rollNumber.trim()) {
      setFeeFormError('Student Roll Number is required.');
      setSubmittingFee(false);
      return;
    }

    const t = parseFloat(feeForm.tuitionFee) || 0;
    const s = parseFloat(feeForm.sportsFee) || 0;
    const l = parseFloat(feeForm.labFee) || 0;
    const a = parseFloat(feeForm.schoolAccessoriesFee) || 0;
    const tr = parseFloat(feeForm.transportFee) || 0;
    const h = parseFloat(feeForm.hostelFee) || 0;
    const o = parseFloat(feeForm.otherCharges) || 0;

    const totalSum = t + s + l + a + tr + h + o;

    if (totalSum <= 0) {
      setFeeFormError('Please enter at least one fee amount greater than zero.');
      setSubmittingFee(false);
      return;
    }

    const getPeriodText = (startMonth, periodType) => {
      const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
      const startIndex = months.indexOf(startMonth);
      if (periodType === '1 Month') {
        return `${startMonth}`;
      } else if (periodType === '2 Months') {
        const endIndex = (startIndex + 1) % 12;
        return `${startMonth} - ${months[endIndex]}`;
      } else if (periodType === '3 Months (Quarterly)') {
        const endIndex = (startIndex + 2) % 12;
        return `${startMonth} - ${months[endIndex]} (Quarterly)`;
      } else if (periodType === '6 Months (Half-Yearly)') {
        const endIndex = (startIndex + 5) % 12;
        return `${startMonth} - ${months[endIndex]} (Half-Yearly)`;
      } else if (periodType === '12 Months (Complete Year)') {
        return `Complete Year`;
      }
      return startMonth;
    };

    try {
      const payload = {
        rollNumber: feeForm.rollNumber.trim(),
        tuitionFee: t,
        sportsFee: s,
        labFee: l,
        schoolAccessoriesFee: a,
        transportFee: tr,
        hostelFee: h,
        otherCharges: o,
        month: getPeriodText(feeForm.month, feeForm.periodType),
        year: feeForm.year,
        remarks: feeForm.remarks
      };

      if (actionType === 'deposit') {
        await API.post('/api/admin/fees/deposit', payload);
        setFeeFormSuccess('Fee transaction recorded successfully.');
      } else {
        const response = await API.post('/api/admin/fees/assign', payload);
        setFeeFormSuccess(response.data);
      }

      setFeeForm({
        rollNumber: '',
        tuitionFee: '',
        sportsFee: '',
        labFee: '',
        schoolAccessoriesFee: '',
        transportFee: '',
        hostelFee: '',
        otherCharges: '',
        month: 'January',
        year: '2026',
        remarks: 'Tuition & Academic Fees',
        periodType: '1 Month'
      });
      fetchFees();
      fetchStats();
    } catch (err) {
      setFeeFormError(err.response?.data || `Failed to ${actionType === 'deposit' ? 'deposit' : 'assign'} fee. Please check Roll Number.`);
    } finally {
      setSubmittingFee(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await API.get('/api/admin/stats');
      setStats(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const response = await API.get('/api/admin/students');
      setStudents(response.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchTeachers = async () => {
    setLoading(true);
    try {
      const response = await API.get('/api/admin/teachers');
      setTeachers(response.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    if (activeTab === 'students' || activeTab === 'timetable_mgmt') fetchStudents();
    if (activeTab === 'teachers' || activeTab === 'timetable_mgmt' || activeTab === 'salary_mgmt') fetchTeachers();
    if (activeTab === 'fees') fetchFees();
  }, [activeTab]);

  useEffect(() => {
    if (activeTab === 'salary_mgmt') {
      const initial = {};
      teachers.forEach(t => {
        initial[t.id] = {
          basicSalary: t.basicSalary !== null && t.basicSalary !== undefined ? t.basicSalary : '',
          allowance: t.allowance !== null && t.allowance !== undefined ? t.allowance : '',
          deduction: t.deduction !== null && t.deduction !== undefined ? t.deduction : ''
        };
      });
      setSalaryInputs(initial);
    }
  }, [activeTab, teachers]);

  const handleStudentSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');
    try {
      await API.post('/api/admin/students', studentForm);
      setFormSuccess('Student created successfully!');
      setStudentForm({ 
        username: '', 
        email: '', 
        name: '', 
        rollNumber: '', 
        gradeLevel: 'Grade 10',
        phoneNumber: '',
        dateOfBirth: '',
        fatherName: '',
        motherName: '',
        parentPhoneNo: '',
        parentProfession: '',
        siblings: ''
      });
      fetchStudents();
      fetchStats();
      setTimeout(() => {
        setShowStudentModal(false);
        setFormSuccess('');
      }, 1500);
    } catch (err) {
      setFormError(err.response?.data || 'Failed to create student.');
    }
  };

  const startEditStudent = (student) => {
    setEditingStudent({
      id: student.id,
      username: student.user?.username || '',
      email: student.user?.email || '',
      phoneNumber: student.user?.phoneNumber || '',
      dateOfBirth: student.user?.dateOfBirth || '',
      name: student.name || '',
      rollNumber: student.rollNumber || '',
      gradeLevel: student.gradeLevel || 'Grade 10',
      isHosteler: student.isHosteler || false,
      transportType: student.transportType || 'None',
      villageName: student.villageName || '',
      aadhaarCardNo: student.aadhaarCardNo || '',
      enrolledCourse: student.enrolledCourse || 'General Sciences',
      lastYearMarks: student.lastYearMarks !== null && student.lastYearMarks !== undefined ? student.lastYearMarks : '',
      gender: student.gender || 'Male',
      fatherName: student.fatherName || '',
      motherName: student.motherName || '',
      parentPhoneNo: student.parentPhoneNo || '',
      parentProfession: student.parentProfession || '',
      siblings: student.siblings || ''
    });
    setFormError('');
    setFormSuccess('');
    setShowEditStudentModal(true);
  };

  const handleEditStudentSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');
    try {
      const marksValue = editingStudent.lastYearMarks === '' ? null : parseFloat(editingStudent.lastYearMarks);
      await API.put(`/api/admin/students/${editingStudent.id}`, {
        ...editingStudent,
        lastYearMarks: marksValue
      });
      setFormSuccess('Student profile updated successfully!');
      fetchStudents();
      fetchStats();
      setTimeout(() => {
        setShowEditStudentModal(false);
        setEditingStudent(null);
        setFormSuccess('');
      }, 1500);
    } catch (err) {
      setFormError(err.response?.data || 'Failed to update student profile.');
    }
  };

  const updateTeacherSalaryDirectly = async (teacherId, basicSalary, allowance, deduction) => {
    try {
      const teacherObj = teachers.find(t => t.id === teacherId);
      if (!teacherObj) return;

      const payload = {
        name: teacherObj.name,
        department: teacherObj.department,
        username: teacherObj.user?.username,
        email: teacherObj.user?.email,
        phoneNumber: teacherObj.user?.phoneNumber,
        dateOfBirth: teacherObj.user?.dateOfBirth,
        basicSalary: parseFloat(basicSalary || 0),
        allowance: parseFloat(allowance || 0),
        deduction: parseFloat(deduction || 0),
        timetable: teacherObj.timetable
      };

      await API.put(`/api/admin/teachers/${teacherId}`, payload);
      setFormSuccess(`Salary for ${teacherObj.name} updated successfully!`);
      fetchTeachers();
      setTimeout(() => setFormSuccess(''), 2500);
    } catch (err) {
      setFormError(err.response?.data || 'Failed to update salary.');
      setTimeout(() => setFormError(''), 3000);
    }
  };

  const handleClassTimetableSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');
    try {
      await API.put('/api/admin/timetable/class', timeClassForm);
      setFormSuccess(`Class ${timeClassForm.gradeLevel} timetable updated successfully!`);
      setTimeout(() => setFormSuccess(''), 2500);
    } catch (err) {
      setFormError(err.response?.data || 'Failed to update class timetable.');
    }
  };

  const handleTeacherTimetableSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');
    if (!timeTeacherForm.id) {
      setFormError('Please select a teacher.');
      return;
    }
    try {
      await API.put('/api/admin/timetable/teacher', timeTeacherForm);
      const teacherObj = teachers.find(t => t.id === parseInt(timeTeacherForm.id));
      setFormSuccess(`Timetable for ${teacherObj?.name || 'teacher'} updated successfully!`);
      fetchTeachers();
      setTimeout(() => setFormSuccess(''), 2500);
    } catch (err) {
      setFormError(err.response?.data || 'Failed to update teacher timetable.');
    }
  };

  const handleStudentTimetableSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');
    if (!timeStudentForm.id) {
      setFormError('Please select a student.');
      return;
    }
    try {
      await API.put('/api/admin/timetable/student', timeStudentForm);
      const studentObj = students.find(s => s.id === parseInt(timeStudentForm.id));
      setFormSuccess(`Timetable for ${studentObj?.name || 'student'} updated successfully!`);
      fetchStudents();
      setTimeout(() => setFormSuccess(''), 2500);
    } catch (err) {
      setFormError(err.response?.data || 'Failed to update student timetable.');
    }
  };

  const startEditTeacher = (teacher) => {
    setEditingTeacher({
      id: teacher.id,
      name: teacher.name,
      department: teacher.department,
      username: teacher.user?.username || '',
      email: teacher.user?.email || '',
      phoneNumber: teacher.user?.phoneNumber || '',
      dateOfBirth: teacher.user?.dateOfBirth || '',
      basicSalary: teacher.basicSalary || 45000.0,
      allowance: teacher.allowance || 5000.0,
      deduction: teacher.deduction || 2000.0,
      timetable: teacher.timetable || 'Monday: 09:00 AM - 10:00 AM (Mathematics - Grade 10-A)'
    });
    setFormError('');
    setFormSuccess('');
    setShowEditTeacherModal(true);
  };

  const handleEditTeacherSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');
    try {
      await API.put(`/api/admin/teachers/${editingTeacher.id}`, editingTeacher);
      setFormSuccess('Teacher profile updated successfully!');
      fetchTeachers();
      fetchStats();
      setTimeout(() => {
        setShowEditTeacherModal(false);
        setEditingTeacher(null);
        setFormSuccess('');
      }, 1500);
    } catch (err) {
      setFormError(err.response?.data || 'Failed to update teacher profile.');
    }
  };

  const handleTeacherSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');
    try {
      await API.post('/api/admin/teachers', teacherForm);
      setFormSuccess('Teacher created successfully!');
      setTeacherForm({ 
        username: '', 
        email: '', 
        name: '', 
        department: 'Mathematics',
        phoneNumber: '',
        dateOfBirth: ''
      });
      fetchTeachers();
      fetchStats();
      setTimeout(() => {
        setShowTeacherModal(false);
        setFormSuccess('');
      }, 1500);
    } catch (err) {
      setFormError(err.response?.data || 'Failed to create teacher.');
    }
  };

  const deleteStudent = async (id) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      try {
        await API.delete(`/api/admin/students/${id}`);
        fetchStudents();
        fetchStats();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const deleteTeacher = async (id) => {
    if (window.confirm('Are you sure you want to delete this teacher?')) {
      try {
        await API.delete(`/api/admin/teachers/${id}`);
        fetchTeachers();
        fetchStats();
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div className="app-container">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="main-content">
        {activeTab === 'dashboard' && (
          <div className="animate-fade-in">
            <div className="page-header">
              <div>
                <h1 className="page-title">Admin Dashboard</h1>
                <p className="page-subtitle">Overview of the School Management System</p>
              </div>
            </div>

            <div className="stats-grid">
              <div className="glass-card stat-card">
                <div className="stat-info">
                  <span className="stat-value">{stats.totalStudents}</span>
                  <span className="stat-label">Registered Students</span>
                </div>
                <div className="stat-icon">
                  <Users size={24} />
                </div>
              </div>

              <div className="glass-card stat-card">
                <div className="stat-info">
                  <span className="stat-value">{stats.totalTeachers}</span>
                  <span className="stat-label">Teachers & Instructors</span>
                </div>
                <div className="stat-icon" style={{ color: 'var(--color-secondary)' }}>
                  <UserCheck size={24} />
                </div>
              </div>

              <div className="glass-card stat-card">
                <div className="stat-info">
                  <span className="stat-value">{stats.totalUsers}</span>
                  <span className="stat-label">Total User Accounts</span>
                </div>
                <div className="stat-icon" style={{ color: 'var(--color-success)' }}>
                  <Activity size={24} />
                </div>
              </div>
            </div>

            <div className="glass-card" style={{ marginTop: '2rem' }}>
              <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem', fontWeight: 600 }}>System Highlights</h2>
              <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', marginTop: '1rem' }}>
                <div style={{ flex: 1, minWidth: '240px', background: 'rgba(255, 255, 255, 0.02)', padding: '1rem', borderRadius: '8px' }}>
                  <h3 style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Active Term</h3>
                  <p style={{ fontWeight: 600 }}>Spring Semester 2026</p>
                </div>
                <div style={{ flex: 1, minWidth: '240px', background: 'rgba(255, 255, 255, 0.02)', padding: '1rem', borderRadius: '8px' }}>
                  <h3 style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Database Engine</h3>
                  <p style={{ fontWeight: 600, color: 'var(--color-success)' }}>MySQL Active (school_management_db)</p>
                </div>
                <div style={{ flex: 1, minWidth: '240px', background: 'rgba(255, 255, 255, 0.02)', padding: '1rem', borderRadius: '8px' }}>
                  <h3 style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Security Protocol</h3>
                  <p style={{ fontWeight: 600, color: 'var(--color-primary)' }}>JWT Phone/DOB Auth + Single Session</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'students' && (
          <div className="animate-fade-in">
            <div className="page-header">
              <div>
                <h1 className="page-title">Student Records</h1>
                <p className="page-subtitle">View, edit, and manage registered student profiles</p>
              </div>
              <button className="btn btn-primary" onClick={() => { setFormError(''); setFormSuccess(''); setShowStudentModal(true); }}>
                <Plus size={16} />
                <span>Add New Student</span>
              </button>
            </div>

            <div className="glass-card">
              {loading ? (
                <p>Loading students...</p>
              ) : students.length === 0 ? (
                <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '2rem' }}>No student records found.</p>
              ) : (
                <div className="table-container">
                  <table>
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Roll Number</th>
                        <th>Grade</th>
                        <th>Allocated Section</th>
                        <th>Phone Number</th>
                        <th>Parent Phone</th>
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
                          <td>
                            <span className={`badge ${student.section ? 'badge-success' : 'badge-secondary'}`} style={{ textTransform: 'none' }}>
                              {student.section || 'Unassigned'}
                            </span>
                          </td>
                          <td>{student.user?.phoneNumber || 'N/A'}</td>
                          <td>{student.parentPhoneNo || 'N/A'}</td>
                          <td>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                              <button className="btn" onClick={() => startEditStudent(student)} style={{ padding: '0.4rem 0.6rem', display: 'flex', alignItems: 'center', background: 'rgba(59, 130, 246, 0.15)', color: '#93c5fd', border: '1px solid rgba(59, 130, 246, 0.3)' }}>
                                <Edit size={14} style={{ marginRight: '4px' }} />
                                <span>Edit</span>
                              </button>
                              <button className="btn btn-danger" onClick={() => deleteStudent(student.id)} style={{ padding: '0.4rem 0.6rem', display: 'flex', alignItems: 'center' }}>
                                <Trash2 size={14} />
                              </button>
                            </div>
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

        {activeTab === 'teachers' && (
          <div className="animate-fade-in">
            <div className="page-header">
              <div>
                <h1 className="page-title">Educators Directory</h1>
                <p className="page-subtitle">Manage faculty and departmental assignments</p>
              </div>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button className="btn" onClick={() => { setFormError(''); setFormSuccess(''); setActiveTab('salary_mgmt'); }} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '0.6rem 1rem', borderRadius: '8px', cursor: 'pointer', fontWeight: 500 }}>
                  <DollarSign size={16} />
                  <span>Manage Salaries</span>
                </button>
                <button className="btn btn-primary" onClick={() => { setFormError(''); setFormSuccess(''); setShowTeacherModal(true); }} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Plus size={16} />
                  <span>Add Teacher</span>
                </button>
              </div>
            </div>

            <div className="glass-card">
              {loading ? (
                <p>Loading teachers...</p>
              ) : teachers.length === 0 ? (
                <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '2rem' }}>No teacher records found.</p>
              ) : (
                <div className="table-container">
                  <table>
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Department</th>
                        <th>Phone Number</th>
                        <th>Email</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {teachers.map((teacher) => (
                        <tr key={teacher.id}>
                          <td style={{ fontWeight: 600 }}>{teacher.name}</td>
                          <td>
                            <span className="badge badge-primary" style={{ background: 'rgba(168, 85, 247, 0.15)', color: '#d8b4fe' }}>
                              {teacher.department}
                            </span>
                          </td>
                          <td>{teacher.user?.phoneNumber || 'N/A'}</td>
                          <td style={{ color: 'var(--text-secondary)' }}>{teacher.user?.email}</td>
                          <td style={{ display: 'flex', gap: '0.5rem' }}>
                            <button className="btn btn-secondary" onClick={() => startEditTeacher(teacher)} style={{ padding: '0.4rem 0.8rem' }}>
                              <Edit size={14} />
                            </button>
                            <button className="btn btn-danger" onClick={() => deleteTeacher(teacher.id)} style={{ padding: '0.4rem 0.8rem' }}>
                              <Trash2 size={14} />
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

        {activeTab === 'fees' && (
          <div className="animate-fade-in">
            <div className="page-header">
              <div>
                <h1 className="page-title">Fee Management System</h1>
                <p className="page-subtitle">Accept deposits, configure collections, and audit student transactions</p>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem', alignItems: 'start' }}>
              {/* Fee deposit form */}
              <div className="glass-card">
                <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1.25rem', color: 'var(--color-primary)' }}>Deposit New Student Fee</h3>
                
                {feeFormError && <div style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#fca5a5', padding: '0.6rem', borderRadius: '6px', marginBottom: '1rem', fontSize: '0.85rem' }}>{feeFormError}</div>}
                {feeFormSuccess && <div style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#a7f3d0', padding: '0.6rem', borderRadius: '6px', marginBottom: '1rem', fontSize: '0.85rem' }}>{feeFormSuccess}</div>}

                <form onSubmit={(e) => e.preventDefault()} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Student Roll Number (Required)</label>
                    <input 
                      type="text" 
                      placeholder="e.g. ROLL-101" 
                      value={feeForm.rollNumber} 
                      onChange={(e) => setFeeForm({ ...feeForm, rollNumber: e.target.value })} 
                      required 
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                    <div className="form-group">
                      <label className="form-label" style={{ fontSize: '0.8rem' }}>Tuition Fee (Rs.)</label>
                      <input 
                        type="number" 
                        step="0.01" 
                        placeholder="0.00" 
                        value={feeForm.tuitionFee} 
                        onChange={(e) => setFeeForm({ ...feeForm, tuitionFee: e.target.value })} 
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label" style={{ fontSize: '0.8rem' }}>Sports Fee (Rs.)</label>
                      <input 
                        type="number" 
                        step="0.01" 
                        placeholder="0.00" 
                        value={feeForm.sportsFee} 
                        onChange={(e) => setFeeForm({ ...feeForm, sportsFee: e.target.value })} 
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label" style={{ fontSize: '0.8rem' }}>Lab Fee (Rs.)</label>
                      <input 
                        type="number" 
                        step="0.01" 
                        placeholder="0.00" 
                        value={feeForm.labFee} 
                        onChange={(e) => setFeeForm({ ...feeForm, labFee: e.target.value })} 
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label" style={{ fontSize: '0.8rem' }}>School Accessories (Rs.)</label>
                      <input 
                        type="number" 
                        step="0.01" 
                        placeholder="Dress, ID card, etc." 
                        value={feeForm.schoolAccessoriesFee} 
                        onChange={(e) => setFeeForm({ ...feeForm, schoolAccessoriesFee: e.target.value })} 
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label" style={{ fontSize: '0.8rem' }}>Transport Fee (Rs.)</label>
                      <input 
                        type="number" 
                        step="0.01" 
                        placeholder="0.00" 
                        value={feeForm.transportFee} 
                        onChange={(e) => setFeeForm({ ...feeForm, transportFee: e.target.value })} 
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label" style={{ fontSize: '0.8rem' }}>Hostel Fee (Rs.)</label>
                      <input 
                        type="number" 
                        step="0.01" 
                        placeholder="0.00" 
                        value={feeForm.hostelFee} 
                        onChange={(e) => setFeeForm({ ...feeForm, hostelFee: e.target.value })} 
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Other Extra Charges (Rs.)</label>
                    <input 
                      type="number" 
                      step="0.01" 
                      placeholder="e.g. Fine, Exam registration" 
                      value={feeForm.otherCharges} 
                      onChange={(e) => setFeeForm({ ...feeForm, otherCharges: e.target.value })} 
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 0.8fr', gap: '0.75rem' }}>
                    <div className="form-group">
                      <label className="form-label">Covered Period</label>
                      <select 
                        value={feeForm.periodType} 
                        onChange={(e) => setFeeForm({ ...feeForm, periodType: e.target.value })}
                      >
                        {['1 Month', '2 Months', '3 Months (Quarterly)', '6 Months (Half-Yearly)', '12 Months (Complete Year)'].map(p => (
                          <option key={p} value={p}>{p}</option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Start Month</label>
                      <select 
                        value={feeForm.month} 
                        onChange={(e) => setFeeForm({ ...feeForm, month: e.target.value })}
                      >
                        {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map(m => (
                          <option key={m} value={m}>{m}</option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Billing Year</label>
                      <select 
                        value={feeForm.year} 
                        onChange={(e) => setFeeForm({ ...feeForm, year: e.target.value })}
                      >
                        {['2024', '2025', '2026', '2027', '2028'].map(y => (
                          <option key={y} value={y}>{y}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Remarks / Description</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Tuition Fee, Exam Fee, Hostel Fee" 
                      value={feeForm.remarks} 
                      onChange={(e) => setFeeForm({ ...feeForm, remarks: e.target.value })} 
                    />
                  </div>

                  <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                    <button 
                      type="button" 
                      className="btn btn-primary" 
                      style={{ flex: 1, padding: '0.75rem' }}
                      disabled={submittingFee}
                      onClick={() => handleFeeAction('deposit')}
                    >
                      <span>{submittingFee ? 'Depositing...' : 'Deposit Fee'}</span>
                    </button>
                    <button 
                      type="button" 
                      className="btn" 
                      style={{ flex: 1, padding: '0.75rem', background: 'rgba(59, 130, 246, 0.15)', color: 'var(--color-primary)', border: '1px solid var(--color-primary)' }}
                      disabled={submittingFee}
                      onClick={() => handleFeeAction('assign')}
                    >
                      <span>{submittingFee ? 'Assigning...' : 'Assign Fee Target'}</span>
                    </button>
                  </div>
                </form>
              </div>

              {/* Transactions Ledger */}
              <div className="glass-card" style={{ gridColumn: 'span 2' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1.25rem' }}>Audit Log & Transaction History</h3>
                {loading ? (
                  <p>Loading fee ledger...</p>
                ) : feeRecords.length === 0 ? (
                  <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '2rem' }}>No fee transactions recorded yet.</p>
                ) : (
                  <div className="table-container">
                    <table>
                      <thead>
                        <tr>
                          <th>Student Name</th>
                          <th>Roll Number</th>
                          <th>Period</th>
                          <th>Remarks</th>
                          <th>Amount Paid</th>
                          <th>Payment Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {feeRecords.map((record) => (
                          <tr key={record.id}>
                            <td style={{ fontWeight: 600 }}>{record.student?.name}</td>
                            <td>
                              <span className="badge badge-secondary" style={{ fontFamily: 'monospace' }}>
                                {record.student?.rollNumber}
                              </span>
                            </td>
                            <td>{record.month} {record.year}</td>
                            <td style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                              <div>{record.remarks || 'Fee Payment'}</div>
                              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '4px', lineHeight: '1.25' }}>
                                Tuition: Rs. {record.tuitionFee?.toFixed(0)} | Sports: Rs. {record.sportsFee?.toFixed(0)} | Lab: Rs. {record.labFee?.toFixed(0)} | Access.: Rs. {record.schoolAccessoriesFee?.toFixed(0)} | Trans.: Rs. {record.transportFee?.toFixed(0)} | Hostel: Rs. {record.hostelFee?.toFixed(0)} | Other: Rs. {record.otherCharges?.toFixed(0)}
                              </div>
                            </td>
                            <td style={{ fontWeight: 700, color: 'var(--color-success)' }}>
                              Rs. {record.amountPaid?.toFixed(2)}
                            </td>
                            <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                              {new Date(record.paymentDate).toLocaleDateString()} {new Date(record.paymentDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </td>
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

        {activeTab === 'timetable_mgmt' && (
          <div className="animate-fade-in">
            <div className="page-header">
              <div>
                <h1 className="page-title">Weekly Schedule & Time Management</h1>
                <p className="page-subtitle">Schedule class-wise hours, teacher sessions, and individual student timetables</p>
              </div>
            </div>

            {formError && <div style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#fca5a5', padding: '0.6rem', borderRadius: '6px', marginBottom: '1rem', fontSize: '0.85rem' }}>{formError}</div>}
            {formSuccess && <div style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#a7f3d0', padding: '0.6rem', borderRadius: '6px', marginBottom: '1rem', fontSize: '0.85rem' }}>{formSuccess}</div>}

            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
              <button 
                type="button"
                className={`btn ${timeMgmtTab === 'class' ? 'btn-primary' : 'btn-secondary'}`} 
                onClick={() => { setTimeMgmtTab('class'); setFormError(''); setFormSuccess(''); }}
              >
                Class-wise Schedule
              </button>
              <button 
                type="button"
                className={`btn ${timeMgmtTab === 'teacher' ? 'btn-primary' : 'btn-secondary'}`} 
                onClick={() => { setTimeMgmtTab('teacher'); setFormError(''); setFormSuccess(''); }}
              >
                Teacher Timetable
              </button>
              <button 
                type="button"
                className={`btn ${timeMgmtTab === 'student' ? 'btn-primary' : 'btn-secondary'}`} 
                onClick={() => { setTimeMgmtTab('student'); setFormError(''); setFormSuccess(''); }}
              >
                Individual Student Timetable
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }}>
              
              {/* Class-wise Planner */}
              {timeMgmtTab === 'class' && (
                <div className="glass-card">
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1.25rem', color: 'var(--color-primary)' }}>
                    Schedule Class-wise Timetable
                  </h3>
                  <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.875rem' }}>
                    Assign a general period schedule to all students in a given class / grade level.
                  </p>
                  <form onSubmit={handleClassTimetableSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div className="form-group">
                      <label className="form-label">Select Grade / Class Level</label>
                      <select 
                        value={timeClassForm.gradeLevel} 
                        onChange={(e) => setTimeClassForm({ ...timeClassForm, gradeLevel: e.target.value })}
                        style={{ width: '100%' }}
                      >
                        {['Grade 9-A', 'Grade 9-B', 'Grade 10-A', 'Grade 10-B', 'Grade 11-A', 'Grade 11-B', 'Grade 12-A', 'Grade 12-B'].map(gl => (
                          <option key={gl} value={gl}>{gl}</option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Weekly Schedule (Text/Description)</label>
                      <textarea
                        rows="6"
                        placeholder="e.g.&#10;Monday: 08:30 AM - 09:30 AM (Mathematics), 09:30 AM - 10:30 AM (Science)&#10;Wednesday: 11:00 AM - 12:00 PM (English Literature), 12:00 PM - 01:00 PM (Computer Science)"
                        value={timeClassForm.timetable}
                        onChange={(e) => setTimeClassForm({ ...timeClassForm, timetable: e.target.value })}
                        required
                      />
                    </div>

                    <div>
                      <button type="submit" className="btn btn-primary">Save Class Schedule</button>
                    </div>
                  </form>
                </div>
              )}

              {/* Teacher Planner */}
              {timeMgmtTab === 'teacher' && (
                <div className="glass-card">
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1.25rem', color: 'var(--color-primary)' }}>
                    Schedule Faculty Timetable
                  </h3>
                  <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.875rem' }}>
                    Schedule hours, classrooms, and subject period assignments for specific educators.
                  </p>
                  <form onSubmit={handleTeacherTimetableSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div className="form-group">
                      <label className="form-label">Select Educator</label>
                      <select 
                        value={timeTeacherForm.id} 
                        onChange={(e) => {
                          const val = e.target.value;
                          const selectedTeacher = teachers.find(t => t.id === parseInt(val));
                          setTimeTeacherForm({ 
                            id: val, 
                            timetable: selectedTeacher?.timetable || '' 
                          });
                        }}
                        style={{ width: '100%' }}
                      >
                        <option value="">-- Choose Faculty Member --</option>
                        {teachers.map(t => (
                          <option key={t.id} value={t.id}>{t.name} ({t.department})</option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Weekly Schedule (Text/Description)</label>
                      <textarea
                        rows="6"
                        placeholder="e.g.&#10;Monday: 09:00 AM - 10:00 AM (Mathematics - Grade 10-A)&#10;Wednesday: 11:00 AM - 12:00 PM (Algebra - Grade 11-B)"
                        value={timeTeacherForm.timetable}
                        onChange={(e) => setTimeTeacherForm({ ...timeTeacherForm, timetable: e.target.value })}
                        required
                      />
                    </div>

                    <div>
                      <button type="submit" className="btn btn-primary">Save Teacher Schedule</button>
                    </div>
                  </form>
                </div>
              )}

              {/* Individual Student Planner */}
              {timeMgmtTab === 'student' && (
                <div className="glass-card">
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1.25rem', color: 'var(--color-primary)' }}>
                    Schedule Individual Student Timetable
                  </h3>
                  <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.875rem' }}>
                    Assign a custom student-specific timetable (useful for specialized tutoring or labs).
                  </p>
                  <form onSubmit={handleStudentTimetableSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div className="form-group">
                      <label className="form-label">Select Student</label>
                      <select 
                        value={timeStudentForm.id} 
                        onChange={(e) => {
                          const val = e.target.value;
                          const selectedStudent = students.find(s => s.id === parseInt(val));
                          setTimeStudentForm({ 
                            id: val, 
                            timetable: selectedStudent?.timetable || '' 
                          });
                        }}
                        style={{ width: '100%' }}
                      >
                        <option value="">-- Choose Student --</option>
                        {students.map(s => (
                          <option key={s.id} value={s.id}>{s.name} ({s.rollNumber} - {s.gradeLevel})</option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Weekly Schedule (Text/Description)</label>
                      <textarea
                        rows="6"
                        placeholder="e.g.&#10;Monday: 02:00 PM - 03:00 PM (Special Science Lab)&#10;Friday: 03:00 PM - 04:00 PM (Math Remedial Session)"
                        value={timeStudentForm.timetable}
                        onChange={(e) => setTimeStudentForm({ ...timeStudentForm, timetable: e.target.value })}
                        required
                      />
                    </div>

                    <div>
                      <button type="submit" className="btn btn-primary">Save Student Schedule</button>
                    </div>
                  </form>
                </div>
              )}

            </div>
          </div>
        )}

        {activeTab === 'salary_mgmt' && (
          <div className="animate-fade-in">
            <div className="page-header">
              <div>
                <h1 className="page-title">Salary Management</h1>
                <p className="page-subtitle">Configure faculty basic salary packages, allowances, and mandatory deductions</p>
              </div>
            </div>

            {formError && <div style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#fca5a5', padding: '0.6rem', borderRadius: '6px', marginBottom: '1rem', fontSize: '0.85rem' }}>{formError}</div>}
            {formSuccess && <div style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#a7f3d0', padding: '0.6rem', borderRadius: '6px', marginBottom: '1rem', fontSize: '0.85rem' }}>{formSuccess}</div>}

            <div className="glass-card">
              <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1.25rem', color: 'var(--color-primary)' }}>
                Faculty Salary Ledger
              </h3>
              
              {loading ? (
                <p>Loading salaries...</p>
              ) : teachers.length === 0 ? (
                <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '2rem' }}>No educator records found.</p>
              ) : (
                <div className="table-container">
                  <table>
                    <thead>
                      <tr>
                        <th>Educator Name</th>
                        <th>Department</th>
                        <th>Basic Salary (Rs.)</th>
                        <th>Allowances (Rs.)</th>
                        <th>Deductions (Rs.)</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {teachers.map(t => (
                        <tr key={t.id}>
                          <td style={{ fontWeight: 600 }}>{t.name}</td>
                          <td>
                            <span className="badge badge-primary" style={{ background: 'rgba(168, 85, 247, 0.15)', color: '#d8b4fe' }}>
                              {t.department}
                            </span>
                          </td>
                          <td>
                            <input
                              type="number"
                              value={salaryInputs[t.id]?.basicSalary ?? ''}
                              onChange={(e) => setSalaryInputs({
                                ...salaryInputs,
                                [t.id]: { ...salaryInputs[t.id], basicSalary: e.target.value }
                              })}
                              style={{ width: '120px', padding: '0.4rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '4px' }}
                              placeholder="e.g. 50000"
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              value={salaryInputs[t.id]?.allowance ?? ''}
                              onChange={(e) => setSalaryInputs({
                                ...salaryInputs,
                                [t.id]: { ...salaryInputs[t.id], allowance: e.target.value }
                              })}
                              style={{ width: '120px', padding: '0.4rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '4px' }}
                              placeholder="e.g. 5000"
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              value={salaryInputs[t.id]?.deduction ?? ''}
                              onChange={(e) => setSalaryInputs({
                                ...salaryInputs,
                                [t.id]: { ...salaryInputs[t.id], deduction: e.target.value }
                              })}
                              style={{ width: '120px', padding: '0.4rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '4px' }}
                              placeholder="e.g. 2000"
                            />
                          </td>
                          <td>
                            <button
                              type="button"
                              className="btn btn-primary"
                              onClick={() => updateTeacherSalaryDirectly(
                                t.id,
                                salaryInputs[t.id]?.basicSalary,
                                salaryInputs[t.id]?.allowance,
                                salaryInputs[t.id]?.deduction
                              )}
                              style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}
                            >
                              Save Package
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
      </main>

      {/* Add Student Modal */}
      {showStudentModal && (
        <div className="modal-overlay">
          <div className="glass-card modal-content animate-fade-in" style={{ maxWidth: '650px', maxHeight: '90vh', overflowY: 'auto' }}>
            <h3 style={{ marginBottom: '1.5rem', fontSize: '1.2rem', fontWeight: 600 }}>Register New Student</h3>
            
            {formError && <div style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#fca5a5', padding: '0.5rem', borderRadius: '6px', marginBottom: '1rem', fontSize: '0.85rem' }}>{formError}</div>}
            {formSuccess && <div style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#a7f3d0', padding: '0.5rem', borderRadius: '6px', marginBottom: '1rem', fontSize: '0.85rem' }}>{formSuccess}</div>}

            <form onSubmit={handleStudentSubmit}>
              <h4 style={{ color: 'var(--color-primary)', fontSize: '0.9rem', marginBottom: '0.75rem', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '4px' }}>1. Personal & Account Details</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input type="text" value={studentForm.name} onChange={(e) => setStudentForm({ ...studentForm, name: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Roll Number</label>
                  <input type="text" placeholder="e.g. ROLL-101" value={studentForm.rollNumber} onChange={(e) => setStudentForm({ ...studentForm, rollNumber: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Username</label>
                  <input type="text" value={studentForm.username} onChange={(e) => setStudentForm({ ...studentForm, username: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input type="email" value={studentForm.email} onChange={(e) => setStudentForm({ ...studentForm, email: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Phone Number</label>
                  <input type="text" placeholder="e.g. 1234567890" value={studentForm.phoneNumber} onChange={(e) => setStudentForm({ ...studentForm, phoneNumber: e.target.value.replace(/\D/g, '').slice(0, 15) })} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Date of Birth (DOB)</label>
                  <input type="date" value={studentForm.dateOfBirth} onChange={(e) => setStudentForm({ ...studentForm, dateOfBirth: e.target.value })} required />
                </div>
                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label className="form-label">Grade Level</label>
                  <select value={studentForm.gradeLevel} onChange={(e) => setStudentForm({ ...studentForm, gradeLevel: e.target.value })}>
                    <option value="Grade 9">Grade 9</option>
                    <option value="Grade 10">Grade 10</option>
                    <option value="Grade 11">Grade 11</option>
                    <option value="Grade 12">Grade 12</option>
                  </select>
                </div>
              </div>

              <h4 style={{ color: 'var(--color-secondary)', fontSize: '0.9rem', marginTop: '1.5rem', marginBottom: '0.75rem', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '4px' }}>2. Parents & Family Details</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Father's Name</label>
                  <input type="text" placeholder="Father's name" value={studentForm.fatherName} onChange={(e) => setStudentForm({ ...studentForm, fatherName: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">Mother's Name</label>
                  <input type="text" placeholder="Mother's name" value={studentForm.motherName} onChange={(e) => setStudentForm({ ...studentForm, motherName: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">Parent Phone Number</label>
                  <input type="text" placeholder="e.g. 9876543210" value={studentForm.parentPhoneNo} onChange={(e) => setStudentForm({ ...studentForm, parentPhoneNo: e.target.value.replace(/\D/g, '').slice(0, 15) })} />
                </div>
                <div className="form-group">
                  <label className="form-label">Parent Profession</label>
                  <input type="text" placeholder="e.g. Engineer" value={studentForm.parentProfession} onChange={(e) => setStudentForm({ ...studentForm, parentProfession: e.target.value })} />
                </div>
                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label className="form-label">Siblings Details</label>
                  <input type="text" placeholder="e.g. 1 brother (Grade 8), 1 sister" value={studentForm.siblings} onChange={(e) => setStudentForm({ ...studentForm, siblings: e.target.value })} />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem', justifyContent: 'flex-end' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowStudentModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save Student</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Student Modal */}
      {showEditStudentModal && editingStudent && (
        <div className="modal-overlay">
          <div className="glass-card modal-content animate-fade-in" style={{ maxWidth: '650px', maxHeight: '90vh', overflowY: 'auto' }}>
            <h3 style={{ marginBottom: '1.5rem', fontSize: '1.2rem', fontWeight: 600 }}>Edit Student Record</h3>
            
            {formError && <div style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#fca5a5', padding: '0.5rem', borderRadius: '6px', marginBottom: '1rem', fontSize: '0.85rem' }}>{formError}</div>}
            {formSuccess && <div style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#a7f3d0', padding: '0.5rem', borderRadius: '6px', marginBottom: '1rem', fontSize: '0.85rem' }}>{formSuccess}</div>}

            <form onSubmit={handleEditStudentSubmit}>
              <h4 style={{ color: 'var(--color-primary)', fontSize: '0.9rem', marginBottom: '0.75rem', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '4px' }}>1. Administrative Details</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input type="text" value={editingStudent.name} onChange={(e) => setEditingStudent({ ...editingStudent, name: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Roll Number</label>
                  <input type="text" value={editingStudent.rollNumber} onChange={(e) => setEditingStudent({ ...editingStudent, rollNumber: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Username</label>
                  <input type="text" value={editingStudent.username} onChange={(e) => setEditingStudent({ ...editingStudent, username: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input type="email" value={editingStudent.email} onChange={(e) => setEditingStudent({ ...editingStudent, email: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Phone Number</label>
                  <input type="text" value={editingStudent.phoneNumber} onChange={(e) => setEditingStudent({ ...editingStudent, phoneNumber: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Date of Birth (DOB)</label>
                  <input type="date" value={editingStudent.dateOfBirth} onChange={(e) => setEditingStudent({ ...editingStudent, dateOfBirth: e.target.value })} required />
                </div>
                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label className="form-label">Grade Level</label>
                  <select value={editingStudent.gradeLevel} onChange={(e) => setEditingStudent({ ...editingStudent, gradeLevel: e.target.value })}>
                    <option value="Grade 9">Grade 9</option>
                    <option value="Grade 10">Grade 10</option>
                    <option value="Grade 11">Grade 11</option>
                    <option value="Grade 12">Grade 12</option>
                  </select>
                </div>
              </div>

              <h4 style={{ color: 'var(--color-secondary)', fontSize: '0.9rem', marginTop: '1.5rem', marginBottom: '0.75rem', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '4px' }}>2. Academic & Housing Details</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Gender</label>
                  <select value={editingStudent.gender} onChange={(e) => setEditingStudent({ ...editingStudent, gender: e.target.value })}>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Aadhaar Card No (12 Digits)</label>
                  <input type="text" value={editingStudent.aadhaarCardNo} onChange={(e) => setEditingStudent({ ...editingStudent, aadhaarCardNo: e.target.value.replace(/\D/g, '').slice(0,12) })} />
                </div>
                <div className="form-group">
                  <label className="form-label">Village/City Name</label>
                  <input type="text" value={editingStudent.villageName} onChange={(e) => setEditingStudent({ ...editingStudent, villageName: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">Enrolled Course</label>
                  <select value={editingStudent.enrolledCourse} onChange={(e) => setEditingStudent({ ...editingStudent, enrolledCourse: e.target.value })}>
                    <option value="General Sciences">General Sciences</option>
                    <option value="Computer Science & IT">Computer Science & IT</option>
                    <option value="Commerce & Economics">Commerce & Economics</option>
                    <option value="Arts & Humanities">Arts & Humanities</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Last Year Marks (%)</label>
                  <input type="number" step="0.01" min="0" max="100" placeholder="e.g. 85.0" value={editingStudent.lastYearMarks} onChange={(e) => setEditingStudent({ ...editingStudent, lastYearMarks: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">Transport Type</label>
                  <select value={editingStudent.transportType} onChange={(e) => setEditingStudent({ ...editingStudent, transportType: e.target.value })}>
                    <option value="None">None</option>
                    <option value="School Transport">School Transport</option>
                    <option value="Own Transport">Own Transport</option>
                  </select>
                </div>
                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', marginTop: '0.5rem' }}>
                    <input type="checkbox" checked={editingStudent.isHosteler} onChange={(e) => setEditingStudent({ ...editingStudent, isHosteler: e.target.checked })} />
                    <span className="form-label" style={{ marginBottom: 0 }}>On-Campus Hosteler</span>
                  </label>
                </div>
              </div>

              <h4 style={{ color: 'var(--color-success)', fontSize: '0.9rem', marginTop: '1.5rem', marginBottom: '0.75rem', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '4px' }}>3. Parents & Family Details</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Father's Name</label>
                  <input type="text" value={editingStudent.fatherName} onChange={(e) => setEditingStudent({ ...editingStudent, fatherName: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">Mother's Name</label>
                  <input type="text" value={editingStudent.motherName} onChange={(e) => setEditingStudent({ ...editingStudent, motherName: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">Parent Phone Number</label>
                  <input type="text" value={editingStudent.parentPhoneNo} onChange={(e) => setEditingStudent({ ...editingStudent, parentPhoneNo: e.target.value.replace(/\D/g, '').slice(0, 15) })} />
                </div>
                <div className="form-group">
                  <label className="form-label">Parent Profession</label>
                  <input type="text" value={editingStudent.parentProfession} onChange={(e) => setEditingStudent({ ...editingStudent, parentProfession: e.target.value })} />
                </div>
                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label className="form-label">Siblings Details</label>
                  <input type="text" value={editingStudent.siblings} onChange={(e) => setEditingStudent({ ...editingStudent, siblings: e.target.value })} />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem', justifyContent: 'flex-end' }}>
                <button type="button" className="btn btn-secondary" onClick={() => { setShowEditStudentModal(false); setEditingStudent(null); }}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Teacher Modal */}
      {showTeacherModal && (
        <div className="modal-overlay">
          <div className="glass-card modal-content animate-fade-in">
            <h3 style={{ marginBottom: '1.5rem', fontSize: '1.2rem', fontWeight: 600 }}>Register New Teacher</h3>
            
            {formError && <div style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#fca5a5', padding: '0.5rem', borderRadius: '6px', marginBottom: '1rem', fontSize: '0.85rem' }}>{formError}</div>}
            {formSuccess && <div style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#a7f3d0', padding: '0.5rem', borderRadius: '6px', marginBottom: '1rem', fontSize: '0.85rem' }}>{formSuccess}</div>}

            <form onSubmit={handleTeacherSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input type="text" value={teacherForm.name} onChange={(e) => setTeacherForm({ ...teacherForm, name: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Department</label>
                  <select value={teacherForm.department} onChange={(e) => setTeacherForm({ ...teacherForm, department: e.target.value })}>
                    <option value="Mathematics">Mathematics</option>
                    <option value="Science">Science</option>
                    <option value="Social Studies">Social Studies</option>
                    <option value="English Literature">English Literature</option>
                    <option value="Computer Science">Computer Science</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '0.5rem' }}>
                <div className="form-group">
                  <label className="form-label">Username</label>
                  <input type="text" value={teacherForm.username} onChange={(e) => setTeacherForm({ ...teacherForm, username: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input type="email" value={teacherForm.email} onChange={(e) => setTeacherForm({ ...teacherForm, email: e.target.value })} required />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '0.5rem' }}>
                <div className="form-group">
                  <label className="form-label">Phone Number</label>
                  <input type="text" placeholder="e.g. 1234567890" value={teacherForm.phoneNumber} onChange={(e) => setTeacherForm({ ...teacherForm, phoneNumber: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Date of Birth (DOB)</label>
                  <input type="date" value={teacherForm.dateOfBirth} onChange={(e) => setTeacherForm({ ...teacherForm, dateOfBirth: e.target.value })} required />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem', justifyContent: 'flex-end' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowTeacherModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save Teacher</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Teacher Modal */}
      {showEditTeacherModal && editingTeacher && (
        <div className="modal-overlay">
          <div className="glass-card modal-content animate-fade-in">
            <h3 style={{ marginBottom: '1.5rem', fontSize: '1.2rem', fontWeight: 600 }}>Edit Teacher Record</h3>
            
            {formError && <div style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#fca5a5', padding: '0.5rem', borderRadius: '6px', marginBottom: '1rem', fontSize: '0.85rem' }}>{formError}</div>}
            {formSuccess && <div style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#a7f3d0', padding: '0.5rem', borderRadius: '6px', marginBottom: '1rem', fontSize: '0.85rem' }}>{formSuccess}</div>}

            <form onSubmit={handleEditTeacherSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input type="text" value={editingTeacher.name} onChange={(e) => setEditingTeacher({ ...editingTeacher, name: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Department</label>
                  <select value={editingTeacher.department} onChange={(e) => setEditingTeacher({ ...editingTeacher, department: e.target.value })}>
                    <option value="Mathematics">Mathematics</option>
                    <option value="Science">Science</option>
                    <option value="Social Studies">Social Studies</option>
                    <option value="English Literature">English Literature</option>
                    <option value="Computer Science">Computer Science</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '0.5rem' }}>
                <div className="form-group">
                  <label className="form-label">Username</label>
                  <input type="text" value={editingTeacher.username} onChange={(e) => setEditingTeacher({ ...editingTeacher, username: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input type="email" value={editingTeacher.email} onChange={(e) => setEditingTeacher({ ...editingTeacher, email: e.target.value })} required />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '0.5rem' }}>
                <div className="form-group">
                  <label className="form-label">Phone Number</label>
                  <input type="text" placeholder="e.g. 1234567890" value={editingTeacher.phoneNumber} onChange={(e) => setEditingTeacher({ ...editingTeacher, phoneNumber: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Date of Birth (DOB)</label>
                  <input type="date" value={editingTeacher.dateOfBirth} onChange={(e) => setEditingTeacher({ ...editingTeacher, dateOfBirth: e.target.value })} required />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginTop: '0.5rem' }}>
                <div className="form-group">
                  <label className="form-label">Basic Salary (Rs.)</label>
                  <input type="number" step="0.01" value={editingTeacher.basicSalary} onChange={(e) => setEditingTeacher({ ...editingTeacher, basicSalary: parseFloat(e.target.value) || 0 })} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Allowances (Rs.)</label>
                  <input type="number" step="0.01" value={editingTeacher.allowance} onChange={(e) => setEditingTeacher({ ...editingTeacher, allowance: parseFloat(e.target.value) || 0 })} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Deductions (Rs.)</label>
                  <input type="number" step="0.01" value={editingTeacher.deduction} onChange={(e) => setEditingTeacher({ ...editingTeacher, deduction: parseFloat(e.target.value) || 0 })} required />
                </div>
              </div>

              <div className="form-group" style={{ marginTop: '0.5rem' }}>
                <label className="form-label">Class Schedule Timetable Details</label>
                <textarea 
                  rows="3" 
                  placeholder="Enter classes, e.g. Monday: 09:00 AM - 10:00 AM (Mathematics - Grade 10-A)" 
                  value={editingTeacher.timetable} 
                  onChange={(e) => setEditingTeacher({ ...editingTeacher, timetable: e.target.value })} 
                  required 
                />
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem', justifyContent: 'flex-end' }}>
                <button type="button" className="btn btn-secondary" onClick={() => { setShowEditTeacherModal(false); setEditingTeacher(null); }}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminDashboard;
