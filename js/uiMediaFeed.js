/* =========================================================================
   UI MEDIA FEED — TRUYỀN THÔNG, DƯ LUẬN & PHẢN ỨNG NGƯỜI HÂM MỘ
   Media & Fan Reaction Hub (Twitter/X style timeline & Press quotes)
   ========================================================================= */

import { getPlayer } from './state.js';
import { ensurePlayerMediaFeed } from './mediaEngine.js';

let currentMediaFilter = 'all';

/**
 * Lọc danh mục tin tức truyền thông / MXH
 * @param {'all'|'press'|'fan'|'team'|'awards'} category 
 */
export function filterMediaFeed(category = 'all') {
  currentMediaFilter = category;
  const player = getPlayer();
  if (player) {
    renderMediaFeedTab(player, currentMediaFilter);
  }
}

if (typeof window !== 'undefined') {
  window.filterMediaFeed = filterMediaFeed;
}

/**
 * Render toàn bộ giao diện phân hệ "Truyền Thông & Dư Luận"
 * @param {object} player 
 * @param {string} filterCategory 
 */
export function renderMediaFeedTab(player, filterCategory = currentMediaFilter) {
  currentMediaFilter = filterCategory;
  const container = document.getElementById('mediaFeedContainer');
  if (!container) return;

  const feed = ensurePlayerMediaFeed(player);

  const countAll = feed.length;
  const countPress = feed.filter(item => item.category === 'PRESS').length;
  const countFan = feed.filter(item => item.category === 'FAN').length;
  const countTeam = feed.filter(item => item.category === 'TEAM').length;
  const countAwards = feed.filter(item => item.category === 'AWARDS').length;

  const filteredFeed = feed.filter(item => {
    if (filterCategory === 'all') return true;
    if (filterCategory === 'press') return item.category === 'PRESS';
    if (filterCategory === 'fan') return item.category === 'FAN';
    if (filterCategory === 'team') return item.category === 'TEAM';
    if (filterCategory === 'awards') return item.category === 'AWARDS';
    return true;
  });

  // Tính toán chỉ số lan tỏa truyền thông (Media Buzz Index)
  let buzzLabel = "Sôi Động Nội Bộ ⚡";
  let buzzClass = "buzz-local";
  if (countAll >= 20 || countAwards >= 2) {
    buzzLabel = "Bùng Nổ Toàn Cầu 🔥 (Global Viral)";
    buzzClass = "buzz-global";
  } else if (countAll >= 8) {
    buzzLabel = "Tâm Điểm Thể Thao 🌟 (High Buzz)";
    buzzClass = "buzz-high";
  }

  // Header Bar thống kê dư luận & Bộ lọc Tabs
  const headerHtml = `
    <div class="media-buzz-overview-card">
      <div class="media-buzz-stat">
        <div class="media-buzz-val" style="color: #38bdf8;">${countAll}</div>
        <div class="media-buzz-lbl">📱 Tổng Tin & Trích Dẫn</div>
      </div>
      <div class="media-buzz-stat">
        <div class="media-buzz-val ${buzzClass}">${buzzLabel}</div>
        <div class="media-buzz-lbl">🌐 Chỉ Số Lan Tỏa</div>
      </div>
      <div class="media-buzz-stat">
        <div class="media-buzz-val" style="color: #10b981;">98.8% Tích Cực</div>
        <div class="media-buzz-lbl">💬 Độ Hưởng Ứng CĐV</div>
      </div>
    </div>

    <div class="media-filters-bar">
      <button class="media-filter-btn ${filterCategory === 'all' ? 'active' : ''}" onclick="window.filterMediaFeed('all')">
        🌐 Tất Cả (${countAll})
      </button>
      <button class="media-filter-btn ${filterCategory === 'press' ? 'active' : ''}" onclick="window.filterMediaFeed('press')">
        🗞️ Báo Chí Quốc Tế (${countPress})
      </button>
      <button class="media-filter-btn ${filterCategory === 'fan' ? 'active' : ''}" onclick="window.filterMediaFeed('fan')">
        💬 CĐV & Mạng Xã Hội (${countFan})
      </button>
      <button class="media-filter-btn ${filterCategory === 'team' ? 'active' : ''}" onclick="window.filterMediaFeed('team')">
        👔 HLV & Đồng Đội (${countTeam})
      </button>
      <button class="media-filter-btn ${filterCategory === 'awards' ? 'active' : ''}" onclick="window.filterMediaFeed('awards')">
        🌟 Danh Hiệu & MVP (${countAwards})
      </button>
    </div>
  `;

  if (filteredFeed.length === 0) {
    container.innerHTML = `
      ${headerHtml}
      <div class="media-empty-state">
        <div style="font-size: 3rem; margin-bottom: 12px;">📱</div>
        <div style="font-weight: 800; font-size: 1.1rem; color: var(--text-main);">Chưa có phản ứng trong danh mục này</div>
        <div style="font-size: 0.85rem; color: var(--text-muted); margin-top: 6px; max-width: 480px; line-height: 1.5;">
          Hãy ra sân thi đấu thăng hoa (Rating &ge; 9.0), ghi bàn thắng định đoạt hoặc đoạt danh hiệu MVP / Vô địch cúp để thổi bùng cơn sốt truyền thông toàn cầu!
        </div>
      </div>
    `;
    return;
  }

  const itemsHtml = filteredFeed.map(item => {
    const badgeClass = `media-card-${(item.badge || 'normal').toLowerCase()}`;
    const tagHtml = item.highlightTag 
      ? `<span class="media-highlight-pill ${badgeClass}">${item.highlightTag}</span>` 
      : '';

    // Render Metrics nếu có (Social likes, retweets)
    let footerHtml = '';
    if (item.metrics) {
      footerHtml = `
        <div class="media-social-metrics">
          <span class="metric-item">❤️ ${item.metrics.likes || '45K'}</span>
          <span class="metric-item">🔄 ${item.metrics.retweets || '12K'}</span>
          <span class="metric-item">💬 ${item.metrics.comments || '850'}</span>
          <span class="metric-item metric-views">📊 Thịnh Hành</span>
        </div>
      `;
    } else {
      footerHtml = `
        <div class="media-press-footer">
          <span>📰 ${item.source}</span>
          <span style="opacity: 0.7;">• Độc Quyền Toàn Cầu</span>
        </div>
      `;
    }

    return `
      <div class="media-feed-card ${badgeClass}">
        <div class="media-card-header">
          <div class="media-avatar-box">
            <span class="media-avatar-icon">${item.avatar || '🗞️'}</span>
          </div>
          <div class="media-author-meta">
            <div class="media-author-title">
              <span class="media-author-name">${item.author}</span>
              ${item.verified ? '<span class="media-verified-badge" title="Đã xác minh chính thức">✓</span>' : ''}
              <span class="media-author-role">• ${item.role}</span>
            </div>
            <div class="media-source-time">
              <span>${item.source}</span>
              <span class="media-bullet">•</span>
              <span class="media-time-text">${item.timeLabel}</span>
            </div>
          </div>
          <div class="media-card-tag-box">
            ${tagHtml}
          </div>
        </div>

        ${item.headline ? `<div class="media-headline-text">${item.headline}</div>` : ''}

        <div class="media-body-content">
          ${item.content}
        </div>

        ${footerHtml}
      </div>
    `;
  }).join('');

  container.innerHTML = `
    ${headerHtml}
    <div class="media-feed-list">
      ${itemsHtml}
    </div>
  `;
}
