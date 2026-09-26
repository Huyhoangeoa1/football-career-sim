/* =========================================================================
   UI CAREER — CAREER CHRONICLE (NHẬT KÝ SỰ NGHIỆP & TIMELINE BADGES)
   Extracted from ui.js
   ========================================================================= */
import { getPlayer } from './state.js';
/* =========================================================================
   12. CAREER CHRONICLE (NHẬT KÝ SỰ NGHIỆP & TIMELINE BADGES)
   ========================================================================= */
let currentChronicleFilter = 'all';

export function filterCareerChronicle(category = 'all') {
  currentChronicleFilter = category;
  const player = getPlayer();
  if (player) {
    renderCareerChronicleTab(player, currentChronicleFilter);
  }
}
if (typeof window !== 'undefined') {
  window.filterCareerChronicle = filterCareerChronicle;
}

export function renderCareerChronicleTab(player, filterCategory = currentChronicleFilter) {
  currentChronicleFilter = filterCategory;
  const container = document.getElementById('careerChronicleContainer');
  if (!container) return;

  const logs = player.careerChronicleLog || [];
  const countAll = logs.length;
  const countMatches = logs.filter(l => l.category === 'matches' || l.category === 'MATCH').length;
  const countTransfers = logs.filter(l => l.category === 'transfers' || l.category === 'TRANSFER').length;
  const countTrophies = logs.filter(l => l.category === 'trophies' || l.category === 'TROPHY' || l.category === 'SPECIAL').length;

  const filteredLogs = logs.filter(item => {
    if (filterCategory === 'all') return true;
    if (filterCategory === 'matches') return item.category === 'matches' || item.category === 'MATCH';
    if (filterCategory === 'transfers') return item.category === 'transfers' || item.category === 'TRANSFER';
    if (filterCategory === 'trophies') return item.category === 'trophies' || item.category === 'TROPHY' || item.category === 'SPECIAL';
    return true;
  });

  const filterBarHtml = `
    <div class="chronicle-filters-bar">
      <button class="chronicle-filter-btn ${filterCategory === 'all' ? 'active' : ''}" onclick="window.filterCareerChronicle('all')">
        🌐 Tất Cả (${countAll})
      </button>
      <button class="chronicle-filter-btn ${filterCategory === 'matches' ? 'active' : ''}" onclick="window.filterCareerChronicle('matches')">
        ⚽ Trận Đấu (${countMatches})
      </button>
      <button class="chronicle-filter-btn ${filterCategory === 'transfers' ? 'active' : ''}" onclick="window.filterCareerChronicle('transfers')">
        ✈️ Chuyển Nhượng & Hợp Đồng (${countTransfers})
      </button>
      <button class="chronicle-filter-btn ${filterCategory === 'trophies' ? 'active' : ''}" onclick="window.filterCareerChronicle('trophies')">
        🏆 Danh Hiệu & Kỷ Lục (${countTrophies})
      </button>
    </div>
  `;

  if (filteredLogs.length === 0) {
    container.innerHTML = `
      ${filterBarHtml}
      <div class="chronicle-empty-state">
        <div style="font-size: 2.8rem; margin-bottom: 10px;">📜</div>
        <div style="font-weight: 800; font-size: 1.05rem; color: var(--text-main);">Chưa có cột mốc nào trong danh mục này</div>
        <div style="font-size: 0.85rem; color: var(--text-muted); margin-top: 6px; max-width: 480px; line-height: 1.5;">
          Hãy tiếp tục ra sân, tỏa sáng tại các trận cầu đinh, ghi bàn thắng vàng phút bù giờ và chinh phục các đỉnh cao danh hiệu để lưu danh sử sách!
        </div>
      </div>
    `;
    return;
  }

  const timelineHtml = `
    <div class="chronicle-timeline">
      ${filteredLogs.map(item => {
        const badgeColorClass = `badge-${item.badgeColor || 'gold'}`;
        return `
          <div class="chronicle-timeline-item">
            <div class="chronicle-timeline-marker ${badgeColorClass}"></div>
            <div class="chronicle-card ${badgeColorClass}">
              <div class="chronicle-card-head">
                <span class="chronicle-badge ${badgeColorClass}">${item.badge || '⭐ CỘT MỐC LỊCH SỬ'}</span>
                <span class="chronicle-meta">Mùa ${item.season || 1} • Năm ${item.year || 2026} (${item.age} tuổi) • Chặng ${item.phase || 1}/4</span>
              </div>
              <div class="chronicle-card-club">
                <span>🏟️</span> <span>${item.club || 'CLB Sự Nghiệp'}</span>
              </div>
              <div class="chronicle-card-title">
                <span>${item.icon || '✨'}</span> <span>${item.title}</span>
              </div>
              <div class="chronicle-card-desc">
                ${item.desc}
              </div>
            </div>
          </div>
        `;
      }).join('')}
    </div>
  `;

  container.innerHTML = `${filterBarHtml}${timelineHtml}`;
}

/* =========================================================================
   13. MULTI-TIER COMPETITIONS (ĐẤU TRƯỜNG ĐA CẤP ĐỘ & CLUB PRESTIGE)
   ========================================================================= */
