import assert from 'node:assert';
import { FAME_TIERS, getFameTier, generateSponsorshipOffers, signSponsorship, processAnnualSponsorshipPayout, getActiveSponsorshipStats } from '../js/playerEngine.js';
import { SPONSORSHIP_CATEGORIES, SPONSORSHIP_BRANDS } from '../js/data.js';
import { _migrate } from '../js/storage.js';

console.log("=== BẮT ĐẦU KIỂM THỬ HỆ THỐNG TÀI TRỢ THƯƠNG MẠI ĐA TẦNG ===");

// 1. Kiểm tra Dữ liệu Danh Mục & Nhãn Hàng
console.log("\n[TEST 1] Kiểm tra SPONSORSHIP_CATEGORIES và SPONSORSHIP_BRANDS...");
if (!SPONSORSHIP_CATEGORIES.BOOTS || !SPONSORSHIP_CATEGORIES.BEVERAGE || !SPONSORSHIP_CATEGORIES.LUXURY || !SPONSORSHIP_CATEGORIES.TECH_GAMING || !SPONSORSHIP_CATEGORIES.GLOBAL_AMBASSADOR) {
  throw new Error("Thiếu một trong 5 danh mục tài trợ!");
}
console.log(`Đã xác thực 5 danh mục: ${Object.keys(SPONSORSHIP_CATEGORIES).join(', ')}`);
console.log(`Tổng số nhãn hàng: ${SPONSORSHIP_BRANDS.length}`);
if (SPONSORSHIP_BRANDS.length < 18) {
  throw new Error("Số lượng nhãn hàng chưa đủ đa dạng!");
}

// 2. Kiểm tra Sinh Đề Nghị (generateSponsorshipOffers) theo các Tiers
console.log("\n[TEST 2] Kiểm tra co giãn đề nghị theo các mốc Fame Tiers...");

// Tier 1: Tân Binh (Fame 100)
const playerTier1 = { fame: 100, activeSponsorships: [], activeAgent: "agent_family", money: 1000, year: 2026, age: 16 };
const offersTier1 = generateSponsorshipOffers(playerTier1);
const unlockedT1 = offersTier1.filter(o => o.isUnlocked);
console.log(`Tier 1 (Fame 100): ${unlockedT1.length} nhãn hàng mở khóa. Ví dụ: ${unlockedT1[0]?.name} - ${unlockedT1[0]?.annualPayout}/năm, ${unlockedT1[0]?.durationYears} năm`);
if (unlockedT1.length === 0) throw new Error("Tier 1 phải mở khóa được ít nhất 1 nhãn hàng tân binh (Mizuno)!");
if (unlockedT1[0].annualPayout < 20000 || unlockedT1[0].annualPayout > 80000) {
  throw new Error(`Giá trị Tier 1 không nằm trong khoảng 20k - 80k: ${unlockedT1[0].annualPayout}`);
}

// Tier 4: Ngôi sao quốc nội (Fame 1500)
const playerTier4 = { fame: 1500, activeSponsorships: [], activeAgent: "agent_family", money: 100000, year: 2028, age: 18 };
const offersTier4 = generateSponsorshipOffers(playerTier4);
const pumaOffer = offersTier4.find(o => o.id === "sp_puma");
console.log(`Tier 4 (Fame 1500): Puma offer = ${pumaOffer?.annualPayout}/năm, ${pumaOffer?.durationYears} năm`);
if (!pumaOffer || !pumaOffer.isUnlocked) throw new Error("Puma phải mở khóa ở Tier 4!");
if (pumaOffer.annualPayout < 250000 || pumaOffer.annualPayout > 1500000) {
  throw new Error(`Puma ở Tier 4 phải trong khoảng €250k - €1.5M: ${pumaOffer.annualPayout}`);
}

// Tier 8: Biểu tượng đương đại (Fame 15000)
const playerTier8 = { fame: 15000, activeSponsorships: [], activeAgent: "agent_family", money: 5000000, year: 2032, age: 22 };
const offersTier8 = generateSponsorshipOffers(playerTier8);
const nikeLifetime = offersTier8.find(o => o.id === "sp_nike_lifetime");
console.log(`Tier 8 (Fame 15000): Nike Lifetime offer = ${nikeLifetime?.annualPayout}/năm, duration = ${nikeLifetime?.durationYears}, isLifetime = ${nikeLifetime?.isLifetime}`);
if (!nikeLifetime || !nikeLifetime.isUnlocked || !nikeLifetime.isLifetime) {
  throw new Error("Tier 8 phải mở khóa hợp đồng TRỌN ĐỜI cho Giày (Nike Lifetime)!");
}
if (nikeLifetime.annualPayout < 10000000 || nikeLifetime.annualPayout > 25000000) {
  throw new Error(`Tier 8 Boots lifetime payout phải trong khoảng 10M - 25M: ${nikeLifetime.annualPayout}`);
}

// Tier 9: Huyền thoại bất tử GOAT (Fame 25000)
const playerTier9 = { fame: 25000, activeSponsorships: [], activeAgent: "agent_family", money: 50000000, year: 2036, age: 26 };
const offersTier9 = generateSponsorshipOffers(playerTier9);
const goatLifetimeOffers = offersTier9.filter(o => o.isLifetime);
console.log(`Tier 9 (GOAT): Có ${goatLifetimeOffers.length} nhãn hàng đề nghị TRỌN ĐỜI (LIFETIME)!`);
goatLifetimeOffers.slice(0, 3).forEach(o => {
  console.log(` - ${o.name} (${o.category}): ${o.annualPayout}/năm (LIFETIME)`);
  if (o.annualPayout < 30000000 || o.annualPayout > 50000000) {
    throw new Error(`Tier 9 GOAT lifetime deal phải trong khoảng 30M - 50M: ${o.annualPayout}`);
  }
});

// 3. Kiểm tra Ký Hợp Đồng & Độc Quyền Danh Mục (signSponsorship)
console.log("\n[TEST 3] Kiểm tra Ký Hợp Đồng & Thay thế Độc Quyền Danh Mục...");
const testPlayer = {
  fame: 10000,
  activeSponsorships: [],
  activeAgent: "agent_family",
  money: 50000,
  year: 2026,
  age: 18,
  careerLogs: []
};

// Ký Mizuno
const res1 = signSponsorship(testPlayer, "sp_mizuno");
if (!res1.success || testPlayer.activeSponsorships.length !== 1) {
  throw new Error("Ký Mizuno thất bại!");
}
console.log(`Ký thành công: ${testPlayer.activeSponsorships[0].name}, Tiền lót tay: ${res1.signingBonus}`);
if (testPlayer.money <= 50000) throw new Error("Chưa nhận tiền lót tay!");

// Ký Puma (Cùng danh mục BOOTS -> phải thay thế Mizuno)
const res2 = signSponsorship(testPlayer, "sp_puma");
if (!res2.success || testPlayer.activeSponsorships.length !== 1) {
  throw new Error("Thay thế Puma thất bại hoặc độ dài danh sách activeSponsorships không đúng!");
}
if (res2.replacedDeal.id !== "sp_mizuno") {
  throw new Error("Hợp đồng bị thay thế không phải là Mizuno!");
}
if (testPlayer.activeSponsorships[0].id !== "sp_puma") {
  throw new Error("Hợp đồng hiện tại không phải là Puma!");
}
console.log(`Thay thế thành công: Đã thay ${res2.replacedDeal.name} bằng ${testPlayer.activeSponsorships[0].name}`);

// Ký thêm danh mục khác: BEVERAGE (Gatorade) & TECH (PlayStation)
const res3 = signSponsorship(testPlayer, "sp_gatorade");
const res4 = signSponsorship(testPlayer, "sp_playstation");
if (testPlayer.activeSponsorships.length !== 3) {
  throw new Error(`Kỳ vọng 3 hợp đồng khác danh mục nhưng thực tế: ${testPlayer.activeSponsorships.length}`);
}
console.log(`Ký song song 3 danh mục thành công: ${testPlayer.activeSponsorships.map(d => d.name).join(', ')}`);

// 4. Kiểm tra Quyết Toán Hàng Năm (processAnnualSponsorshipPayout)
console.log("\n[TEST 4] Kiểm tra Quyết Toán Hàng Năm & Trừ Thời Hạn...");
const initialCash = testPlayer.money;
const activeStats = getActiveSponsorshipStats(testPlayer);
console.log(`Tổng thu nhập tài trợ dự kiến mỗi năm: ${activeStats.totalAnnualIncome}`);

// Giả lập bước sang mùa giải 2027
testPlayer.year = 2027;
const payoutRes1 = processAnnualSponsorshipPayout(testPlayer);
console.log(`Đã quyết toán năm 2027: +${payoutRes1.totalPayout}. Số dư mới: ${testPlayer.money}`);
if (payoutRes1.totalPayout !== activeStats.totalAnnualIncome) {
  throw new Error(`Tiền quyết toán (${payoutRes1.totalPayout}) không khớp với tổng dự kiến (${activeStats.totalAnnualIncome})!`);
}
if (testPlayer.money !== initialCash + payoutRes1.totalPayout) {
  throw new Error("Tiền người chơi chưa được cộng đúng!");
}

// Kiểm tra guard chống trùng quyết toán cùng năm
const duplicatePayout = processAnnualSponsorshipPayout(testPlayer);
if (duplicatePayout.totalPayout !== 0 || !duplicatePayout.alreadyProcessed) {
  throw new Error("Lỗi: Quyết toán 2 lần trong cùng một năm!");
}
console.log("Guard chống duplicate payout trong cùng một năm hoạt động chuẩn xác!");

// 5. Kiểm tra Hợp Đồng Trọn Đời Không Bao Giờ Hết Hạn
console.log("\n[TEST 5] Kiểm tra Hợp Đồng Trọn Đời (LIFETIME)...");
const goatPlayer = {
  fame: 25000,
  activeSponsorships: [],
  activeAgent: "agent_family",
  money: 1000000,
  year: 2026,
  age: 26,
  careerLogs: []
};
signSponsorship(goatPlayer, "sp_nike_lifetime");
if (!goatPlayer.activeSponsorships[0].isLifetime) {
  throw new Error("Hợp đồng Nike Lifetime phải có isLifetime: true!");
}

// Chạy 15 mùa giải liên tục
for (let y = 2027; y <= 2042; y++) {
  goatPlayer.year = y;
  const pRes = processAnnualSponsorshipPayout(goatPlayer);
  if (pRes.expiredDeals.length > 0) {
    throw new Error(`Hợp đồng trọn đời bị hết hạn tại năm ${y}!`);
  }
}
if (goatPlayer.activeSponsorships.length !== 1 || goatPlayer.activeSponsorships[0].yearsRemaining !== 'LIFETIME') {
  throw new Error("Hợp đồng trọn đời bị thay đổi hoặc mất sau 15 năm!");
}
console.log("Hợp đồng trọn đời hoạt động vĩnh viễn suốt 15 mùa giải mà không bao giờ hết hạn!");

// 6. Kiểm tra Migration & Fallback trong storage.js
console.log("\n[TEST 6] Kiểm tra Migration & Fallback trong storage.js...");
const legacySaveData = {
  name: "Nguyễn Văn A",
  age: 19,
  position: "ST",
  careerStats: { matches: 50, goals: 30 },
  currentSeasonStats: { matches: 0, goals: 0 },
  injury: { isInjured: false },
  tactic: "ATTACKING",
  activeSponsor: "sp_nike" // save cũ chưa có activeSponsorships
};

_migrate(legacySaveData);
if (!Array.isArray(legacySaveData.activeSponsorships) || legacySaveData.activeSponsorships.length === 0) {
  throw new Error("Migration không khởi tạo activeSponsorships hoặc không migrate từ activeSponsor cũ!");
}
console.log(`Đã migrate thành công: ${legacySaveData.activeSponsorships.length} hợp đồng tài trợ mới từ save cũ!`);

console.log("\n=== TẤT CẢ CÁC BÀI KIỂM THỬ ĐÃ VƯỢT QUA 100% THÀNH CÔNG! ===");
