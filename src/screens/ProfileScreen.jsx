import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, getDocs, query, where, doc, setDoc, getDoc } from 'firebase/firestore';

const ProfileScreen = () => {
  const [stats, setStats] = useState({ total: 0, completed: 0, playing: 0 });
  const [topGames, setTopGames] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [displayName, setDisplayName] = useState("Gamer Scout");
  const [isUpdating, setIsUpdating] = useState(false);

  const currentUserId = "user_123";
  const userEmail = "gamerscout@sgf.com";

  useEffect(() => {
    const fetchProfileData = async () => {
      setLoading(true);
      try {
        // 1. Fetch User Data
        const userDoc = await getDoc(doc(db, "users", currentUserId));
        if (userDoc.exists()) setDisplayName(userDoc.data().displayName || "Gamer Scout");

        // 2. Fetch Library Stats
        const qSaved = query(collection(db, "savedGames"), where("userId", "==", currentUserId));
        const snap = await getDocs(qSaved);
        const all = snap.docs.map(d => ({ id: d.id, ...d.data() }));

        setStats({
          total: all.length,
          completed: all.filter(g => g.status === 'Completed').length,
          playing: all.filter(g => g.status === 'Playing').length
        });

        // 3. Hall of Fame (Top 3 Completed)
        setTopGames(all.filter(g => g.status === 'Completed').slice(0, 3));

      } catch (err) {
        console.error("Profile Data Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfileData();
  }, []);

  const handleUpdateName = async () => {
    if (!displayName.trim()) return;
    setIsUpdating(true);
    try {
      await setDoc(doc(db, "users", currentUserId), { displayName }, { merge: true });
      alert("Display name updated!");
    } catch (err) {
      alert("Error updating name.");
    } finally {
      setIsUpdating(false);
    }
  };

  const completionRate = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

  if (loading) return <div style={styles.loader}>Loading Profile...</div>;

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div style={styles.profileInfo}>
          <div style={styles.avatar}>{displayName.substring(0, 2).toUpperCase()}</div>
          <div>
            <h1 style={styles.username}>{displayName}</h1>
            <p style={styles.email}>{userEmail}</p>
          </div>
        </div>
        <div style={styles.levelBadge}>LVL {Math.floor(stats.completed / 2) + 1}</div>
      </header>

      <div style={styles.mainGrid}>
        {/* LEFT COLUMN: IDENTITY & STATS */}
        <div style={styles.column}>
          <div style={styles.sectionCard}>
            <h3 style={styles.sectionTitle}>Account Identity</h3>
            <label style={styles.label}>Display Name</label>
            <input 
              style={styles.input} 
              value={displayName} 
              onChange={(e) => setDisplayName(e.target.value)} 
            />
            <button style={styles.saveBtn} onClick={handleUpdateName} disabled={isUpdating}>
              {isUpdating ? "Saving..." : "Update Name"}
            </button>
          </div>

          <div style={styles.sectionCard}>
            <h3 style={styles.sectionTitle}>Library Mastery</h3>
            <div style={styles.progressBarBg}>
              <div style={{...styles.progressBarFill, width: `${completionRate}%`}}></div>
            </div>
            <div style={styles.statsRow}>
              <div style={styles.miniStat}><span style={styles.statVal}>{stats.total}</span><span style={styles.statLab}>Games</span></div>
              <div style={styles.miniStat}><span style={{...styles.statVal, color: '#00D1FF'}}>{stats.playing}</span><span style={styles.statLab}>Playing</span></div>
              <div style={styles.miniStat}><span style={{...styles.statVal, color: '#A2FF00'}}>{stats.completed}</span><span style={styles.statLab}>Finished</span></div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: HALL OF FAME & SECURITY */}
        <div style={styles.column}>
          <div style={styles.sectionCard}>
            <h3 style={styles.sectionTitle}>🏆 Hall of Fame</h3>
            <div style={styles.topGamesGrid}>
              {topGames.length > 0 ? topGames.map((game, i) => (
                <div key={i} style={styles.topGameCard}>
                  <img src={game.image} style={styles.topGameImg} alt="game" />
                  <p style={styles.topGameName}>{game.name}</p>
                </div>
              )) : <p style={styles.emptyText}>Finish games to feature them here!</p>}
            </div>
          </div>

          <div style={styles.sectionCard}>
            <h3 style={styles.sectionTitle}>Security & Privacy</h3>
            <button style={styles.actionBtn}>Change Password</button>
            <button style={styles.actionBtn}>Privacy Settings</button>
            <button style={{...styles.actionBtn, color: '#FF4B4B'}}>Log Out of All Devices</button>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: { padding: '40px', maxWidth: '1200px', margin: '0 auto', color: '#fff' },
  loader: { height: '80vh', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#00D1FF' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', backgroundColor: '#0D1421', padding: '30px', borderRadius: '24px', border: '1px solid #1E293B' },
  profileInfo: { display: 'flex', alignItems: 'center', gap: '20px' },
  avatar: { width: '70px', height: '70px', backgroundColor: '#00D1FF', borderRadius: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', fontWeight: 'bold', color: '#000' },
  username: { margin: 0, fontSize: '28px', fontWeight: 'bold' },
  email: { margin: 0, color: '#64748B' },
  levelBadge: { padding: '10px 20px', backgroundColor: '#1E293B', borderRadius: '50px', border: '1px solid #00D1FF', color: '#00D1FF', fontWeight: 'bold' },
  
  mainGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' },
  column: { display: 'flex', flexDirection: 'column', gap: '25px' },
  sectionCard: { backgroundColor: '#0D1421', borderRadius: '24px', padding: '25px', border: '1px solid #1E293B' },
  sectionTitle: { fontSize: '12px', textTransform: 'uppercase', color: '#00D1FF', marginBottom: '20px', letterSpacing: '1px' },
  
  topGamesGrid: { display: 'flex', gap: '15px' },
  topGameCard: { flex: 1, textAlign: 'center' },
  topGameImg: { width: '100%', height: '110px', borderRadius: '12px', objectFit: 'cover', border: '2px solid #A2FF00' },
  topGameName: { fontSize: '12px', marginTop: '8px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' },
  
  label: { fontSize: '11px', color: '#64748B', display: 'block', marginBottom: '8px' },
  input: { width: '100%', padding: '12px', backgroundColor: '#050A15', border: '1px solid #1E293B', borderRadius: '12px', color: '#fff', marginBottom: '15px' },
  saveBtn: { width: '100%', padding: '12px', backgroundColor: '#00D1FF', color: '#000', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' },
  
  actionBtn: { width: '100%', padding: '12px', backgroundColor: '#1E293B', border: 'none', borderRadius: '12px', color: '#fff', textAlign: 'left', marginBottom: '10px', cursor: 'pointer', fontSize: '14px' },
  
  progressBarBg: { height: '10px', backgroundColor: '#050A15', borderRadius: '10px', marginBottom: '20px' },
  progressBarFill: { height: '100%', backgroundColor: '#00D1FF', borderRadius: '10px', transition: 'width 0.5s ease' },
  statsRow: { display: 'flex', justifyContent: 'space-between' },
  miniStat: { textAlign: 'center' },
  statVal: { display: 'block', fontSize: '24px', fontWeight: 'bold' },
  statLab: { fontSize: '11px', color: '#64748B' },
  emptyText: { color: '#64748B', fontSize: '13px', textAlign: 'center', width: '100%' }
};

export default ProfileScreen;