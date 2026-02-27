import React, { useState } from 'react';
import { auth, db } from '../firebase';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword 
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const LoginScreen = ({ onLoginSuccess, onBack }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [step, setStep] = useState(1); // 1: Credentials, 2: Profile Info
  const [loading, setLoading] = useState(false);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [profileData, setProfileData] = useState({ displayName: '', age: '' });
  const [activeUid, setActiveUid] = useState(null);

  // --- EMAIL LOGIN / SIGNUP ---
  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isSignUp) {
        const res = await createUserWithEmailAndPassword(auth, email, password);
        setActiveUid(res.user.uid);
        setStep(2); // Move to Name/Age setup
      } else {
        const res = await signInWithEmailAndPassword(auth, email, password);
        onLoginSuccess(res.user.uid);
      }
    } catch (err) { 
      alert(err.message); 
    } finally {
      setLoading(false);
    }
  };

  // --- SAVE FINAL PROFILE ---
  const finishProfile = async () => {
    if (!profileData.displayName || !profileData.age) return alert("Fill all fields");
    setLoading(true);
    try {
      await setDoc(doc(db, "users", activeUid), {
        displayName: profileData.displayName,
        age: profileData.age,
        uid: activeUid,
        email: email,
        createdAt: new Date().toISOString()
      });
      onLoginSuccess(activeUid);
    } catch (err) { 
      alert("Error saving profile"); 
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.headerRow}>
           <button style={styles.backBtn} onClick={onBack}>← Back</button>
           <h1 style={styles.logo}>🎮 SGF</h1>
        </div>
        
        {step === 1 ? (
          <>
            <h2 style={styles.title}>{isSignUp ? "Create Scout Account" : "Welcome Back"}</h2>
            
            <form onSubmit={handleAuth} style={styles.form}>
              <input 
                style={styles.input} 
                placeholder="Email" 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)} 
                required 
              />
              <input 
                style={styles.input} 
                placeholder="Password" 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)} 
                required 
              />
              <button style={styles.mainBtn} type="submit" disabled={loading}>
                {loading ? "Processing..." : (isSignUp ? "Create Account" : "Log In")}
              </button>
            </form>

            <p style={styles.toggleText} onClick={() => setIsSignUp(!isSignUp)}>
              {isSignUp ? "Already a member? Log In" : "New Scout? Sign Up"}
            </p>
          </>
        ) : (
          <div style={styles.form}>
            <h2 style={styles.title}>Complete Your Profile</h2>
            <label style={styles.label}>What should we call you?</label>
            <input 
              style={styles.input} 
              placeholder="Display Name" 
              onChange={(e) => setProfileData({...profileData, displayName: e.target.value})} 
            />
            <label style={styles.label}>How old are you?</label>
            <input 
              style={styles.input} 
              type="number" 
              placeholder="Age" 
              onChange={(e) => setProfileData({...profileData, age: e.target.value})} 
            />
            <button style={styles.mainBtn} onClick={finishProfile} disabled={loading}>
              {loading ? "Saving..." : "Enter Dashboard"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: { height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#050A15', color: '#fff' },
  card: { padding: '40px', backgroundColor: '#0D1421', borderRadius: '30px', border: '1px solid #1E293B', width: '360px', textAlign: 'center' },
  headerRow: { display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', marginBottom: '10px' },
  backBtn: { position: 'absolute', left: 0, background: 'none', border: 'none', color: '#64748B', cursor: 'pointer', fontSize: '13px' },
  logo: { fontSize: '28px', color: '#00D1FF', margin: 0, fontWeight: 'bold' },
  title: { fontSize: '18px', marginBottom: '25px', fontWeight: '500' },
  form: { display: 'flex', flexDirection: 'column', gap: '15px', textAlign: 'left' },
  label: { fontSize: '11px', color: '#64748B', marginBottom: '-10px', textTransform: 'uppercase' },
  input: { padding: '12px', borderRadius: '10px', border: '1px solid #1E293B', backgroundColor: '#050A15', color: '#fff', outline: 'none' },
  mainBtn: { padding: '14px', borderRadius: '10px', border: 'none', backgroundColor: '#00D1FF', color: '#000', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px' },
  toggleText: { marginTop: '20px', fontSize: '13px', color: '#00D1FF', cursor: 'pointer', textDecoration: 'none' }
};

export default LoginScreen;