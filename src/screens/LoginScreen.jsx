import React, { useState } from 'react';
import { auth, googleProvider, db } from '../firebase';
import { 
  signInWithPopup, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword 
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const LoginScreen = ({ onLoginSuccess }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [step, setStep] = useState(1); // 1: Credentials, 2: Profile Info
  const [loading, setLoading] = useState(false);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [profileData, setProfileData] = useState({ displayName: '', age: '' });
  const [activeUid, setActiveUid] = useState(null);

  // --- GOOGLE LOGIN ---
  const handleGoogle = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const userDoc = await getDoc(doc(db, "users", user.uid));

      if (userDoc.exists()) {
        onLoginSuccess(user.uid);
      } else {
        setActiveUid(user.uid);
        setProfileData({ ...profileData, displayName: user.displayName || '' });
        setStep(2);
      }
    } catch (err) { alert(err.message); }
    setLoading(false);
  };

  // --- EMAIL LOGIN / SIGNUP ---
  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isSignUp) {
        const res = await createUserWithEmailAndPassword(auth, email, password);
        setActiveUid(res.user.uid);
        setStep(2); // Go to Name/Age step
      } else {
        const res = await signInWithEmailAndPassword(auth, email, password);
        onLoginSuccess(res.user.uid);
      }
    } catch (err) { alert(err.message); }
    setLoading(false);
  };

  // --- SAVE FINAL PROFILE ---
  const finishProfile = async () => {
    if (!profileData.displayName || !profileData.age) return alert("Fill all fields");
    try {
      await setDoc(doc(db, "users", activeUid), {
        displayName: profileData.displayName,
        age: profileData.age,
        uid: activeUid,
        email: email || auth.currentUser.email
      });
      onLoginSuccess(activeUid);
    } catch (err) { alert("Error saving profile"); }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.logo}>🎮 SGF</h1>
        
        {step === 1 ? (
          <>
            <h2 style={styles.title}>{isSignUp ? "Create Account" : "Welcome Back"}</h2>
            
            <form onSubmit={handleAuth} style={styles.form}>
              <input 
                style={styles.input} 
                placeholder="Email" 
                type="email" 
                onChange={(e) => setEmail(e.target.value)} 
                required 
              />
              <input 
                style={styles.input} 
                placeholder="Password" 
                type="password" 
                onChange={(e) => setPassword(e.target.value)} 
                required 
              />
              <button style={styles.mainBtn} type="submit" disabled={loading}>
                {isSignUp ? "Sign Up" : "Log In"}
              </button>
            </form>

            <div style={styles.divider}>OR</div>

            <button style={styles.googleBtn} onClick={handleGoogle}>
              <img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" style={{width:20}} alt="G" />
              Continue with Google
            </button>

            <p style={styles.toggleText} onClick={() => setIsSignUp(!isSignUp)}>
              {isSignUp ? "Already have an account? Log In" : "Don't have an account? Sign Up"}
            </p>
          </>
        ) : (
          <div style={styles.form}>
            <h2 style={styles.title}>One Last Thing...</h2>
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
            <button style={styles.mainBtn} onClick={finishProfile}>Enter Dashboard</button>
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: { height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#050A15', color: '#fff' },
  card: { padding: '40px', backgroundColor: '#0D1421', borderRadius: '30px', border: '1px solid #1E293B', width: '360px', textAlign: 'center' },
  logo: { fontSize: '32px', color: '#00D1FF', marginBottom: '20px' },
  title: { fontSize: '20px', marginBottom: '25px' },
  form: { display: 'flex', flexDirection: 'column', gap: '15px', textAlign: 'left' },
  label: { fontSize: '11px', color: '#64748B', marginBottom: '-10px', textTransform: 'uppercase' },
  input: { padding: '12px', borderRadius: '10px', border: '1px solid #1E293B', backgroundColor: '#050A15', color: '#fff' },
  mainBtn: { padding: '14px', borderRadius: '10px', border: 'none', backgroundColor: '#00D1FF', color: '#000', fontWeight: 'bold', cursor: 'pointer' },
  googleBtn: { width: '100%', padding: '12px', borderRadius: '10px', border: 'none', backgroundColor: '#fff', color: '#000', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', cursor: 'pointer' },
  divider: { margin: '20px 0', fontSize: '12px', color: '#475569' },
  toggleText: { marginTop: '20px', fontSize: '13px', color: '#00D1FF', cursor: 'pointer', textDecoration: 'underline' }
};

export default LoginScreen;