import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { GraduationCap, Users, UserCheck, BookOpen, LogOut, Home, Award, CreditCard, FileText, Layers, Calendar, ClipboardList, Clock, DollarSign, Bell, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Sidebar = ({ activeTab, setActiveTab }) => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getRoleDisplayName = (role) => {
    switch (role) {
      case 'ROLE_ADMIN': return 'Administrator';
      case 'ROLE_TEACHER': return 'Educator';
      case 'ROLE_STUDENT': return 'Student';
      default: return 'User';
    }
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <GraduationCap size={28} className="text-primary" style={{ color: 'var(--color-primary)' }} />
        <span>EduPortal</span>
      </div>

      <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1, overflowY: 'auto', paddingRight: '4px' }}>
        <a 
          className={`sidebar-item ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('dashboard')}
        >
          <Home size={18} />
          <span>Dashboard</span>
        </a>

        {user?.role === 'ROLE_ADMIN' && (
          <>
            <a 
              className={`sidebar-item ${activeTab === 'students' ? 'active' : ''}`}
              onClick={() => setActiveTab('students')}
            >
              <Users size={18} />
              <span>Students</span>
            </a>
            <a 
              className={`sidebar-item ${activeTab === 'teachers' ? 'active' : ''}`}
              onClick={() => setActiveTab('teachers')}
            >
              <UserCheck size={18} />
              <span>Teachers</span>
            </a>
            <a 
              className={`sidebar-item ${activeTab === 'timetable_mgmt' ? 'active' : ''}`}
              onClick={() => setActiveTab('timetable_mgmt')}
            >
              <Clock size={18} />
              <span>Time Management</span>
            </a>
            <a 
              className={`sidebar-item ${activeTab === 'salary_mgmt' ? 'active' : ''}`}
              onClick={() => setActiveTab('salary_mgmt')}
            >
              <DollarSign size={18} />
              <span>Salary Management</span>
            </a>
            <a 
              className={`sidebar-item ${activeTab === 'fees' ? 'active' : ''}`}
              onClick={() => setActiveTab('fees')}
            >
              <CreditCard size={18} />
              <span>Fee Management</span>
            </a>
          </>
        )}

        {user?.role === 'ROLE_TEACHER' && (
          <>
            <a 
              className={`sidebar-item ${activeTab === 'grades' ? 'active' : ''}`}
              onClick={() => setActiveTab('grades')}
            >
              <Award size={18} />
              <span>Grades Sheet</span>
            </a>
            <a 
              className={`sidebar-item ${activeTab === 'assignments' ? 'active' : ''}`}
              onClick={() => setActiveTab('assignments')}
            >
              <ClipboardList size={18} />
              <span>Assignments</span>
            </a>
            <a 
              className={`sidebar-item ${activeTab === 'timetable' ? 'active' : ''}`}
              onClick={() => setActiveTab('timetable')}
            >
              <Clock size={18} />
              <span>My Timetable</span>
            </a>
            <a 
              className={`sidebar-item ${activeTab === 'salary' ? 'active' : ''}`}
              onClick={() => setActiveTab('salary')}
            >
              <DollarSign size={18} />
              <span>Salary Ledger</span>
            </a>
            <a 
              className={`sidebar-item ${activeTab === 'attendance' ? 'active' : ''}`}
              onClick={() => setActiveTab('attendance')}
            >
              <UserCheck size={18} />
              <span>Attendance</span>
            </a>
            <a 
              className={`sidebar-item ${activeTab === 'notices' ? 'active' : ''}`}
              onClick={() => setActiveTab('notices')}
            >
              <Bell size={18} />
              <span>Notices</span>
            </a>
            <a 
              className={`sidebar-item ${activeTab === 'profile' ? 'active' : ''}`}
              onClick={() => setActiveTab('profile')}
            >
              <User size={18} />
              <span>My Profile</span>
            </a>
          </>
        )}

        {user?.role === 'ROLE_STUDENT' && (
          <>
            <a 
              className={`sidebar-item ${activeTab === 'mygrades' ? 'active' : ''}`}
              onClick={() => setActiveTab('mygrades')}
            >
              <Award size={18} />
              <span>My Grades</span>
            </a>
            <a 
              className={`sidebar-item ${activeTab === 'fees' ? 'active' : ''}`}
              onClick={() => setActiveTab('fees')}
            >
              <CreditCard size={18} />
              <span>Fee Details</span>
            </a>
            <a 
              className={`sidebar-item ${activeTab === 'timetable' ? 'active' : ''}`}
              onClick={() => setActiveTab('timetable')}
            >
              <Clock size={18} />
              <span>My Timetable</span>
            </a>
            <a 
              className={`sidebar-item ${activeTab === 'courses' ? 'active' : ''}`}
              onClick={() => setActiveTab('courses')}
            >
              <BookOpen size={18} />
              <span>Course Details</span>
            </a>
            <a 
              className={`sidebar-item ${activeTab === 'result_report' ? 'active' : ''}`}
              onClick={() => setActiveTab('result_report')}
            >
              <FileText size={18} />
              <span>Result Report</span>
            </a>
            <a 
              className={`sidebar-item ${activeTab === 'syllabus' ? 'active' : ''}`}
              onClick={() => setActiveTab('syllabus')}
            >
              <Layers size={18} />
              <span>Syllabus Pattern</span>
            </a>
            <a 
              className={`sidebar-item ${activeTab === 'calendar' ? 'active' : ''}`}
              onClick={() => setActiveTab('calendar')}
            >
              <Calendar size={18} />
              <span>Academic Calendar</span>
            </a>
          </>
        )}
      </nav>

      <div className="sidebar-footer">
        <div className="user-profile-badge">
          <div className="user-avatar">
            {user?.username?.substring(0, 2).toUpperCase()}
          </div>
          <div className="user-details">
            <span className="user-name">{user?.username}</span>
            <span className="user-role">{getRoleDisplayName(user?.role)}</span>
          </div>
        </div>
        <button className="btn btn-secondary" onClick={handleLogout} style={{ width: '100%' }}>
          <LogOut size={16} />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
