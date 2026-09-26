import {
  initSeasonScheduleAndTable,
  simulateMatchdayRound,
  advanceTournamentBracket
} from '../js/engine.js';
import { ALL_CLUBS } from '../js/data.js';

console.log("=== BẮT ĐẦU TEST SỬA TRIỆT ĐỂ LỖI KẸT VÒNG LẶP TRẬN CÚP (CUP STUCK LOOP) ===");

// 1. Tạo mock player
const manUnited = ALL_CLUBS.find(c => c.name.includes("Man United") || c.name.includes("Manchester United") || c.id === 'man_united') || ALL_CLUBS[2];
const arsenal = ALL_CLUBS.find(c => c.name.includes("Arsenal") || c.id === 'arsenal') || ALL_CLUBS[1];
const mockPlayer = {
  name: "Nguyen Hoang",
  position: "ST",
  age: 18,
  isAcademyStage: false,
  currentClub: arsenal,
  club: arsenal,
  attr1: 75,
  attr2: 75,
  attr3: 75,
  attr4: 75,
  form: 70,
  stam: 80,
  morale: 80,
  tactic: 'BALANCED',
  goals: 5,
  assists: 3,
  totalMatches: 10,
  currentEuroStatus: "NONE"
};

initSeasonScheduleAndTable(mockPlayer);
console.log(`✓ Khởi tạo mùa giải: ${mockPlayer.currentSeasonFixtures.length} vòng đấu.`);

// Tìm fixture cúp Bán Kết
const semiCupIdx = mockPlayer.currentSeasonFixtures.findIndex(f => 
  f.stageName && f.stageName.includes("Bán Kết")
);
console.log(`✓ Tìm thấy trận Bán Kết Cúp tại index: ${semiCupIdx} (${mockPlayer.currentSeasonFixtures[semiCupIdx].stageName} vs ${mockPlayer.currentSeasonFixtures[semiCupIdx].playerMatch.opponent.name})`);

// Đặt pointer ngay tại trận Bán Kết để kiểm tra
mockPlayer.currentFixtureIndex = semiCupIdx;
mockPlayer.fixtureIndex = semiCupIdx;

const goalsBefore = mockPlayer.goals;
const assistsBefore = mockPlayer.assists;
const seasonGoalsBefore = mockPlayer.currentSeasonStats.goals;
const seasonMatchesBefore = mockPlayer.currentSeasonStats.matches;
const totalMatchesBefore = mockPlayer.totalMatches;

// Lấy điểm trên BXH League của Arsenal trước trận cúp
const userLeagueRowBefore = mockPlayer.leagueTable.find(t => t.isPlayerClub || t.id === arsenal.id);
const pointsBefore = userLeagueRowBefore ? userLeagueRowBefore.points : 0;
const playedBefore = userLeagueRowBefore ? userLeagueRowBefore.played : 0;

// Mô phỏng trận đấu Bán Kết Cúp (người chơi thắng 3-1, ghi 2 bàn, 1 kiến tạo)
const isSemiHome = mockPlayer.currentSeasonFixtures[semiCupIdx].playerMatch.isPlayerHome;
const semiResult = simulateMatchdayRound(mockPlayer, false, {
  homeScore: isSemiHome ? 3 : 1,
  awayScore: isSemiHome ? 1 : 3,
  playerGoals: 2,
  playerAssists: 1,
  rating: 8.5,
  xG: 1.2
});

console.log("-----------------------------------------");
console.log("KẾT QUẢ MÔ PHỎNG BÁN KẾT CÚP:");
console.log(`- Outcome: ${semiResult.outcome}, Tỷ số: ${semiResult.homeScore} - ${semiResult.awayScore}`);
console.log(`- Goals sau trận: ${mockPlayer.goals} (tăng từ ${goalsBefore})`);
console.log(`- Season Goals: ${mockPlayer.currentSeasonStats.goals} (tăng từ ${seasonGoalsBefore})`);
console.log(`- Season Matches: ${mockPlayer.currentSeasonStats.matches} (tăng từ ${seasonMatchesBefore})`);
console.log(`- Total Matches: ${mockPlayer.totalMatches} (tăng từ ${totalMatchesBefore})`);

// Kiểm tra 1: Chỉ số cá nhân bắt buộc cộng dồn
if (mockPlayer.goals !== goalsBefore + 2) throw new Error(`Goals không khớp! Kỳ vọng ${goalsBefore + 2}, nhận ${mockPlayer.goals}`);
if (mockPlayer.assists !== assistsBefore + 1) throw new Error(`Assists không khớp! Kỳ vọng ${assistsBefore + 1}, nhận ${mockPlayer.assists}`);
if (mockPlayer.currentSeasonStats.goals !== seasonGoalsBefore + 2) throw new Error(`Season Goals không khớp!`);
if (mockPlayer.currentSeasonStats.matches !== seasonMatchesBefore + 1) throw new Error(`Season Matches không khớp!`);
if (mockPlayer.totalMatches !== totalMatchesBefore + 1) throw new Error(`Total Matches không khớp!`);
console.log("✓ TEST 1 PASS: Chỉ số cá nhân được cộng dồn chính xác sau trận cúp!");

// Kiểm tra 2: KHÔNG cộng điểm vào BXH League
const userLeagueRowAfter = mockPlayer.leagueTable.find(t => t.isPlayerClub || t.id === arsenal.id);
if (userLeagueRowAfter) {
  if (userLeagueRowAfter.points !== pointsBefore) throw new Error(`Lỗi: BXH League bị cộng điểm trong trận Cúp! Trước: ${pointsBefore}, sau: ${userLeagueRowAfter.points}`);
  if (userLeagueRowAfter.played !== playedBefore) throw new Error(`Lỗi: Số trận League bị tăng trong trận Cúp! Trước: ${playedBefore}, sau: ${userLeagueRowAfter.played}`);
}
console.log("✓ TEST 2 PASS: BXH League không bị cộng điểm hay cộng trận trong trận Cúp!");

// Kiểm tra 3: Sơ đồ cúp đồng bộ (Bracket Sync) và Bán Kết đã đẩy vào Chung Kết
const domBracket = mockPlayer.tournamentBrackets.domesticCup;
console.log("Trạng thái sơ đồ cúp Bán Kết / Chung Kết:");
console.log(`- QF 1-4 winners: ${domBracket.quarterFinals.map(m => m.winner?.name || "none").join(', ')}`);
console.log(`- SF 1: ${domBracket.semiFinals[0].club1?.name} vs ${domBracket.semiFinals[0].club2?.name} (Winner: ${domBracket.semiFinals[0].winner?.name})`);
console.log(`- SF 2: ${domBracket.semiFinals[1].club1?.name} vs ${domBracket.semiFinals[1].club2?.name} (Winner: ${domBracket.semiFinals[1].winner?.name})`);
console.log(`- Final: ${domBracket.final.club1?.name} vs ${domBracket.final.club2?.name}`);

if (!domBracket.semiFinals[0].winner || !domBracket.semiFinals[1].winner) {
  throw new Error("Lỗi: Các trận Bán Kết chưa được giải quyết xong!");
}
if (!domBracket.final.club1 || !domBracket.final.club2) {
  throw new Error("Lỗi: Trận Chung Kết chưa có 2 đội vào chung kết!");
}
if (mockPlayer.cupStage !== 'final') {
  throw new Error(`Lỗi: cupStage kỳ vọng 'final', nhận ${mockPlayer.cupStage}`);
}
console.log("✓ TEST 3 PASS: Sơ đồ Cúp đồng bộ hoàn hảo, QF và SF đã giải quyết xong và xác định 2 đội Chung Kết!");

// Kiểm tra 4: Next Match pointer không bị kẹt lặp lại trận Bán Kết Man United
console.log(`- Fixture index kế tiếp: ${mockPlayer.currentFixtureIndex} (trận trước: ${semiCupIdx})`);
if (mockPlayer.currentFixtureIndex <= semiCupIdx) {
  throw new Error(`Lỗi: Pointer bị kẹt ở vòng cũ ${mockPlayer.currentFixtureIndex}!`);
}
const nextFixture = mockPlayer.currentSeasonFixtures[mockPlayer.currentFixtureIndex];
console.log(`- Trận kế tiếp: ${nextFixture.stageName || nextFixture.competitionName} vs ${nextFixture.playerMatch.opponent.name}`);
if (nextFixture.playerMatch.isPlayed) {
  throw new Error("Lỗi: Trận kế tiếp đã bị đánh dấu isPlayed!");
}
console.log("✓ TEST 4 PASS: Con trỏ trận đấu đã chuyển sang vòng đấu tiếp theo (không bị lặp lại)!");

// Kiểm tra 5: Thử nghiệm trường hợp người chơi THUA trận Bán Kết Cúp
console.log("\n--- TEST TRƯỜNG HỢP THUA BÁN KẾT CÚP (DỪNG BƯỚC Ở CÚP) ---");
const mockPlayer2 = {
  name: "Nguyen Hoang 2",
  position: "ST",
  age: 18,
  currentClub: arsenal,
  club: arsenal,
  attr1: 75, attr2: 75, attr3: 75, attr4: 75,
  form: 70, stam: 80, morale: 80,
  tactic: 'BALANCED',
  goals: 0, assists: 0, totalMatches: 0,
  currentEuroStatus: "NONE"
};
initSeasonScheduleAndTable(mockPlayer2);
const sfIdx2 = mockPlayer2.currentSeasonFixtures.findIndex(f => f.stageName && f.stageName.includes("Bán Kết"));
mockPlayer2.currentFixtureIndex = sfIdx2;

// Thua trận
const isH2 = mockPlayer2.currentSeasonFixtures[sfIdx2].playerMatch.isPlayerHome;
simulateMatchdayRound(mockPlayer2, false, {
  homeScore: isH2 ? 0 : 2,
  awayScore: isH2 ? 2 : 0,
  playerGoals: 0,
  playerAssists: 0,
  rating: 6.0,
  xG: 0.1
});

if (mockPlayer2.cupStage !== 'eliminated') {
  throw new Error(`Lỗi: Kỳ vọng cupStage = 'eliminated', nhận ${mockPlayer2.cupStage}`);
}
// Các trận Chung Kết cúp sau đó phải bị loại bỏ (isEliminated = true, isCompleted = true)
const futureFinals = mockPlayer2.currentSeasonFixtures.filter(f => 
  f.competitionType === 'DOMESTIC_CUP' && f.stageName && f.stageName.includes("Chung Kết")
);
futureFinals.forEach(f => {
  if (!f.isEliminated || !f.isCompleted) {
    throw new Error(`Lỗi: Trận Chung kết chưa được đánh dấu eliminated khi thua Bán kết!`);
  }
});
console.log("✓ TEST 5 PASS: Khi thua Bán Kết, người chơi dừng bước ở Cúp, trận Chung Kết được tự động hủy!");

console.log("\n==========================================");
console.log("🎉 TẤT CẢ 5 BÀI TEST ĐÃ VƯỢT QUA 100% THÀNH CÔNG!");
console.log("==========================================");
