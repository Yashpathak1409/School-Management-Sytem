import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { 
  GraduationCap, 
  Users, 
  Calendar, 
  DollarSign, 
  Award, 
  Clock, 
  ArrowRight, 
  LogIn, 
  UserPlus, 
  CheckCircle2, 
  Mail, 
  Phone, 
  MapPin, 
  Shield, 
  Star,
  BookOpen,
  ChevronRight,
  HelpCircle,
  Menu,
  X
} from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useContext(AuthContext);
  
  // Newsletter State
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);
  
  // Tab State for "How it Works"
  const [activeRoleTab, setActiveRoleTab] = useState('admin');

  // Interactive Mock Dashboard State
  const [mockTab, setMockTab] = useState('timetable');

  // FAQ Accordion State
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      setNewsletterSubscribed(true);
      setNewsletterEmail('');
      setTimeout(() => setNewsletterSubscribed(false), 5000);
    }
  };

  const getDashboardPath = () => {
    if (!user) return '/login';
    if (user.role === 'ROLE_ADMIN') return '/admin';
    if (user.role === 'ROLE_TEACHER') return '/teacher';
    if (user.role === 'ROLE_STUDENT') return '/student';
    return '/login';
  };

  const faqs = [
    {
      q: "How does the Automated billing desk calculate student targets?",
      a: "Administrators can assign unified targets (Tuition Fee, Sports Fee, Lab Fee, Accessories) to specific grades or students. The system generates invoices dynamically and audits transaction logs instantly upon payment."
    },
    {
      q: "Can teachers edit student marks after upload?",
      a: "Yes. The report card form has an updates-enabled design. Teachers can re-enter student roll numbers to overwrite incorrect subject marks or update remarks directly."
    },
    {
      q: "Is there a custom timetable scheduler for teachers and students?",
      a: "Absolutely. The Time Management module supports general class-wise schedules, teacher-specific timetables, and custom individual student schedule inputs."
    },
    {
      q: "How secure is the credential-based role authentication?",
      a: "Apex Academy uses enterprise-grade JWT (JSON Web Token) authentication. User access control filters authenticate role-based boundaries on every API request."
    }
  ];

  return (
    <div style={{ 
      backgroundColor: '#090d16', 
      color: '#f8fafc', 
      minHeight: '100vh', 
      fontFamily: "'Outfit', 'Inter', sans-serif",
      overflowX: 'hidden'
    }}>
      {/* Background Tech Mesh SVG Overlay */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '700px',
        backgroundImage: 'radial-gradient(circle at 50% 120px, rgba(99, 102, 241, 0.15), transparent 60%), radial-gradient(circle at 10% 200px, rgba(59, 130, 246, 0.1), transparent 40%)',
        zIndex: 0,
        pointerEvents: 'none'
      }}></div>

      {/* Navigation Header */}
      <header style={{ 
        position: 'sticky', 
        top: 0, 
        zIndex: 1000, 
        backgroundColor: '#0f172a', 
        borderBottom: '1px solid #1e293b',
        padding: '1.25rem 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', zIndex: 10 }} onClick={() => navigate('/')}>
          <div style={{ 
            background: 'linear-gradient(135deg, #6366f1, #3b82f6)', 
            padding: '0.5rem', 
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <GraduationCap size={22} color="#ffffff" />
          </div>
          <span style={{ fontSize: '1.3rem', fontWeight: 800, letterSpacing: '-0.025em', color: '#ffffff' }}>
            APEX ACADEMY
          </span>
        </div>

        <nav style={{ display: 'flex', gap: '2rem', alignItems: 'center', zIndex: 10 }}>
          <a href="#features" style={{ color: '#94a3b8', textDecoration: 'none', fontWeight: 500, fontSize: '0.95rem', transition: 'color 0.2s' }} onMouseEnter={(e) => e.target.style.color = '#ffffff'} onMouseLeave={(e) => e.target.style.color = '#94a3b8'}>Features</a>
          <a href="#demo" style={{ color: '#94a3b8', textDecoration: 'none', fontWeight: 500, fontSize: '0.95rem', transition: 'color 0.2s' }} onMouseEnter={(e) => e.target.style.color = '#ffffff'} onMouseLeave={(e) => e.target.style.color = '#94a3b8'}>Interactive Demo</a>
          <a href="#pathways" style={{ color: '#94a3b8', textDecoration: 'none', fontWeight: 500, fontSize: '0.95rem', transition: 'color 0.2s' }} onMouseEnter={(e) => e.target.style.color = '#ffffff'} onMouseLeave={(e) => e.target.style.color = '#94a3b8'}>Portal Roles</a>
          <a href="#faq" style={{ color: '#94a3b8', textDecoration: 'none', fontWeight: 500, fontSize: '0.95rem', transition: 'color 0.2s' }} onMouseEnter={(e) => e.target.style.color = '#ffffff'} onMouseLeave={(e) => e.target.style.color = '#94a3b8'}>FAQ</a>
        </nav>

        <div style={{ display: 'flex', gap: '1rem', zIndex: 10 }}>
          {isAuthenticated ? (
            <button 
              onClick={() => navigate(getDashboardPath())} 
              className="btn btn-primary"
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.65rem 1.35rem', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, border: 'none', background: 'linear-gradient(135deg, #6366f1, #3b82f6)' }}
            >
              <span>Go to Dashboard</span>
              <ArrowRight size={16} />
            </button>
          ) : (
            <>
              <button 
                onClick={() => navigate('/login')} 
                style={{ 
                  background: 'transparent', 
                  color: '#ffffff', 
                  border: '1px solid #334155', 
                  padding: '0.65rem 1.35rem', 
                  borderRadius: '8px', 
                  cursor: 'pointer',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  transition: 'border-color 0.2s, background-color 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.target.style.borderColor = '#6366f1';
                  e.target.style.backgroundColor = 'rgba(99, 102, 241, 0.05)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.borderColor = '#334155';
                  e.target.style.backgroundColor = 'transparent';
                }}
              >
                <LogIn size={16} />
                <span>Sign In</span>
              </button>
              <button 
                onClick={() => navigate('/register')} 
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.5rem', 
                  padding: '0.65rem 1.35rem', 
                  borderRadius: '8px', 
                  cursor: 'pointer', 
                  fontWeight: 600,
                  border: 'none',
                  background: 'linear-gradient(135deg, #6366f1, #3b82f6)',
                  color: '#ffffff'
                }}
              >
                <UserPlus size={16} />
                <span>Register</span>
              </button>
            </>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section style={{ 
        padding: '6rem 2rem 5rem 2rem',
        maxWidth: '1240px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: '1fr 1.1fr',
        gap: '4rem',
        alignItems: 'center',
        position: 'relative',
        zIndex: 10
      }}>
        <div>
          {/* Animated pulsing pill */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', backgroundColor: '#1e1b4b', color: '#a5b4fc', padding: '0.4rem 0.9rem', borderRadius: '30px', fontSize: '0.8rem', fontWeight: 600, marginBottom: '1.5rem', border: '1px solid #3730a3' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10b981', display: 'inline-block', boxShadow: '0 0 8px #10b981' }}></span>
            <span>ENTERPRISE MANAGEMENT READY</span>
          </div>

          <h1 style={{ 
            fontSize: '3.75rem', 
            lineHeight: 1.1, 
            fontWeight: 900, 
            marginBottom: '1.5rem',
            letterSpacing: '-0.035em'
          }}>
            The Operating System <br />
            For <span style={{ background: 'linear-gradient(to right, #6366f1, #3b82f6, #10b981)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Modern Schools</span>
          </h1>
          <p style={{ 
            fontSize: '1.15rem', 
            color: '#94a3b8', 
            lineHeight: 1.6, 
            marginBottom: '2.5rem',
            maxWidth: '540px'
          }}>
            Apex Academy is a high-performance administration portal that unifies schedules, salaries, student directories, and billing targets in one dashboard.
          </p>

          <div style={{ display: 'flex', gap: '1.25rem' }}>
            <button 
              onClick={() => navigate(isAuthenticated ? getDashboardPath() : '/login')}
              style={{ 
                background: 'linear-gradient(135deg, #6366f1, #3b82f6)',
                color: '#ffffff',
                border: 'none',
                padding: '0.9rem 1.85rem',
                borderRadius: '8px',
                fontSize: '1rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                boxShadow: '0 4px 16px rgba(99, 102, 241, 0.35)'
              }}
            >
              <span>Access Control Portal</span>
              <ArrowRight size={18} />
            </button>
            <button 
              onClick={() => navigate('/register')}
              style={{ 
                background: '#111827',
                color: '#ffffff',
                border: '1px solid #374151',
                padding: '0.9rem 1.85rem',
                borderRadius: '8px',
                fontSize: '1rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'border-color 0.2s, background-color 0.2s'
              }}
              onMouseEnter={(e) => {
                e.target.style.borderColor = '#6366f1';
                e.target.style.backgroundColor = '#1f2937';
              }}
              onMouseLeave={(e) => {
                e.target.style.borderColor = '#374151';
                e.target.style.backgroundColor = '#111827';
              }}
            >
              Create Account
            </button>
          </div>
        </div>

        {/* Hero Interactive Screen Preview (NO glassmorphism, solid cards) */}
        <div id="demo" style={{ 
          backgroundColor: '#111827', 
          borderRadius: '12px', 
          border: '1px solid #374151',
          overflow: 'hidden',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.6)'
        }}>
          {/* Top Window Bar */}
          <div style={{ 
            backgroundColor: '#1f2937', 
            padding: '0.85rem 1.25rem', 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            borderBottom: '1px solid #374151'
          }}>
            <div style={{ display: 'flex', gap: '0.4rem' }}>
              <div style={{ width: '11px', height: '11px', borderRadius: '50%', backgroundColor: '#ef4444' }}></div>
              <div style={{ width: '11px', height: '11px', borderRadius: '50%', backgroundColor: '#eab308' }}></div>
              <div style={{ width: '11px', height: '11px', borderRadius: '50%', backgroundColor: '#22c55e' }}></div>
            </div>
            <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600, letterSpacing: '0.05em' }}>APEX SYSTEM INTERACTIVE PREVIEW</span>
            <div style={{ width: '30px' }}></div>
          </div>

          {/* Inner Interactive Navigation Tabs */}
          <div style={{ 
            display: 'flex', 
            backgroundColor: '#0b0f19', 
            borderBottom: '1px solid #374151'
          }}>
            <button 
              onClick={() => setMockTab('timetable')}
              style={{
                flex: 1,
                padding: '0.85rem',
                background: mockTab === 'timetable' ? '#111827' : 'transparent',
                color: mockTab === 'timetable' ? '#6366f1' : '#64748b',
                border: 'none',
                borderBottom: mockTab === 'timetable' ? '2px solid #6366f1' : 'none',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: '0.85rem'
              }}
            >
              Time Scheduler
            </button>
            <button 
              onClick={() => setMockTab('salary')}
              style={{
                flex: 1,
                padding: '0.85rem',
                background: mockTab === 'salary' ? '#111827' : 'transparent',
                color: mockTab === 'salary' ? '#10b981' : '#64748b',
                border: 'none',
                borderBottom: mockTab === 'salary' ? '2px solid #10b981' : 'none',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: '0.85rem'
              }}
            >
              Salary Ledger
            </button>
            <button 
              onClick={() => setMockTab('grades')}
              style={{
                flex: 1,
                padding: '0.85rem',
                background: mockTab === 'grades' ? '#111827' : 'transparent',
                color: mockTab === 'grades' ? '#3b82f6' : '#64748b',
                border: 'none',
                borderBottom: mockTab === 'grades' ? '2px solid #3b82f6' : 'none',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: '0.85rem'
              }}
            >
              Report Card Form
            </button>
          </div>

          {/* Interactive Screen Body */}
          <div style={{ padding: '1.5rem', minHeight: '260px', backgroundColor: '#0f172a' }}>
            {mockTab === 'timetable' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div style={{ display: 'flex', justifyContext: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>Active Weekly Schedule (Grade 10-A)</span>
                  <span style={{ fontSize: '0.7rem', color: '#c7d2fe', backgroundColor: '#312e81', padding: '0.15rem 0.4rem', borderRadius: '4px', border: '1px solid #4338ca' }}>Admin Sync Status: OK</span>
                </div>
                
                {/* Schedule Table Mockup */}
                <div style={{ 
                  border: '1px solid #1e293b', 
                  borderRadius: '6px', 
                  overflow: 'hidden', 
                  fontSize: '0.8rem' 
                }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr 2fr', backgroundColor: '#1e293b', padding: '0.5rem', fontWeight: 600 }}>
                    <div>Time</div>
                    <div>Monday</div>
                    <div>Wednesday</div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr 2fr', padding: '0.5rem', borderBottom: '1px solid #1e293b' }}>
                    <div style={{ color: '#94a3b8' }}>09:00 AM</div>
                    <div style={{ color: '#818cf8', fontWeight: 600 }}>Mathematics</div>
                    <div style={{ color: '#34d399', fontWeight: 600 }}>Physics Lab</div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr 2fr', padding: '0.5rem' }}>
                    <div style={{ color: '#94a3b8' }}>11:30 AM</div>
                    <div style={{ color: '#fca5a5', fontWeight: 600 }}>Chemistry</div>
                    <div style={{ color: '#60a5fa', fontWeight: 600 }}>Computer Sci.</div>
                  </div>
                </div>
              </div>
            )}

            {mockTab === 'salary' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>Faculty Compensation Ledger (Direct Update Panel)</span>
                
                {/* Pay Summary Cards */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
                  <div style={{ backgroundColor: '#111827', padding: '0.75rem', borderRadius: '6px', border: '1px solid #1e293b' }}>
                    <div style={{ fontSize: '0.7rem', color: '#64748b' }}>Basic Salary</div>
                    <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#f8fafc', marginTop: '0.15rem' }}>Rs. 65,000.00</div>
                  </div>
                  <div style={{ backgroundColor: '#111827', padding: '0.75rem', borderRadius: '6px', border: '1px solid #1e293b' }}>
                    <div style={{ fontSize: '0.7rem', color: '#64748b' }}>Allowances</div>
                    <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#10b981', marginTop: '0.15rem' }}>+ Rs. 8,500.00</div>
                  </div>
                  <div style={{ backgroundColor: '#111827', padding: '0.75rem', borderRadius: '6px', border: '1px solid #1e293b' }}>
                    <div style={{ fontSize: '0.7rem', color: '#64748b' }}>Deductions</div>
                    <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#ef4444', marginTop: '0.15rem' }}>- Rs. 3,200.00</div>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#111827', padding: '0.6rem 0.85rem', borderRadius: '6px', border: '1px solid #1e293b', marginTop: '0.25rem' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>Total Net Pay: Rs. 70,300.00</span>
                  <button style={{ backgroundColor: '#10b981', color: '#ffffff', border: 'none', padding: '0.25rem 0.6rem', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 600, cursor: 'pointer' }}>Apply Change</button>
                </div>
              </div>
            )}

            {mockTab === 'grades' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>Upload Student Marks (Dynamic Report Card API)</span>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div>
                    <label style={{ fontSize: '0.7rem', color: '#94a3b8', display: 'block', marginBottom: '0.25rem' }}>Roll Number</label>
                    <input type="text" value="ROLL-102" disabled style={{ width: '100%', backgroundColor: '#111827', border: '1px solid #1e293b', padding: '0.4rem', borderRadius: '4px', color: '#f8fafc', fontSize: '0.75rem' }} />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.7rem', color: '#94a3b8', display: 'block', marginBottom: '0.25rem' }}>Subject Marks</label>
                    <input type="text" value="92.5% (Grade A+)" disabled style={{ width: '100%', backgroundColor: '#111827', border: '1px solid #1e293b', padding: '0.4rem', borderRadius: '4px', color: '#f8fafc', fontSize: '0.75rem' }} />
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: '0.7rem', color: '#94a3b8', display: 'block', marginBottom: '0.25rem' }}>Remarks</label>
                  <input type="text" value="Consistent academic output across exams." disabled style={{ width: '100%', backgroundColor: '#111827', border: '1px solid #1e293b', padding: '0.4rem', borderRadius: '4px', color: '#f8fafc', fontSize: '0.75rem' }} />
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.25rem' }}>
                  <button style={{ backgroundColor: '#3b82f6', color: '#ffffff', border: 'none', padding: '0.4rem 1rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}>Upload & Sync</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Advanced Solid Grid Features Section */}
      <section id="features" style={{ 
        padding: '6rem 2rem',
        maxWidth: '1240px',
        margin: '0 auto',
        position: 'relative',
        zIndex: 10
      }}>
        <div style={{ textAlign: 'center', marginBottom: '4.5rem' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '1rem', letterSpacing: '-0.025em' }}>
            Built For Enterprise Operations
          </h2>
          <p style={{ color: '#94a3b8', maxWidth: '640px', margin: '0 auto', fontSize: '1.05rem', lineHeight: 1.6 }}>
            Apex Academy is equipped with state-of-the-art database pipelines and interactive control consoles to handle complete campus structures.
          </p>
        </div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(3, 1fr)', 
          gap: '2rem' 
        }}>
          {/* Card 1 */}
          <div style={{ 
            backgroundColor: '#111827', 
            borderRadius: '10px', 
            padding: '2.25rem 2rem', 
            border: '1px solid #1e293b',
            boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
            transition: 'border-color 0.2s, transform 0.2s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = '#6366f1';
            e.currentTarget.style.transform = 'translateY(-4px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = '#1e293b';
            e.currentTarget.style.transform = 'none';
          }}>
            <div style={{ display: 'inline-flex', padding: '0.6rem', borderRadius: '8px', backgroundColor: 'rgba(99,102,241,0.1)', color: '#6366f1', marginBottom: '1.5rem' }}>
              <Clock size={26} />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem' }}>Scheduler Console</h3>
            <p style={{ color: '#94a3b8', lineHeight: 1.5, fontSize: '0.9rem', margin: 0 }}>
              Plan class periods, associate subjects, and schedule custom teacher/student hours dynamically.
            </p>
          </div>

          {/* Card 2 */}
          <div style={{ 
            backgroundColor: '#111827', 
            borderRadius: '10px', 
            padding: '2.25rem 2rem', 
            border: '1px solid #1e293b',
            boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
            transition: 'border-color 0.2s, transform 0.2s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = '#10b981';
            e.currentTarget.style.transform = 'translateY(-4px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = '#1e293b';
            e.currentTarget.style.transform = 'none';
          }}>
            <div style={{ display: 'inline-flex', padding: '0.6rem', borderRadius: '8px', backgroundColor: 'rgba(16,185,129,0.1)', color: '#10b981', marginBottom: '1.5rem' }}>
              <DollarSign size={26} />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem' }}>Salary Ledger</h3>
            <p style={{ color: '#94a3b8', lineHeight: 1.5, fontSize: '0.9rem', margin: 0 }}>
              Adjust faculty basic packages, audit allowances, and process salary logs from a single full-page control.
            </p>
          </div>

          {/* Card 3 */}
          <div style={{ 
            backgroundColor: '#111827', 
            borderRadius: '10px', 
            padding: '2.25rem 2rem', 
            border: '1px solid #1e293b',
            boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
            transition: 'border-color 0.2s, transform 0.2s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = '#3b82f6';
            e.currentTarget.style.transform = 'translateY(-4px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = '#1e293b';
            e.currentTarget.style.transform = 'none';
          }}>
            <div style={{ display: 'inline-flex', padding: '0.6rem', borderRadius: '8px', backgroundColor: 'rgba(59,130,246,0.1)', color: '#3b82f6', marginBottom: '1.5rem' }}>
              <Award size={26} />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem' }}>Report Card Desk</h3>
            <p style={{ color: '#94a3b8', lineHeight: 1.5, fontSize: '0.9rem', margin: 0 }}>
              Upload scores directly to student roll numbers and add custom course subjects in real-time.
            </p>
          </div>

          {/* Card 4 */}
          <div style={{ 
            backgroundColor: '#111827', 
            borderRadius: '10px', 
            padding: '2.25rem 2rem', 
            border: '1px solid #1e293b',
            boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
            transition: 'border-color 0.2s, transform 0.2s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = '#a855f7';
            e.currentTarget.style.transform = 'translateY(-4px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = '#1e293b';
            e.currentTarget.style.transform = 'none';
          }}>
            <div style={{ display: 'inline-flex', padding: '0.6rem', borderRadius: '8px', backgroundColor: 'rgba(168,85,247,0.1)', color: '#a855f7', marginBottom: '1.5rem' }}>
              <BookOpen size={26} />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem' }}>Assignments Module</h3>
            <p style={{ color: '#94a3b8', lineHeight: 1.5, fontSize: '0.9rem', margin: 0 }}>
              Post guidelines and homework tasks. Track academic submissions from the teacher or student console.
            </p>
          </div>

          {/* Card 5 */}
          <div style={{ 
            backgroundColor: '#111827', 
            borderRadius: '10px', 
            padding: '2.25rem 2rem', 
            border: '1px solid #1e293b',
            boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
            transition: 'border-color 0.2s, transform 0.2s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = '#fb923c';
            e.currentTarget.style.transform = 'translateY(-4px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = '#1e293b';
            e.currentTarget.style.transform = 'none';
          }}>
            <div style={{ display: 'inline-flex', padding: '0.6rem', borderRadius: '8px', backgroundColor: 'rgba(251,146,60,0.1)', color: '#fb923c', marginBottom: '1.5rem' }}>
              <Users size={26} />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem' }}>Integrated Rosters</h3>
            <p style={{ color: '#94a3b8', lineHeight: 1.5, fontSize: '0.9rem', margin: 0 }}>
              Search and filter database directories containing user profile details, roles, and registrations.
            </p>
          </div>

          {/* Card 6 */}
          <div style={{ 
            backgroundColor: '#111827', 
            borderRadius: '10px', 
            padding: '2.25rem 2rem', 
            border: '1px solid #1e293b',
            boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
            transition: 'border-color 0.2s, transform 0.2s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = '#f43f5e';
            e.currentTarget.style.transform = 'translateY(-4px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = '#1e293b';
            e.currentTarget.style.transform = 'none';
          }}>
            <div style={{ display: 'inline-flex', padding: '0.6rem', borderRadius: '8px', backgroundColor: 'rgba(244,63,94,0.1)', color: '#f43f5e', marginBottom: '1.5rem' }}>
              <Shield size={26} />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem' }}>Automated Billing</h3>
            <p style={{ color: '#94a3b8', lineHeight: 1.5, fontSize: '0.9rem', margin: 0 }}>
              Create tuition, hostel, and sports fee bills. Accept payments and audit logs instantly.
            </p>
          </div>
        </div>
      </section>

      {/* Role Pathways Showcase (Solid design, no glassmorphism) */}
      <section id="pathways" style={{ 
        backgroundColor: '#0f172a', 
        borderTop: '1px solid #1e293b',
        borderBottom: '1px solid #1e293b',
        padding: '6rem 2rem',
        position: 'relative',
        zIndex: 10
      }}>
        <div style={{ 
          maxWidth: '1240px', 
          margin: '0 auto' 
        }}>
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '1rem', letterSpacing: '-0.025em' }}>
              Targeted Role Pathways
            </h2>
            <p style={{ color: '#94a3b8', maxWidth: '600px', margin: '0 auto', fontSize: '1.05rem' }}>
              Select a portal perspective to verify specific actions and interface modules.
            </p>
          </div>

          {/* Role tabs switcher */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            gap: '1rem', 
            marginBottom: '3rem' 
          }}>
            {['admin', 'teacher', 'student'].map(role => (
              <button 
                key={role}
                onClick={() => setActiveRoleTab(role)}
                style={{
                  background: activeRoleTab === role ? 'linear-gradient(135deg, #6366f1, #3b82f6)' : '#111827',
                  color: '#ffffff',
                  border: activeRoleTab === role ? 'none' : '1px solid #374151',
                  padding: '0.75rem 1.75rem',
                  borderRadius: '8px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontSize: '0.95rem'
                }}
              >
                {role === 'admin' ? 'Administrators' : role === 'teacher' ? 'Educators' : 'Students'}
              </button>
            ))}
          </div>

          {/* Pathway Content Panel */}
          <div style={{ 
            backgroundColor: '#111827', 
            borderRadius: '12px', 
            border: '1px solid #1e293b',
            padding: '3rem',
            display: 'grid',
            gridTemplateColumns: '1.3fr 1fr',
            gap: '4rem',
            alignItems: 'center'
          }}>
            <div>
              {activeRoleTab === 'admin' && (
                <>
                  <h3 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '1.25rem', color: '#6366f1' }}>
                    Centralized Operations & Billing Console
                  </h3>
                  <p style={{ color: '#94a3b8', lineHeight: 1.6, marginBottom: '2rem', fontSize: '1rem' }}>
                    Apex Academy provides administrative personnel with tools to enroll students, register educators, configure weekly schedules, and manage school cash flows securely.
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                      <CheckCircle2 size={18} color="#10b981" />
                      <span style={{ fontWeight: 500, fontSize: '0.95rem' }}>Configure basic salary packages, allowances, and deductions</span>
                    </div>
                    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                      <CheckCircle2 size={18} color="#10b981" />
                      <span style={{ fontWeight: 500, fontSize: '0.95rem' }}>Apply student billing targets and review transactions audit logs</span>
                    </div>
                    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                      <CheckCircle2 size={18} color="#10b981" />
                      <span style={{ fontWeight: 500, fontSize: '0.95rem' }}>Manage weekly class schedules, teacher, and student hours</span>
                    </div>
                  </div>
                </>
              )}

              {activeRoleTab === 'teacher' && (
                <>
                  <h3 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '1.25rem', color: '#10b981' }}>
                    Academic Control & Report Card Builder
                  </h3>
                  <p style={{ color: '#94a3b8', lineHeight: 1.6, marginBottom: '2rem', fontSize: '1rem' }}>
                    Teachers can manage daily lecture times, assign homework details, design custom course subjects, and upload score marks directly to student roll numbers.
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                      <CheckCircle2 size={18} color="#10b981" />
                      <span style={{ fontWeight: 500, fontSize: '0.95rem' }}>Register custom teaching subjects dynamically</span>
                    </div>
                    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                      <CheckCircle2 size={18} color="#10b981" />
                      <span style={{ fontWeight: 500, fontSize: '0.95rem' }}>Overwrite or correct errors in report card mark logs</span>
                    </div>
                    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                      <CheckCircle2 size={18} color="#10b981" />
                      <span style={{ fontWeight: 500, fontSize: '0.95rem' }}>Audit weekly teaching schedule and personal salary details</span>
                    </div>
                  </div>
                </>
              )}

              {activeRoleTab === 'student' && (
                <>
                  <h3 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '1.25rem', color: '#3b82f6' }}>
                    Interactive Student Dashboard
                  </h3>
                  <p style={{ color: '#94a3b8', lineHeight: 1.6, marginBottom: '2rem', fontSize: '1rem' }}>
                    Students gain complete visibility into academic status logs, homework tasks, classroom schedule times, and printed transaction history.
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                      <CheckCircle2 size={18} color="#10b981" />
                      <span style={{ fontWeight: 500, fontSize: '0.95rem' }}>Check assigned weekly schedules and classes details</span>
                    </div>
                    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                      <CheckCircle2 size={18} color="#10b981" />
                      <span style={{ fontWeight: 500, fontSize: '0.95rem' }}>View report cards, grades status, and faculty remarks</span>
                    </div>
                    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                      <CheckCircle2 size={18} color="#10b981" />
                      <span style={{ fontWeight: 500, fontSize: '0.95rem' }}>Audit billing payments and review digital invoices</span>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Quick Action Side Panel */}
            <div style={{ 
              backgroundColor: '#0f172a', 
              borderRadius: '8px', 
              padding: '2.5rem 2rem', 
              border: '1px solid #1e293b',
              textAlign: 'center'
            }}>
              <h4 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.75rem' }}>Sign In to Your Workspace</h4>
              <p style={{ color: '#64748b', fontSize: '0.85rem', lineHeight: 1.5, marginBottom: '1.75rem' }}>
                Access dashboard resources using your registered mobile number and DOB credentials.
              </p>
              <button 
                onClick={() => navigate('/login')}
                style={{ 
                  background: 'linear-gradient(135deg, #6366f1, #3b82f6)',
                  color: '#ffffff',
                  border: 'none',
                  padding: '0.8rem 1.5rem',
                  borderRadius: '6px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem'
                }}
              >
                <span>Access Console</span>
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Advanced Interactive FAQ Section */}
      <section id="faq" style={{ 
        padding: '6rem 2rem',
        maxWidth: '900px',
        margin: '0 auto',
        position: 'relative',
        zIndex: 10
      }}>
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '1rem', letterSpacing: '-0.025em' }}>
            Frequently Asked Questions
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '1.05rem' }}>
            Got questions about operating boundaries or portal settings? We have answers.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {faqs.map((faq, index) => (
            <div 
              key={index}
              style={{ 
                backgroundColor: '#111827', 
                borderRadius: '8px', 
                border: '1px solid #1e293b', 
                overflow: 'hidden'
              }}
            >
              <button
                onClick={() => toggleFaq(index)}
                style={{
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '1.25rem 1.5rem',
                  background: 'transparent',
                  border: 'none',
                  color: '#ffffff',
                  textAlign: 'left',
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: '1rem'
                }}
              >
                <span>{faq.q}</span>
                <span style={{ color: '#6366f1', fontSize: '1.2rem', fontWeight: 400 }}>
                  {openFaq === index ? '−' : '+'}
                </span>
              </button>
              
              {openFaq === index && (
                <div style={{ 
                  padding: '0 1.5rem 1.25rem 1.5rem', 
                  color: '#94a3b8', 
                  fontSize: '0.95rem', 
                  lineHeight: 1.5,
                  borderTop: '1px solid #1e293b',
                  paddingTop: '1rem'
                }}>
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Advanced Newsletter Block */}
      <section id="newsletter" style={{ 
        backgroundColor: '#111827',
        borderTop: '1px solid #1e293b',
        borderBottom: '1px solid #1e293b',
        padding: '5.5rem 2rem',
        position: 'relative',
        zIndex: 10
      }}>
        <div style={{ 
          maxWidth: '760px', 
          margin: '0 auto', 
          textAlign: 'center' 
        }}>
          <h2 style={{ fontSize: '2.2rem', fontWeight: 900, marginBottom: '1rem', letterSpacing: '-0.025em' }}>
            Subscribe to Academic Notices
          </h2>
          <p style={{ color: '#94a3b8', marginBottom: '2.5rem', fontSize: '1.05rem', lineHeight: 1.5 }}>
            Stay updated with term holidays, timetable releases, and fee payment deadlines.
          </p>

          {newsletterSubscribed ? (
            <div style={{ 
              backgroundColor: 'rgba(16, 185, 129, 0.15)', 
              color: '#a7f3d0', 
              padding: '1rem 2.25rem', 
              borderRadius: '8px', 
              border: '1px solid #10b981',
              display: 'inline-block',
              fontSize: '1rem',
              fontWeight: 600
            }}>
              ✓ Thank you! You have successfully subscribed to campus news alerts.
            </div>
          ) : (
            <form onSubmit={handleNewsletterSubmit} style={{ 
              display: 'flex', 
              gap: '1rem', 
              justifyContent: 'center',
              flexWrap: 'wrap'
            }}>
              <input 
                type="email" 
                placeholder="Enter your email address" 
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                required
                style={{ 
                  backgroundColor: '#0f172a',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  padding: '0.9rem 1.25rem',
                  color: '#ffffff',
                  fontSize: '1rem',
                  minWidth: '320px',
                  outline: 'none'
                }}
              />
              <button 
                type="submit" 
                style={{ 
                  background: 'linear-gradient(135deg, #6366f1, #3b82f6)',
                  color: '#ffffff',
                  border: 'none',
                  padding: '0.9rem 1.85rem',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(99, 102, 241, 0.25)'
                }}
              >
                Subscribe Now
              </button>
            </form>
          )}
        </div>
      </section>

      {/* Footer Block */}
      <footer style={{ 
        padding: '5rem 2rem 2.5rem 2rem',
        backgroundColor: '#090d16',
        borderTop: '1px solid #1e293b',
        position: 'relative',
        zIndex: 10
      }}>
        <div style={{ 
          maxWidth: '1240px', 
          margin: '0 auto', 
          display: 'grid', 
          gridTemplateColumns: '1.5fr 1fr 1.2fr', 
          gap: '5rem',
          marginBottom: '4rem'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
              <div style={{ 
                background: 'linear-gradient(135deg, #6366f1, #3b82f6)', 
                padding: '0.45rem', 
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <GraduationCap size={20} color="#ffffff" />
              </div>
              <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#ffffff' }}>APEX ACADEMY</span>
            </div>
            <p style={{ color: '#64748b', fontSize: '0.9rem', lineHeight: 1.6, margin: 0 }}>
              Leading the digital transformation of educational systems through secure database registries, automated timetables, and integrated fee desks.
            </p>
          </div>

          <div>
            <h4 style={{ color: '#ffffff', fontSize: '0.95rem', fontWeight: 700, marginBottom: '1.25rem', letterSpacing: '0.05em' }}>NAVIGATION</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.9rem' }}>
              <a href="#features" style={{ color: '#64748b', textDecoration: 'none' }} onMouseEnter={(e) => e.target.style.color = '#ffffff'} onMouseLeave={(e) => e.target.style.color = '#64748b'}>Core Features</a>
              <a href="#demo" style={{ color: '#64748b', textDecoration: 'none' }} onMouseEnter={(e) => e.target.style.color = '#ffffff'} onMouseLeave={(e) => e.target.style.color = '#64748b'}>Interactive Demo</a>
              <a href="#pathways" style={{ color: '#64748b', textDecoration: 'none' }} onMouseEnter={(e) => e.target.style.color = '#ffffff'} onMouseLeave={(e) => e.target.style.color = '#64748b'}>Pathways</a>
              <a href="/login" style={{ color: '#64748b', textDecoration: 'none' }} onMouseEnter={(e) => e.target.style.color = '#ffffff'} onMouseLeave={(e) => e.target.style.color = '#64748b'}>Sign In Portal</a>
            </div>
          </div>

          <div>
            <h4 style={{ color: '#ffffff', fontSize: '0.95rem', fontWeight: 700, marginBottom: '1.25rem', letterSpacing: '0.05em' }}>GET IN TOUCH</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.9rem', color: '#64748b' }}>
              <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
                <MapPin size={16} />
                <span>Sector-62, Institutional Area, Noida, UP</span>
              </div>
              <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
                <Phone size={16} />
                <span>+91 120 445 6678</span>
              </div>
              <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
                <Mail size={16} />
                <span>support@apexacademy.edu</span>
              </div>
            </div>
          </div>
        </div>

        <div style={{ 
          maxWidth: '1240px', 
          margin: '0 auto', 
          borderTop: '1px solid #1e293b', 
          paddingTop: '2rem', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          fontSize: '0.85rem',
          color: '#64748b'
        }}>
          <span>© 2026 Apex Academy Inc. All rights reserved.</span>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <a href="#" style={{ color: '#64748b', textDecoration: 'none' }}>Privacy Policy</a>
            <a href="#" style={{ color: '#64748b', textDecoration: 'none' }}>Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
