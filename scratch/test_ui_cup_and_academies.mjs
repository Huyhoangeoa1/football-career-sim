import { YOUTH_ACADEMIES, YOUTH_LEAGUE_CLUBS } from '../js/data.js';
import { createInitialPlayer } from '../js/state.js';
import { initSeasonScheduleAndTable } from '../js/seasonEngine.js';
import { renderMatchCard } from '../js/uiCup.js';

console.log("=== BẮT ĐẦU KIỂM THỬ: SƠ ĐỒ CÚP & 16 HỌC VIỆN MÀN HÌNH TẠO NHÂN VẬT ===");

// 1. Kiểm tra danh sách 16 Học viện trong YOUTH_ACADEMIES
console.log(`\n1. Kiểm tra YOUTH_ACADEMIES: Số lượng = ${YOUTH_ACADEMIES.length}`);
if (YOUTH_ACADEMIES.length !== 16) {
  throw new Error(`Kỳ vọng 16 học viện nhưng có ${YOUTH_ACADEMIES.length}`);
}

const requiredFields = ['id', 'name', 'code', 'icon', 'power', 'reputation', 'country', 'stadium', 'desc', 'philosophy'];
for (const acad of YOUTH_ACADEMIES) {
  for (const field of requiredFields) {
    if (!acad[field]) {
      throw new Error(`Học viện ${acad.name} thiếu trường: ${field}`);
    }
  }
  // So khớp với YOUTH_LEAGUE_CLUBS
  const matchInLeague = YOUTH_LEAGUE_CLUBS.find(c => c.id === acad.id);
  if (!matchInLeague) {
    throw new Error(`Học viện ${acad.id} không tìm thấy trong YOUTH_LEAGUE_CLUBS!`);
  }
  console.log(`  ✓ [${acad.code}] ${acad.name} (${acad.country}) - Sân: ${acad.stadium} - Sức mạnh: ${acad.power}`);
}

// 2. Kiểm tra tạo cầu thủ với từng học viện trong số 16 học viện
console.log(`\n2. Kiểm tra Khởi tạo nhân vật & BXH với các học viện mới:`);
const testAcadIds = ["dortmund_youth", "hale_end", "city_cfa", "juventus_youth", "inter_youth", "psg_youth", "pvf_academy", "castilla"];

for (const acadId of testAcadIds) {
  const p = createInitialPlayer("Tân Binh Test", "VN", "ST", acadId);
  if (!p.academy || p.academy.id !== acadId) {
    throw new Error(`Cầu thủ không nhận đúng học viện ${acadId}`);
  }
  initSeasonScheduleAndTable(p);
  if (!p.leagueTable || p.leagueTable.length !== 16) {
    throw new Error(`BXH giải trẻ không đủ 16 đội khi chọn học viện ${acadId}`);
  }
  const pRow = p.leagueTable.find(t => t.isPlayerClub);
  if (!pRow) {
    throw new Error(`Không tìm thấy dòng của người chơi (isPlayerClub: true) trong BXH khi chọn ${acadId}`);
  }
  console.log(`  ✓ Chọn ${acadId} ➔ Player Club: ${p.academy.name} ➔ BXH ghi nhận đúng (isPlayerClub: ${pRow.isPlayerClub}, code: ${pRow.clubCode})`);
}

// 3. Kiểm tra renderMatchCard trong js/uiCup.js
console.log(`\n3. Kiểm tra renderMatchCard (Nhiệm vụ 1):`);
const activeClub = YOUTH_LEAGUE_CLUBS.find(c => c.id === 'castilla');
const mockMatch = {
  id: 'test_match_1',
  club1: activeClub, // CLB của người chơi
  club2: YOUTH_LEAGUE_CLUBS.find(c => c.id === 'la_masia'),
  score1: 2,
  score2: 1,
  winner: activeClub,
  isPlayed: true
};

const cardHtml = renderMatchCard(mockMatch, 'Chung Kết Cúp', activeClub);

// Kiểm tra 1: Không được chứa badge hoặc text '★ BẠN'
if (cardHtml.includes('★ BẠN')) {
  throw new Error(`Thẻ trận đấu vẫn còn chứa text/badge '★ BẠN'!`);
}
console.log(`  ✓ Đã loại bỏ hoàn toàn chữ/badge '★ BẠN' khỏi thẻ.`);

// Kiểm tra 2: Phải chứa ngôi sao ⭐ nhỏ cạnh tên đội người chơi
if (!cardHtml.includes('⭐')) {
  throw new Error(`Thẻ trận đấu thiếu biểu tượng ngôi sao '⭐' bên cạnh tên đội người chơi!`);
}
console.log(`  ✓ Đã bổ sung biểu tượng ngôi sao ⭐ tinh tế cạnh tên đội người chơi.`);

// Kiểm tra 3: Vẫn giữ class 'player-match' trên thẻ
if (!cardHtml.includes('player-match')) {
  throw new Error(`Thẻ trận đấu bị mất class 'player-match'!`);
}
console.log(`  ✓ Thẻ trận đấu vẫn giữ nguyên class 'player-match' để hiển thị khung viền vàng kim nổi bật.`);

console.log(`\n>>> TẤT CẢ CÁC BƯỚC KIỂM THỬ ĐÃ THÀNH CÔNG RỰC RỠ! <<<`);
