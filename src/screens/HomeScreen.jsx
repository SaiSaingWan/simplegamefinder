import React, { useEffect, useState } from 'react';

const HomeScreen = ({ onStartQuiz, onSelectGame, onGenreSelect, userLevel = 1 }) => {
  const [trending, setTrending] = useState([]);
  const [newReleases, setNewReleases] = useState([]);
  const [loading, setLoading] = useState(true);
  const API_KEY = '738e6aa86d1444cf87ccc6b8607e1d4a';

  useEffect(() => {
    const fetchAllFeeds = async () => {
      setLoading(true);
      try {
        const today = new Date().toISOString().split('T')[0];
        const lastMonth = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        
        // 1. Fetch Trending (Vertical List)
        const trendingRes = await fetch(`https://api.rawg.io/api/games?key=${API_KEY}&dates=${lastMonth},${today}&ordering=-added&page_size=5`);
        const trendingData = await trendingRes.json();
        setTrending(trendingData.results || []);

        // 2. Fetch New Releases (Horizontal Feed)
        const newRes = await fetch(`https://api.rawg.io/api/games?key=${API_KEY}&dates=2024-01-01,${today}&ordering=-released&page_size=8`);
        const newData = await newRes.json();
        setNewReleases(newData.results || []);

      } catch (err) {
        console.error("Feed Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAllFeeds();
  }, []);

  return (
    <div style={styles.container}>
      {/* HERO SECTION */}
      <div style={styles.hero}>
        <div style={styles.heroOverlay}>
          <h1 style={styles.heroTitle}>Level {userLevel} Scout HQ</h1>
          <p style={styles.heroSubtitle}>We've scanned 500,000+ games. Ready to find yours?</p>
          <button style={styles.quizBtn} onClick={onStartQuiz}>Launch Matchmaker</button>
        </div>
      </div>

      {/* HORIZONTAL FEED: NEW RELEASES */}
      <div style={styles.horizontalSection}>
        <h2 style={styles.sectionTitle}>✨ Fresh Drops</h2>
        <div style={styles.horizontalScroll}>
          {newReleases.map(game => (
            <div key={game.id} style={styles.scrollCard} onClick={() => onSelectGame(game.id)}>
              <div style={{...styles.scrollImg, backgroundImage: `url(${game.background_image})`}}>
                <span style={styles.scrollBadge}>New</span>
              </div>
              <p style={styles.scrollName}>{game.name}</p>
            </div>
          ))}
        </div>
      </div>

      <div style={styles.contentGrid}>
        {/* LEFT: TRENDING FEED */}
        <div style={styles.feedCard}>
          <h2 style={styles.sectionTitle}>🔥 Trending Now</h2>
          <div style={styles.newsList}>
            {trending.map(game => (
              <div key={game.id} style={styles.newsItem} onClick={() => onSelectGame(game.id)}>
                <img src={game.background_image} style={styles.newsThumb} alt={game.name} />
                <div style={{flex: 1}}>
                  <h4 style={styles.newsName}>{game.name}</h4>
                  <p style={styles.newsMeta}>Rating: ⭐ {game.rating}</p>
                </div>
                <div style={styles.chevron}>→</div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT: QUICK BROWSE */}
        <div style={styles.sideCol}>
          <div style={styles.feedCard}>
            <h2 style={styles.sectionTitle}>Browse Genres</h2>
            <div style={styles.genreGrid}>
              {['Action', 'RPG', 'Strategy', 'Indie', 'Shooter', 'Casual'].map(g => (
                <div key={g} style={styles.genrePill} onClick={() => onGenreSelect(null, g)}>
                  {g}
                </div>
              ))}
            </div>
          </div>
          
          <div style={{...styles.feedCard, background: 'linear-gradient(to bottom right, #1E293B, #0F172A)'}}>
            <h3 style={{color: '#00D1FF', margin: 0}}>Scout Tip 💡</h3>
            <p style={{color: '#94A3B8', fontSize: '13px'}}>Complete games to increase your Scout Tier and unlock special badges!</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: { padding: '30px', maxWidth: '1300px', margin: '0 auto' },
  hero: { 
    height: '300px', borderRadius: '24px', marginBottom: '40px',
    backgroundImage: 'url(https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2070&auto=format&fit=crop)',
    backgroundSize: 'cover', backgroundPosition: 'center', overflow: 'hidden'
  },
  heroOverlay: { 
    height: '100%', width: '100%', display: 'flex', flexDirection: 'column', 
    justifyContent: 'center', alignItems: 'center', 
    background: 'linear-gradient(to right, rgba(5, 10, 21, 0.9), rgba(5, 10, 21, 0.2))',
    textAlign: 'center'
  },
  heroTitle: { fontSize: '48px', color: '#fff', margin: 0, fontWeight: '900' },
  heroSubtitle: { color: '#00D1FF', fontSize: '18px', marginBottom: '20px' },
  quizBtn: { padding: '12px 30px', backgroundColor: '#00D1FF', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' },
  
  horizontalSection: { marginBottom: '40px' },
  sectionTitle: { color: '#fff', fontSize: '18px', marginBottom: '20px', textTransform: 'uppercase', letterSpacing: '1px' },
  horizontalScroll: { display: 'flex', gap: '20px', overflowX: 'auto', paddingBottom: '15px' },
  scrollCard: { minWidth: '200px', cursor: 'pointer' },
  scrollImg: { height: '120px', borderRadius: '15px', backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative' },
  scrollBadge: { position: 'absolute', top: '10px', left: '10px', backgroundColor: '#A2FF00', color: '#000', fontSize: '10px', padding: '2px 8px', borderRadius: '4px', fontWeight: 'bold' },
  scrollName: { color: '#fff', marginTop: '10px', fontSize: '14px', fontWeight: '600' },
  
  contentGrid: { display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '30px' },
  feedCard: { backgroundColor: '#0D1421', padding: '25px', borderRadius: '24px', border: '1px solid #1E293B', marginBottom: '20px' },
  newsList: { display: 'flex', flexDirection: 'column', gap: '15px' },
  newsItem: { display: 'flex', gap: '15px', alignItems: 'center', padding: '12px', backgroundColor: '#050A15', borderRadius: '16px', cursor: 'pointer', transition: '0.2s' },
  newsThumb: { width: '60px', height: '60px', borderRadius: '12px', objectFit: 'cover' },
  newsName: { color: '#fff', margin: 0, fontSize: '15px' },
  newsMeta: { color: '#64748B', margin: '5px 0 0 0', fontSize: '12px' },
  chevron: { color: '#1E293B', fontSize: '20px' },
  
  genreGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' },
  genrePill: { padding: '12px', backgroundColor: '#050A15', border: '1px solid #1E293B', borderRadius: '12px', color: '#fff', textAlign: 'center', cursor: 'pointer', fontSize: '13px' }
};

export default HomeScreen;