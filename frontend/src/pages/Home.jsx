import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Code, PenTool, Globe, Database, Users, Star, TrendingUp } from 'lucide-react';

const Home = () => {
    const categories = [
        { icon: <Code size={32} />, name: "Development", count: "120+ Skills" },
        { icon: <PenTool size={32} />, name: "Design", count: "85+ Skills" },
        { icon: <Globe size={32} />, name: "Languages", count: "40+ Skills" },
        { icon: <Database size={32} />, name: "Data Science", count: "60+ Skills" },
    ];

    const trendingSkills = [
        "React.js Architecture", "Conversational French", "UI/UX Prototyping", "Python Automation"
    ];

    return (
        <div className="container" style={{ paddingBottom: '100px' }}>
            <section className="hero-section">
                <div style={{ display: 'inline-block', padding: '8px 16px', background: 'rgba(99, 102, 241, 0.1)', borderRadius: '20px', color: 'var(--primary)', fontWeight: 600, marginBottom: '20px', border: '1px solid rgba(99, 102, 241, 0.2)' }}>
                    ✨ Gemini & ChatGPT AI Capable
                </div>
                <h1>Exchange Skills, <br/> Grow Together.</h1>
                <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto 40px auto', lineHeight: 1.6 }}>
                    Join the ultimate peer-to-peer network. Offer what you know, request what you want to learn, and trade skills securely and beautifully.
                </p>
                <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
                    <Link to="/dashboard">
                        <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '16px 32px', fontSize: '1.1rem' }}>
                            Explore Dashboard <ArrowRight size={20} />
                        </button>
                    </Link>
                    <button className="btn-secondary" style={{ padding: '16px 32px', fontSize: '1.1rem' }} onClick={() => document.getElementById('how-it-works').scrollIntoView({ behavior: 'smooth' })}>Learn More</button>
                </div>
            </section>

            <section id="how-it-works" style={{ padding: '40px 0' }}>
                <h2 style={{ textAlign: 'center', fontSize: '2rem', marginBottom: '40px' }}>How SkillSwap Works</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
                    <div className="glass-panel flex-center" style={{ flexDirection: 'column', padding: '40px', textAlign: 'center' }}>
                        <div style={{ background: 'rgba(99, 102, 241, 0.15)', padding: '20px', borderRadius: '50%', marginBottom: '20px' }}>
                            <Users size={40} color="var(--primary)" />
                        </div>
                        <h3>1. Connect</h3>
                        <p style={{ color: 'var(--text-muted)', marginTop: '10px' }}>Find peers offering skills you need or seeking skills you have in our diverse marketplace.</p>
                    </div>
                    <div className="glass-panel flex-center" style={{ flexDirection: 'column', padding: '40px', textAlign: 'center' }}>
                        <div style={{ background: 'rgba(168, 85, 247, 0.15)', padding: '20px', borderRadius: '50%', marginBottom: '20px' }}>
                            <TrendingUp size={40} color="#a855f7" />
                        </div>
                        <h3>2. Swap</h3>
                        <p style={{ color: 'var(--text-muted)', marginTop: '10px' }}>Exchange knowledge securely using our built-in video rooms and messaging.</p>
                    </div>
                    <div className="glass-panel flex-center" style={{ flexDirection: 'column', padding: '40px', textAlign: 'center' }}>
                        <div style={{ background: 'rgba(236, 72, 153, 0.15)', padding: '20px', borderRadius: '50%', marginBottom: '20px' }}>
                            <Star size={40} color="#ec4899" />
                        </div>
                        <h3>3. Grow</h3>
                        <p style={{ color: 'var(--text-muted)', marginTop: '10px' }}>Level up your abilities and review your peers' teaching quality to build reputation.</p>
                    </div>
                </div>
            </section>

            <section style={{ padding: '60px 0' }}>
                <div className="flex-between" style={{ marginBottom: '40px', flexWrap: 'wrap', gap: '20px' }}>
                    <h2 style={{ fontSize: '2rem' }}>Popular Categories & Trending</h2>
                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                        {trendingSkills.map((ts, idx) => (
                            <span key={idx} style={{ background: 'rgba(255,255,255,0.05)', padding: '8px 16px', borderRadius: '20px', fontSize: '0.9rem', color: 'var(--text-muted)', border: '1px solid rgba(255,255,255,0.1)' }}>
                                🔥 {ts}
                            </span>
                        ))}
                    </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
                    {categories.map((cat, i) => (
                        <div key={i} className="glass-panel" style={{ padding: '30px', textAlign: 'center', cursor: 'pointer' }}>
                            <div style={{ color: 'var(--primary)', marginBottom: '15px' }}>{cat.icon}</div>
                            <h3 style={{ fontSize: '1.4rem', marginBottom: '8px' }}>{cat.name}</h3>
                            <p style={{ color: 'var(--text-muted)' }}>{cat.count}</p>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default Home;
