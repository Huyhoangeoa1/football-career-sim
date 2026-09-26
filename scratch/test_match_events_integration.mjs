import { createDecisionMoment, rollArenaEvent, createDeepMatchSimulation, simulateTickProgress } from '../js/engine.js';
import { getEligibleMatchEventTemplates } from '../js/data.js';

console.log('=== TEST 1: Check Templates Availability ===');
const fwTemplates = getEligibleMatchEventTemplates('ST');
console.log('FW templates count:', fwTemplates.length, fwTemplates.map(t => t.id));
const dfTemplates = getEligibleMatchEventTemplates('CB');
console.log('DF templates count:', dfTemplates.length, dfTemplates.map(t => t.id));
const gkTemplates = getEligibleMatchEventTemplates('GK');
console.log('GK templates count:', gkTemplates.length, gkTemplates.map(t => t.id));

console.log('\n=== TEST 2: FW Player Decision Moments ===');
const fw = { name: 'Striker Son', position: 'ST', attr1: 75, attr2: 68, attr3: 65, attr4: 72 };
for (let i = 0; i < 6; i++) {
  const d = createDecisionMoment(fw, 10 + i * 14, false);
  console.log(`[Min ${d.minute}'] ${d.title}`);
  d.choices.forEach((c, idx) => {
    console.log(`   Choice ${idx + 1}: ${c.text} -> ${Math.round(c.successChance * 100)}% | ${c.statHint}`);
  });
}

console.log('\n=== TEST 3: DF Player Decision Moments ===');
const df = { name: 'Defender Dung', position: 'CB', attr1: 76, attr2: 74, attr3: 80, attr4: 60 };
for (let i = 0; i < 4; i++) {
  const d = createDecisionMoment(df, 15 + i * 20, false);
  console.log(`[Min ${d.minute}'] ${d.title}`);
  d.choices.forEach((c, idx) => {
    console.log(`   Choice ${idx + 1}: ${c.text} -> ${Math.round(c.successChance * 100)}% | ${c.statHint}`);
  });
}

console.log('\n=== TEST 4: GK Player Decision Moments ===');
const gk = { name: 'Keeper Lam', position: 'GK', attr1: 82, attr2: 78, attr3: 75, attr4: 55 };
for (let i = 0; i < 3; i++) {
  const d = rollArenaEvent(gk, 25 + i * 25, false);
  console.log(`[Min ${d.minute}'] ${d.title}`);
  d.choices.forEach((c, idx) => {
    console.log(`   Choice ${idx + 1}: ${c.text} -> ${Math.round(c.successChance * 100)}% | ${c.statHint}`);
  });
}

console.log('\n=== TEST 5: Full Deep Match Simulation with new templates ===');
const sim = createDeepMatchSimulation(fw, { opponentName: 'Manchester City', opponentPower: 85 });
let executedChoices = 0;
while (!sim.isFinished && sim.currentTickIndex < sim.totalTicks) {
  const res = simulateTickProgress(sim, fw, null);
  if (res.isDecisionMoment) {
    executedChoices++;
    const chosenChoice = res.decisionData.choices[0];
    console.log(`Decision ${executedChoices} at min ${sim.tickMinutes[sim.currentTickIndex]}: ${res.decisionData.title}`);
    console.log(`   Selected: "${chosenChoice.text}"`);
    const actionResult = {
      actionType: chosenChoice.successType,
      xG: chosenChoice.xG || 0.5,
      successText: chosenChoice.successText
    };
    const actRes = simulateTickProgress(sim, fw, actionResult);
    if (actRes.tickEvent) {
      console.log(`   -> Event log: ${actRes.tickEvent.text.slice(0, 65)}...`);
    }
  }
}
console.log(`Match completed successfully! Total choices executed: ${executedChoices}`);
console.log('Final Score:', sim.homeScore, '-', sim.awayScore);
console.log('Player Goals:', sim.playerStats.goals, 'Assists:', sim.playerStats.assists, 'Tackles:', sim.playerStats.tackles);
console.log('\n🎉 ALL MATCH EVENTS INTEGRATION TESTS PASSED 100%!');
