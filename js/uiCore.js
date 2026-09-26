/* =========================================================================
   UI CORE — FORMATTERS & ANIMATIONS
   Extracted from ui.js — No external UI dependencies
   ========================================================================= */

export function formatCurrency(num, symbol = "€") {
  if (num >= 1000000000) return `${symbol}${(num / 1000000000).toFixed(2)}B`;
  if (num >= 1000000) return `${symbol}${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${symbol}${(num / 1000).toFixed(0)}k`;
  return `${symbol}${num}`;
}

export function formatMoney(num) {
  return formatCurrency(num, "$");
}

export function formatSalary(salary) {
  const n = Math.round(Number(salary) || 0);
  return `€${n.toLocaleString()} / week`;
}

if (typeof window !== 'undefined') {
  window.formatSalary = formatSalary;
}

export function triggerConfetti() {
  const container = document.createElement('div');
  container.className = 'confetti-wrapper';
  document.body.appendChild(container);

  const colors = ['#f59e0b', '#10b981', '#38bdf8', '#a855f7', '#ec4899', '#ffffff'];
  for (let i = 0; i < 70; i++) {
    const piece = document.createElement('div');
    piece.className = 'confetti-piece';
    piece.style.left = `${Math.random() * 100}vw`;
    piece.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    piece.style.animationDuration = `${Math.random() * 2 + 1.5}s`;
    piece.style.animationDelay = `${Math.random() * 0.5}s`;
    container.appendChild(piece);
  }

  setTimeout(() => {
    if (container && container.parentNode) {
      container.parentNode.removeChild(container);
    }
  }, 3500);
}

export function showToast(message, type = "success") {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast-message ${type === 'transfer' ? 'toast-transfer' : (type === 'gold' ? 'toast-gold' : '')}`;
  toast.innerHTML = `<span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => {
      if (toast && toast.parentNode && typeof toast.parentNode.removeChild === 'function') {
        toast.parentNode.removeChild(toast);
      } else if (toast && typeof toast.remove === 'function') {
        toast.remove();
      }
    }, 300);
  }, 2800);
}

export function getEuroBadgeText(status, leagueId) {
  if (status === "C1") {
    return leagueId === "SAUDI_PRO" ? "🌏 AFC Champions League Elite" : (leagueId === "MLS_AMERICAS" ? "🌎 CONCACAF / Libertadores" : "🏆 UEFA Champions League (C1)");
  }
  if (status === "C2") {
    return leagueId === "SAUDI_PRO" ? "🌏 AFC Champions League Two" : "🥈 UEFA Europa League (C2)";
  }
  if (status === "C3") {
    return "🥉 UEFA Conference League (C3)";
  }
  return "🏟️ Giải Quốc Nội (Không đá Cúp Châu Lục)";
}
