import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Code, LayoutDashboard, X, User, MessageCircle, Coins } from 'lucide-react';

const Navbar = () => {
    const location = useLocation();
    const [showAuth, setShowAuth] = useState(false);
    const [user, setUser] = useState(null);
    const [formData, setFormData] = useState({ username: '', email: '', password: '' });

    useEffect(() => {
        const stored = localStorage.getItem('skillswap_user');
        if (stored) setUser(JSON.parse(stored));
    }, []);

    const handleAuth = async (e) => {
        e.preventDefault();
        try {
            let res = await fetch('http://localhost:5000/api/users/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            let data = await res.json();

            // If user already exists, seamlessly log them in!
            if (data.error && data.error.includes('already exists')) {
                res = await fetch('http://localhost:5000/api/users/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: formData.email, password: formData.password })
                });
                data = await res.json();
            }

            if (data.id) {
                localStorage.setItem('skillswap_user', JSON.stringify({ id: data.id, username: data.username }));
                setUser({ id: data.id, username: data.username });
                setShowAuth(false);
            } else {
                alert(data.error || 'Authentication failed. Please check your credentials.');
            }
        } catch (error) {
            alert('Server error. Ensure backend is running.');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('skillswap_user');
        setUser(null);
    };

    return (
        <>
            <nav className="nav-bar">
                <div className="container flex-between">
                    <Link to="/" className="logo flex-center" style={{ gap: '10px' }}>
                        <div style={{ background: 'var(--primary)', padding: '8px', borderRadius: '12px' }}>
                            <Code size={24} color="white" />
                        </div>
                        <span style={{ fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-0.5px' }}>
                            Skill<span style={{ color: 'var(--primary)' }}>Swap</span>
                        </span>
                    </Link>
                    <div className="nav-links">
                        <Link to="/" className={location.pathname === '/' ? 'active' : ''}>Home</Link>
                        <Link to="/dashboard" className={location.pathname === '/dashboard' ? 'active' : ''}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <LayoutDashboard size={18} />
                                Dashboard
                            </div>
                        </Link>
                        
                        {user ? (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginLeft: '10px' }}>
                                <Link to="/messages" className={location.pathname === '/messages' ? 'active' : ''}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <MessageCircle size={18} />
                                        Inbox
                                    </div>
                                </Link>
                                <div title="Timebank Credits" style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24', padding: '4px 10px', borderRadius: '15px', display: 'flex', alignItems: 'center', gap: '5px', fontWeight: 600, fontSize: '0.9rem', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
                                    <Coins size={14}/> 5 Hrs
                                </div>
                                <span style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                    <User size={16} /> {user.username}
                                </span>
                                <button className="btn-secondary" onClick={handleLogout} style={{ padding: '8px 16px', fontSize: '0.9rem' }}>Logout</button>
                            </div>
                        ) : (
                            <>
                                <button className="btn-secondary" style={{ marginLeft: '10px' }} onClick={() => setShowAuth(true)}>Sign In</button>
                                <button className="btn-primary" onClick={() => setShowAuth(true)}>Get Started</button>
                            </>
                        )}
                    </div>
                </div>
            </nav>

            {showAuth && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 9999, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <div className="glass-panel" style={{ padding: '40px', width: '100%', maxWidth: '400px', position: 'relative' }}>
                        <X size={24} style={{ position: 'absolute', top: '15px', right: '15px', cursor: 'pointer', color: 'var(--text-muted)' }} onClick={() => setShowAuth(false)} />
                        <h2 style={{ marginBottom: '20px' }}>Join SkillSwap</h2>
                        <form onSubmit={handleAuth} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            <input type="text" placeholder="Username" required value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})} />
                            <input type="email" placeholder="Email Address" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                            <input type="password" placeholder="Password" required value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
                            <button type="submit" className="btn-primary" style={{ marginTop: '10px' }}>Continue</button>
                            <span style={{fontSize: '0.85rem', color: 'var(--text-muted)'}}>No account needed beforehand. Simply enter details to create an account & login automatically.</span>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};

export default Navbar;
