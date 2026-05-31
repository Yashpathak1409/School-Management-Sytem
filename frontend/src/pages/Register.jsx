import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

const Register = () => {
  return (
    <div className="auth-page">
      <div className="glass-card auth-card animate-fade-in" style={{ textAlign: 'center', padding: '3rem 2rem' }}>
        <div style={{
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          background: 'rgba(245, 158, 11, 0.1)',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--color-warning)',
          marginBottom: '1.5rem'
        }}>
          <ShieldAlert size={36} />
        </div>
        
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', fontWeight: 700 }}>Registration Restricted</h2>
        <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', marginBottom: '2rem' }}>
          Public sign-up is disabled to protect system integrity. Student and Teacher accounts can only be provisioned by school administrators.
        </p>

        <Link to="/login" className="btn btn-secondary" style={{ display: 'inline-flex', width: '100%' }}>
          <ArrowLeft size={16} />
          <span>Return to Sign In</span>
        </Link>
      </div>
    </div>
  );
};

export default Register;
