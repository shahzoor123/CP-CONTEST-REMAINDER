async function fetchCodeforcesContests() {
    try {
        const response = await fetch('https://codeforces.com/api/contest.list');
        const data = await response.json();
        const contests = data.result.filter(contest => contest.phase === "BEFORE").reverse();
        
        const contestContainer = document.getElementById("codeforces-contests");
        contestContainer.innerHTML = ""; // Clear loading message
        
        if (contests.length === 0) {
            contestContainer.innerHTML = "<p class='text-gray-400'>No upcoming contests.</p>";
            return;
        }
        
        // Get current time and time two days from now
        const now = new Date();
        const twoDaysFromNow = new Date(now.getTime() + (2 * 24 * 60 * 60 * 1000));
        
        contests.forEach(contest => {
            const startTime = new Date(contest.startTimeSeconds * 1000);
            const duration = (contest.durationSeconds / 3600).toFixed(1) + " hrs";
            
            // Check if contest is happening within the next two days
            const isTwoDayContest = startTime >= now && startTime <= twoDaysFromNow;
            
            const contestCard = document.createElement('div');
            contestCard.className = `
                contest-item 
                p-4 
                border 
                rounded-lg 
                relative 
                transition-all 
                duration-300 
                hover:scale-105 
                hover:shadow-lg 
                cursor-pointer
                ${isTwoDayContest 
                    ? 'border-red-500 bg-red-900/20 hover:border-red-300' 
                    : 'border-blue-500 bg-gray-700 hover:border-blue-300'}
            `;
            
            // Main contest details
            contestCard.innerHTML = `
                <h3 class="text-lg font-bold ${isTwoDayContest ? 'text-red-400' : 'text-blue-400'}">
                    ${contest.name}
                </h3>
                <p class="text-sm ${isTwoDayContest ? 'text-red-200' : 'text-gray-300'}">
                    Starts: ${startTime.toLocaleString()}
                </p>
                <p class="text-sm ${isTwoDayContest ? 'text-red-200' : 'text-gray-300'}">
                    Duration: ${duration}
                </p>
                ${isTwoDayContest ? '<div class="absolute top-2 right-2 text-red-500 font-bold">SOON!</div>' : ''}
            `;
            
            // Hover tooltip
            const hoverTooltip = document.createElement('div');
            hoverTooltip.className = `
                absolute 
                z-10 
                bottom-full 
                left-1/2 
                transform 
                -translate-x-1/2 
                -translate-y-2 
                ${isTwoDayContest ? 'bg-red-900' : 'bg-blue-900'} 
                text-white 
                p-3 
                rounded-lg 
                shadow-lg 
                opacity-0 
                invisible 
                transition-all 
                duration-300 
                contest-tooltip 
                min-w-[250px] 
                text-center
            `;
            
            // Additional contest details in tooltip
            hoverTooltip.innerHTML = `
                <h4 class="font-bold ${isTwoDayContest ? 'text-red-300' : 'text-blue-300'} mb-2">
                    Contest Details
                </h4>
                <p><strong>ID:</strong> ${contest.id}</p>
                <p><strong>Type:</strong> ${contest.type}</p>
                <p><strong>Registered:</strong> ${contest.preparedBy || 'N/A'}</p>
                <a href="https://codeforces.com/contests/${contest.id}" 
                   target="_blank" 
                   class="${isTwoDayContest 
                       ? 'bg-red-500 hover:bg-red-600' 
                       : 'bg-blue-500 hover:bg-blue-600'} 
                   text-white px-3 py-1 rounded inline-block mt-2">
                    View Contest
                </a>
            `;
            
            // Append tooltip to contest card
            contestCard.appendChild(hoverTooltip);
            
            // Add event listeners for hover effects
            contestCard.addEventListener('mouseenter', () => {
                hoverTooltip.classList.remove('opacity-0', 'invisible');
                hoverTooltip.classList.add('opacity-100', 'visible');
            });
            
            contestCard.addEventListener('mouseleave', () => {
                hoverTooltip.classList.remove('opacity-100', 'visible');
                hoverTooltip.classList.add('opacity-0', 'invisible');
            });
            
            contestContainer.appendChild(contestCard);
        });
    } catch (error) {
        document.getElementById("codeforces-contests").innerHTML = "<p class='text-red-400'>Failed to load contests.</p>";
    }
}

async function fetchCodechefContests() {
    try {
        const response = await fetch('https://competeapi.vercel.app/contests/codechef/');
        const data = await response.json();
        const contests = data.future_contests; // Use future contests from the response
        
        const contestContainer = document.getElementById("codechef-contests");
        contestContainer.innerHTML = ""; // Clear loading message
        
        if (contests.length === 0) {
            contestContainer.innerHTML = "<p class='text-gray-400'>No upcoming contests.</p>";
            return;
        }
        
        // Get current time and time two days from now
        const now = new Date();
        const twoDaysFromNow = new Date(now.getTime() + (2 * 24 * 60 * 60 * 1000));
        
        contests.forEach(contest => {
            const startTime = new Date(contest.contest_start_date_iso);
            const duration = (contest.contest_duration / 60).toFixed(1) + " hrs";
            
            // Check if contest is happening within the next two days
            const isTwoDayContest = startTime >= now && startTime <= twoDaysFromNow;
            
            const contestCard = document.createElement('div');
            contestCard.className = `
                contest-item 
                p-4 
                border 
                rounded-lg 
                relative 
                transition-all 
                duration-500 
                hover:scale-105 
                hover:shadow-lg 
                cursor-pointer
                ${isTwoDayContest 
                    ? 'border-red-500 bg-red-900/20 hover:border-red-300' 
                    : 'border-blue-500 bg-gray-700 hover:border-blue-300'}
            `;
            
            // Main contest details
            contestCard.innerHTML = `
                <h3 class="text-lg font-bold ${isTwoDayContest ? 'text-red-400' : 'text-blue-400'}">
                    ${contest.contest_name}
                </h3>
                <p class="text-sm ${isTwoDayContest ? 'text-red-200' : 'text-gray-300'}">
                    Starts: ${startTime.toLocaleString()}
                </p>
                <p class="text-sm ${isTwoDayContest ? 'text-red-200' : 'text-gray-300'}">
                    Duration: ${duration}
                </p>
                ${isTwoDayContest ? '<div class="absolute top-2 right-2 text-red-500 font-bold">SOON!</div>' : ''}
            `;
            
            // Hover tooltip
            const hoverTooltip = document.createElement('div');
            hoverTooltip.className = `
                absolute 
                z-10 
                bottom-full 
                left-1/2 
                transform 
                -translate-x-1/2 
                -translate-y-2 
                ${isTwoDayContest ? 'bg-red-900' : 'bg-blue-900'} 
                text-white 
                p-3 
                rounded-lg 
                shadow-lg 
                opacity-0 
                invisible 
                transition-all 
                duration-300 
                contest-tooltip 
                min-w-[250px] 
                text-center
            `;
            
            // Additional contest details in tooltip
            hoverTooltip.innerHTML = `
                <h4 class="font-bold ${isTwoDayContest ? 'text-red-300' : 'text-blue-300'} mb-2">
                    Contest Details
                </h4>
                <p><strong>ID:</strong> ${contest.contest_name}</p>
                <p><strong>Type:</strong> ${contest.contest_type}</p>
                <p><strong>Registered:</strong> ${contest.prepared_by || 'N/A'}</p>
                <a href="https://www.codechef.com/contests/${contest.id}" 
                   target="_blank" 
                   class="${isTwoDayContest 
                       ? 'bg-red-500 hover:bg-red-600' 
                       : 'bg-blue-500 hover:bg-blue-600'} 
                   text-white px-3 py-1 rounded inline-block mt-2">
                    View Contest
                </a>
            `;
            
            // Append tooltip to contest card
            contestCard.appendChild(hoverTooltip);
            
            // Add event listeners for hover effects
            contestCard.addEventListener('mouseenter', () => {
                hoverTooltip.classList.remove('opacity-0', 'invisible');
                hoverTooltip.classList.add('opacity-100', 'visible');
            });
            
            contestCard.addEventListener('mouseleave', () => {
                hoverTooltip.classList.remove('opacity-100', 'visible');
                hoverTooltip.classList.add('opacity-0', 'invisible');
            });
            
            // Append contest card to the container
            contestContainer.appendChild(contestCard);
        });
    } catch (error) {
        document.getElementById("codechef-contests").innerHTML = "<p class='text-red-400'>Failed to load contests.</p>";
    }
}

async function fetchLeetCodeContests() {
    try {
        const response = await fetch('https://competeapi.vercel.app/contests/leetcode/');
        const data = await response.json();
        const contests = data.data.topTwoContests; // Use top two contests from the response
        
        const contestContainer = document.getElementById("leetcode-contests");
        contestContainer.innerHTML = ""; // Clear loading message
        
        if (contests.length === 0) {
            contestContainer.innerHTML = "<p class='text-gray-400'>No upcoming contests.</p>";
            return;
        }
        
        // Get current time and time two days from now
        const now = new Date();
        const twoDaysFromNow = new Date(now.getTime() + (2 * 24 * 60 * 60 * 1000));
        
        contests.forEach(contest => {
            const startTime = new Date(contest.startTime * 1000);
            const duration = (contest.duration / 3600).toFixed(1) + " hrs";
            
            // Check if contest is happening within the next two days
            const isTwoDayContest = startTime >= now && startTime <= twoDaysFromNow;
            
            const contestCard = document.createElement('div');
            contestCard.className = `
                contest-item 
                p-4 
                border 
                rounded-lg 
                relative 
                transition-all 
                duration-500 
                hover:scale-105 
                hover:shadow-lg 
                cursor-pointer
                ${isTwoDayContest 
                    ? 'border-red-500 bg-red-900/20 hover:border-red-300' 
                    : 'border-blue-500 bg-gray-700 hover:border-blue-300'}
            `;
            
            // Main contest details
            contestCard.innerHTML = `
                <h3 class="text-lg font-bold ${isTwoDayContest ? 'text-red-400' : 'text-blue-400'}">
                    ${contest.title}
                </h3>
                <p class="text-sm ${isTwoDayContest ? 'text-red-200' : 'text-gray-300'}">
                    Starts: ${startTime.toLocaleString()}
                </p>
                <p class="text-sm ${isTwoDayContest ? 'text-red-200' : 'text-gray-300'}">
                    Duration: ${duration}
                </p>
                ${isTwoDayContest ? '<div class="absolute top-2 right-2 text-red-500 font-bold">SOON!</div>' : ''}
            `;
            
            // Hover tooltip
            const hoverTooltip = document.createElement('div');
            hoverTooltip.className = `
                absolute 
                z-10 
                bottom-full 
                left-1/2 
                transform 
                -translate-x-1/2 
                -translate-y-2 
                ${isTwoDayContest ? 'bg-red-900' : 'bg-blue-900'} 
                text-white 
                p-3 
                rounded-lg 
                shadow-lg 
                opacity-0 
                invisible 
                transition-all 
                duration-300 
                contest-tooltip 
                min-w-[250px] 
                text-center
            `;
            
            // Additional contest details in tooltip
            hoverTooltip.innerHTML = `
                <h4 class="font-bold ${isTwoDayContest ? 'text-red-300' : 'text-blue-300'} mb-2">
                    Contest Details
                </h4>
                <p><strong>ID:</strong> ${contest.title}</p>
                <p><strong>Type:</strong> ${contest.type}</p>
                <p><strong>Registered:</strong> ${contest.preparedBy || 'N/A'}</p>
                <a href="https://leetcode.com/contest" 
                   target="_blank" 
                   class="${isTwoDayContest 
                       ? 'bg-red-500 hover:bg-red-600' 
                       : 'bg-blue-500 hover:bg-blue-600'} 
                   text-white px-3 py-1 rounded inline-block mt-2">
                    View Contest
                </a>
            `;
            
            // Append tooltip to contest card
            contestCard.appendChild(hoverTooltip);
            
            // Add event listeners for hover effects
            contestCard.addEventListener('mouseenter', () => {
                hoverTooltip.classList.remove('opacity-0', 'invisible');
                hoverTooltip.classList.add('opacity-100', 'visible');
            });
            
            contestCard.addEventListener('mouseleave', () => {
                hoverTooltip.classList.remove('opacity-100', 'visible');
                hoverTooltip.classList.add('opacity-0', 'invisible');
            });
            
            // Append contest card to the container
            contestContainer.appendChild(contestCard);
        });
    } catch (error) {
        document.getElementById("leetcode-contests").innerHTML = "<p class='text-red-400'>Failed to load contests.</p>";
    }
}

fetchCodeforcesContests();
fetchCodechefContests();
fetchLeetCodeContests();