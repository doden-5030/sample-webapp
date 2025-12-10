// サンプルデータ（ローカルのみ）
const TIPS = [
  {
    id: 1,
    game: "Dragon Quest",
    title: "初期攻略：序盤の効率的なレベリング",
    summary: "最初のダンジョン周回で経験値ブーストを狙う方法。",
    content: "序盤は敵の経験値が比較的高い安全なダンジョンで、全滅しない程度に周回するのが効率的。パーティの回復手段を確保し、状態異常対策を忘れずに。重要アイテムは宝箱だけでなく、敵ドロップも確認すること。",
    tags: ["レベリング","序盤","初心者向け"],
    date: "2024-01-10"
  },
  {
    id: 2,
    game: "Stellar Frontier",
    title: "ボス攻略：弱点属性を突く",
    summary: "ボスの弱点属性を確認して装備を揃える手順。",
    content: "ボスごとに弱点属性が異なるため、スキャンや図鑑で属性を確認。属性耐性ダウンのスキルや、属性武器を切り替えてダメージを最大化する。補助役はバフ回復に徹すると安定する。",
    tags: ["ボス","属性","中級者向け"],
    date: "2024-03-22"
  },
  {
    id: 3,
    game: "Mystic Adventure",
    title: "隠し要素：マップ南東の隠し扉",
    summary: "条件を満たすと開く隠し扉の見つけ方。",
    content: "特定の時間帯（夜）に特定のアイテムを装備していると、南東の岩が透けるエフェクトを発生させる。このときに近づくと隠し扉が開き、レアアイテムが入手可能。",
    tags: ["隠し要素","発見","小ネタ"],
    date: "2023-11-05"
  },
  {
    id: 4,
    game: "Dragon Quest",
    title: "装備集め：効率的なゴールド稼ぎ",
    summary: "装備を揃えるための短時間で稼げる金策。",
    content: "週に一度出現する希少素材モンスターを狩ることで、大量のゴールドと装備の素材が手に入る。売却するアイテムと強化に回すアイテムを分けて管理することが大切。",
    tags: ["金策","装備","効率化"],
    date: "2024-06-15"
  },
  {
    id: 5,
    game: "Stellar Frontier",
    title: "トレードのコツ：相場を読む",
    summary: "アイテムの需要と供給を把握して利益を出す方法。",
    content: "イベント期間中は特定素材の需要が高まるため、イベント開始前に仕込んでおくと利益が出やすい。プレイヤー間の相場は小さなサーバー差があるため、複数回の取引で相場を学ぼう。",
    tags: ["経済","取引","上級者向け"],
    date: "2024-08-01"
  }
];

// 要素取得
const tipsList = document.getElementById("tipsList");
const noResults = document.getElementById("noResults");
const searchForm = document.getElementById("searchForm");
const gameInput = document.getElementById("gameInput");
const keywordInput = document.getElementById("keywordInput");
const clearBtn = document.getElementById("clearBtn");

const overlay = document.getElementById("overlay");
const modalTitle = document.getElementById("modalTitle");
const modalMeta = document.getElementById("modalMeta");
const modalContent = document.getElementById("modalContent");
const modalTags = document.getElementById("modalTags");
const modalClose = document.getElementById("modalClose");

// デバッグログ
console.log("App loaded. overlay:", overlay, "modalClose:", modalClose);

// 初期レンダリング
function renderList(items) {
  tipsList.innerHTML = "";
  if (!items.length) {
    noResults.hidden = false;
    return;
  }
  noResults.hidden = true;
  items.forEach(item => {
    const card = document.createElement("article");
    card.className = "card";
    card.tabIndex = 0;
    card.setAttribute("role", "button");
    card.innerHTML = `
      <div class="game">${escapeHtml(item.game)}</div>
      <h3 class="title">${escapeHtml(item.title)}</h3>
      <div class="summary">${escapeHtml(item.summary)}</div>
      <div class="tags">${item.tags.map(t => `<span class="tag">${escapeHtml(t)}</span>`).join("")}</div>
    `;
    card.addEventListener("click", () => openModal(item));
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") openModal(item);
    });
    tipsList.appendChild(card);
  });
}

// フィルタリング
function filterTips() {
  const game = gameInput.value.trim().toLowerCase();
  const kw = keywordInput.value.trim().toLowerCase();

  const results = TIPS.filter(tip => {
    const inGame = game === "" || tip.game.toLowerCase().includes(game);
    if (!inGame) return false;
    if (!kw) return true;
    // キーワードはタイトル・サマリ・コンテンツ・タグでヒット
    const haystack = [
      tip.title,
      tip.summary,
      tip.content,
      tip.tags.join(" ")
    ].join(" ").toLowerCase();
    return haystack.includes(kw);
  });

  renderList(results);
}

// モーダル表示
function openModal(item) {
  if (!overlay) {
    console.error("overlay not found");
    return;
  }
  modalTitle.textContent = item.title;
  modalMeta.textContent = `${item.game} • ${item.date}`;
  modalContent.textContent = item.content;
  modalTags.innerHTML = item.tags.map(t => `<span class="tag">${escapeHtml(t)}</span>`).join(" ");
  overlay.hidden = false;
  overlay.style.display = "flex";
  document.body.style.overflow = "hidden";
  console.log("Modal opened");
}

function closeModal() {
  if (!overlay) return;
  overlay.hidden = true;
  overlay.style.display = "none";
  document.body.style.overflow = "";
  console.log("Modal closed");
}

// ユーティリティ（XSS対策のため最低限のエスケープ）
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

// イベント
if (searchForm) {
  searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    filterTips();
  });
}

if (clearBtn) {
  clearBtn.addEventListener("click", () => {
    gameInput.value = "";
    keywordInput.value = "";
    filterTips();
  });
}

// リアルタイムで検索反映（タイプ中にも絞り込みたい場合）
if (gameInput) gameInput.addEventListener("input", debounce(filterTips, 250));
if (keywordInput) keywordInput.addEventListener("input", debounce(filterTips, 250));

// モーダル閉じる
if (modalClose) {
  modalClose.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    closeModal();
  });
}

if (overlay) {
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) {
      e.preventDefault();
      closeModal();
    }
  });
}

// Escapeキーで閉じる
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && overlay && !overlay.hidden) {
    closeModal();
  }
});

// 初期表示
renderList(TIPS);

// 小さなヘルパー: debounce
function debounce(fn, wait) {
  let t;
  return function (...args) {
    clearTimeout(t);
    t = setTimeout(() => fn.apply(this, args), wait);
  };
}
