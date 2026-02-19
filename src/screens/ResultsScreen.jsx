import React, { useEffect, useState } from 'react';
import { db } from '../firebase'; 
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const ResultsScreen = ({ quizResults, onBack }) => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState(null);
  
  const API_KEY = '738e6aa86d1444cf87ccc6b8607e1d4a'; 

  useEffect(() => {
    const fetchGames = async () => {
      setLoading(true);
      try {
        let url = "";

        // MODE 1: Manual Search from Sidebar
        if (quizResults?.mode === 'search') {
          url = `https://api.rawg.io/api/games?key=${API_KEY}&search=${quizResults.query}&page_size=12`;
        } 
        // MODE 2: Quiz Recommendations
        else {
          const platformMap = { 'PC': '4', 'Console': '18,1,187', 'Mobile': '3,21', 'Handheld': '7' };
          const genreMap = { 'Action': 'action', 'RPG': 'role-playing-games-rpg', 'Strategy': 'strategy', 'Simulation': 'simulation', 'Puzzle': 'puzzle' };
          const moodTags = { 'Relaxed': 'relaxing', 'High Energy': 'fast-paced', 'Competitive': 'multiplayer', 'Social': 'co-op' };

          const platform = platformMap[quizResults.device] || '';
          const genre = genreMap[quizResults.genre] || '';
          const tag = moodTags[quizResults.mood] || '';

          url = `https://api.rawg.io/api/games?key=${API_KEY}&platforms=${platform}&genres=${genre}&tags=${tag}&page_size=12&ordering=-rating`;
        }

        const response = await fetch(url);
        const data = await response.json();
        setGames(data.results || []);
      } catch (error) {
        console.error("API Error:", error);
      } finally {
        setTimeout(() => setLoading(false), 800);
      }
    };

    if (quizResults) fetchGames();
  }, [quizResults]);

  const handleSaveGame = async (game) => {
    setSavingId(game.id);
    try {
      await addDoc(collection(db, "savedGames"), {
        gameId: game.id,
        name: game.name,
        image: game.background_image,
        rating: game.rating,
        savedAt: serverTimestamp(),
      });
      alert(`✨ ${game.name} saved to library!`);
    } catch (error) {
      console.error("Error saving:", error);
      alert("Failed to save.");
    } finally {
      setSavingId(null);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button onClick={onBack} style={styles.backBtn}>
          {quizResults?.mode === 'search' ? '← Back' : '← Change Preferences'}
        </button>
        <h1 style={styles.title}>
          {quizResults?.mode === 'search' ? `Results for "${quizResults.query}"` : 'Recommended for You'}
        </h1>
        {quizResults?.mode !== 'search' && (
          <div style={styles.filterSummary}>
            {quizResults.device} • {quizResults.genre} • {quizResults.mood}
          </div>
        )}
      </div>

      {loading ? (
        <div style={styles.loadingArea}>
          <div className="spinner"></div>
          <p style={{color: '#94A3B8'}}>Scanning global databases...</p>
        </div>
      ) : (
        <div style={styles.resultsGrid}>
          {games.length > 0 ? (
            games.map((game, index) => (
              <div key={game.id} style={{...styles.gameCard, animation: `fadeIn 0.5s ease forwards ${index * 0.1}s`}}>
                <div style={{...styles.gameImage, backgroundImage: `url(${game.background_image})`}}>
                  <div style={styles.ratingBadge}>⭐ {game.rating || 'N/A'}</div>
                </div>
                <div style={styles.cardContent}>
                  <h3 style={styles.gameTitle} title={game.name}>{game.name}</h3>
                  <button 
                    style={savingId === game.id ? styles.saveBtnActive : styles.saveBtn} 
                    onClick={() => handleSaveGame(game)}
                    disabled={savingId === game.id}
                  >
                    {savingId === game.id ? 'Saving...' : 'Save to Library'}
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div style={{textAlign: 'center', gridColumn: '1/-1', padding: '100px'}}>
                <h2 style={{color: '#fff'}}>No matches found.</h2>
                <p style={{color: '#94A3B8'}}>Try using different keywords or quiz options.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const styles = {
  container: { padding: '40px', minHeight: '100vh', backgroundColor: '#050A15' },
  header: { marginBottom: '40px' },
  backBtn: { background: 'none', border: 'none', color: '#00D1FF', cursor: 'pointer', fontSize: '14px', marginBottom: '10px', textTransform: 'uppercase', fontWeight: 'bold' },
  title: { fontSize: '32px', fontWeight: 'bold', margin: 0, color: '#fff' },
  filterSummary: { color: '#94A3B8', marginTop: '5px', fontSize: '16px' },
  loadingArea: { textAlign: 'center', marginTop: '150px' },
  resultsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '25px' },
  gameCard: { backgroundColor: '#0D1421', borderRadius: '12px', overflow: 'hidden', border: '1px solid #1E293B', opacity: 0 },
  gameImage: { height: '160px', backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative' },
  ratingBadge: { position: 'absolute', top: '10px', right: '10px', background: 'rgba(0,0,0,0.8)', padding: '4px 8px', borderRadius: '6px', fontSize: '12px', color: '#A2FF00', fontWeight: 'bold' },
  cardContent: { padding: '20px' },
  gameTitle: { fontSize: '18px', marginBottom: '20px', color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' },
  saveBtn: { width: '100%', padding: '12px', backgroundColor: '#1E293B', color: '#fff', border: '1px solid #334155', borderRadius: '10px', cursor: 'pointer', fontWeight: '600', transition: '0.2s' },
  saveBtnActive: { width: '100%', padding: '12px', backgroundColor: '#00D1FF', color: '#000', border: 'none', borderRadius: '10px', fontWeight: 'bold' }
};

export default ResultsScreen;