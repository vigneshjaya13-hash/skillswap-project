const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
const log = (msg) => console.log(`\x1b[36m[LIVE DEMO]\x1b[0m ${new Date().toLocaleTimeString()} - ${msg}`);

async function runDemo() {
    const API = 'http://localhost:5000/api';
    console.log('\n=============================================');
    console.log('🌟 SKILL SWAP LIVE DEMONSTRATION 🌟');
    console.log('=============================================\n');

    try {
        // 1. Register User A
        log("👤 Creating User A: 'Alice the Expert'");
        let resA = await fetch(`${API}/users/register`, {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: 'AliceDemo', email: `alice${Date.now()}@test.com`, password: 'password123' })
        });
        const alice = await resA.json();
        log(`✅ Alice registered successfully! (ID: ${alice.id})`);
        await sleep(1000);

        // 2. Register User B
        log("👤 Creating User B: 'Bob the Learner'");
        let resB = await fetch(`${API}/users/register`, {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: 'BobDemo', email: `bob${Date.now()}@test.com`, password: 'password123' })
        });
        const bob = await resB.json();
        log(`✅ Bob registered successfully! (ID: ${bob.id})`);
        await sleep(1000);

        // 3. Alice Posts a Skill
        log(`📝 Alice is posting a new offered skill on the Dashboard...`);
        let resSkill = await fetch(`${API}/skills`, {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                user_id: alice.id, 
                name: 'Mastering React & Vite 2026', 
                description: 'I will teach you how to build fast web apps!',
                category: 'Development',
                type: 'offered'
            })
        });
        const skill = await resSkill.json();
        log(`✅ Skill created successfully! (Skill ID: ${skill.id})`);
        await sleep(1500);

        // 4. Bob Requests the Swap
        log(`👀 Bob sees Alice's skill and clicks "Request to Learn"...`);
        let resSwap = await fetch(`${API}/swaps`, {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                requester_id: bob.id, 
                provider_id: alice.id,
                skill_id: skill.id
            })
        });
        const swap = await resSwap.json();
        log(`📬 Swap request heavily routed to Alice's Inbox. (Status: ${swap.status.toUpperCase()})`);
        await sleep(1500);

        // 5. Alice Checks Inbox and Accepts
        log(`📩 Alice opens her Inbox and sees a request from Bob...`);
        let resInbox = await fetch(`${API}/swaps/${alice.id}`);
        const inbox = await resInbox.json();
        const pendingSwap = inbox.find(s => s.id === swap.id);
        log(`🔍 Alice sees: "${pendingSwap.requester_name} wants to learn ${pendingSwap.skill_name}!"`);
        await sleep(1000);
        
        log(`🤝 Alice clicks "Approve". Updating database...`);
        let resAccept = await fetch(`${API}/swaps/${swap.id}`, {
            method: 'PUT', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: 'accepted' })
        });
        const acceptedSwap = await resAccept.json();
        log(`🎉 Database Update: Swap ID ${swap.id} new status ===> ${acceptedSwap.status.toUpperCase()}`);
        await sleep(500);

        console.log('\n=============================================');
        console.log('✨ DEMONSTRATION COMPLETE: The Swap was successful! ✨');
        console.log('=============================================\n');

    } catch (e) {
        console.error("Demo failed:", e);
    }
}

runDemo();
