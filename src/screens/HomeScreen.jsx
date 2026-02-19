import React, { useEffect, useState } from 'react';

const HomeScreen = ({ onStartQuiz }) => {
  const [trending, setTrending] = useState([]);
  const [loading, setLoading] = useState(true);
  const API_KEY = '738e6aa86d1444cf87ccc6b8607e1d4a'; 

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        // Updated page_size to 10 for better layout filling
        const response = await fetch(
          `https://api.rawg.io/api/games?key=${API_KEY}&ordering=-relevance&page_size=10`
        );
        const data = await response.json();
        setTrending(data.results || []);
      } catch (error) {
        console.error("Trending fetch error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTrending();
  }, []);

  return (
    <div style={styles.container}>
      {/* HERO SECTION */}
      <section style={styles.hero}>
        <h1 style={styles.heroTitle}>Find your next <span style={{color: '#00D1FF'}}>adventure.</span></h1>
        <p style={styles.heroSubtitle}>Stop scrolling, start playing. Take the quiz to find games tailored to your mood and device.</p>
        <button onClick={onStartQuiz} style={styles.mainBtn}>START MATCHMAKING</button>
      </section>

      {/* TRENDING SECTION */}
      <section style={styles.trendingSection}>
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>Trending Now</h2>
          <div style={styles.line}></div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '50px' }}>
            <div className="spinner"></div>
            <p style={{color: '#94A3B8'}}>Loading top titles...</p>
          </div>
        ) : (
          <div style={styles.grid}>
            {trending.map((game) => (
              <div key={game.id} style={styles.gameCard}>
                <div 
                  style={{...styles.cardImage, backgroundImage: `url(${game.background_image})`}} 
                >
                  <div style={styles.ratingLabel}>⭐ {game.rating}</div>
                </div>
                <div style={styles.cardInfo}>
                  <h4 style={styles.gameName}>{game.name}</h4>
                  <div style={styles.metaRow}>
                    <span style={styles.gameGenre}>{game.genres[0]?.name || 'Game'}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

const styles = {
  container: { padding: '40px 5%', maxWidth: '1600px', margin: '0 auto' },
  hero: { 
    textAlign: 'center', 
    padding: '60px 20px', 
    backgroundColor: '#0D1421', 
    borderRadius: '24px',
    marginBottom: '50px',
    border: '1px solid #1E293B',
    background: 'linear-gradient(145deg, #0D1421 0%, #050A15 100%)'
  },
  heroTitle: { fontSize: '48px', fontWeight: '900', margin: '0 0 15px 0', letterSpacing: '-1px' },
  heroSubtitle: { color: '#94A3B8', fontSize: '18px', maxWidth: '550px', margin: '0 auto 35px auto', lineHeight: '1.5' },
  mainBtn: { padding: '18px 36px', backgroundColor: '#00D1FF', color: '#000', border: 'none', borderRadius: '10px', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer', transition: '0.2s', boxShadow: '0 4px 15px rgba(0, 209, 255, 0.3)' },
  
  trendingSection: { marginTop: '10px' },
  sectionHeader: { display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '30px' },
  sectionTitle: { fontSize: '22px', fontWeight: '700', whiteSpace: 'nowrap', color: '#fff' },
  line: { height: '1px', backgroundColor: '#1E293B', width: '100%' },
  
  grid: { 
    display: 'grid', 
    // This setup handles 10 items beautifully on different screen sizes
    gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', 
    gap: '20px' 
  },
  gameCard: { 
    backgroundColor: '#0D1421', 
    borderRadius: '12px', 
    overflow: 'hidden', 
    border: '1px solid #1E293B',
    transition: 'transform 0.2s ease',
    cursor: 'default'
  },
  cardImage: { 
    height: '140px', 
    backgroundSize: 'cover', 
    backgroundPosition: 'center',
    position: 'relative'
  },
  ratingLabel: {
    position: 'absolute',
    top: '8px',
    right: '8px',
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: '2px 8px',
    borderRadius: '5px',
    fontSize: '11px',
    fontWeight: 'bold',
    color: '#A2FF00'
  },
  cardInfo: { padding: '15px' },
  gameName: { fontSize: '15px', fontWeight: '600', margin: '0 0 8px 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: '#fff' },
  metaRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  gameGenre: { color: '#64748B', fontSize: '11px', textTransform: 'uppercase', fontWeight: '700', letterSpacing: '0.5px' }
};

export default HomeScreen;