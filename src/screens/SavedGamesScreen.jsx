import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, query, where, onSnapshot, doc, updateDoc, deleteDoc } from 'firebase/firestore';

const SavedGamesScreen = ({ onSelectGame }) => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const currentUserId = "user_123";

  useEffect(() => {
    const q = query(collection(db, "savedGames"), where("userId", "==", currentUserId));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setGames(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const updateStatus = async (docId, newStatus) => {
    await updateDoc(doc(db, "savedGames", docId), { status: newStatus });
  };

  const removeGame = async (docId) => {
    if(window.confirm("Delete this game?")) await deleteDoc(doc(db, "savedGames", docId));
  };

  if (loading) return <div style={styles.loader}><div className="spinner"></div></div>;

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>My Backlog</h1>
      <div style={styles.grid}>
        {games.map((game) => (
          <div key={game.id} style={styles.card}>
            <div style={{...styles.image, backgroundImage: `url(${game.image})`}} onClick={() => onSelectGame(game.gameId)} />
            <div style={styles.info}>
              <h4 style={styles.gameName}>{game.name}</h4>
              <select 
                style={{...styles.select, color: game.status === 'Completed' ? '#A2FF00' : '#00D1FF'}}
                value={game.status || "Backlog"}
                onChange={(e) => updateStatus(game.id, e.target.value)}
              >
                <option value="Backlog">⏳ Backlog</option>
                <option value="Playing">🎮 Playing</option>
                <option value="Completed">🏆 Completed</option>
              </select>
              <button onClick={() => removeGame(game.id)} style={styles.removeBtn}>Remove</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const styles = {
  container: { padding: '40px' },
  title: { color: '#fff', fontSize: '32px', marginBottom: '30px' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px' },
  card: { backgroundColor: '#0D1421', borderRadius: '15px', border: '1px solid #1E293B', overflow: 'hidden' },
  image: { height: '120px', backgroundSize: 'cover', cursor: 'pointer' },
  info: { padding: '15px' },
  gameName: { color: '#fff', fontSize: '14px', marginBottom: '10px' },
  select: { width: '100%', padding: '8px', backgroundColor: '#050A15', border: '1px solid #1E293B', borderRadius: '6px' },
  removeBtn: { width: '100%', background: 'none', border: 'none', color: '#FF4B4B', marginTop: '10px', cursor: 'pointer' },
  loader: { textAlign: 'center', marginTop: '100px' }
};

export default SavedGamesScreen;