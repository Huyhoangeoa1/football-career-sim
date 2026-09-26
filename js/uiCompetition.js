/* =========================================================================
   UI COMPETITION — MULTI-TIER COMPETITIONS & CLUB PRESTIGE WIDGET
   Extracted from ui.js
   ========================================================================= */
import { updateCompetitionTier } from './engine.js';
export function renderCompetitionTierWidget(player) {
  const container = document.getElementById('competitionTierWidgetBox');
  if (!container) return;

  const tier = updateCompetitionTier(player) || {
    currentTier: 3,
    tierName: 'Tier 3: Giải Trẻ & Đào Tạo',
    clubPrestige: 35,
    qualificationStatus: 'YOUTH_LEAGUE',
    relegationThreat: false,
    tierDifficultyFactor: 0.80
  };

  const isTier1 = tier.currentTier === 1;
  const isTier2 = tier.currentTier === 2;

  let tierBadge = '🌱 TIER 3 - GIẢI TRẺ & ĐÀO TẠO';
  let tierBadgeColor = 'badge-green';
  let tierDifficultyText = '🛡️ Phòng ngự đối phương: VỪA PHẢI (OVR 55 - 68 | Kháng bàn thắng x0.80)';
  let tierDesc = 'Đấu trường đào tạo & ươm mầm tài năng. Thích hợp để tích lũy kinh nghiệm, rèn luyện chỉ số và thu hút sự chú ý của các tuyển trạch viên Châu Âu.';

  if (isTier1) {
    tierBadge = '👑 TIER 1 - ĐỈNH CAO CHÂU ÂU';
    tierBadgeColor = 'badge-gold';
    tierDifficultyText = '🛡️ Phòng ngự đối thủ: SIÊU GẮT GAO (OVR 82 - 94 | Kháng bàn thắng x1.25)';
    tierDesc = 'Đấu trường đỉnh cao khắt khe nhất thế giới (Top 5 VĐQG & UEFA Champions League). Hàng thủ kỷ luật thép, đối thủ có AI kèm người cực chặt chẽ.';
  } else if (isTier2) {
    tierBadge = '🥈 TIER 2 - HẠNG NHẤT CHÂU ÂU';
    tierBadgeColor = 'badge-blue';
    tierDifficultyText = '🛡️ Phòng ngự đối thủ: CHẶT CHẼ (OVR 70 - 79 | Kháng bàn thắng x1.00)';
    tierDesc = 'Đấu trường tranh vé thăng hạng giàu tính cọ xát (Championship, Segunda & Europa League). Cần nỗ lực liên tục để bước lên giải đấu thượng tầng.';
  }

  const prestige = Math.min(100, Math.max(0, tier.clubPrestige || 50));
  const qualStatus = tier.qualificationStatus || 'Thi đấu quốc nội';
  const threatAlert = tier.relegationThreat
    ? `<div class="tier-alert-danger">⚠️ BÁO ĐỘNG RỚT HẠNG: Phong độ bết bát của đội bóng đang đối diện nguy cơ tụt hạng mùa sau!</div>`
    : `<div class="tier-alert-safe">✨ VỊ THẾ VỮNG CHẮC: Kết quả thi đấu bảo đảm thứ hạng danh giá của CLB.</div>`;

  container.innerHTML = `
    <div class="competition-tier-card ${tierBadgeColor}">
      <div class="tier-card-header">
        <div class="tier-card-left">
          <span class="tier-badge ${tierBadgeColor}">${tierBadge}</span>
          <span class="tier-name-title">${tier.tierName}</span>
        </div>
        <div class="tier-status-pill">
          ${qualStatus}
        </div>
      </div>

      <div class="tier-prestige-section">
        <div class="prestige-header">
          <span class="prestige-label">⭐ Danh Vọng CLB (Club Prestige)</span>
          <span class="prestige-score">${prestige}/100</span>
        </div>
        <div class="prestige-bar-bg">
          <div class="prestige-bar-fill" style="width: ${prestige}%;"></div>
        </div>
      </div>

      <div class="tier-difficulty-info">
        <div class="tier-diff-row">
          <span>${tierDifficultyText}</span>
        </div>
        <div class="tier-diff-desc">${tierDesc}</div>
      </div>

      ${threatAlert}
    </div>
  `;
}

/* =========================================================================
   11. SUMMER TOURNAMENT MODAL (VÒNG CHUNG KẾT MÙA HÈ - ĐTQG)
   ========================================================================= */
