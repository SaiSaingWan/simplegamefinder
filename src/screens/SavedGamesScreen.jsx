import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, query, orderBy, onSnapshot, doc, deleteDoc } from 'firebase/firestore';

const SavedGamesScreen = () => {
  const [savedGames, setSavedGames] = useState([]);

  useEffect(() => {
    const q = query(collection(db, "savedGames"), orderBy("savedAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setSavedGames(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, []);

  const removeGame = async (id) => {
    if(window.confirm("Remove from library?")) {
      await deleteDoc(doc(db, "savedGames", id));
    }
  };

  return (
    <div style={{ padding: '40px' }}>
      <h1 style={{ fontSize: '36px', marginBottom: '10px' }}>My Library</h1>
      <p style={{ color: '#94A3B8', marginBottom: '40px' }}>Games you've bookmarked for later.</p>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '25px' }}>
        {savedGames.map(game => (
          <div key={game.id} style={{ backgroundColor: '#0D1421', borderRadius: '15px', overflow: 'hidden', border: '1px solid #1E293B' }}>
            <img src={game.image} alt={game.name} style={{ width: '100%', height: '150px', objectFit: 'cover' }} />
            <div style={{ padding: '20px' }}>
              <h3 style={{ margin: '0 0 10px 0', fontSize: '18px' }}>{game.name}</h3>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#A2FF00', fontWeight: 'bold' }}>⭐ {game.rating}</span>
                <button 
                  onClick={() => removeGame(game.id)}
                  style={{ background: 'none', border: 'none', color: '#FF4B4B', cursor: 'pointer', fontSize: '12px' }}
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {savedGames.length === 0 && <p style={{ color: '#475569' }}>Your library is empty. Go take the quiz!</p>}
    </div>
  );
};

export default SavedGamesScreen;