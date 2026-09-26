import { createInitialPlayer } from '../js/state.js';
import { 
  initSeasonScheduleAndTable, 
  simulateMatchdayRound, 
  calculateDynamicGrowth,
  initLeagueTopScorers,
  updateLeagueTable
} from '../js/engine.js';
import { REAL_RIVAL_SCORERS, YOUTH_LEAGUE_CLUBS } from '../js/data.js';

console.log("=== BẮT ĐẦU KIỂM TRA TOÀN DIỆN 3 VẤN ĐỀ CỐT LÕI ===");

// ----------------------------------------------------
// TEST 1: VUA PHÁ LƯỚI THEO ĐÚNG GIẢI ĐẤU (U19 ACADEMY)
// ----------------------------------------------------
console.log("\n[TEST 1] Kiểm tra Bảng Vua Phá Lưới theo giải đấu U19 Academy:");
const p = createInitialPlayer("Sơn Cước", "VN", "FW", "la_masia");
initSeasonScheduleAndTable(p);

const scorers = p.leagueTopScorers;
console.log(`- Số lượng cầu thủ trong BXH Vua phá lưới: ${scorers.length}`);
console.log(`- Cầu thủ người chơi: ${scorers[0].name} (${scorers[0].clubName})`);

const hasEplStars = scorers.some(s => s.name === "Erling Haaland" || s.name === "Bukayo Saka" || s.name === "Mohamed Salah");
const hasYouthStars = scorers.some(s => s.name === "Marc Guiu" || s.name === "Ethan Wheatley" || s.name === "Tyrique George");

console.log(`- Chứa siêu sao Ngoại Hạng Anh (Lỗi cũ): ${hasEplStars ? "CÓ (THẤT BẠI)" : "KHÔNG (ĐÚNG CHUẨN)"}`);
console.log(`- Chứa các chân sút trẻ U19 (Marc Guiu, Wheatley...): ${hasYouthStars ? "CÓ (ĐÚNG CHUẨN)" : "KHÔNG (THẤT BẠI)"}`);

if (hasEplStars || !hasYouthStars) {
  console.error("❌ TEST 1 THẤT BẠI!");
  process.exit(1);
} else {
  console.log("✅ TEST 1 THÀNH CÔNG: Vua Phá Lưới hoàn toàn độc lập và chính xác cho giải U19!");
}

// ----------------------------------------------------
// TEST 2: ĐỒNG BỘ BXH & REAL-TIME TOP SCORERS QUA TỪNG VÒNG ĐẤU
// ----------------------------------------------------
console.log("\n[TEST 2] Kiểm tra đồng bộ Bảng xếp hạng và Vua phá lưới qua từng vòng đấu:");
console.log(`- Số đội trong BXH U19: ${p.leagueTable.length}`);
console.log(`- Trận đấu trước khi đá: ${p.leagueTable[0].clubName} (Số trận: ${p.leagueTable[0].played})`);

// Mô phỏng 3 vòng đấu
for (let r = 1; r <= 3; r++) {
  const outcome = simulateMatchdayRound(p, true, null);
  console.log(`  -> Vòng ${r}: Kết quả trận người chơi: ${outcome.playerMatchResult.scoreStr} (Bàn của bạn: ${outcome.playerGoals})`);
}

// Kiểm tra BXH sau 3 vòng
const sortedCorrectly = p.leagueTable.every((team, idx) => {
  if (idx === 0) return true;
  const prev = p.leagueTable[idx - 1];
  if (prev.points > team.points) return true;
  if (prev.points === team.points) {
    if (prev.gd > team.gd) return true;
    if (prev.gd === team.gd) return prev.gf >= team.gf;
  }
  return false;
});

const allPlayed = p.leagueTable.every(t => t.played === 3);
console.log(`- Tất cả ${p.leagueTable.length} đội đều đã cập nhật số trận (= 3): ${allPlayed ? "ĐÚNG" : "SAI"}`);
console.log(`- BXH được sắp xếp chuẩn theo Điểm -> HS -> Bàn thắng: ${sortedCorrectly ? "ĐÚNG" : "SAI"}`);
console.log(`- Đội dẫn đầu: ${p.leagueTable[0].clubName} (${p.leagueTable[0].points} điểm, HS: ${p.leagueTable[0].gd}, Form: [${p.leagueTable[0].recentForm.join(',')}])`);

// Kiểm tra Vua phá lưới có cộng dồn bàn thắng thực tế từ các trận AI
const totalGoalsScoredInTop = p.leagueTopScorers.reduce((sum, s) => sum + s.goals, 0);
console.log(`- Tổng số bàn thắng được ghi trong BXH Vua Phá Lưới sau 3 vòng: ${totalGoalsScoredInTop} bàn`);
console.log(`- Top 3 Vua phá lưới hiện tại:`);
p.leagueTopScorers.slice(0, 3).forEach((s, i) => {
  console.log(`   #${i + 1}: ${s.name} (${s.clubName || s.clubCode}): ${s.goals} bàn`);
});

if (!allPlayed || !sortedCorrectly || totalGoalsScoredInTop === 0) {
  console.error("❌ TEST 2 THẤT BẠI!");
  process.exit(1);
} else {
  console.log("✅ TEST 2 THÀNH CÔNG: BXH và Vua Phá Lưới hoạt động hoàn hảo và nhảy số đồng bộ thời gian thực!");
}

// ----------------------------------------------------
// TEST 3: CƠ CHẾ TĂNG TRƯỞNG CHỈ SỐ VI MÔ & BẢO VỆ CHỈ SỐ KHÔNG GIẢM
// ----------------------------------------------------
console.log("\n[TEST 3] Kiểm tra Tăng trưởng chỉ số vi mô và Quy tắc bảo vệ tuyệt đối:");
const testPlayer = createInitialPlayer("Minh Quân", "VN", "FW", "la_masia");
testPlayer.age = 17;
testPlayer.form = 75; // Phong độ cao
testPlayer.attr1 = 55.85; // Decimal float
testPlayer.attr2 = 58.10;

console.log(`- Chỉ số khởi điểm: Dứt điểm = ${testPlayer.attr1}, Tốc độ = ${testPlayer.attr2}`);

// 3.1: Đá cực hay (Rating 8.5) -> Tăng trưởng vi mô + kích hoạt Milestone khi vượt ngưỡng số nguyên
const stellarGrowth = calculateDynamicGrowth(testPlayer, 8.5, { goals: 2, assists: 1 });
console.log(`- Rating 8.5: Summary: "${stellarGrowth.summaryText}"`);
console.log(`- Dứt điểm mới: ${testPlayer.attr1} (Nguyên: ${Math.floor(testPlayer.attr1)})`);
console.log(`- Số sự kiện biến động chỉ số: ${stellarGrowth.statChanges.length}`);
stellarGrowth.statChanges.forEach(sc => {
  console.log(`   -> [${sc.statName || sc.stat}]: ${sc.reason} (isMilestone: ${sc.isMilestone}, val: ${sc.currentValue})`);
});

const crossedInteger = stellarGrowth.statChanges.some(sc => sc.isMilestone && sc.currentValue >= 56);
console.log(`- Phát hiện vượt mốc số nguyên (55.85 -> >=56.00): ${crossedInteger ? "ĐÚNG CHUẨN" : "CHƯA ĐẠT"}`);

// 3.2: Đá tệ liên tiếp nhưng Form vẫn >= 50 hoặc Cầu thủ trẻ (< 28 tuổi) -> TUYỆT ĐỐI KHÔNG ĐƯỢC GIẢM CHỈ SỐ
const currentAttr1BeforeBad = testPlayer.attr1;
console.log(`\n- Thử nghiệm 5 trận liên tiếp đá cực kém (Rating 4.5):`);
for (let b = 1; b <= 5; b++) {
  const badGrowth = calculateDynamicGrowth(testPlayer, 4.5, { goals: 0 });
  console.log(`   Trận tệ #${b}: Attr1 = ${testPlayer.attr1}, Form = ${testPlayer.form}, isRegression = ${badGrowth.isRegression}`);
}

const wasPenalized = testPlayer.attr1 < currentAttr1BeforeBad;
console.log(`- Cầu thủ trẻ (17 tuổi) có bị trừ chỉ số không: ${wasPenalized ? "CÓ (LỖI NGHIÊM TRỌNG)" : "KHÔNG (BẢO VỆ CHỈ SỐ AN TOÀN TUYỆT ĐỐI)"}`);

if (!crossedInteger || wasPenalized) {
  console.error("❌ TEST 3 THẤT BẠI!");
  process.exit(1);
} else {
  console.log("✅ TEST 3 THÀNH CÔNG: Cơ chế vi mô thập phân và bộ đệm bảo vệ chỉ số hoạt động 100% chuẩn xác!");
}

console.log("\n==========================================");
console.log("🎉 TẤT CẢ CÁC BÀI TEST ĐỀU ĐẠT CHUẨN 100%!");
console.log("==========================================");
