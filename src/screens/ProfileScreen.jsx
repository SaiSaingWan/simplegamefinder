import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';

const ProfileScreen = () => {
  const [stats, setStats] = useState({ savedCount: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      const querySnapshot = await getDocs(collection(db, "savedGames"));
      setStats({ savedCount: querySnapshot.size });
    };
    fetchStats();
  }, []);

  return (
    <div style={styles.container}>
      <div style={styles.profileHeader}>
        <div style={styles.avatar}>JS</div>
        <div>
          <h1 style={styles.userName}>Gamer Explorer</h1>
          <p style={styles.userEmail}>tester@simplegamefinder.com</p>
        </div>
      </div>

      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <span style={styles.statNumber}>{stats.savedCount}</span>
          <span style={styles.statLabel}>Games in Library</span>
        </div>
        <div style={styles.statCard}>
          <span style={styles.statNumber}>Gold</span>
          <span style={styles.statLabel}>Member Status</span>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: { padding: '60px' },
  profileHeader: { display: 'flex', alignItems: 'center', gap: '30px', marginBottom: '50px' },
  avatar: { width: '100px', height: '100px', backgroundColor: '#00D1FF', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px', fontWeight: 'bold', color: '#050A15' },
  userName: { fontSize: '36px', margin: 0 },
  userEmail: { color: '#94A3B8', fontSize: '18px' },
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' },
  statCard: { backgroundColor: '#0D1421', padding: '30px', borderRadius: '20px', border: '1px solid #1E293B', textAlign: 'center' },
  statNumber: { display: 'block', fontSize: '32px', fontWeight: 'bold', color: '#00D1FF', marginBottom: '5px' },
  statLabel: { color: '#94A3B8', textTransform: 'uppercase', fontSize: '12px', letterSpacing: '1px' }
};

export default ProfileScreen;