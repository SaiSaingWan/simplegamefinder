import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, addDoc, query, where, onSnapshot, serverTimestamp, orderBy, getDocs } from 'firebase/firestore';

const GameDetailsScreen = ({ gameId, onBack }) => {
  const [game, setGame] = useState(null);
  const [screenshots, setScreenshots] = useState([]);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  const API_KEY = '738e6aa86d1444cf87ccc6b8607e1d4a';
  const currentUserId = "user_123";

  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      try {
        const detailRes = await fetch(`https://api.rawg.io/api/games/${gameId}?key=${API_KEY}`);
        const detailData = await detailRes.json();
        setGame(detailData);

        const screenRes = await fetch(`https://api.rawg.io/api/games/${gameId}/screenshots?key=${API_KEY}`);
        const screenData = await screenRes.json();
        setScreenshots(screenData.results || []);

        // Check library for this user
        const qSaved = query(collection(db, "savedGames"), 
          where("gameId", "==", parseInt(gameId)), 
          where("userId", "==", currentUserId)
        );
        const savedSnapshot = await getDocs(qSaved);
        if (!savedSnapshot.empty) setIsSaved(true);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAllData();

    const qComments = query(collection(db, "comments"), where("gameId", "==", gameId), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(qComments, (snapshot) => {
      setComments(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, [gameId]);

  const handleSave = async () => {
    if (isSaved || saving) return;
    setSaving(true);
    try {
      await addDoc(collection(db, "savedGames"), {
        gameId: game.id,
        userId: currentUserId,
        name: game.name,
        image: game.background_image,
        rating: game.rating,
        status: "Backlog",
        savedAt: serverTimestamp(),
      });
      setIsSaved(true);
    } catch (err) {
      alert("Error saving.");
    } finally {
      setSaving(false);
    }
  };

  const postComment = async () => {
    if (!newComment.trim()) return;
    await addDoc(collection(db, "comments"), {
      gameId, user: "Gamer Scout", text: newComment, createdAt: serverTimestamp()
    });
    setNewComment("");
  };

  if (loading || !game) return <div style={styles.loadingArea}><div className="spinner"></div></div>;

  return (
    <div style={styles.page}>
      <button onClick={onBack} style={styles.backBtn}>← Back</button>
      <div style={{...styles.hero, backgroundImage: `linear-gradient(to bottom, transparent, #050A15), url(${game.background_image})`}}>
        <div style={styles.heroContent}>
          <h1 style={styles.title}>{game.name}</h1>
          <button style={isSaved ? styles.savedBtn : styles.saveActionBtn} onClick={handleSave} disabled={isSaved}>
            {isSaved ? "✓ In Library" : "Save to Library"}
          </button>
        </div>
      </div>
      <div style={styles.contentGrid}>
        <div>
          <h3>About</h3>
          <p style={styles.description}>{game.description_raw}</p>
          <h3>Screenshots</h3>
          <div style={styles.screenshotGrid}>
            {screenshots.slice(0, 4).map(s => <img key={s.id} src={s.image} style={styles.screenshot} alt="gameplay" />)}
          </div>
          <div style={styles.commentSection}>
            <input style={styles.input} value={newComment} onChange={(e) => setNewComment(e.target.value)} placeholder="Add a comment..." />
            <button onClick={postComment} style={styles.postBtn}>Post</button>
            {comments.map(c => <div key={c.id} style={styles.commentCard}><p>{c.text}</p></div>)}
          </div>
        </div>
        <div style={styles.sidebar}>
          <p>Released: {game.released}</p>
          <p>Rating: {game.rating}</p>
        </div>
      </div>
    </div>
  );
};

const styles = {
  page: { padding: '40px', backgroundColor: '#050A15', color: '#fff' },
  loadingArea: { height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' },
  backBtn: { color: '#00D1FF', background: 'none', border: 'none', cursor: 'pointer', marginBottom: '20px' },
  hero: { height: '400px', backgroundSize: 'cover', display: 'flex', alignItems: 'flex-end', padding: '40px', borderRadius: '20px' },
  heroContent: { width: '100%' },
  title: { fontSize: '48px', margin: '0 0 20px 0' },
  saveActionBtn: { padding: '12px 24px', backgroundColor: '#00D1FF', borderRadius: '8px', fontWeight: 'bold', border: 'none', cursor: 'pointer' },
  savedBtn: { padding: '12px 24px', backgroundColor: '#1E293B', color: '#94A3B8', borderRadius: '8px', border: 'none' },
  contentGrid: { display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '40px', marginTop: '40px' },
  description: { lineHeight: '1.6', color: '#CBD5E1' },
  screenshotGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' },
  screenshot: { width: '100%', borderRadius: '10px' },
  commentSection: { marginTop: '40px' },
  input: { padding: '12px', width: '70%', borderRadius: '8px', border: '1px solid #1E293B', backgroundColor: '#0D1421', color: '#fff' },
  postBtn: { padding: '12px 20px', backgroundColor: '#00D1FF', borderRadius: '8px', border: 'none', marginLeft: '10px' },
  commentCard: { backgroundColor: '#0D1421', padding: '15px', borderRadius: '10px', marginTop: '10px' },
  sidebar: { backgroundColor: '#0D1421', padding: '20px', borderRadius: '15px', height: 'fit-content' }
};

export default GameDetailsScreen;