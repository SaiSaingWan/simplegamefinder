import React, { useState } from 'react';

const QuizScreen = ({ onShowResults, onBack }) => {
  const [selections, setSelections] = useState({
    device: '',
    mood: '',
    genre: '',
    artStyle: '',
    difficulty: '',
    sessionLength: ''
  });

  const categories = [
    { id: 'device', label: 'Primary Device', options: ['PC', 'Console', 'Mobile', 'Handheld'] },
    { id: 'mood', label: 'Current Energy', options: ['Relaxed', 'High Energy', 'Competitive', 'Social'] },
    { id: 'genre', label: 'Preferred Genre', options: ['Action', 'RPG', 'Strategy', 'Simulation', 'Puzzle'] },
    { id: 'artStyle', label: 'Visual Style', options: ['Realistic', 'Stylized', 'Pixel Art', 'Minimalist'] },
    { id: 'difficulty', label: 'Challenge Level', options: ['Casual', 'Intermediate', 'Hardcore'] },
    { id: 'sessionLength', label: 'Available Time', options: ['< 30 mins', '1-3 Hours', 'Marathon'] }
  ];

  const handleSelect = (cat, val) => setSelections({...selections, [cat]: val});
  
  // Calculate Progress Percentage
  const completedCount = Object.values(selections).filter(val => val !== '').length;
  const progressPercent = (completedCount / categories.length) * 100;
  
  const isComplete = completedCount === categories.length;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button onClick={onBack} style={styles.backLink}>← Return to Dashboard</button>
        <h1 style={styles.title}>Game Preference Profile</h1>
        
        {/* PROGRESS BAR CONTAINER */}
        <div style={styles.progressContainer}>
            <div style={styles.progressLabel}>
                <span>Your Profile Progress</span>
                <span>{Math.round(progressPercent)}%</span>
            </div>
            <div style={styles.progressTrack}>
                <div style={{...styles.progressBar, width: `${progressPercent}%`}}></div>
            </div>
        </div>
      </div>

      <div style={styles.quizFlow}>
        {categories.map((cat) => (
          <div key={cat.id} style={styles.section}>
            <h2 style={styles.sectionLabel}>{cat.label}</h2>
            <div style={styles.optionGrid}>
              {cat.options.map((option) => (
                <button 
                  key={option}
                  onClick={() => handleSelect(cat.id, option)}
                  style={selections[cat.id] === option ? styles.activeOption : styles.option}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        ))}

        <div style={styles.footer}>
          <button 
            disabled={!isComplete}
            onClick={() => onShowResults(selections)}
            style={isComplete ? styles.submitBtn : styles.disabledBtn}
          >
            GENERATE RECOMMENDATIONS
          </button>
          {!isComplete && <p style={styles.warning}>Complete all 6 sections to unlock matches.</p>}
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: { padding: '60px 10%', backgroundColor: '#050A15', minHeight: '100vh' },
  header: { marginBottom: '60px', borderLeft: '4px solid #00D1FF', paddingLeft: '30px' },
  backLink: { background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', fontSize: '14px', marginBottom: '15px', textTransform: 'uppercase', letterSpacing: '1px' },
  title: { fontSize: '42px', fontWeight: '800', margin: '0 0 25px 0', color: '#fff' },
  
  // Progress Bar Styles
  progressContainer: { maxWidth: '400px', marginTop: '20px' },
  progressLabel: { display: 'flex', justifyContent: 'space-between', color: '#94A3B8', fontSize: '12px', textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '1px' },
  progressTrack: { width: '100%', height: '4px', backgroundColor: '#1E293B', borderRadius: '10px', overflow: 'hidden' },
  progressBar: { height: '100%', backgroundColor: '#00D1FF', borderRadius: '10px', transition: 'width 0.4s ease-out', boxShadow: '0 0 10px rgba(0, 209, 255, 0.5)' },
  
  quizFlow: { display: 'flex', flexDirection: 'column', gap: '50px' },
  section: { width: '100%' },
  sectionLabel: { color: '#00D1FF', fontSize: '13px', fontWeight: '700', letterSpacing: '2px', marginBottom: '20px', textTransform: 'uppercase' },
  
  optionGrid: { display: 'flex', flexWrap: 'wrap', gap: '12px' },
  option: { padding: '14px 28px', backgroundColor: '#0D1421', color: '#94A3B8', border: '1px solid #1E293B', borderRadius: '8px', cursor: 'pointer', fontSize: '16px', transition: '0.2s' },
  activeOption: { padding: '14px 28px', backgroundColor: '#00D1FF', color: '#000', border: '1px solid #00D1FF', borderRadius: '8px', cursor: 'pointer', fontSize: '16px', fontWeight: '700', boxShadow: '0 0 15px rgba(0, 209, 255, 0.3)' },

  footer: { marginTop: '40px', paddingBottom: '100px', borderTop: '1px solid #1E293B', paddingTop: '50px' },
  submitBtn: { padding: '20px 50px', backgroundColor: '#A2FF00', color: '#000', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '18px', cursor: 'pointer', textTransform: 'uppercase' },
  disabledBtn: { padding: '20px 50px', backgroundColor: '#1E293B', color: '#475569', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '18px', cursor: 'not-allowed', textTransform: 'uppercase' },
  warning: { color: '#475569', marginTop: '15px', fontSize: '14px' }
};

export default QuizScreen;