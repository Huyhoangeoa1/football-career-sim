/* =========================================================================
   UI SETUP — SETUP SCREEN HELPERS
   Extracted from ui.js
   ========================================================================= */
import { POSITION_CONFIG, NATIONALITIES_DATA, YOUTH_ACADEMIES } from './data.js';
import { calculateOVR } from './playerEngine.js';
/* =========================================================================
   2. SETUP SCREEN HELPERS
   ========================================================================= */
export function renderNationalityOptions(nationalities, selectedNatId, onSelectCallback) {
  const container = document.getElementById('nationalityGrid');
  if (!container) return;
  const nats = (nationalities && nationalities.length > 0) ? nationalities : NATIONALITIES_DATA;

  const activeNatId = selectedNatId || window.selectedNationality || "VN";
  window.selectedNationality = activeNatId;

  // Regional Filter handler
  const regionTabs = document.querySelectorAll('#natRegionTabs .setup-filter-pill');
  let currentRegion = 'ALL';

  function drawNats() {
    container.innerHTML = '';
    const filteredNats = (currentRegion === 'ALL') 
      ? nats 
      : nats.filter(n => n.region === currentRegion);

    filteredNats.forEach(nat => {
      const div = document.createElement('div');
      const isSelected = nat.id === window.selectedNationality || nat.idAlias === window.selectedNationality;
      div.className = `nationality-option ${isSelected ? 'selected active' : ''}`;
      div.setAttribute('data-nat', nat.id);
      div.innerHTML = `
        <div class="nat-flag">${nat.flag}</div>
        <div class="nat-name">${nat.name}</div>
        <div class="nat-region-badge">${nat.id} • ${nat.region}</div>
      `;
      div.onclick = (e) => {
        e.preventDefault();
        document.querySelectorAll('.nationality-option').forEach(el => el.classList.remove('selected', 'active'));
        div.classList.add('selected', 'active');
        window.selectedNationality = nat.id;
        if (onSelectCallback) onSelectCallback(nat.id, div);
        updateRookieCardPreview({ natId: nat.id });
      };
      container.appendChild(div);
    });
  }

  if (regionTabs && regionTabs.length > 0) {
    regionTabs.forEach(tab => {
      tab.onclick = (e) => {
        e.preventDefault();
        regionTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        currentRegion = tab.dataset.region || 'ALL';
        drawNats();
      };
    });
  }

  drawNats();
}

export function renderPositionOptions(selectedPos, onSelectCallback) {
  const container = document.getElementById('positionGrid');
  if (!container) return;

  const activePos = selectedPos || window.selectedPosition || "ST";
  window.selectedPosition = activePos;

  const POSITIONS_DATA = [
    // 1. THỦ MÔN
    { id: 'GK', line: 'GK', lineName: 'Thủ Môn', name: 'Thủ Môn (GK)', icon: '🧤', keyAttrs: 'Phản Xạ • Bắt Bóng', desc: 'Người gác đền xuất thần, cứu thua & chỉ huy hàng thủ' },
    // 2. HẬU VỆ
    { id: 'CB', line: 'DF', lineName: 'Hậu Vệ', name: 'Trung Vệ (CB)', icon: '🛡️', keyAttrs: 'Tắc Bóng • Không Chiến • PHY', desc: 'Hòn đá tảng phòng ngự dũng mãnh, cản phá & không chiến' },
    { id: 'LB', line: 'DF', lineName: 'Hậu Vệ', name: 'Hậu Vệ Trái (LB)', icon: '🏃‍♂️', keyAttrs: 'Tốc Độ Biên • Tạt Bóng • DEF', desc: 'Bám biên trái cơ động, lên công về thủ và bọc lót cánh' },
    { id: 'RB', line: 'DF', lineName: 'Hậu Vệ', name: 'Hậu Vệ Phải (RB)', icon: '⚡', keyAttrs: 'Tốc Độ Biên • Tạt Bóng • DEF', desc: 'Bứt tốc biên phải, tranh chấp tay đôi và hỗ trợ leo biên' },
    // 3. TIỀN VỆ
    { id: 'CDM', line: 'MF', lineName: 'Tiền Vệ', name: 'Tiền Vệ Phòng Ngự (CDM)', icon: '⚓', keyAttrs: 'Cắt Bóng • Tranh Chấp • Chuyền Dài', desc: 'Máy quét mỏ neo, đánh chặn từ xa và thu hồi bóng phản công' },
    { id: 'CM', line: 'MF', lineName: 'Tiền Vệ', name: 'Tiền Vệ Trung Tâm (CM)', icon: '🎯', keyAttrs: 'Chuyền Bóng • Nhãn Quan • Kiểm Soát', desc: 'Nhạc trưởng con thoi Box-to-Box, điều phối nhịp độ tuyến giữa' },
    { id: 'CAM', line: 'MF', lineName: 'Tiền Vệ', name: 'Tiền Vệ Công (CAM)', icon: '🪄', keyAttrs: 'Chọc Khe • Rê Bóng • Sút Xa', desc: 'Số 10 hào hoa, xé toang hàng thủ bằng nhãn quan kỳ ảo' },
    { id: 'LM', line: 'MF', lineName: 'Tiền Vệ', name: 'Tiền Vệ Cánh Trái (LM)', icon: '🌪️', keyAttrs: 'Tốc Độ • Tạt Bóng • Rê Dắt', desc: 'Tiền vệ dạt biên trái, hỗ trợ kiểm soát bóng và tạt cánh chuẩn xác' },
    { id: 'RM', line: 'MF', lineName: 'Tiền Vệ', name: 'Tiền Vệ Cánh Phải (RM)', icon: '⚡', keyAttrs: 'Tốc Độ • Tạt Bóng • Rê Dắt', desc: 'Tiền vệ dạt biên phải, mở rộng chiều sâu đội hình và xuyên phá cánh' },
    // 4. TIỀN ĐẠO
    { id: 'LW', line: 'FW', lineName: 'Tiền Đạo', name: 'Tiền Đạo Cánh Trái (LW)', icon: '🔥', keyAttrs: 'Bứt Tốc • Rê Dắt • Cứa Lòng', desc: 'Mũi nhọn xuyên phá biên trái, ngoặt vào trong và cứa lòng hiểm hóc' },
    { id: 'RW', line: 'FW', lineName: 'Tiền Đạo', name: 'Tiền Đạo Cánh Phải (RW)', icon: '⚡', keyAttrs: 'Bứt Tốc • Rê Dắt • Đột Phá', desc: 'Mũi nhọn đột phá biên phải, đi bóng lắt léo và tạo đột biến cao' },
    { id: 'ST', line: 'FW', lineName: 'Tiền Đạo', name: 'Tiền Đạo Cắm (ST)', icon: '⚽', keyAttrs: 'Dứt Điểm • Săn Bàn • Chọn Vị Trí', desc: 'Sát thủ săn bàn 40-75+ bàn/mùa, Chiếc Giày Vàng & Quả Bóng Vàng' }
  ];

  const lineTabs = document.querySelectorAll('#posLineTabs .setup-filter-pill');
  let currentLine = 'ALL';

  function drawPositions() {
    container.innerHTML = '';
    const filtered = (currentLine === 'ALL')
      ? POSITIONS_DATA
      : POSITIONS_DATA.filter(p => p.line === currentLine);

    filtered.forEach(posItem => {
      const div = document.createElement('div');
      const isSelected = posItem.id === window.selectedPosition || 
                         (window.selectedPosition === 'FW' && posItem.id === 'ST') ||
                         (window.selectedPosition === 'MF' && posItem.id === 'CM') ||
                         (window.selectedPosition === 'DF' && posItem.id === 'CB');

      div.className = `position-option ${isSelected ? 'selected active' : ''}`;
      div.setAttribute('data-pos', posItem.id);
      div.setAttribute('data-line', posItem.line);
      div.innerHTML = `
        <div class="pos-top-row">
          <span class="pos-icon">${posItem.icon}</span>
          <span class="pos-line-badge pos-line-${posItem.line.toLowerCase()}">${posItem.lineName}</span>
          <span class="pos-code-badge">${posItem.id}</span>
        </div>
        <div class="name">${posItem.name}</div>
        <div class="pos-key-attrs">✨ ${posItem.keyAttrs}</div>
        <div class="desc">${posItem.desc}</div>
      `;
      div.onclick = (e) => {
        e.preventDefault();
        document.querySelectorAll('.position-option').forEach(el => el.classList.remove('selected', 'active'));
        div.classList.add('selected', 'active');
        window.selectedPosition = posItem.id;
        if (onSelectCallback) onSelectCallback(posItem.id, div);
        updateRookieCardPreview({ pos: posItem.id });
      };
      container.appendChild(div);
    });
  }

  if (lineTabs && lineTabs.length > 0) {
    lineTabs.forEach(tab => {
      tab.onclick = (e) => {
        e.preventDefault();
        lineTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        currentLine = tab.dataset.line || 'ALL';
        drawPositions();
      };
    });
  }

  drawPositions();
}

export function renderAcademyOptions(academies, selectedAcademyId, onSelectCallback) {
  const container = document.getElementById('academyGrid');
  if (!container) return;
  container.innerHTML = '';

  const acadList = (academies && Array.isArray(academies) && academies.length > 0) ? academies : YOUTH_ACADEMIES;
  const activeAcademyId = selectedAcademyId || window.selectedAcademyId || "pvf_academy";
  window.selectedAcademyId = activeAcademyId;

  acadList.forEach(acad => {
    const div = document.createElement('div');
    const isSelected = acad.id === activeAcademyId;
    div.className = `academy-option ${isSelected ? 'selected active' : ''}`;
    div.setAttribute('data-academy', acad.id);
    div.title = acad.desc ? `${acad.name} (${acad.country})\n${acad.desc}` : acad.name;
    div.innerHTML = `
      <div class="acad-header">
        <span class="acad-icon">${acad.icon}</span>
        <span class="acad-flag">${acad.flag || '⚽'}</span>
      </div>
      <div class="acad-info">
        <div class="acad-name" style="font-weight:700; font-size:0.8rem; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${acad.name}</div>
        <div class="acad-country" style="display:flex; justify-content:space-between; align-items:center; font-size:0.68rem; color:var(--text-muted); margin-top:2px;">
          <span>${acad.country}</span>
          <span style="color:var(--accent-gold); font-size:0.68rem; font-weight:700;">PWR ${acad.power || 75}</span>
        </div>
      </div>
    `;
    div.onclick = (e) => {
      e.preventDefault();
      document.querySelectorAll('.academy-option').forEach(el => el.classList.remove('selected', 'active'));
      div.classList.add('selected', 'active');
      window.selectedAcademyId = acad.id;
      if (onSelectCallback) onSelectCallback(acad.id, div);
      updateRookieCardPreview({ academyId: acad.id });
    };
    container.appendChild(div);
  });
}

export function updateRookieCardPreview(params = {}) {
  const nameInput = document.getElementById('inputPlayerName') || 
                    document.getElementById('playerName') || 
                    document.querySelector('input[name="playerName"]');
  const rawName = (params.name !== undefined) 
    ? params.name.trim() 
    : (nameInput && nameInput.value ? nameInput.value.trim() : "");
  const playerName = rawName ? rawName.toUpperCase() : "TÂN BINH VÔ DANH";

  const selectedNatEl = document.querySelector('.nationality-option.selected');
  const natId = params.natId || selectedNatEl?.dataset?.nat || window.selectedNationality || "VN";
  const nationality = NATIONALITIES_DATA.find(n => n.id === natId || n.idAlias === natId) || NATIONALITIES_DATA[0];

  const selectedPosEl = document.querySelector('.position-option.selected');
  const pos = params.pos || selectedPosEl?.dataset?.pos || window.selectedPosition || "ST";

  const posIcons = {
    GK: '🧤',
    CB: '🛡️',
    LB: '🏃‍♂️',
    RB: '⚡',
    CDM: '⚓',
    CM: '🎯',
    CAM: '🪄',
    LM: '🌪️',
    RM: '⚡',
    LW: '🔥',
    RW: '⚡',
    ST: '⚽',
    FW: '⚽',
    MF: '🎯',
    DF: '🛡️'
  };

  const selectedAcadEl = document.querySelector('.academy-option.selected');
  const academyId = params.academyId || selectedAcadEl?.dataset?.academy || window.selectedAcademyId || "pvf_academy";
  const academy = YOUTH_ACADEMIES.find(a => a.id === academyId) || YOUTH_ACADEMIES[0];

  // Base OVR & 6 FUT stats by position - Synced to Starting OVR from POSITION_CONFIG
  const pUpper = String(pos).toUpperCase();
  const pConf = POSITION_CONFIG[pUpper] || POSITION_CONFIG.ST;
  const pStats = pConf.initialStats || { pac: 55, sho: 55, pas: 55, dri: 55, def: 55, phy: 55 };
  let ovr = calculateOVR ? calculateOVR({ position: pUpper, stats: pStats }) : 55;
  let stats = [
    { lbl: 'PAC', val: pStats.pac },
    { lbl: 'DRI', val: pStats.dri },
    { lbl: 'SHO', val: pStats.sho },
    { lbl: 'DEF', val: pStats.def },
    { lbl: 'PAS', val: pStats.pas },
    { lbl: 'PHY', val: pStats.phy }
  ];


  // Update card theme and edition badge
  const elCardOuter = document.getElementById('rookieCardOuter');
  if (elCardOuter) {
    elCardOuter.classList.remove('theme-gold', 'theme-toty', 'theme-tots', 'theme-icon');
    if (!elCardOuter.classList.contains('theme-future')) {
      elCardOuter.classList.add('theme-future');
    }
  }

  const elBadge = document.getElementById('rookieCardEditionBadge') || document.querySelector('.rookie-badge-pill');
  if (elBadge) {
    elBadge.textContent = 'FUTURE';
  }

  // Update card DOM elements if present
  const elOvr = document.getElementById('rookieCardOvr');
  if (elOvr) elOvr.textContent = ovr;

  const elPos = document.getElementById('rookieCardPos');
  if (elPos) elPos.textContent = pUpper === 'FW' ? 'ST' : (pUpper === 'MF' ? 'CAM' : (pUpper === 'DF' ? 'CB' : pUpper));

  const elAvatar = document.getElementById('rookieCardAvatar');
  if (elAvatar) elAvatar.textContent = posIcons[pUpper] || '⚽';

  const elName = document.getElementById('rookieCardName');
  if (elName) elName.textContent = playerName;

  // Cấu trúc thẻ FIFA chuẩn: Dòng 1 Cờ quốc gia, Dòng 2 Logo / Tên viết tắt CLB
  const elFlag = document.getElementById('rookieCardNationFlag');
  if (elFlag) {
    elFlag.textContent = nationality.flag || '🇻🇳';
    elFlag.title = `Quốc tịch: ${nationality.name}`;
  }

  const elNationName = document.getElementById('rookieCardNationName');
  if (elNationName) elNationName.textContent = nationality.name;

  const elClubIcon = document.getElementById('rookieCardClubIcon');
  if (elClubIcon) {
    const academyAbbrMap = {
      castilla: 'CAS',
      la_masia: 'MAS',
      sporting_acad: 'SCP',
      benfica_campus: 'SLB',
      ajax_academy: 'AJX',
      bayern_junior: 'BAY',
      dortmund_youth: 'BVB',
      carrington: 'CAR',
      cobham: 'COB',
      hale_end: 'ARS',
      city_cfa: 'MCI',
      juventus_youth: 'JUV',
      inter_youth: 'INT',
      psg_youth: 'PSG',
      clairefontaine: 'CLA',
      pvf_academy: 'PVF'
    };
    const clubAbbr = academy.code || academyAbbrMap[academy.id] || (academy.name && academy.name.includes('PVF') ? 'PVF' : (academy.icon && academy.icon !== nationality.flag ? academy.icon : 'CLUB'));
    elClubIcon.textContent = clubAbbr;
    elClubIcon.title = `Lò đào tạo: ${academy.name}`;
  }

  const elClubName = document.getElementById('rookieCardClubName');
  if (elClubName) {
    const cleanName = academy.name.replace(/\s*\([^)]*\)/, '');
    elClubName.textContent = cleanName;
    elClubName.title = academy.name;
  }

  // Đồng bộ badge trạng thái bên ngoài phôi thẻ
  const elBadgeStatus = document.querySelector('.preview-badge-status');
  if (elBadgeStatus) {
    elBadgeStatus.textContent = '⭐ RISING STAR • 16 TUỔI • TÂN BINH ACADEMY';
  }



  const elStats = document.getElementById('rookieCardStats');
  if (elStats) {
    elStats.innerHTML = stats.map(s => `
      <div class="rookie-stat-item">
        <span class="rookie-stat-val">${s.val}</span>
        <span class="rookie-stat-lbl">${s.lbl}</span>
      </div>
    `).join('');
  }
}

if (typeof window !== 'undefined') {
  window.renderNationalityOptions = renderNationalityOptions;
  window.renderPositionOptions = renderPositionOptions;
  window.renderAcademyOptions = renderAcademyOptions;
  window.updateRookieCardPreview = updateRookieCardPreview;
}

