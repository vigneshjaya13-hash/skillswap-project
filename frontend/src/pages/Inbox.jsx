import React, { useState, useEffect } from 'react';
import { Mail, Check, X } from 'lucide-react';

const Inbox = () => {
    const [swaps, setSwaps] = useState([]);
    const [loading, setLoading] = useState(true);

    const getCurrentUser = () => {
        const stored = localStorage.getItem('skillswap_user');
        return stored ? JSON.parse(stored) : null;
    };
    const user = getCurrentUser();

    useEffect(() => {
        if (!user) { setLoading(false); return; }
        const fetchSwaps = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '' : 'http://localhost:5000')}/api/swaps/${user.id}`);
                const data = await res.json();
                setSwaps(Array.isArray(data) ? data : []);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchSwaps();
    }, [user]);

    const handleUpdateStatus = async (id, newStatus) => {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '' : 'http://localhost:5000')}/api/swaps/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            });
            if (res.ok) {
                setSwaps(swaps.map(s => s.id === id ? { ...s, status: newStatus } : s));
            }
        } catch (error) {
            alert('Error updating status');
        }
    };

    if (!user) return <div className="container flex-center" style={{ height: '50vh' }}><h2>Please Sign In to view your Inbox.</h2></div>;

    const incoming = swaps.filter(s => s.provider_id === user.id);
    const outgoing = swaps.filter(s => s.requester_id === user.id);

    const renderSwapCard = (s, isIncoming) => (
        <div key={s.id} className="glass-panel" style={{ padding: '20px', marginBottom: '15px' }}>
            <div className="flex-between">
                <div>
                    <h4 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>{s.skill_name}</h4>
                    <p style={{ color: 'var(--text-muted)' }}>
                        {isIncoming ? `Request from: @${s.requester_name}` : `Sent to: @${s.provider_name}`}
                    </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                    <span style={{ 
                        padding: '6px 12px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 600,
                        background: s.status === 'pending' ? 'rgba(245, 158, 11, 0.2)' : 
                                  s.status === 'accepted' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                        color: s.status === 'pending' ? '#fbbf24' : 
                               s.status === 'accepted' ? '#34d399' : '#f87171'
                    }}>
                        {s.status.toUpperCase()}
                    </span>
                </div>
            </div>
            
            {isIncoming && s.status === 'pending' && (
                <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
                    <button className="btn-primary" style={{ background: '#10b981', display: 'flex', alignItems: 'center', gap: '5px' }} onClick={() => handleUpdateStatus(s.id, 'accepted')}>
                        <Check size={16} /> Accept Request
                    </button>
                    <button className="btn-secondary" style={{ color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.3)', display: 'flex', alignItems: 'center', gap: '5px' }} onClick={() => handleUpdateStatus(s.id, 'rejected')}>
                        <X size={16} /> Reject
                    </button>
                </div>
            )}
            
            {s.status === 'accepted' && (
                <div style={{ marginTop: '20px', padding: '15px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px' }}>
                    <p style={{ margin: 0, fontSize: '0.95rem', marginBottom: '10px' }}>
                        🎉 Handshake Complete! You can now contact {isIncoming ? `@${s.requester_name}` : `@${s.provider_name}`}.
                    </p>
                    <a href={`mailto:${isIncoming ? s.requester_email : s.provider_email}?subject=SkillSwap:%20Let's%20learn%20${s.skill_name}`} style={{ textDecoration: 'none' }}>
                        <button className="btn-secondary" style={{ width: '100%', display: 'flex', justifyContent: 'center', gap: '8px', color: 'var(--primary)', borderColor: 'var(--primary)' }}>
                            <Mail size={16} /> Send Email Invitation
                        </button>
                    </a>
                </div>
            )}
        </div>
    );

    return (
        <div className="container" style={{ padding: '40px 24px' }}>
            <h2 style={{ marginBottom: '30px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Mail size={28} color="var(--primary)"/> My Swap Inbox
            </h2>
            
            {/* Split view for larger screens, stacking for mobile */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '40px' }}>
                <div>
                    <h3 style={{ marginBottom: '20px', color: 'var(--text-muted)' }}>📥 Incoming Requests (To Teach)</h3>
                    {loading ? <p>Loading...</p> : incoming.length > 0 ? incoming.map(s => renderSwapCard(s, true)) : <p className="glass-panel" style={{padding: '20px', textAlign: 'center', color: 'var(--text-muted)'}}>No incoming requests yet.</p>}
                </div>
                <div>
                    <h3 style={{ marginBottom: '20px', color: 'var(--text-muted)' }}>📤 Outgoing Requests (To Learn)</h3>
                    {loading ? <p>Loading...</p> : outgoing.length > 0 ? outgoing.map(s => renderSwapCard(s, false)) : <p className="glass-panel" style={{padding: '20px', textAlign: 'center', color: 'var(--text-muted)'}}>No outgoing requests yet.</p>}
                </div>
            </div>
        </div>
    );
};

export default Inbox;
