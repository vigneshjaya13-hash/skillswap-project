import React, { useState, useEffect } from 'react';
import { Search, Plus, Filter, X } from 'lucide-react';

const Dashboard = () => {
    const [skills, setSkills] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [showAddModal, setShowAddModal] = useState(false);
    
    // Live UI State
    const [requestedSkills, setRequestedSkills] = useState(new Set());
    const [activityLog, setActivityLog] = useState(() => {
        const saved = localStorage.getItem('skillswap_activity');
        return saved ? JSON.parse(saved) : [{ time: new Date().toLocaleTimeString(), msg: "Welcome to your SkillSwap Dashboard!" }];
    });
    const [upcomingSkills, setUpcomingSkills] = useState([]);

    // Add Skill Form State
    const [newSkill, setNewSkill] = useState({ name: '', description: '', category: 'Development', type: 'offered', resource_link: '' });

    const logActivity = (msg) => {
        setActivityLog(prev => {
            const newLog = [{ time: new Date().toLocaleTimeString(), msg }, ...prev].slice(0, 10);
            localStorage.setItem('skillswap_activity', JSON.stringify(newLog));
            return newLog;
        });
    };

    const fetchSkills = async () => {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '' : 'http://localhost:5000')}/api/skills`);
            if (res.ok) {
                const data = await res.json();
                setSkills(data.length > 0 ? data : getMockSkills());
            } else {
                setSkills(getMockSkills());
            }
        } catch (err) {
            setSkills(getMockSkills());
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSkills();

        // Automated AI Feed: Adds upcoming skills to the site every 10 seconds to keep content fresh
        const upcoming = [
            "Quantum Computing Basics", "Rust WebAssembly Masterclass", "Advanced Go Microservices", 
            "Prompt Engineering Pro", "SvelteKit Animations", "Unreal Engine 5 Metahumans",
            "iOS Swift UI Interfaces", "Web3 Solana Contracts", "Zero-Knowledge Proofs 101"
        ];
        let index = Math.floor(Math.random() * upcoming.length);
        const interval = setInterval(() => {
            setUpcomingSkills(prev => [{
                id: 'upc' + Date.now(),
                name: upcoming[index % upcoming.length],
                description: 'Automated Upcoming Skill 🔥 Content dropping soon!',
                type: 'upcoming',
                username: 'SkillSwap_AutoEngine'
            }, ...prev].slice(0, 3));
            index++;
        }, 8000); 

        return () => clearInterval(interval);
    }, []);

    const getMockSkills = () => [];

    const getCurrentUser = () => {
        const stored = localStorage.getItem('skillswap_user');
        return stored ? JSON.parse(stored) : null;
    };

    const handleAddSkill = async (e) => {
        e.preventDefault();
        const user = getCurrentUser();
        if (!user) {
            alert("Please Sign In from the top right to add a skill.");
            setShowAddModal(false);
            return;
        }

        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '' : 'http://localhost:5000')}/api/skills`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...newSkill, user_id: user.id })
            });
            if (res.ok) {
                setShowAddModal(false);
                logActivity(`Successfully posted a new skill: ${newSkill.name}`);
                setNewSkill({ name: '', description: '', category: 'Development', type: 'offered', resource_link: '' });
                fetchSkills(); 
            } else {
                console.error("Error adding skill.");
            }
        } catch (error) {
            console.error("Network error.");
        }
    };

    const handleSwapRequest = async (skill) => {
        const user = getCurrentUser();
        if (!user) {
            alert("Please Sign In from the top right to start swapping!");
            return;
        }
        
        if (skill.user_id && user.id === skill.user_id) {
            alert("You cannot request a swap on your own listing!");
            return;
        }

        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '' : 'http://localhost:5000')}/api/swaps`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    requester_id: user.id,
                    provider_id: skill.user_id || 1, // fallback to 1 if mocked
                    skill_id: skill.id
                })
            });
            if (res.ok) {
                // Instantly update UI visually instead of blocking alert
                setRequestedSkills(prev => new Set([...prev, skill.id]));
                logActivity(`Sent swap request to @${skill.username} for "${skill.name}" 🤝`);
            } else {
                console.error("Could not send swap request.");
            }
        } catch (error) {
            console.error("Network error sending request.");
        }
    };

    const filteredSkills = skills.filter(s => filter === 'all' ? true : s.type === filter);

    return (
        <div className="container" style={{ padding: '40px 24px' }}>
            <div className="flex-between" style={{ marginBottom: '30px', flexWrap: 'wrap', gap: '20px' }}>
                <h2>Skill Dashboard</h2>
                <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }} onClick={() => setShowAddModal(true)}>
                    <Plus size={18} /> Add Skill
                </button>
            </div>

            <div className="glass-panel" style={{ padding: '20px', display: 'flex', gap: '20px', marginBottom: '30px', flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: '250px', position: 'relative' }}>
                    <Search size={20} style={{ position: 'absolute', top: '12px', left: '15px', color: 'var(--text-muted)' }} />
                    <input type="text" placeholder="Search for skills..." style={{ paddingLeft: '45px' }} />
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button className={`btn-secondary ${filter === 'all' ? 'btn-primary' : ''}`} onClick={() => setFilter('all')}>All</button>
                    <button className={`btn-secondary ${filter === 'offered' ? 'btn-primary' : ''}`} onClick={() => setFilter('offered')}>Offered</button>
                    <button className={`btn-secondary ${filter === 'requested' ? 'btn-primary' : ''}`} onClick={() => setFilter('requested')}>Requested</button>
                </div>
            </div>

            {loading ? (
                <div className="flex-center" style={{ height: '200px' }}>
                    <div style={{ color: 'var(--primary)', fontSize: '1.2rem' }}>Loading skills...</div>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '30px' }}>
                    <div className="dashboard-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
                        {filteredSkills.map(skill => (
                            <div key={skill.id} className="glass-panel skill-card">
                                <div className="flex-between" style={{ marginBottom: '10px' }}>
                                    <span className={`badge ${skill.type === 'offered' ? 'badge-offered' : 'badge-requested'}`}>
                                        {skill.type}
                                    </span>
                                    <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>by @{skill.username}</span>
                                </div>
                                <h3 style={{ fontSize: '1.3rem', marginBottom: '10px' }}>{skill.name}</h3>
                                <p style={{ color: 'var(--text-muted)', lineHeight: 1.5, flex: 1 }}>{skill.description}</p>
                                
                                {skill.resource_link && (
                                    <a href={skill.resource_link} target="_blank" rel="noreferrer" style={{ textDecoration: 'none' }}>
                                        <button className="btn-secondary" style={{ marginTop: '15px', width: '100%', borderColor: 'var(--primary)', color: 'var(--primary)' }}>
                                            📚 View Uploaded Content
                                        </button>
                                    </a>
                                )}
                                
                                <button 
                                    className={requestedSkills.has(skill.id) ? "btn-secondary" : "btn-primary"} 
                                    style={{ 
                                        marginTop: '10px', width: '100%', 
                                        background: requestedSkills.has(skill.id) ? 'rgba(16, 185, 129, 0.2)' : '',
                                        borderColor: requestedSkills.has(skill.id) ? '#10b981' : '',
                                        color: requestedSkills.has(skill.id) ? '#34d399' : '',
                                        pointerEvents: requestedSkills.has(skill.id) ? 'none' : 'auto'
                                    }} 
                                    onClick={() => handleSwapRequest(skill)}
                                >
                                    {requestedSkills.has(skill.id) ? 'Requested ✅' : (skill.type === 'offered' ? 'Request to Learn' : 'Offer to Teach')}
                                </button>
                            </div>
                        ))}
                        {filteredSkills.length === 0 && (
                            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                                No skills found matching your criteria.
                            </div>
                        )}
                    </div>

                    {/* Right Sidebar for Live Features */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <div className="glass-panel" style={{ padding: '20px' }}>
                            <h3 style={{ marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                ⚡ Live Upcoming Skills
                            </h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                {upcomingSkills.length > 0 ? upcomingSkills.map(s => (
                                    <div key={s.id} style={{ padding: '10px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', borderLeft: '3px solid #fbbf24', animation: 'fadeIn 0.5s ease' }}>
                                        <h4 style={{ fontSize: '0.95rem', margin: '0 0 5px 0' }}>{s.name}</h4>
                                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{s.description}</span>
                                    </div>
                                )) : <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Scanning network for drops...</div>}
                            </div>
                        </div>

                        <div className="glass-panel" style={{ padding: '20px' }}>
                            <h3 style={{ marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                🕒 Recent Activity (Autosaved)
                            </h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '300px', overflowY: 'auto', paddingRight: '5px' }}>
                                {activityLog.map((log, i) => (
                                    <div key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px', fontSize: '0.9rem' }}>
                                        <div style={{ color: 'var(--primary)', fontSize: '0.8rem', marginBottom: '3px' }}>{log.time}</div>
                                        <div style={{ color: 'var(--text-main)' }}>{log.msg}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {showAddModal && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 9999, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <div className="glass-panel" style={{ padding: '40px', width: '100%', maxWidth: '500px', position: 'relative' }}>
                        <X size={24} style={{ position: 'absolute', top: '15px', right: '15px', cursor: 'pointer', color: 'var(--text-muted)' }} onClick={() => setShowAddModal(false)} />
                        <h2 style={{ marginBottom: '20px' }}>Post a Skill</h2>
                        <form onSubmit={handleAddSkill} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            <input type="text" placeholder="Skill Name (e.g., Python Basics)" required value={newSkill.name} onChange={e => setNewSkill({...newSkill, name: e.target.value})} />
                            <textarea placeholder="Describe your skill or what you want to learn..." required rows="3" value={newSkill.description} onChange={e => setNewSkill({...newSkill, description: e.target.value})}></textarea>
                            <input type="url" placeholder="Link to Course Material / Uploads (Optional)" value={newSkill.resource_link} onChange={e => setNewSkill({...newSkill, resource_link: e.target.value})} />
                            <select value={newSkill.category} onChange={e => setNewSkill({...newSkill, category: e.target.value})}>
                                <option value="Development">Development</option>
                                <option value="Design">Design</option>
                                <option value="Languages">Languages</option>
                                <option value="Soft Skills">Soft Skills</option>
                                <option value="Other">Other</option>
                            </select>
                            <select value={newSkill.type} onChange={e => setNewSkill({...newSkill, type: e.target.value})}>
                                <option value="offered">I am Offering to Teach This</option>
                                <option value="requested">I am Requesting to Learn This</option>
                            </select>
                            <button type="submit" className="btn-primary" style={{ marginTop: '10px' }}>Post to Dashboard</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
