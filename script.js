const drawTeamBtn = document.getElementById('drawTeamBtn');
const formationButtons = document.getElementById('formationButtons');
const teamPoolInfo = document.getElementById('teamPoolInfo');
const currentDrawSection = document.getElementById('currentDrawSection');
const currentTeamName = document.getElementById('currentTeamName');
const currentFormationName = document.getElementById('currentFormationName');
const pitchMap = document.getElementById('pitchMap');
const playerSelect = document.getElementById('playerSelect');
const slotSelect = document.getElementById('slotSelect');
const addPlayerBtn = document.getElementById('addPlayerBtn');
const skipTeamBtn = document.getElementById('skipTeamBtn');
const currentStatus = document.getElementById('currentStatus');
const squadSection = document.getElementById('squadSection');
const squadList = document.getElementById('squadList');
const selectedCount = document.getElementById('selectedCount');
const simulateBtn = document.getElementById('simulateBtn');
const simulationResults = document.getElementById('simulationResults');

let worldcupData = null;
let selectedFormation = null;
let currentDrawTeam = null;
let remainingTeams = [];
let usedTeamIds = new Set();
let selectedPlayerIds = new Set();
let selectedPlayers = [];
let customPlayerStats = {};
let tournamentPlayerStats = {};
let skipUsed = false;

const positionCategories = {
  GK: ['GK'],
  LB: ['LB', 'LWB', 'CB', 'RB', 'RWB'],
  RB: ['RB', 'RWB', 'CB', 'LB', 'LWB'],
  CB: ['CB', 'LB', 'RB', 'RWB', 'LWB'],
  LWB: ['LWB', 'LB', 'CB', 'RB'],
  RWB: ['RWB', 'RB', 'CB', 'LB'],
  CM: ['CM', 'CDM', 'CAM', 'LM', 'RM'],
  CAM: ['CAM', 'CM', 'CF', 'ST', 'RW', 'LW'],
  CDM: ['CDM', 'CM', 'CAM', 'LM', 'RM'],
  CF: ['CF', 'ST', 'CAM', 'RW', 'LW'],
  LM: ['LM', 'LW', 'CM', 'CAM', 'WB'],
  RM: ['RM', 'RW', 'CM', 'CAM', 'WB'],
  LW: ['LW', 'LM', 'ST', 'CAM', 'RW'],
  RW: ['RW', 'RM', 'ST', 'CAM', 'LW'],
  ST: ['ST', 'CF', 'CAM', 'RW', 'LW']
};

const formationLayouts = {
  '4-3-3': [
    ['GK'],
    ['LB', 'CB', 'CB', 'RB'],
    ['CM', 'CM', 'CAM'],
    ['LW', 'ST', 'RW']
  ],
  '4-4-2': [
    ['GK'],
    ['LB', 'CB', 'CB', 'RB'],
    ['LM', 'CM', 'CM', 'RM'],
    ['ST', 'ST']
  ],
  '3-5-2': [
    ['GK'],
    ['LWB', 'CB', 'CB', 'RWB'],
    ['CM', 'CM', 'CAM'],
    ['ST', 'ST', 'ST']
  ],
  '4-2-3-1': [
    ['GK'],
    ['LB', 'CB', 'CB', 'RB'],
    ['CDM', 'CM'],
    ['LW', 'CAM', 'RW'],
    ['ST']
  ]
};

function normalizePlaceholderNames() {
  const namePools = {
    europe: {
      first: ['Luka', 'Kieran', 'Antoine', 'Kevin', 'Harry', 'Marco', 'Thomas', 'Bruno', 'Mason', 'Kai', 'Emil', 'Bernardo', 'Phil', 'Marcus', 'Raheem'],
      last: ['Modric', 'Henderson', 'Griezmann', 'Kroos', 'Kane', 'Reus', 'Rodriguez', 'Fernandes', 'Mount', 'Havertz', 'Odegaard', 'Silva', 'Foden', 'Sterling', 'Kimmich']
    },
    southAmerica: {
      first: ['Lionel', 'Neymar', 'Luis', 'Rodrigo', 'Alexis', 'Casemiro', 'Philippe', 'Paulo', 'Angel', 'Edinson', 'Alex', 'Jorge', 'Thiago', 'Renan', 'Gabriel'],
      last: ['Messi', 'Silva', 'Diaz', 'Rodriguez', 'Oyarzabal', 'Fernandes', 'Coutinho', 'Rafinha', 'Aguero', 'Cavani', 'Gomez', 'Cardona', 'Alves', 'Morales', 'Castro']
    },
    northAmerica: {
      first: ['Christian', 'Tyler', 'Jonathan', 'Ricardo', 'Hirving', 'Giovani', 'Jesus', 'Eugenio', 'Alphonso', 'Brenden', 'Tyler', 'Cameron', 'Andrew', 'Michael', 'Weston'],
      last: ['Pulisic', 'Altidore', 'Gonzalez', 'Dos Santos', 'Herrera', 'Castillo', 'Reyna', 'Arriaga', 'Davies', 'McKennie', 'Bradley', 'Green', 'Brooks', 'Christian', 'Giovinco']
    },
    africa: {
      first: ['Mohamed', 'Sadio', 'Riyad', 'Hakim', 'Kalidou', 'Youssef', 'Moussa', 'Thomas', 'Andre', 'Victor', 'Abdou', 'Jordan', 'Ryan', 'Mahamadou', 'Simon'],
      last: ['Salah', 'Mane', 'Mahrez', 'Ziyech', 'Mendy', 'En-Nesyri', 'Camara', 'Toko', 'Onana', 'Ayew', 'Koulibaly', 'Odoi', 'Okoye', 'Niang', 'Cherif']
    },
    asia: {
      first: ['Takefusa', 'Son', 'Hwang', 'Amin', 'Sardar', 'Alireza', 'Mehdi', 'Takumi', 'Yuya', 'Ritsu', 'Kasper', 'Andres', 'Ali', 'Salman', 'Mansour'],
      last: ['Kubo', 'Son', 'Min', 'Baghdad', 'Taremi', 'Jahanbakhsh', 'Sardar', 'Inui', 'Nagao', 'Haraguchi', 'Schmeichel', 'Torres', 'Mousa', 'Al-Dawsari', 'Al-Muwallad']
    },
    default: {
      first: ['Alex', 'Jordan', 'Taylor', 'Morgan', 'Cameron', 'Jamie', 'Reece', 'Elliot', 'Casey', 'Dylan', 'Ryan', 'Owen', 'Nathan', 'Logan', 'Sam'],
      last: ['Brown', 'Jones', 'Smith', 'Williams', 'Johnson', 'Davis', 'Clark', 'Turner', 'Parker', 'Mitchell', 'Walker', 'Reed', 'Ward', 'Cooper', 'Brooks']
    }
  };

  const regionMap = {
    qatar: 'asia', saudi_arabia: 'asia', iran: 'asia', japan: 'asia', south_korea: 'asia', australia: 'asia', thailand: 'asia', china: 'asia', united_states: 'northAmerica', usa: 'northAmerica', mexico: 'northAmerica', canada: 'northAmerica', costa_rica: 'northAmerica', canada: 'northAmerica', brazil: 'southAmerica', argentina: 'southAmerica', uruguay: 'southAmerica', ecuador: 'southAmerica', colombia: 'southAmerica', chile: 'southAmerica', peru: 'southAmerica', france: 'europe', england: 'europe', spain: 'europe', portugal: 'europe', germany: 'europe', denmark: 'europe', poland: 'europe', netherlands: 'europe', belgium: 'europe', croatia: 'europe', wales: 'europe', switzerland: 'europe', serbia: 'europe', senegal: 'africa', morocco: 'africa', cameroon: 'africa', ghana: 'africa', tunisia: 'africa', nigeria: 'africa', egypt: 'africa'
  };

  const placeholderPattern = /(?:Goalkeeper|Striker|Center Back|Midfielder|Attacking Midfielder|Left Winger|Right Winger|Left Back|Right Back|Defensive Midfielder|Left Midfielder|Right Midfielder|Forward|Wingback|Center Midfielder|Right Back|Left Back|Right Wing|Left Wing)(?: #\d+)?$/i;
  const usedNames = new Set();

  function getRegion(teamId) {
    return regionMap[teamId.toLowerCase()] || 'default';
  }

  function getStableIndex(key, size) {
    let hash = 0;
    for (let i = 0; i < key.length; i++) {
      hash = (hash * 31 + key.charCodeAt(i)) % 1000000007;
    }
    return Math.abs(hash) % size;
  }

  function generateName(team, player) {
    const region = getRegion(team.id);
    const pool = namePools[region] || namePools.default;
    const firstIndex = getStableIndex(`${team.id}-${player.id}-first`, pool.first.length);
    const lastIndex = getStableIndex(`${team.id}-${player.id}-last`, pool.last.length);
    let name = `${pool.first[firstIndex]} ${pool.last[lastIndex]}`;
    if (usedNames.has(name)) {
      const altIndex = (lastIndex + 1) % pool.last.length;
      name = `${pool.first[firstIndex]} ${pool.last[altIndex]}`;
    }
    usedNames.add(name);
    return name;
  }

  worldcupData.teams.forEach((team) => {
    team.squad.forEach((player) => {
      if (!player.name || placeholderPattern.test(player.name) || player.name.toLowerCase().startsWith(team.name.toLowerCase().split(' ')[0] + ' ')) {
        player.name = generateName(team, player);
      }
    });
  });
}

function hide(element) {
  element.classList.add('hidden');
}

function show(element) {
  element.classList.remove('hidden');
}

function fetchData() {
  fetch('data/worldcup-2026.json')
    .then((response) => response.json())
    .then((data) => {
      worldcupData = data;
      normalizePlaceholderNames();
      populateFormationButtons();
      resetDraft();
    })
    .catch((error) => {
      simulationResults.innerHTML = `<p>Error loading game data: ${error.message}</p>`;
    });
}

function populateFormationButtons() {
  formationButtons.innerHTML = '';
  Object.keys(worldcupData.formations).forEach((formation) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = formation;
    button.addEventListener('click', () => selectFormation(formation, button));
    formationButtons.appendChild(button);
  });
}

function selectFormation(formation, button) {
  selectedFormation = formation;
  Array.from(formationButtons.children).forEach((btn) => btn.classList.toggle('active', btn === button));
  currentFormationName.innerHTML = `<strong>Formation:</strong> ${formation}`;
  renderFormationPitch();
  resetDraftSelection();
  drawTeamBtn.disabled = false;
  currentStatus.textContent = 'Draw a random nation and select one eligible player from that team.';
}

function resetDraft() {
  selectedFormation = null;
  selectedPlayers = [];
  selectedPlayerIds = new Set();
  currentDrawTeam = null;
  remainingTeams = [];
  usedTeamIds = new Set();
  skipUsed = false;
  simulationResults.innerHTML = '';
  hide(currentDrawSection);
  hide(squadSection);
  hide(document.getElementById('simulationSection'));
  teamPoolInfo.textContent = '';
  drawTeamBtn.disabled = true;
  skipTeamBtn.disabled = false;
  currentStatus.textContent = 'Choose a formation first to start drafting.';
}

function resetDraftSelection() {
  selectedPlayers = [];
  selectedPlayerIds = new Set();
  currentDrawTeam = null;
  remainingTeams = [...worldcupData.teams];
  usedTeamIds = new Set();
  skipUsed = false;
  currentStatus.textContent = '';
  simulationResults.innerHTML = '';
  hide(currentDrawSection);
  hide(squadSection);
  hide(document.getElementById('simulationSection'));
  updateTeamPoolInfo();
  renderFormationPitch();
  updateSelectedSquad();
  skipTeamBtn.disabled = false;
}

function updateTeamPoolInfo() {
  const available = remainingTeams.length;
  const used = [...usedTeamIds].map((teamId) => {
    const team = worldcupData.teams.find((item) => item.id === teamId);
    return team ? team.abbreviation : teamId;
  });

  teamPoolInfo.innerHTML = `Remaining teams: <strong>${available}</strong>` +
    (used.length ? `<br>Selected: ${used.join(', ')}` : '');
}

function renderFormationPitch() {
  if (!selectedFormation) {
    pitchMap.innerHTML = '';
    return;
  }

  const rows = formationLayouts[selectedFormation] || [worldcupData.formations[selectedFormation]];
  const slots = rows.flat();

  pitchMap.innerHTML = slots.map((position, index) => `
    <div class="pitch-slot empty" data-slot-index="${index}" data-position="${position}">
      <div class="position">${position}</div>
      <div class="player">Empty</div>
    </div>
  `).join('');
}

function updatePitchSlots() {
  if (!selectedFormation) return;

  const slotElements = pitchMap.querySelectorAll('.pitch-slot');
  slotElements.forEach((slotElement) => {
    const index = Number(slotElement.dataset.slotIndex);
    const playerSelection = selectedPlayers.find((selection) => selection.slotIndex === index);
    const playerName = playerSelection ? playerSelection.player.name : 'Empty';

    slotElement.querySelector('.player').textContent = playerName;
    slotElement.classList.toggle('selected', Boolean(playerSelection));
    slotElement.classList.toggle('empty', !playerSelection);
  });
}

function drawRandomTeam() {
  if (!selectedFormation || selectedPlayers.length >= worldcupData.formations[selectedFormation].length || remainingTeams.length === 0) {
    return;
  }

  const randomIndex = Math.floor(Math.random() * remainingTeams.length);
  currentDrawTeam = remainingTeams.splice(randomIndex, 1)[0];
  usedTeamIds.add(currentDrawTeam.id);
  updateTeamPoolInfo();
  renderCurrentTeam();
  drawTeamBtn.disabled = true;
}

function renderCurrentTeam() {
  if (!currentDrawTeam) return;
  show(currentDrawSection);
  currentTeamName.innerHTML = `<strong>${currentDrawTeam.name}</strong> (${currentDrawTeam.abbreviation}) — Rating ${currentDrawTeam.rating}`;
  populatePlayerSelect();
}

function populatePlayerSelect() {
  const openSlots = getOpenSlots();
  const eligiblePlayers = currentDrawTeam.squad
    .filter((player) => player.active && !selectedPlayerIds.has(player.id) && isPlayerEligible(player, openSlots))
    .sort((a, b) => b.rating - a.rating);

  playerSelect.innerHTML = '<option value="">Select a player</option>' +
    eligiblePlayers.map((player) => {
      const allowed = getAllowedSlotPositions(player, openSlots);
      const positionsLabel = allowed.length ? ` — ${allowed.join(', ')}` : '';
      return `<option value="${player.id}">${player.name} (${player.rating})${positionsLabel}</option>`;
    }).join('');

  playerSelect.value = '';
  slotSelect.innerHTML = '<option value="">Select a player first</option>';
  slotSelect.disabled = true;
  addPlayerBtn.disabled = eligiblePlayers.length === 0;

  if (eligiblePlayers.length === 0) {
    currentStatus.textContent = 'No eligible players remain in this squad for your formation. Skip the team to draw another.';
  } else {
    currentStatus.textContent = `Pick one player from ${currentDrawTeam.name}. ${openSlots.length} slot(s) remain.`;
  }
}

function getOpenSlots() {
  return worldcupData.formations[selectedFormation]
    .map((position, index) => ({ position, index }))
    .filter((slot) => !selectedPlayers.some((selection) => selection.slotIndex === slot.index));
}

function isPlayerEligible(player, openSlots) {
  const allowed = positionCategories[player.position] || [player.position];
  return openSlots.some((slot) => allowed.includes(slot.position));
}

function getPlayerAllowedSlots(player, openSlots) {
  const allowed = positionCategories[player.position] || [player.position];
  return openSlots.filter((slot) => allowed.includes(slot.position));
}

function getAllowedSlotPositions(player, openSlots) {
  return getPlayerAllowedSlots(player, openSlots).map((slot) => slot.position);
}

function updateSlotSelect() {
  const openSlots = getOpenSlots();
  const playerId = playerSelect.value;
  if (!playerId) {
    slotSelect.innerHTML = '<option value="">Select a player first</option>';
    slotSelect.disabled = true;
    return;
  }

  const player = currentDrawTeam.squad.find((item) => item.id === playerId);
  const allowedSlots = getPlayerAllowedSlots(player, openSlots);

  if (!allowedSlots.length) {
    slotSelect.innerHTML = '<option value="">No eligible positions</option>';
    slotSelect.disabled = true;
    return;
  }

  slotSelect.innerHTML = '<option value="">Select a position</option>' +
    allowedSlots.map((slot) => `<option value="${slot.index}">${slot.position}</option>`).join('');
  slotSelect.disabled = false;
}

function findBestSlotForPlayer(player) {
  const openSlots = getOpenSlots();
  const allowed = positionCategories[player.position] || [player.position];
  let bestSlot = null;
  let bestScore = Infinity;

  openSlots.forEach((slot) => {
    const preferenceIndex = allowed.indexOf(slot.position);
    if (preferenceIndex === -1) return;

    const score = preferenceIndex * 100 + slot.index;
    if (score < bestScore) {
      bestScore = score;
      bestSlot = slot;
    }
  });

  return bestSlot;
}

function addPlayerToSquad() {
  if (!currentDrawTeam) return;

  const playerId = playerSelect.value;
  if (!playerId) {
    currentStatus.textContent = 'Please select a player before adding to your squad.';
    return;
  }

  const player = currentDrawTeam.squad.find((item) => item.id === playerId);
  const openSlots = getOpenSlots();
  const selectedSlotIndex = slotSelect.value ? Number(slotSelect.value) : null;
  let slot = null;

  if (selectedSlotIndex !== null) {
    slot = openSlots.find((openSlot) => openSlot.index === selectedSlotIndex);
  }

  if (!slot) {
    slot = findBestSlotForPlayer(player);
  }

  if (!slot) {
    currentStatus.textContent = 'This player cannot fill any remaining formation slot.';
    return;
  }

  selectedPlayers.push({
    player,
    team: currentDrawTeam,
    assignedPosition: slot.position,
    slotIndex: slot.index
  });
  selectedPlayerIds.add(playerId);
  currentDrawTeam = null;
  hide(currentDrawSection);
  updateSelectedSquad();

  if (selectedPlayers.length === worldcupData.formations[selectedFormation].length) {
    simulateBtn.disabled = false;
    show(document.getElementById('simulationSection'));
    currentStatus.textContent = 'Your squad is complete. Simulate your World Cup run now.';
  } else {
    drawTeamBtn.disabled = false;
    currentStatus.textContent = 'Player added. Draw the next team for another squad member.';
  }
}

function skipTeam() {
  if (!currentDrawTeam) return;
  if (skipUsed) {
    currentStatus.textContent = 'You can only skip one team per squad build.';
    return;
  }

  skipUsed = true;
  skipTeamBtn.disabled = true;
  currentDrawTeam = null;
  hide(currentDrawSection);
  drawTeamBtn.disabled = false;
  currentStatus.textContent = 'Team skipped — draw another nation to continue building your squad.';
}

function updateSelectedSquad() {
  selectedCount.textContent = selectedPlayers.length;

  if (selectedPlayers.length === 0) {
    hide(squadSection);
    return;
  }

  show(squadSection);
  squadList.innerHTML = selectedPlayers
    .slice()
    .sort((a, b) => a.slotIndex - b.slotIndex)
    .map((selection) => `
      <div class="position-card">
        <strong>${selection.player.name}</strong>
        <div class="player-meta">${selection.team.abbreviation} • ${selection.assignedPosition}</div>
        <div>Rating ${selection.player.rating}</div>
      </div>
    `)
    .join('');

  simulateBtn.disabled = selectedPlayers.length !== worldcupData.formations[selectedFormation].length;
  updatePitchSlots();
  updatePositionRatingSummary();
}

function updatePositionRatingSummary() {
  const summary = document.getElementById('positionRatingSummary');
  const ratings = computePositionRatings();

  summary.innerHTML = `
    <div><strong>GK:</strong> ${ratings.GK !== null ? ratings.GK : 'N/A'}</div>
    <div><strong>Defending:</strong> ${ratings.DEF !== null ? ratings.DEF : 'N/A'}</div>
    <div><strong>Midfield:</strong> ${ratings.MID !== null ? ratings.MID : 'N/A'}</div>
    <div><strong>Attack:</strong> ${ratings.ATT !== null ? ratings.ATT : 'N/A'}</div>
  `;
}

function computePositionRatings() {
  const groups = {
    GK: [],
    DEF: [],
    MID: [],
    ATT: []
  };

  selectedPlayers.forEach((selection) => {
    const position = selection.player.position;
    const group = getPositionGroup(position);
    groups[group].push(selection.player);
  });

  return {
    GK: averageGroupScore(groups.GK, ['defending', 'physical', 'passing']),
    DEF: averageGroupScore(groups.DEF, ['defending', 'physical']),
    MID: averageGroupScore(groups.MID, ['passing', 'dribbling']),
    ATT: averageGroupScore(groups.ATT, ['shooting', 'dribbling'])
  };
}

function getPositionGroup(position) {
  if (position === 'GK') return 'GK';
  if (['CB', 'LB', 'RB', 'LWB', 'RWB'].includes(position)) return 'DEF';
  if (['CDM', 'CM', 'CAM', 'LM', 'RM'].includes(position)) return 'MID';
  if (['ST', 'CF', 'RW', 'LW'].includes(position)) return 'ATT';
  return 'MID';
}

function averageGroupScore(players, categories) {
  if (!players.length) return null;

  const total = players.reduce((sum, player) => {
    const score = categories.reduce((catSum, category) => {
      const stat = player.stats?.[category]?.overall;
      return catSum + (typeof stat === 'number' ? stat : player.rating);
    }, 0);
    return sum + score / categories.length;
  }, 0);

  return Math.round(total / players.length);
}

function computeCustomTeamRating() {
  if (selectedPlayers.length === 0) return 0;
  const total = selectedPlayers.reduce((sum, selection) => sum + selection.player.rating, 0);
  return Math.round(total / selectedPlayers.length);
}

function resetPlayerStats(customTeam) {
  customPlayerStats = selectedPlayers.reduce((stats, selection) => {
    stats[selection.player.id] = {
      player: selection.player,
      team: selection.team,
      assignedPosition: selection.assignedPosition,
      slotIndex: selection.slotIndex,
      goals: 0,
      assists: 0,
      ga: 0,
      cleanSheets: 0,
      matches: 0
    };
    return stats;
  }, {});

  tournamentPlayerStats = worldcupData.teams.reduce((stats, team) => {
    team.squad.forEach((player) => {
      stats[player.id] = {
        player,
        team,
        goals: 0,
        assists: 0,
        ga: 0,
        cleanSheets: 0,
        matches: 0
      };
    });
    return stats;
  }, {});

  selectedPlayers.forEach((selection) => {
    tournamentPlayerStats[selection.player.id] = customPlayerStats[selection.player.id];
  });
}

function getTeamPlayerStats(teamId, customTeam) {
  if (teamId === customTeam.id) {
    return selectedPlayers
      .map((selection) => tournamentPlayerStats[selection.player.id])
      .filter(Boolean);
  }

  const team = worldcupData.teams.find((item) => item.id === teamId);
  return team ? team.squad.map((player) => tournamentPlayerStats[player.id]).filter(Boolean) : [];
}

function updateTeamStats(teamStats, goalsFor) {
  if (goalsFor <= 0 || teamStats.length === 0) return;

  const scorerWeights = {
    ST: 5,
    CF: 4,
    CAM: 3,
    LW: 3,
    RW: 3,
    LM: 2,
    RM: 2,
    CM: 2,
    CDM: 1,
    LB: 1,
    RB: 1,
    LWB: 1,
    RWB: 1,
    GK: 0
  };

  const candidates = teamStats.filter((stat) => scorerWeights[stat.player.position] > 0);
  if (candidates.length === 0) return;

  const weightedPool = candidates.flatMap((stat) => Array(Math.max(1, scorerWeights[stat.player.position])).fill(stat));

  for (let i = 0; i < goalsFor; i += 1) {
    const scorer = weightedPool[Math.floor(Math.random() * weightedPool.length)];
    scorer.goals += 1;

    const assistCandidates = candidates.filter((stat) => stat.player.id !== scorer.player.id);
    if (assistCandidates.length) {
      const assister = assistCandidates[Math.floor(Math.random() * assistCandidates.length)];
      assister.assists += 1;
    }
  }
}

function applyPlayerStats(homeId, awayId, result, customTeam) {
  const homeStats = getTeamPlayerStats(homeId, customTeam);
  const awayStats = getTeamPlayerStats(awayId, customTeam);

  const homeKeepers = homeStats.filter((stat) => stat.player.position === 'GK');
  const awayKeepers = awayStats.filter((stat) => stat.player.position === 'GK');

  const homeKeeper = homeKeepers.sort((a, b) => b.player.rating - a.player.rating)[0];
  const awayKeeper = awayKeepers.sort((a, b) => b.player.rating - a.player.rating)[0];

  if (homeKeeper) {
    homeKeeper.ga += result.awayGoals;
    homeKeeper.matches += 1;
    if (result.awayGoals === 0) {
      homeKeeper.cleanSheets += 1;
    }
  }
  if (awayKeeper) {
    awayKeeper.ga += result.homeGoals;
    awayKeeper.matches += 1;
    if (result.homeGoals === 0) {
      awayKeeper.cleanSheets += 1;
    }
  }

  updateTeamStats(homeStats, result.homeGoals);
  updateTeamStats(awayStats, result.awayGoals);
}

function computeDreamTeamAwards() {
  const stats = Object.values(customPlayerStats);
  const sortedByGoals = [...stats].sort((a, b) => b.goals - a.goals || b.player.rating - a.player.rating);
  const sortedByAssists = [...stats].sort((a, b) => b.assists - a.assists || b.player.rating - a.player.rating);
  const keepers = stats.filter((stat) => stat.player.position === 'GK');
  const sortedByCleanSheets = [...keepers].sort((a, b) => b.cleanSheets - a.cleanSheets || a.ga - b.ga || b.player.rating - a.player.rating);

  const goldenBoot = sortedByGoals[0];
  const mostAssists = sortedByAssists[0];
  const goldenGlove = sortedByCleanSheets[0];
  const goldenBall = [...stats].sort((a, b) => {
    const aScore = a.goals * 6 + a.assists * 4 + (a.player.position === 'GK' ? 4 : 0) + a.player.rating * 0.08;
    const bScore = b.goals * 6 + b.assists * 4 + (b.player.position === 'GK' ? 4 : 0) + b.player.rating * 0.08;
    return bScore - aScore;
  })[0];

  return { goldenBoot, mostAssists, goldenGlove, goldenBall };
}

function computeTournamentAwards() {
  const stats = Object.values(tournamentPlayerStats);
  const sortedByGoals = [...stats].sort((a, b) => b.goals - a.goals || b.player.rating - a.player.rating);
  const sortedByAssists = [...stats].sort((a, b) => b.assists - a.assists || b.player.rating - a.player.rating);
  const keepers = stats.filter((stat) => stat.player.position === 'GK');
  const sortedByCleanSheets = [...keepers].sort((a, b) => b.cleanSheets - a.cleanSheets || a.ga - b.ga || b.player.rating - a.player.rating);

  const goldenBoot = sortedByGoals[0];
  const mostAssists = sortedByAssists[0];
  const goldenGlove = sortedByCleanSheets[0];
  const goldenBall = [...stats].sort((a, b) => {
    const aScore = a.goals * 6 + a.assists * 4 + (a.player.position === 'GK' ? 4 : 0) + a.player.rating * 0.08;
    const bScore = b.goals * 6 + b.assists * 4 + (b.player.position === 'GK' ? 4 : 0) + b.player.rating * 0.08;
    return bScore - aScore;
  })[0];

  return { goldenBoot, mostAssists, goldenGlove, goldenBall };
}

function simulateTournament() {
  if (selectedPlayers.length !== worldcupData.formations[selectedFormation].length) {
    alert('You must build a complete 11-player squad before simulating.');
    return;
  }

  const customTeam = {
    id: 'custom',
    name: 'Dream XI',
    abbreviation: 'DREAM',
    rating: computeCustomTeamRating()
  };

  resetPlayerStats(customTeam);

  const insertionGroup = selectRandomGroup();
  const replacedTeamId = insertionGroup.teams[insertionGroup.teams.length - 1];
  const groupResults = simulateAllGroups(customTeam, insertionGroup.id, replacedTeamId);
  const insertedGroup = groupResults.find((group) => group.groupId === insertionGroup.id);
  const customPosition = insertedGroup.standings.findIndex((row) => row.team.id === customTeam.id) + 1;
  const qualified = customPosition <= 2;
  const progress = buildKnockoutPath(groupResults, customTeam);
  const dreamAwards = computeDreamTeamAwards();
  const tournamentAwards = computeTournamentAwards();

  renderSimulationResults(customTeam, insertionGroup, replacedTeamId, insertedGroup, customPosition, qualified, progress, dreamAwards, tournamentAwards, groupResults);
}

function selectRandomGroup() {
  const index = Math.floor(Math.random() * worldcupData.groups.length);
  return worldcupData.groups[index];
}

function simulateAllGroups(customTeam, customGroupId, replacedTeamId) {
  return worldcupData.groups.map((group) => {
    const teamIds = group.teams.map((id) => (group.id === customGroupId && id === replacedTeamId ? customTeam.id : id));
    const standings = teamIds.map((id) => ({
      team: id === customTeam.id ? customTeam : worldcupData.teams.find((item) => item.id === id),
      points: 0,
      gf: 0,
      ga: 0,
      gd: 0,
      wins: 0,
      draws: 0,
      losses: 0
    }));

    const groupFixtures = worldcupData.fixtures
      .filter((match) => match.groupId === group.id)
      .map((match) => ({
        home: match.home === replacedTeamId && group.id === customGroupId ? customTeam.id : match.home,
        away: match.away === replacedTeamId && group.id === customGroupId ? customTeam.id : match.away
      }));

    groupFixtures.forEach((match) => {
      const result = simulateMatch(match.home, match.away, customTeam);
      const homeRow = standings.find((row) => row.team.id === match.home);
      const awayRow = standings.find((row) => row.team.id === match.away);

      applyPlayerStats(match.home, match.away, result, customTeam);

      homeRow.gf += result.homeGoals;
      homeRow.ga += result.awayGoals;
      awayRow.gf += result.awayGoals;
      awayRow.ga += result.homeGoals;
      homeRow.gd = homeRow.gf - homeRow.ga;
      awayRow.gd = awayRow.gf - awayRow.ga;

      if (result.homeGoals > result.awayGoals) {
        homeRow.points += 3;
        homeRow.wins += 1;
        awayRow.losses += 1;
      } else if (result.homeGoals < result.awayGoals) {
        awayRow.points += 3;
        awayRow.wins += 1;
        homeRow.losses += 1;
      } else {
        homeRow.points += 1;
        awayRow.points += 1;
        homeRow.draws += 1;
        awayRow.draws += 1;
      }
    });

    standings.sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points;
      if (b.gd !== a.gd) return b.gd - a.gd;
      if (b.gf !== a.gf) return b.gf - a.gf;
      return a.team.name.localeCompare(b.team.name);
    });

    return { groupId: group.id, name: group.name, replacedTeamId, standings };
  });
}

function simulateMatch(homeId, awayId, customTeam) {
  const homeTeam = homeId === customTeam.id ? customTeam : worldcupData.teams.find((team) => team.id === homeId);
  const awayTeam = awayId === customTeam.id ? customTeam : worldcupData.teams.find((team) => team.id === awayId);
  const homePower = homeTeam.rating + (Math.random() * 12 - 4);
  const awayPower = awayTeam.rating + (Math.random() * 12 - 4);
  const result = generateMatchScore(homePower, awayPower);
  return {
    homeGoals: result.homeGoals,
    awayGoals: result.awayGoals,
    homeTeam,
    awayTeam
  };
}

function generateMatchScore(homePower, awayPower) {
  const powerDiff = homePower - awayPower;
  const averageGoals = 1.4 + Math.max(0, powerDiff / 24);
  const homeGoals = Math.max(0, Math.round(randomGaussian(averageGoals + 0.2, 1.1)));
  const awayGoals = Math.max(0, Math.round(randomGaussian(Math.max(0.4, averageGoals - powerDiff / 32), 1.0)));
  if (homeGoals === awayGoals) {
    if (Math.abs(powerDiff) > 7) {
      if (powerDiff > 0) return { homeGoals: awayGoals + 1, awayGoals };
      return { homeGoals, awayGoals: homeGoals + 1 };
    }
  }
  return { homeGoals, awayGoals };
}

function randomGaussian(mean, sd) {
  let u = 0, v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  return mean + sd * Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
}

function getThirdPlaceTeams(groupResults) {
  return groupResults.map((group) => ({
    groupId: group.groupId,
    team: group.standings[2].team,
    points: group.standings[2].points,
    gd: group.standings[2].gd,
    gf: group.standings[2].gf
  }))
    .filter((row) => row.team)
    .sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points;
      if (b.gd !== a.gd) return b.gd - a.gd;
      if (b.gf !== a.gf) return b.gf - a.gf;
      return a.team.name.localeCompare(b.team.name);
    });
}

function resolveBracketReference(ref, groupMap, thirdPlaceTeams, previousWinners) {
  if (!ref) return null;
  if (ref.group && ref.position) {
    return groupMap[ref.group]?.[ref.position - 1]?.team || null;
  }
  if (ref.thirdSeed) {
    return thirdPlaceTeams[ref.thirdSeed - 1]?.team || null;
  }
  if (ref.winnerOfIndex !== undefined) {
    return previousWinners?.[ref.winnerOfIndex] || null;
  }
  return null;
}

function buildKnockoutPath(groupResults, customTeam) {
  const groupMap = groupResults.reduce((map, group) => {
    map[group.groupId] = group.standings;
    return map;
  }, {});

  const thirdPlaceTeams = getThirdPlaceTeams(groupResults).slice(0, 8);
  const path = [];
  let previousWinners = [];
  let currentWinners = [];

  const stages = [
    { key: 'roundOf32', name: 'Round of 32' },
    { key: 'roundOf16', name: 'Round of 16' },
    { key: 'quarterfinals', name: 'Quarter-final' },
    { key: 'semifinals', name: 'Semi-final' },
    { key: 'final', name: 'Final' }
  ];

  stages.forEach((stage) => {
    const bracket = worldcupData.knockoutBracket[stage.key];
    if (!bracket || !Array.isArray(bracket)) return;

    const matches = bracket.map((item) => ({
      home: resolveBracketReference(item.home, groupMap, thirdPlaceTeams, previousWinners),
      away: resolveBracketReference(item.away, groupMap, thirdPlaceTeams, previousWinners)
    }));

    currentWinners = matches.map((match) => simulateKnockoutMatch(match, stage.name, customTeam, path));
    previousWinners = currentWinners;
  });

  return { path, champion: currentWinners[0] };
}

function simulateKnockoutMatch(match, roundName, customTeam, path) {
  const result = simulateMatch(match.home.id, match.away.id, customTeam);
  applyPlayerStats(match.home.id, match.away.id, result, customTeam);
  const winner = result.homeGoals >= result.awayGoals ? match.home : match.away;
  const loser = winner === match.home ? match.away : match.home;
  const logEntry = {
    round: roundName,
    home: match.home,
    away: match.away,
    homeGoals: result.homeGoals,
    awayGoals: result.awayGoals,
    winner,
    loser
  };

  path.push(logEntry);
  return winner;
}

function renderSimulationResults(customTeam, group, replacedTeamId, insertedGroup, position, qualified, progress, dreamAwards, tournamentAwards, groupResults) {
  const replacedTeam = worldcupData.teams.find((team) => team.id === replacedTeamId);
  const teamName = replacedTeam ? replacedTeam.name : 'the replaced nation';
  const suffix = position === 1 ? 'st' : position === 2 ? 'nd' : position === 3 ? 'rd' : 'th';
  const status = qualified ? 'qualified for the knockout stage' : 'was eliminated in the group stage';

  const groupStageHtml = groupResults.map((groupResult) => `
      <div class="match-log">
        <h4>${groupResult.name} Standings</h4>
        <ol>
          ${groupResult.standings.map((standing) => `
            <li>${standing.team.name} — ${standing.points} pts, GD ${standing.gd}, GF ${standing.gf}</li>
          `).join('')}
        </ol>
      </div>
    `).join('');

  const knockoutHtml = progress.path.reduce((html, item) => {
    return html + `
      <p><strong>${item.round}</strong>: ${item.home.name} ${item.homeGoals}–${item.awayGoals} ${item.away.name} — Winner: ${item.winner.name}</p>
    `;
  }, '');

  simulationResults.innerHTML = `
    <h3>Custom World Cup Simulation</h3>
    <p>Your Dream XI enters ${group.name} by replacing ${teamName}. Your squad rating is <strong>${customTeam.rating}</strong>.</p>
    <p>The Dream XI finished <strong>${position}${suffix}</strong> in the group and ${status}.</p>
    ${groupStageHtml}
    <div class="match-log">
      <h4>Knockout Stage Results</h4>
      ${knockoutHtml}
    </div>
    <div class="match-log">
      <h4>Dream XI Awards</h4>
      <ul>
        <li><strong>Golden Boot:</strong> ${dreamAwards.goldenBoot.player.name} — ${dreamAwards.goldenBoot.goals} goals</li>
        <li><strong>Most Assists:</strong> ${dreamAwards.mostAssists.player.name} — ${dreamAwards.mostAssists.assists} assists</li>
        <li><strong>Golden Glove:</strong> ${dreamAwards.goldenGlove.player.name} — ${dreamAwards.goldenGlove.cleanSheets} clean sheets</li>
        <li><strong>Golden Ball:</strong> ${dreamAwards.goldenBall.player.name} — ${dreamAwards.goldenBall.goals} goals, ${dreamAwards.goldenBall.assists} assists</li>
      </ul>
    </div>
    <div class="match-log">
      <h4>Tournament Awards (All Teams)</h4>
      <ul>
        <li><strong>Golden Boot:</strong> ${tournamentAwards.goldenBoot.player.name} — ${tournamentAwards.goldenBoot.goals} goals</li>
        <li><strong>Most Assists:</strong> ${tournamentAwards.mostAssists.player.name} — ${tournamentAwards.mostAssists.assists} assists</li>
        <li><strong>Golden Glove:</strong> ${tournamentAwards.goldenGlove.player.name} — ${tournamentAwards.goldenGlove.cleanSheets} clean sheets</li>
        <li><strong>Golden Ball:</strong> ${tournamentAwards.goldenBall.player.name} — ${tournamentAwards.goldenBall.goals} goals, ${tournamentAwards.goldenBall.assists} assists</li>
      </ul>
    </div>
  `;
  show(document.getElementById('simulationSection'));
}

fetchData();

drawTeamBtn.addEventListener('click', drawRandomTeam);
playerSelect.addEventListener('change', updateSlotSelect);
addPlayerBtn.addEventListener('click', addPlayerToSquad);
skipTeamBtn.addEventListener('click', skipTeam);
simulateBtn.addEventListener('click', simulateTournament);

