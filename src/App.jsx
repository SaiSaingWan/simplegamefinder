import React, { useState } from 'react';
import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import QuizScreen from './screens/QuizScreen';
import ResultsScreen from './screens/ResultsScreen';
import SavedGamesScreen from './screens/SavedGamesScreen';
import ProfileScreen from './screens/ProfileScreen';
import './index.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentScreen, setCurrentScreen] = useState('home');
  const [userChoices, setUserChoices] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e) => {
    if (e.key === 'Enter' && searchQuery.trim() !== "") {
      setUserChoices({ mode: 'search', query: searchQuery });
      setCurrentScreen('results');
      setSearchQuery(""); // Clear bar after search
    }
  };

  if (!isLoggedIn) return <LoginScreen onLoginSuccess={() => setIsLoggedIn(true)} />;

  return (
    <div style={webStyles.dashboardContainer}>
      <nav style={webStyles.sidebar}>
        <div>
          <div style={webStyles.logo}>🎮 SGF</div>
          
          {/* NEW SEARCH BAR */}
          <div style={webStyles.searchContainer}>
            <input 
              style={webStyles.searchInput} 
              placeholder="Quick Search..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearch}
            />
          </div>

          <div style={{...webStyles.navLink, color: currentScreen === 'home' ? '#00D1FF' : '#94A3B8'}} onClick={() => setCurrentScreen('home')}>Home</div>
          <div style={{...webStyles.navLink, color: currentScreen === 'quiz' ? '#00D1FF' : '#94A3B8'}} onClick={() => setCurrentScreen('quiz')}>Take Quiz</div>
          <div style={{...webStyles.navLink, color: currentScreen === 'saved' ? '#00D1FF' : '#94A3B8'}} onClick={() => setCurrentScreen('saved')}>Library</div>
          <div style={{...webStyles.navLink, color: currentScreen === 'profile' ? '#00D1FF' : '#94A3B8'}} onClick={() => setCurrentScreen('profile')}>Profile</div>
        </div>
        <div style={webStyles.logoutBtn} onClick={() => setIsLoggedIn(false)}>Logout</div>
      </nav>

      <main style={webStyles.contentArea}>
        {currentScreen === 'home' && <HomeScreen onStartQuiz={() => setCurrentScreen('quiz')} />}
        {currentScreen === 'quiz' && <QuizScreen onBack={() => setCurrentScreen('home')} onShowResults={(c) => { setUserChoices(c); setCurrentScreen('results'); }} />}
        {currentScreen === 'results' && <ResultsScreen quizResults={userChoices} onBack={() => setCurrentScreen('quiz')} />}
        {currentScreen === 'saved' && <SavedGamesScreen />}
        {currentScreen === 'profile' && <ProfileScreen />}
      </main>
    </div>
  );
}

const webStyles = {
  dashboardContainer: { display: 'flex', width: '100vw', height: '100vh', overflow: 'hidden', backgroundColor: '#050A15' },
  sidebar: { width: '260px', backgroundColor: '#0D1421', padding: '30px 20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', borderRight: '1px solid #1E293B', flexShrink: 0 },
  logo: { fontSize: '24px', fontWeight: 'bold', color: '#00D1FF', marginBottom: '30px' },
  searchContainer: { marginBottom: '30px' },
  searchInput: { width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #1E293B', backgroundColor: '#050A15', color: '#fff', fontSize: '14px', outline: 'none' },
  navLink: { padding: '12px 10px', cursor: 'pointer', fontSize: '16px', borderRadius: '8px', marginBottom: '5px' },
  logoutBtn: { color: '#FF4B4B', cursor: 'pointer', fontWeight: 'bold', padding: '10px' },
  contentArea: { flexGrow: 1, height: '100%', overflowY: 'auto' }
};

export default App;