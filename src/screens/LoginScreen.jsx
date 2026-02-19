import React, { useState } from 'react';
import { auth } from '../firebase/config';
import { signInWithEmailAndPassword } from 'firebase/auth';

const LoginScreen = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      onLoginSuccess();
    } catch (error) {
      alert("Login failed: " + error.message);
    }
  };

  return (
    <div style={styles.webContainer}>
      {/* LEFT SIDE: Immersive Branding */}
      <div style={styles.visualSide}>
        <div style={styles.overlay}>
          <h1 style={styles.branding}>SimpleGameFinder</h1>
          <p style={styles.tagline}>Stop scrolling. Start playing.</p>
        </div>
      </div>

      {/* RIGHT SIDE: Full-width Form Section */}
      <div style={styles.formSide}>
        <div style={styles.formCard}>
          <h2 style={styles.title}>Welcome Back</h2>
          <p style={styles.subtitle}>Enter your details to access your dashboard</p>

          <form onSubmit={handleLogin} style={styles.form}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Email Address</label>
              <input 
                type="email" 
                placeholder="name@example.com" 
                style={styles.input}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Password</label>
              <input 
                type="password" 
                placeholder="••••••••" 
                style={styles.input}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" style={styles.loginBtn}>Sign In</button>
          </form>

          <div style={styles.divider}><span>OR</span></div>

          <div style={styles.socialGrid}>
            <button style={styles.socialBtn}>Google</button>
            <button style={styles.socialBtn}>Apple ID</button>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  webContainer: { 
    display: 'flex', 
    width: '100vw', // Occupy full viewport width
    height: '100vh', 
    backgroundColor: '#050A15', 
    color: '#fff',
    overflow: 'hidden'
  },
  visualSide: { 
    flex: 1.5, // Takes up 60% of the screen
    background: 'linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url("https://images.unsplash.com/photo-1542751371-adc38448a05e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80")',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  overlay: { textAlign: 'center', padding: '0 20px' },
  branding: { fontSize: '56px', fontWeight: '900', letterSpacing: '-2px', margin: 0 },
  tagline: { fontSize: '22px', color: '#00D1FF', marginTop: '10px' },
  
  formSide: { 
    flex: 1, // Takes up 40% of the screen
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center', 
    backgroundColor: '#0D1421', // Dark background for the form area
    padding: '40px' 
  },
  formCard: { width: '100%', maxWidth: '400px' },
  title: { fontSize: '32px', marginBottom: '10px' },
  subtitle: { color: '#94A3B8', marginBottom: '30px' },
  inputGroup: { marginBottom: '20px' },
  label: { display: 'block', marginBottom: '8px', fontSize: '14px', color: '#94A3B8' },
  input: { 
    width: '100%', 
    padding: '14px', 
    borderRadius: '12px', 
    border: '1px solid #1E293B', 
    backgroundColor: '#1E293B', 
    color: '#fff', 
    fontSize: '16px',
    boxSizing: 'border-box' 
  },
  loginBtn: { 
    width: '100%', 
    padding: '16px', 
    backgroundColor: '#A2FF00', 
    color: '#000', 
    border: 'none', 
    borderRadius: '12px', 
    fontWeight: 'bold', 
    fontSize: '16px', 
    cursor: 'pointer', 
    marginTop: '10px',
    transition: '0.2s opacity'
  },
  divider: { margin: '30px 0', textAlign: 'center', borderBottom: '1px solid #1E293B', lineHeight: '0.1em' },
  socialGrid: { display: 'flex', gap: '15px' },
  socialBtn: { 
    flex: 1, 
    padding: '12px', 
    backgroundColor: '#1E293B', 
    color: '#fff', 
    border: '1px solid #334155', 
    borderRadius: '12px', 
    cursor: 'pointer',
    fontSize: '14px'
  }
};

export default LoginScreen;