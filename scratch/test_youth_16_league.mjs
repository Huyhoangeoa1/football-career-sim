import { YOUTH_LEAGUE_CLUBS, REAL_RIVAL_SCORERS } from '../js/data.js';
import { 
  initLeagueTable, 
  generateSeasonFixtures, 
  initSeasonScheduleAndTable,
  YOUTH_RIVAL_ASSIST_POOL 
} from '../js/seasonEngine.js';

console.log("=== BẮT ĐẦU KIỂM THỬ GIẢI TRẺ U19 ACADEMY 16 ĐỘI ===");

// 1. Kiểm tra danh sách 16 đội trong data.js
console.log(`\n1. Kiểm tra YOUTH_LEAGUE_CLUBS: Số lượng = ${YOUTH_LEAGUE_CLUBS.length}`);
if (YOUTH_LEAGUE_CLUBS.length !== 16) {
  throw new Error(`Kỳ vọng 16 đội nhưng có ${YOUTH_LEAGUE_CLUBS.length} đội`);
}

const expectedClubNames = [
  "Real Madrid Castilla",
  "FC Barcelona La Masia",
  "Sporting CP Academy",
  "Benfica Seixal Campus",
  "Ajax De Toekomst",
  "FC Bayern Campus",
  "Borussia Dortmund Youth",
  "Man United Carrington",
  "Chelsea Cobham Academy",
  "Arsenal Hale End",
  "Man City CFA",
  "Juventus Primavera",
  "Inter Milan Youth",
  "PSG Youth Academy",
  "INF Clairefontaine",
  "PVF Football Academy"
];

for (const name of expectedClubNames) {
  const found = YOUTH_LEAGUE_CLUBS.find(c => c.name === name);
  if (!found) {
    throw new Error(`Thiếu câu lạc bộ: ${name}`);
  }
  if (!found.id || !found.code || !found.icon || !found.power || !found.country || !found.stadium) {
    throw new Error(`CLB ${name} thiếu thuộc tính bắt buộc!`);
  }
  console.log(`  ✓ ${found.name} (${found.country}) - Code: ${found.code}, Sân: ${found.stadium}, Power: ${found.power}`);
}

// 2. Kiểm tra Vua phá lưới & Vua kiến tạo trẻ có đủ 16 học viện
console.log(`\n2. Kiểm tra Rival Pool cho 16 học viện:`);
const youthScorerClubIds = new Set(REAL_RIVAL_SCORERS.YOUTH_LEAGUE.map(s => s.clubId));
console.log(`  - Số CLB có ứng viên phá lưới: ${youthScorerClubIds.size}`);
console.log(`  - Số ứng viên kiến tạo: ${YOUTH_RIVAL_ASSIST_POOL.length}`);

// 3. Kiểm tra initLeagueTable
console.log(`\n3. Kiểm tra initLeagueTable(player):`);
const mockPlayer = {
  name: "Nguyễn Văn A",
  age: 16,
  isAcademyStage: true,
  isPro: false,
  academy: YOUTH_LEAGUE_CLUBS[5], // FC Bayern Campus
  club: YOUTH_LEAGUE_CLUBS[5],
  leagueId: "YOUTH_LEAGUE"
};

const table = initLeagueTable(mockPlayer);
console.log(`  - Số đội trong BXH: ${table.length}`);
if (table.length !== 16) {
  throw new Error(`BXH phải có 16 đội, nhưng có ${table.length}`);
}

const playerClubInTable = table.find(t => t.isPlayerClub);
if (!playerClubInTable) {
  throw new Error(`Đội của người chơi không được đánh dấu isPlayerClub: true`);
}
console.log(`  ✓ Đội người chơi trong BXH: ${playerClubInTable.clubName} (isPlayerClub: ${playerClubInTable.isPlayerClub})`);

for (const row of table) {
  if (row.played !== 0 || row.won !== 0 || row.drawn !== 0 || row.lost !== 0 ||
      row.gf !== 0 || row.ga !== 0 || row.gd !== 0 || row.points !== 0) {
    throw new Error(`Đội ${row.clubName} có chỉ số khác 0 khi khởi tạo!`);
  }
}
console.log(`  ✓ Toàn bộ 16 đội khởi đầu sạch với 0 trận, 0 thắng, 0 hòa, 0 bại, 0 điểm.`);

// 4. Kiểm tra generateSeasonFixtures
console.log(`\n4. Kiểm tra generateSeasonFixtures cho 16 đội:`);
const fixtures = generateSeasonFixtures(
  "YOUTH_LEAGUE",
  mockPlayer.academy,
  "NONE",
  false,
  true,
  null,
  null,
  "Việt Nam",
  mockPlayer
);

console.log(`  - Tổng số fixtures được tạo: ${fixtures.length}`);

const leagueFixtures = fixtures.filter(f => f.competitionType === "LEAGUE");
const domesticCupFixtures = fixtures.filter(f => f.competitionType === "DOMESTIC_CUP");
const continentalFixtures = fixtures.filter(f => f.competitionType === "UCL");

console.log(`  - Số trận VĐQG U19: ${leagueFixtures.length} (Kỳ vọng: 30 vòng)`);
console.log(`  - Số trận Cúp Trẻ QG: ${domesticCupFixtures.length} (Kỳ vọng: 4 trận: 1/8, Tứ kết, Bán kết, Chung kết)`);
console.log(`  - Số trận UEFA Youth League: ${continentalFixtures.length} (Kỳ vọng: 6 trận: 3 bảng + 3 knockout)`);

if (leagueFixtures.length !== 30) {
  throw new Error(`Kỳ vọng 30 vòng VĐQG U19 nhưng có ${leagueFixtures.length}`);
}
if (domesticCupFixtures.length !== 4) {
  throw new Error(`Kỳ vọng 4 trận Cúp QG nhưng có ${domesticCupFixtures.length}`);
}
if (continentalFixtures.length !== 6) {
  throw new Error(`Kỳ vọng 6 trận UEFA Youth League nhưng có ${continentalFixtures.length}`);
}

// Kiểm tra chi tiết từng fixture giải VĐQG
leagueFixtures.forEach((f, idx) => {
  if (f.stageName !== `Vòng ${idx + 1}/30`) {
    throw new Error(`Stage name không khớp: ${f.stageName} vs Vòng ${idx + 1}/30`);
  }
  if (!f.playerMatch || !f.aiMatches) {
    throw new Error(`Vòng ${idx + 1} thiếu playerMatch hoặc aiMatches`);
  }
  if (f.aiMatches.length !== 7) {
    throw new Error(`Vòng ${idx + 1} phải có 7 aiMatches (16 đội -> 8 cặp), nhưng có ${f.aiMatches.length}`);
  }
});
console.log(`  ✓ Toàn bộ 30 vòng VĐQG có đủ stageName (Vòng X/30), 1 playerMatch, 7 aiMatches.`);

// In danh sách các trận cúp được đan xen
console.log(`  - Lịch đan xen các cúp:`);
fixtures.forEach((f, idx) => {
  if (f.competitionType !== "LEAGUE") {
    console.log(`    #${idx + 1}: [${f.competitionType}] ${f.competitionName} - ${f.stageName} (vs ${f.playerMatch?.opponent?.name || 'TBD'})`);
  }
});

// 5. Kiểm tra initSeasonScheduleAndTable
console.log(`\n5. Kiểm tra initSeasonScheduleAndTable:`);
const fullPlayer = {
  name: "Lê Hoàng",
  age: 16,
  tier: 3,
  isAcademyStage: true,
  academy: YOUTH_LEAGUE_CLUBS[0],
  club: YOUTH_LEAGUE_CLUBS[0],
  leagueId: "YOUTH_LEAGUE"
};

initSeasonScheduleAndTable(fullPlayer);

if (!fullPlayer.leagueTable || fullPlayer.leagueTable.length !== 16) {
  throw new Error(`Player leagueTable phải có 16 đội sau initSeasonScheduleAndTable!`);
}
if (!fullPlayer.currentSeasonFixtures || fullPlayer.currentSeasonFixtures.length !== 40) {
  throw new Error(`Player currentSeasonFixtures phải có 40 trận (30 league + 10 cup)!`);
}

console.log(`  ✓ fullPlayer.leagueTable có ${fullPlayer.leagueTable.length} đội.`);
console.log(`  ✓ fullPlayer.currentSeasonFixtures có ${fullPlayer.currentSeasonFixtures.length} trận.`);
console.log(`\n>>> TẤT CẢ CÁC BƯỚC KIỂM THỬ THÀNH CÔNG RỰC RỠ! <<<`);
