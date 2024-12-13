// Fetch and display teams in the dropdown
fetch('/teams')
  .then(response => response.json())
  .then(teams => {
    // Sort teams alphabetically by name
    teams.sort((a, b) => a.name.localeCompare(b.name));

    const select = document.getElementById('team-select');
    teams.forEach(team => {
      const option = document.createElement('option');
      option.value = team.id;
      option.textContent = team.name;
      select.appendChild(option);
    });
  });

// Fetch and display stats and players when a team is selected
document.getElementById('team-select').addEventListener('change', function() {
  const teamId = this.value;
  const teamStatsDiv = document.getElementById('team-stats');
  const playerSelectDiv = document.querySelector('.player-select');
  const playerInfoDiv = document.getElementById('player-info');
  const playerSelect = document.getElementById('player-select');

  // Reset info sections and dropdown when team is unselected or changed
  playerInfoDiv.innerHTML = '';
  playerInfoDiv.style.display = 'none';
  playerSelect.innerHTML = '<option value="">Select a player</option>'; // Reset player dropdown
  playerSelectDiv.style.display = 'none';
  teamStatsDiv.style.display = 'none';

  // If no team is selected, return early
  if (!teamId) return;

  fetch(`/team-stats/${teamId}`)
    .then(response => response.json())
    .then(data => {
      // Display team stats
      const statsInfo = document.getElementById('stats-info');
      statsInfo.innerHTML = `
        <div><strong>Team Name:</strong> ${data.stats.name} - ${data.stats.abbreviation}</div>
        <div><strong>Division:</strong> ${data.stats.division}</div>
        <div><strong>Venue:</strong> ${data.stats.venue}</div>
        <div><strong>First Year of Play:</strong> ${data.stats.firstYear}</div>
      `;
      
      // Sort players alphabetically by full name
      playerSelect.innerHTML = '<option value="">Select a player</option>';  // Reset player select dropdown
      data.roster.sort((a, b) => a.fullName.localeCompare(b.fullName));  // Sort by player name

      data.roster.forEach(player => {
        const option = document.createElement('option');
        option.value = player.personId;
        option.textContent = `${player.fullName} - #${player.jerseyNumber} - ${player.position}`;
        playerSelect.appendChild(option);
      });

      // Show the team stats and player dropdown
      teamStatsDiv.style.display = 'block';
      playerSelectDiv.style.display = 'block';
    })
    .catch(error => {
      document.getElementById('stats-info').innerHTML = `<p>Error fetching stats.</p>`;
      teamStatsDiv.style.display = 'none'; // Hide the team stats if error occurs
      playerSelectDiv.style.display = 'none'; // Hide player dropdown if error occurs
    });
});

// Fetch and display player info when a player is selected
document.getElementById('player-select').addEventListener('change', function() {
  const personId = this.value;
  const playerInfoDiv = document.getElementById('player-info');

  if (personId) {
    fetch(`/player-info/${personId}`)
      .then(response => response.json())
      .then(data => {
        // Display player info with formatted details
        const playerInfo = data;

        playerInfoDiv.innerHTML = `
          <h2>Player Info</h2>
          <div><strong>Name:</strong> ${playerInfo.fullName}</div>
          <div><strong>Nickname:</strong> ${playerInfo.nickname || 'N/A'}</div>
          <div><strong>Position:</strong> ${playerInfo.position}</div>
          <div><strong>Bats / Throws:</strong> ${playerInfo.batSide} / ${playerInfo.pitchHand}</div>
          <div><strong>Height, Weight:</strong> ${playerInfo.height}, ${playerInfo.weight} lbs</div>
          <div><strong>Born:</strong> ${playerInfo.birthDate} in ${playerInfo.birthPlace}</div>
          <div><strong>Debuted:</strong> ${playerInfo.debutDate || 'N/A'}</div>
        `;

        // Make sure the player info section is visible
        playerInfoDiv.style.display = 'block';
      })
      .catch(error => {
        playerInfoDiv.innerHTML = `<p>Error fetching player information.</p>`;
        playerInfoDiv.style.display = 'block';  // Show even if there is an error
      });
  } else {
    // Clear player info if no player is selected
    playerInfoDiv.innerHTML = '';
    playerInfoDiv.style.display = 'none'; // Hide player info section if no player is selected
  }
});
