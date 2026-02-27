import React, { useState, useEffect } from 'react';
import { db, auth } from './firebase';
import { doc, query, where, collection, onSnapshot } from 'firebase/firestore';

// Screens
import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import QuizScreen from './screens/QuizScreen';
import ResultsScreen from './screens/ResultsScreen';
import SavedGamesScreen from './screens/SavedGamesScreen';
import ProfileScreen from './screens/ProfileScreen';
import GameDetailsScreen from './screens/GameDetailsScreen';

function App() {
  // AUTH STATE
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState(null);
  const [authLoading, setAuthLoading] = useState(true); // Added to prevent flicker

  // NAVIGATION & UI STATE
  const [currentScreen, setCurrentScreen] = useState('home');
  const [userChoices, setUserChoices] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGameId, setSelectedGameId] = useState(null);
  
  // SHARED USER PROFILE STATE
  const [userName, setUserName] = useState("Guest");
  const [userLevel, setUserLevel] = useState(1);

  // --- AUTH LISTENER ---
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setIsLoggedIn(true);
        setUserId(user.uid);
      } else {
        setIsLoggedIn(false);
        setUserId(null);
        setUserName("Guest");
        setUserLevel(1);
      }
      setAuthLoading(false);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    let unsubName = () => {};
    let unsubLevel = () => {};

    if (isLoggedIn && userId) {
      const userRef = doc(db, "users", userId);
      unsubName = onSnapshot(userRef, (docSnap) => {
        if (docSnap.exists()) {
          setUserName(docSnap.data().displayName || "Scout");
        }
      });

      const q = query(
        collection(db, "savedGames"), 
        where("userId", "==", userId),
        where("status", "==", "Completed")
      );
      
      unsubLevel = onSnapshot(q, (snapshot) => {
        const completedCount = snapshot.size;
        const calculatedLevel = Math.floor(completedCount / 2) + 1;
        setUserLevel(calculatedLevel);
      });
    }

    return () => {
      unsubName();
      unsubLevel();
    };
  }, [isLoggedIn, userId]);

  // HANDLERS
  const handleLoginSuccess = (uid) => {
    setUserId(uid);
    setIsLoggedIn(true);
    setCurrentScreen('home'); // Go to home after login
  };

  const handleLogout = async () => {
    await auth.signOut();
    setIsLoggedIn(false);
    setUserId(null);
    setCurrentScreen('home');
  };

  const openGameDetails = (id) => {
    setSelectedGameId(id);
    setCurrentScreen('details');
  };

  const handleGenreClick = (genreId, genreName) => {
    setUserChoices({ mode: 'search', query: genreName, genreId: genreId });
    setCurrentScreen('results');
  };

  const handleSearch = (e) => {
    if (e.key === 'Enter' && searchQuery.trim() !== "") {
      setUserChoices({ mode: 'search', query: searchQuery });
      setCurrentScreen('results');
      setSearchQuery("");
    }
  };

  if (authLoading) return <div style={{color: 'white', textAlign: 'center', marginTop: '20%'}}>Initializing Scout HQ...</div>;

  return (
    <div style={webStyles.dashboardContainer}>
      {/* SIDEBAR NAVIGATION - Always Visible */}
      <nav style={webStyles.sidebar}>
        <div>
          <div style={webStyles.logo} onClick={() => setCurrentScreen('home')}>🎮 SGF</div>
          
          {/* USER BADGE */}
          <div style={webStyles.userBadge}>
            <div style={webStyles.avatarContainer}>
               <div style={{...webStyles.avatarSmall, backgroundColor: isLoggedIn ? '#00D1FF' : '#334155'}}>
                {userName.substring(0, 1).toUpperCase()}
               </div>
               {isLoggedIn && <div style={webStyles.levelCircle}>{userLevel}</div>}
            </div>
            <div>
              <p style={webStyles.sidebarName}>{userName}</p>
              <p style={webStyles.levelText}>{isLoggedIn ? `Tier ${userLevel} Member` : 'Guest Access'}</p>
            </div>
          </div>

          <div style={webStyles.searchContainer}>
            <input 
              style={webStyles.searchInput} 
              placeholder="Search database..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearch}
            />
          </div>

          <div 
            style={{...webStyles.navLink, color: currentScreen === 'home' ? '#00D1FF' : '#94A3B8'}} 
            onClick={() => setCurrentScreen('home')}
          >Home</div>
          <div 
            style={{...webStyles.navLink, color: currentScreen === 'quiz' ? '#00D1FF' : '#94A3B8'}}
            onClick={() => setCurrentScreen('quiz')}
          >Matchmaker</div>

          {/* PROTECTED LINKS */}
          {isLoggedIn && (
            <>
              <div 
                style={{...webStyles.navLink, color: currentScreen === 'saved' ? '#00D1FF' : '#94A3B8'}}
                onClick={() => setCurrentScreen('saved')}
              >My Library</div>
              <div 
                style={{...webStyles.navLink, color: currentScreen === 'profile' ? '#00D1FF' : '#94A3B8'}}
                onClick={() => setCurrentScreen('profile')}
              >Profile</div>
            </>
          )}
        </div>
        
        {isLoggedIn ? (
          <div style={webStyles.logoutBtn} onClick={handleLogout}>Logout</div>
        ) : (
          <div style={webStyles.loginSideBtn} onClick={() => setCurrentScreen('login')}>Sign In</div>
        )}
      </nav>

      {/* MAIN CONTENT AREA */}
      <main style={webStyles.contentArea}>
        {currentScreen === 'home' && (
          <HomeScreen 
            onStartQuiz={() => setCurrentScreen('quiz')} 
            onSelectGame={openGameDetails} 
            onGenreSelect={handleGenreClick}
            userLevel={userLevel}
            user={isLoggedIn ? { uid: userId, displayName: userName } : null}
            onLoginClick={() => setCurrentScreen('login')}
          />
        )}
        {currentScreen === 'login' && (
          <LoginScreen onLoginSuccess={handleLoginSuccess} onBack={() => setCurrentScreen('home')} />
        )}
        {currentScreen === 'quiz' && (
          <QuizScreen 
            onBack={() => setCurrentScreen('home')} 
            onShowResults={(c) => { setUserChoices(c); setCurrentScreen('results'); }} 
          />
        )}
        {currentScreen === 'results' && (
          <ResultsScreen 
            quizResults={userChoices} 
            onBack={() => setCurrentScreen('home')} 
            onSelectGame={openGameDetails} 
          />
        )}
        {currentScreen === 'saved' && isLoggedIn && (
          <SavedGamesScreen onSelectGame={openGameDetails} userId={userId} />
        )}
        {currentScreen === 'profile' && isLoggedIn && (
          <ProfileScreen userId={userId} />
        )}
        {currentScreen === 'details' && (
          <GameDetailsScreen 
            gameId={selectedGameId} 
            onBack={() => setCurrentScreen('home')} 
            userId={userId}
          />
        )}
      </main>
    </div>
  );
}

const webStyles = {
  dashboardContainer: { display: 'flex', width: '100vw', height: '100vh', overflow: 'hidden', backgroundColor: '#050A15' },
  sidebar: { width: '260px', backgroundColor: '#0D1421', padding: '30px 20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', borderRight: '1px solid #1E293B', flexShrink: 0 },
  logo: { fontSize: '24px', fontWeight: 'bold', color: '#00D1FF', marginBottom: '25px', cursor: 'pointer' },
  userBadge: { display: 'flex', alignItems: 'center', gap: '15px', padding: '15px', backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: '16px', marginBottom: '30px', border: '1px solid #1E293B' },
  avatarContainer: { position: 'relative' },
  avatarSmall: { width: '40px', height: '40px', color: '#000', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '18px' },
  levelCircle: { position: 'absolute', bottom: '-5px', right: '-5px', width: '18px', height: '18px', backgroundColor: '#A2FF00', color: '#000', borderRadius: '50%', fontSize: '10px', fontWeight: '900', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #0D1421' },
  sidebarName: { fontSize: '14px', color: '#fff', fontWeight: 'bold', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '120px' },
  levelText: { fontSize: '11px', color: '#A2FF00', margin: 0, fontWeight: '600' },
  searchContainer: { marginBottom: '25px' },
  searchInput: { width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #1E293B', backgroundColor: '#050A15', color: '#fff', fontSize: '13px', outline: 'none' },
  navLink: { padding: '12px 10px', cursor: 'pointer', fontSize: '15px', borderRadius: '8px', marginBottom: '5px', transition: '0.2s' },
  logoutBtn: { color: '#FF4B4B', cursor: 'pointer', fontWeight: 'bold', padding: '10px', fontSize: '14px' },
  loginSideBtn: { color: '#00D1FF', cursor: 'pointer', fontWeight: 'bold', padding: '10px', fontSize: '14px' },
  contentArea: { flexGrow: 1, height: '100%', overflowY: 'auto', backgroundColor: '#050A15' }
};

export default App;