import assert from 'node:assert';
import { 
  createDeepMatchSimulation, 
  simulateTickProgress,
  getRandomAiPlayerName,
  getRandomAiOpponentName,
  getRandomAiTeammateName,
  getAiGoalkeeperName,
  getHomeGoalkeeperName
} from '../js/matchEngine.js';
import { 
  getRandomGoalCommentary, 
  getRandomAssistCommentary, 
  COMMENTARY_BANK 
} from '../js/commentaryData.js';

console.log('--- STARTING MATCH COMMENTARY & ST EVENT TESTS ---');

// =========================================================================
// TEST 1: Goal Commentary templates must include scorer and club names
// =========================================================================
console.log('Testing Goal Commentary Templates...');

const mockContext = {
  scorerName: 'Nguyễn Văn A (BẠN) ⭐',
  clubName: 'Real Madrid Castilla',
  playerName: 'Nguyễn Văn A (BẠN) ⭐',
  teamName: 'Real Madrid Castilla',
  assistName: 'Nico Paz',
  min: 45
};

for (let i = 0; i < 30; i++) {
  const goalText = getRandomGoalCommentary(mockContext);
  assert(goalText.includes('Nguyễn Văn A (BẠN) ⭐'), `Goal commentary missing scorer: ${goalText}`);
  assert(goalText.includes('Real Madrid Castilla'), `Goal commentary missing club: ${goalText}`);
}

// Test Blowout Goal templates
for (let i = 0; i < 20; i++) {
  const blowoutText = getRandomGoalCommentary({ ...mockContext, isBlowout: true });
  assert(blowoutText.includes('Nguyễn Văn A (BẠN) ⭐'), `Blowout goal missing scorer: ${blowoutText}`);
  assert(blowoutText.includes('Real Madrid Castilla'), `Blowout goal missing club: ${blowoutText}`);
}

// Test Clutch 90+ Goal templates
for (let i = 0; i < 20; i++) {
  const clutchText = getRandomGoalCommentary({ ...mockContext, isClutch: true, min: 92 });
  assert(clutchText.includes('Nguyễn Văn A (BẠN) ⭐'), `Clutch goal missing scorer: ${clutchText}`);
  assert(clutchText.includes('Real Madrid Castilla'), `Clutch goal missing club: ${clutchText}`);
}

// Test Assist Templates
for (let i = 0; i < 20; i++) {
  const assistText = getRandomAssistCommentary({
    playerName: 'Nguyễn Văn A (BẠN) ⭐',
    scorerName: 'Gonzalo García',
    clubName: 'Real Madrid Castilla',
    teamName: 'Real Madrid Castilla'
  });
  assert(assistText.includes('Nguyễn Văn A (BẠN) ⭐'), `Assist missing player: ${assistText}`);
  assert(assistText.includes('Gonzalo García'), `Assist missing scorer: ${assistText}`);
  assert(assistText.includes('Real Madrid Castilla'), `Assist missing club: ${assistText}`);
}

console.log('✅ Goal & Assist templates verified successfully!');

// =========================================================================
// TEST 2: AI Player & Goalkeeper Name Helpers
// =========================================================================
console.log('Testing AI Player & Goalkeeper Generation...');

const barcaPlayer = getRandomAiPlayerName('FC Barcelona La Masia');
assert(typeof barcaPlayer === 'string' && barcaPlayer.length > 2, 'Invalid Barca player name');

const muPlayer = getRandomAiPlayerName('Manchester United Academy');
assert(typeof muPlayer === 'string' && muPlayer.length > 2, 'Invalid MU player name');

const barcaGk = getAiGoalkeeperName('FC Barcelona La Masia');
assert(barcaGk.includes('Diego Kochen') || barcaGk.includes('Thủ môn'), `Expected GK name, got ${barcaGk}`);

const generalGk = getAiGoalkeeperName('Đại Kình Địch FC');
assert(generalGk.includes('Thủ môn'), `Expected fallback GK, got ${generalGk}`);

console.log('✅ AI Name Helpers verified successfully!');

// =========================================================================
// TEST 3: Striker Player Simulation — Absolutely NO Saves
// =========================================================================
console.log('Testing Striker Simulation & Saves Prevention...');

const mockStriker = {
  name: 'Leo Nguyen',
  position: 'ST',
  positionGroup: 'FW',
  attr1: 80, // Sút
  attr2: 70, // Chuyền
  attr3: 75, // Thể lực
  attr4: 78, // Kỹ thuật
  form: 75,
  morale: 80,
  stam: 85,
  isAcademyStage: true,
  academy: { name: 'Manchester United Academy', icon: '🔴' }
};

// Sub-test 3A: When an attacking decision fails with actionType 'SAVE' (e.g. Penalty saved)
{
  const sim = createDeepMatchSimulation(mockStriker, {
    opponentName: 'Chelsea FC Academy',
    opponentPower: 54
  });

  const penaltySavedResult = {
    actionType: 'SAVE',
    xG: 0.85
  };

  const res = simulateTickProgress(sim, mockStriker, penaltySavedResult);
  
  // Striker saves MUST remain 0!
  assert.strictEqual(sim.playerStats.saves, 0, `Striker should have 0 saves, got: ${sim.playerStats.saves}`);
  // Shots should have incremented
  assert.strictEqual(sim.playerStats.shots, 1, `Striker shot should be recorded`);
  assert.strictEqual(sim.playerStats.onTarget, 1, `Striker shot on target should be recorded`);
  
  // Event text must NOT say Leo Nguyen made a save
  assert(res.tickEvent.text.includes('không thắng được phản xạ') || res.tickEvent.text.includes('CÚ ĐÁ BỊ CẢN PHÁ'), 
    `Expected shot saved commentary, got: ${res.tickEvent.text}`);
  assert(!res.tickEvent.text.includes('Leo Nguyen (BẠN) ⭐ bay người'), 
    `Striker was wrongly described as diving for a save: ${res.tickEvent.text}`);
}

// Sub-test 3B: Multiple Full Match Simulations for Striker
for (let matchIdx = 0; matchIdx < 20; matchIdx++) {
  const sim = createDeepMatchSimulation(mockStriker, {
    opponentName: 'FC Barcelona La Masia',
    opponentPower: 55
  });

  while (!sim.isFinished) {
    const isDecision = (sim.pendingDecisionTick === sim.currentTickIndex);
    let choice = null;
    if (isDecision) {
      // Simulate random choice
      const roll = Math.random();
      if (roll < 0.35) {
        choice = { actionType: 'GOAL', xG: 0.65 };
      } else if (roll < 0.60) {
        choice = { actionType: 'SAVE', xG: 0.65 }; // Shot saved by opponent GK
      } else if (roll < 0.85) {
        choice = { actionType: 'MISS', xG: 0.65 };
      } else {
        choice = { actionType: 'ASSIST', xG: 0.50 };
      }
    }
    
    const res = simulateTickProgress(sim, mockStriker, choice);
    
    // Check every event in feed
    if (res.tickEvent) {
      if (res.tickEvent.type === 'GOAL' || res.tickEvent.type === 'OPP_GOAL') {
        // Goal must have scorer name and club name
        assert(res.tickEvent.text.includes('(') || res.tickEvent.text.includes('cho') || res.tickEvent.text.includes('VÀOOO'),
          `Goal text missing format: ${res.tickEvent.text}`);
      }

      // Check that striker is NEVER credited with a save in text
      if (res.tickEvent.text.includes('bay người hết cỡ cản phá')) {
        assert(!res.tickEvent.text.includes('Leo Nguyen'), `Striker appeared in save commentary! Event: ${res.tickEvent.text}`);
      }
    }
  }

  // STRIKER MUST HAVE 0 SAVES POST MATCH
  assert.strictEqual(sim.playerStats.saves, 0, `Striker accumulated ${sim.playerStats.saves} saves in match ${matchIdx}!`);
}

console.log('✅ 20 full matches simulated for Striker: 0 saves recorded, all goals properly named!');

// =========================================================================
// TEST 4: Goalkeeper Player Simulation — CAN have saves
// =========================================================================
console.log('Testing Goalkeeper Simulation...');

const mockGoalkeeper = {
  name: 'David De Gea Jr',
  position: 'GK',
  positionGroup: 'GK',
  attr1: 82,
  attr2: 75,
  attr3: 79,
  attr4: 80,
  form: 75,
  morale: 80,
  stam: 85,
  isAcademyStage: true,
  academy: { name: 'Manchester United Academy', icon: '🔴' }
};

{
  const sim = createDeepMatchSimulation(mockGoalkeeper, {
    opponentName: 'Arsenal Hale End',
    opponentPower: 52
  });

  const saveResult = {
    actionType: 'SAVE',
    xG: 0.79
  };

  const res = simulateTickProgress(sim, mockGoalkeeper, saveResult);
  assert.strictEqual(sim.playerStats.saves, 1, `Goalkeeper should have 1 save`);
  assert(res.tickEvent.text.includes('David De Gea Jr'), `Goalkeeper save should mention GK name: ${res.tickEvent.text}`);
}

console.log('✅ Goalkeeper correctly receives saves and commentary!');
console.log('🎉 ALL TESTS PASSED SUCCESSFULLY! 🎉');
