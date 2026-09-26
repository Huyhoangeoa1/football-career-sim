import { SPONSORSHIP_CATEGORIES, SPONSORSHIP_BRANDS, AGENTS_DATA } from '../js/data.js';
import { generateSponsorshipOffers, signSponsorship, getActiveSponsorshipStats } from '../js/playerEngine.js';

class MockElement {
  constructor(tagName = 'div') {
    this.tagName = tagName.toUpperCase();
    this.children = [];
    this.attributes = {};
    this.dataset = {};
    this.style = {};
    this._innerHTML = '';
    this.classList = {
      _classes: new Set(),
      add: (c) => this.classList._classes.add(c),
      remove: (c) => this.classList._classes.delete(c),
      contains: (c) => this.classList._classes.has(c)
    };
  }

  get innerHTML() {
    return this._innerHTML;
  }

  set innerHTML(val) {
    this._innerHTML = val;
    this.children = [];
  }

  get textContent() {
    return this._innerHTML.replace(/<[^>]*>/g, '');
  }

  appendChild(child) {
    this.children.push(child);
    return child;
  }

  querySelector(selector) {
    return this.querySelectorAll(selector)[0] || null;
  }

  querySelectorAll(selector) {
    const results = [];
    const check = (el) => {
      if (selector.startsWith('.') && el.className && el.className.includes(selector.slice(1))) {
        results.push(el);
      } else if (selector.startsWith('#') && el.id === selector.slice(1)) {
        results.push(el);
      } else if (el.tagName && el.tagName.toLowerCase() === selector.toLowerCase()) {
        results.push(el);
      }
      for (const ch of el.children) check(ch);
    };
    check(this);
    return results;
  }
}

global.document = {
  getElementById: (id) => elements[id] || null,
  createElement: (tag) => new MockElement(tag)
};

const elements = {
  agentsListContainer: new MockElement('div'),
  sponsorshipsListContainer: new MockElement('div')
};

console.log("=== KIỂM THỬ TÍCH HỢP HỆ THỐNG TÀI TRỢ ===");

const testPlayer = {
  fame: 8500, // Tier 7: Siêu sao toàn cầu
  money: 2000000,
  activeAgent: "agent_family",
  activeSponsorships: [],
  careerLogs: []
};

// 1. Kiểm tra offers sinh ra cho Tier 7
const offers = generateSponsorshipOffers(testPlayer);
console.log(`Sinh ra ${offers.length} đề nghị tài trợ`);
const unlocked = offers.filter(o => o.isUnlocked);
console.log(`Số đề nghị đã mở khóa cho Tier 7 (8500 pts): ${unlocked.length}`);
if (unlocked.length < 10) throw new Error("Tier 7 phải mở khóa được hầu hết các nhãn hàng Tier 1 đến 7!");

// 2. Ký 1 hợp đồng BOOTS (Nike)
const res1 = signSponsorship(testPlayer, "sp_nike");
if (!res1.success) throw new Error("Ký Nike thất bại!");
console.log(`Ký thành công: ${res1.deal.name}, Giá trị: ${res1.deal.annualPayout}/năm`);

// 3. Ký 1 hợp đồng LUXURY (Rolex)
const res2 = signSponsorship(testPlayer, "sp_rolex");
if (!res2.success) throw new Error("Ký Rolex thất bại!");
console.log(`Ký thành công: ${res2.deal.name}, Giá trị: ${res2.deal.annualPayout}/năm`);

// 4. Ký 1 hợp đồng BEVERAGE (Red Bull)
const res3 = signSponsorship(testPlayer, "sp_redbull");
if (!res3.success) throw new Error("Ký Red Bull thất bại!");
console.log(`Ký thành công: ${res3.deal.name}, Giá trị: ${res3.deal.annualPayout}/năm`);

const stats = getActiveSponsorshipStats(testPlayer);
console.log(`Tổng số hợp đồng đang hiệu lực: ${stats.count}/5`);
console.log(`Tổng thu nhập thụ động mỗi mùa: €${(stats.totalAnnualIncome / 1000000).toFixed(2)}M/mùa`);

if (stats.count !== 3) throw new Error("Kỳ vọng 3 hợp đồng đang hoạt động!");
if (stats.totalAnnualIncome < 30000000) throw new Error("Tổng thu nhập 3 hợp đồng khủng phải > 30M!");

console.log("\n=== KIỂM THỬ LOGIC HOÀN TOÀN THÀNH CÔNG! ===");
