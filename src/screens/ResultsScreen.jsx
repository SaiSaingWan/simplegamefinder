import React, { useEffect, useState } from 'react';
import { db } from '../firebase'; 
import { collection, addDoc, serverTimestamp, getDocs, query, where } from 'firebase/firestore';

const ResultsScreen = ({ quizResults, onBack, onSelectGame }) => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState(null);
  const [savedGameIds, setSavedGameIds] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  const API_KEY = '738e6aa86d1444cf87ccc6b8607e1d4a'; 
  const currentUserId = "user_123"; // Logic placeholder

  useEffect(() => {
    const fetchGamesData = async () => {
      setLoading(true);
      try {
        // Fetch only this user's library to show "Saved" status correctly
        const qSaved = query(collection(db, "savedGames"), where("userId", "==", currentUserId));
        const savedSnapshot = await getDocs(qSaved);
        setSavedGameIds(savedSnapshot.docs.map(doc => doc.data().gameId));

        let baseUrl = "";
        if (quizResults?.genreId) {
          baseUrl = `https://api.rawg.io/api/games?key=${API_KEY}&genres=${quizResults.genreId}&ordering=-rating`;
        } else if (quizResults?.mode === 'search') {
          baseUrl = `https://api.rawg.io/api/games?key=${API_KEY}&search=${quizResults.query}`;
        } else {
          const platformMap = { 'PC': '4', 'Console': '18,1,187', 'Mobile': '3,21', 'Handheld': '7' };
          const genreMap = { 'Action': 'action', 'RPG': 'role-playing-games-rpg', 'Strategy': 'strategy', 'Simulation': 'simulation', 'Puzzle': 'puzzle' };
          const moodTags = { 'Relaxed': 'relaxing', 'High Energy': 'fast-paced', 'Competitive': 'multiplayer', 'Social': 'co-op' };

          const platform = platformMap[quizResults?.device] || '';
          const genre = genreMap[quizResults?.genre] || '';
          const tag = moodTags[quizResults?.mood] || '';

          baseUrl = `https://api.rawg.io/api/games?key=${API_KEY}&platforms=${platform}&genres=${genre}&tags=${tag}&ordering=-rating`;
        }

        const response = await fetch(`${baseUrl}&page_size=16&page=${currentPage}`);
        const data = await response.json();
        setGames(data.results || []);
        setTotalPages(Math.ceil((data.count || 0) / 16) > 50 ? 50 : Math.ceil((data.count || 0) / 16));
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };

    if (quizResults) fetchGamesData();
  }, [quizResults, currentPage]);

  const handleSaveGame = async (e, game) => {
    e.stopPropagation();
    if (savedGameIds.includes(game.id)) return;
    setSavingId(game.id);
    try {
      await addDoc(collection(db, "savedGames"), {
        gameId: game.id,
        userId: currentUserId, // LINK TO USER
        name: game.name,
        image: game.background_image,
        rating: game.rating,
        status: "Backlog", // INITIAL STATUS
        savedAt: serverTimestamp(),
      });
      setSavedGameIds(prev => [...prev, game.id]);
    } catch (err) {
      alert("Error saving.");
    } finally {
      setSavingId(null);
    }
  };

  const renderPageNumbers = () => {
    const pages = [];
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, startPage + 4);
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button key={i} onClick={() => setCurrentPage(i)} style={currentPage === i ? styles.pageBtnActive : styles.pageBtn}>{i}</button>
      );
    }
    return pages;
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button onClick={onBack} style={styles.backBtn}>← Back</button>
        <h1 style={styles.title}>Results</h1>
      </div>

      {loading ? <div style={styles.loadingArea}><div className="spinner"></div></div> : (
        <>
          <div style={styles.resultsGrid}>
            {games.map((game) => {
              const isSaved = savedGameIds.includes(game.id);
              return (
                <div key={game.id} style={styles.gameCard} onClick={() => onSelectGame(game.id)}>
                  <div style={{...styles.gameImage, backgroundImage: `url(${game.background_image})`}}>
                    <div style={styles.ratingBadge}>⭐ {game.rating}</div>
                  </div>
                  <div style={styles.cardContent}>
                    <h3 style={styles.gameTitle}>{game.name}</h3>
                    <button 
                      style={isSaved ? styles.savedBtn : styles.saveBtn} 
                      onClick={(e) => handleSaveGame(e, game)}
                      disabled={isSaved || savingId === game.id}
                    >
                      {isSaved ? '✓ In Library' : 'Save to Library'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
          <div style={styles.paginationRow}>
            <button style={styles.navBtn} disabled={currentPage === 1} onClick={() => setCurrentPage(prev => prev - 1)}>Prev</button>
            <div style={styles.pageNumbers}>{renderPageNumbers()}</div>
            <button style={styles.navBtn} disabled={currentPage === totalPages} onClick={() => setCurrentPage(prev => prev + 1)}>Next</button>
          </div>
        </>
      )}
    </div>
  );
};

const styles = {
  container: { padding: '40px', backgroundColor: '#050A15', minHeight: '100vh' },
  header: { marginBottom: '40px' },
  backBtn: { background: 'none', border: 'none', color: '#00D1FF', cursor: 'pointer', fontWeight: 'bold' },
  title: { fontSize: '30px', color: '#fff' },
  loadingArea: { textAlign: 'center', marginTop: '100px' },
  resultsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' },
  gameCard: { backgroundColor: '#0D1421', borderRadius: '12px', overflow: 'hidden', border: '1px solid #1E293B', cursor: 'pointer' },
  gameImage: { height: '140px', backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative' },
  ratingBadge: { position: 'absolute', top: '8px', right: '8px', background: 'rgba(0,0,0,0.8)', padding: '2px 8px', borderRadius: '5px', fontSize: '11px', color: '#A2FF00' },
  cardContent: { padding: '15px' },
  gameTitle: { fontSize: '15px', color: '#fff', marginBottom: '15px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' },
  saveBtn: { width: '100%', padding: '10px', backgroundColor: '#1E293B', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' },
  savedBtn: { width: '100%', padding: '10px', backgroundColor: 'transparent', color: '#64748B', border: '1px solid #1E293B', borderRadius: '8px' },
  paginationRow: { display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '50px', gap: '20px' },
  navBtn: { padding: '8px 16px', backgroundColor: '#00D1FF', color: '#000', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' },
  pageNumbers: { display: 'flex', gap: '8px' },
  pageBtn: { padding: '8px 12px', backgroundColor: '#0D1421', color: '#fff', border: '1px solid #1E293B', borderRadius: '6px', cursor: 'pointer' },
  pageBtnActive: { padding: '8px 12px', backgroundColor: '#00D1FF', color: '#000', border: 'none', borderRadius: '6px', fontWeight: 'bold' }
};

export default ResultsScreen;