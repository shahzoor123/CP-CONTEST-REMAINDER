const TWO_DAYS = 2 * 24 * 60 * 60 * 1000;
const timerMap = {}; // id -> startDate

function fmtDate(d) {
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + ' ' +
        d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
}

function fmtDur(secs) {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    return h > 0 ? (m > 0 ? `${h}h ${m}m` : `${h}h`) : `${m}m`;
}

function countdown(start) {
    const diff = start - new Date();
    if (diff <= 0) return 'starting now';
    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    if (d > 0) return `in ${d}d ${h}h`;
    if (h > 0) return `in ${h}h ${m}m`;
    return `in ${m}m`;
}

// Refresh all countdowns every 30 seconds
setInterval(() => {
    Object.entries(timerMap).forEach(([id, start]) => {
        const el = document.getElementById(id);
        if (el) el.textContent = countdown(start);
    });
}, 30000);

function buildCard(contest, index, platform) {
    const { name, start, durSecs, url } = contest;
    const isSoon = (start - new Date()) < TWO_DAYS && start > new Date();
    const timerId = `timer-${platform}-${index}`;
    timerMap[timerId] = start;

    const card = document.createElement('div');
    card.className = `contest-item p-4 border rounded-lg relative cursor-default transition-all duration-300 hover:scale-105 ${
        isSoon
            ? 'border-red-500 bg-red-900/20 hover:border-red-300'
            : 'border-blue-500 bg-gray-700 hover:border-blue-300'
    }`;

    card.innerHTML = `
        <div class="flex items-start justify-between gap-2">
            <h3 class="text-sm font-bold ${isSoon ? 'text-red-400' : 'text-blue-400'} leading-snug">
                ${name}
            </h3>
            ${isSoon ? `<span class="text-xs font-bold text-red-400 bg-red-900/40 border border-red-500 px-2 py-0.5 rounded shrink-0">SOON</span>` : ''}
        </div>

        <div class="mt-2 space-y-1 text-xs ${isSoon ? 'text-red-200' : 'text-gray-300'}">
            <p>📅 ${fmtDate(start)}</p>
            <p>⏱ ${fmtDur(durSecs)}</p>
            <p id="${timerId}" class="font-mono ${isSoon ? 'text-red-300' : 'text-blue-300'}">${countdown(start)}</p>
        </div>

        <a href="${url}" target="_blank"
           class="mt-3 inline-block text-xs px-3 py-1 rounded ${
               isSoon ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'
           } text-white transition-colors">
            View Contest →
        </a>
    `;

    return card;
}

// ─── Codeforces ───────────────────────────────────────────────────────────────

async function fetchCodeforcesContests() {
    const container = document.getElementById('codeforces-contests');
    try {
        const res = await fetch('https://codeforces.com/api/contest.list');
        const data = await res.json();
        const upcoming = data.result
            .filter(c => c.phase === 'BEFORE')
            .reverse();

        container.innerHTML = '';
        if (!upcoming.length) {
            container.innerHTML = "<p class='text-gray-400'>No upcoming contests.</p>";
            return;
        }

        // Summary line
        const soon = upcoming.filter(c => (new Date(c.startTimeSeconds * 1000) - new Date()) < TWO_DAYS);
        const summary = document.createElement('p');
        summary.className = 'text-xs text-gray-400 mb-3';
        summary.textContent = `${upcoming.length} upcoming${soon.length ? ` · ${soon.length} within 48h` : ''}`;
        container.appendChild(summary);

        upcoming.forEach((c, i) => {
            container.appendChild(buildCard({
                name: c.name,
                start: new Date(c.startTimeSeconds * 1000),
                durSecs: c.durationSeconds,
                url: `https://codeforces.com/contest/${c.id}`
            }, i, 'cf'));
        });

    } catch (e) {
        container.innerHTML = "<p class='text-red-400'>Failed to load Codeforces contests.</p>";
    }
}

// ─── CodeChef ─────────────────────────────────────────────────────────────────

async function fetchCodechefContests() {
    const container = document.getElementById('codechef-contests');
    try {
        const res = await fetch('https://competeapi.vercel.app/contests/codechef/');
        const data = await res.json();
        const upcoming = data.future_contests || [];

        container.innerHTML = '';
        if (!upcoming.length) {
            container.innerHTML = "<p class='text-gray-400'>No upcoming contests.</p>";
            return;
        }

        const soon = upcoming.filter(c => (new Date(c.contest_start_date_iso) - new Date()) < TWO_DAYS);
        const summary = document.createElement('p');
        summary.className = 'text-xs text-gray-400 mb-3';
        summary.textContent = `${upcoming.length} upcoming${soon.length ? ` · ${soon.length} within 48h` : ''}`;
        container.appendChild(summary);

        upcoming.forEach((c, i) => {
            container.appendChild(buildCard({
                name: c.contest_name,
                start: new Date(c.contest_start_date_iso),
                durSecs: c.contest_duration * 60,
                url: `https://www.codechef.com/contests/${c.contest_code || ''}`
            }, i, 'cc'));
        });

    } catch (e) {
        container.innerHTML = "<p class='text-red-400'>Failed to load CodeChef contests.</p>";
    }
}

// ─── LeetCode ─────────────────────────────────────────────────────────────────

async function fetchLeetCodeContests() {
    const container = document.getElementById('leetcode-contests');
    try {
        const res = await fetch('https://competeapi.vercel.app/contests/leetcode/');
        const data = await res.json();
        const upcoming = data.data.topTwoContests || [];

        container.innerHTML = '';
        if (!upcoming.length) {
            container.innerHTML = "<p class='text-gray-400'>No upcoming contests.</p>";
            return;
        }

        const summary = document.createElement('p');
        summary.className = 'text-xs text-gray-400 mb-3';
        summary.textContent = `${upcoming.length} upcoming`;
        container.appendChild(summary);

        upcoming.forEach((c, i) => {
            container.appendChild(buildCard({
                name: c.title,
                start: new Date(c.startTime * 1000),
                durSecs: c.duration,
                url: `https://leetcode.com/contest/${c.titleSlug || ''}`
            }, i, 'lc'));
        });

    } catch (e) {
        container.innerHTML = "<p class='text-red-400'>Failed to load LeetCode contests.</p>";
    }
}

fetchCodeforcesContests();
fetchCodechefContests();
fetchLeetCodeContests();