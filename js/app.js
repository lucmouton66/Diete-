// ===================================================================
// Utilitaires nutrition
// ===================================================================
function computeItemMacros(item) {
  const f = FOODS[item.food];
  const ratio = item.qty / 100;
  return {
    kcal: f.kcal * ratio,
    p: f.p * ratio,
    c: f.c * ratio,
    f: f.f * ratio,
  };
}

function sumMacros(list) {
  return list.reduce(
    (acc, m) => ({
      kcal: acc.kcal + m.kcal,
      p: acc.p + m.p,
      c: acc.c + m.c,
      f: acc.f + m.f,
    }),
    { kcal: 0, p: 0, c: 0, f: 0 }
  );
}

function fmt(n, d = 0) {
  return n.toLocaleString("fr-FR", { minimumFractionDigits: d, maximumFractionDigits: d });
}

function timeToMinutes(timeStr) {
  const [h, m] = timeStr.replace("h", ":").split(":").map(Number);
  return h * 60 + (m || 0);
}

function nextMealIndex(meals) {
  const nowMinutes = new Date().getHours() * 60 + new Date().getMinutes();
  const withIndex = meals.map((meal, i) => ({ i, minutes: timeToMinutes(meal.time) }));
  const upcoming = withIndex.find((m) => m.minutes > nowMinutes);
  return upcoming ? upcoming.i : withIndex[0].i;
}

// ===================================================================
// Rendu du plan alimentaire
// ===================================================================
function renderMealPlan() {
  const plan = MEAL_PLAN;
  const container = document.getElementById("meals-container");
  container.innerHTML = "";

  const dayMacros = [];
  const nextIndex = nextMealIndex(plan.meals);
  let nextCard = null;

  plan.meals.forEach((meal, index) => {
    const itemMacros = meal.items.map(computeItemMacros);
    const mealTotal = sumMacros(itemMacros);
    dayMacros.push(mealTotal);

    const card = document.createElement("div");
    card.className = "meal-card";
    if (index === nextIndex) {
      card.className += " meal-card--next";
      card.id = "next-meal";
      nextCard = card;
    }

    const itemsHtml = meal.items
      .map((item, i) => {
        const f = FOODS[item.food];
        const m = itemMacros[i];
        return `<li>
          <span class="item-name">${f.name}</span>
          <span class="item-qty">${item.qty}${f.unit}</span>
          <span class="item-macro">${fmt(m.kcal)} kcal · P ${fmt(m.p, 1)}g</span>
        </li>`;
      })
      .join("");

    card.innerHTML = `
      <div class="meal-header">
        <h3>${meal.name}</h3>
        <span class="meal-time">${meal.time}</span>
      </div>
      ${index === nextIndex ? `<span class="next-badge">Prochain repas</span>` : ""}
      <ul class="item-list">${itemsHtml}</ul>
      ${meal.note ? `<p class="meal-note">${meal.note}</p>` : ""}
      <div class="meal-total">
        Total repas : <strong>${fmt(mealTotal.kcal)} kcal</strong>
        · P ${fmt(mealTotal.p)}g · G ${fmt(mealTotal.c)}g · L ${fmt(mealTotal.f)}g
      </div>
    `;
    container.appendChild(card);
  });

  if (nextCard) {
    setTimeout(() => {
      nextCard.scrollIntoView({ block: "center" });
    }, 100);
  }

  const dayTotal = sumMacros(dayMacros);
  document.getElementById("day-total").innerHTML = `
    <div class="total-box">
      <div><span>${fmt(dayTotal.kcal)}</span><small>kcal</small></div>
      <div><span>${fmt(dayTotal.p)}g</span><small>Protéines</small></div>
      <div><span>${fmt(dayTotal.c)}g</span><small>Glucides</small></div>
      <div><span>${fmt(dayTotal.f)}g</span><small>Lipides</small></div>
    </div>
  `;
}

// ===================================================================
// Suivi de poids (localStorage)
// ===================================================================
const START_WEIGHT = 75;
const GOAL_WEIGHT = 85;
const STORAGE_KEY = "poids-log-v1";
const GOAL_DATE_KEY = "goal-date-v1";

function getWeightLog() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveWeightLog(log) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(log));
  } catch {
    /* stockage indisponible, on continue sans persister */
  }
}

function getGoalDate() {
  try {
    return localStorage.getItem(GOAL_DATE_KEY) || defaultGoalDate();
  } catch {
    return defaultGoalDate();
  }
}

function defaultGoalDate() {
  const now = new Date();
  const year = now.getMonth() >= 3 ? now.getFullYear() + 1 : now.getFullYear();
  return `${year}-04-30`;
}

function initWeightTracker() {
  const form = document.getElementById("weight-form");
  const dateInput = document.getElementById("weight-date");
  const valueInput = document.getElementById("weight-value");
  const goalDateInput = document.getElementById("goal-date");

  dateInput.value = new Date().toISOString().slice(0, 10);
  goalDateInput.value = getGoalDate();

  let log = getWeightLog();
  if (log.length === 0) {
    log.push({ date: new Date().toISOString().slice(0, 10), weight: START_WEIGHT });
    saveWeightLog(log);
  }

  renderWeightTracker(log);

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const date = dateInput.value;
    const weight = parseFloat(valueInput.value);
    if (!date || isNaN(weight)) return;

    log = getWeightLog().filter((entry) => entry.date !== date);
    log.push({ date, weight });
    log.sort((a, b) => a.date.localeCompare(b.date));
    saveWeightLog(log);
    valueInput.value = "";
    renderWeightTracker(log);
  });

  goalDateInput.addEventListener("change", () => {
    try {
      localStorage.setItem(GOAL_DATE_KEY, goalDateInput.value);
    } catch {
      /* ignore */
    }
    renderWeightTracker(getWeightLog());
  });

  document.getElementById("clear-log").addEventListener("click", () => {
    if (!confirm("Effacer tout l'historique de poids ?")) return;
    saveWeightLog([]);
    log = getWeightLog();
    if (log.length === 0) {
      log.push({ date: new Date().toISOString().slice(0, 10), weight: START_WEIGHT });
      saveWeightLog(log);
    }
    renderWeightTracker(log);
  });
}

function renderWeightTracker(log) {
  const sorted = [...log].sort((a, b) => a.date.localeCompare(b.date));
  const current = sorted[sorted.length - 1];
  const goalDate = getGoalDate();

  const today = new Date();
  const goal = new Date(goalDate);
  const weeksLeft = Math.max(0.1, (goal - today) / (1000 * 60 * 60 * 24 * 7));
  const kgToGo = GOAL_WEIGHT - current.weight;
  const paceNeeded = kgToGo / weeksLeft;

  let paceActual = null;
  if (sorted.length >= 2) {
    const first = sorted[0];
    const last = sorted[sorted.length - 1];
    const weeksElapsed = Math.max(0.1, (new Date(last.date) - new Date(first.date)) / (1000 * 60 * 60 * 24 * 7));
    paceActual = (last.weight - first.weight) / weeksElapsed;
  }

  document.getElementById("weight-stats").innerHTML = `
    <div class="stat"><span>${fmt(current.weight, 1)} kg</span><small>Poids actuel</small></div>
    <div class="stat"><span>${fmt(GOAL_WEIGHT, 1)} kg</span><small>Objectif</small></div>
    <div class="stat"><span>${kgToGo > 0 ? fmt(kgToGo, 1) : 0} kg</span><small>Restant</small></div>
    <div class="stat"><span>${fmt(weeksLeft, 1)}</span><small>Semaines restantes</small></div>
    <div class="stat"><span>${fmt(paceNeeded, 2)} kg/sem</span><small>Rythme nécessaire</small></div>
    <div class="stat"><span>${paceActual !== null ? fmt(paceActual, 2) + " kg/sem" : "—"}</span><small>Ton rythme actuel</small></div>
  `;

  const adviceEl = document.getElementById("weight-advice");
  if (paceNeeded > 0.35) {
    adviceEl.textContent = "⚠️ Le rythme nécessaire est élevé (>0.35kg/sem) : le risque est de prendre trop de gras. Augmente légèrement les portions (riz, avoine, huile d'olive) plutôt que d'ajouter du sucre.";
  } else if (paceActual !== null && paceActual < paceNeeded * 0.5 && kgToGo > 0) {
    adviceEl.textContent = "Ton rythme actuel est en dessous de l'objectif : ajoute une collation (ex: 40g de flocons d'avoine + whey) pour augmenter légèrement l'apport calorique.";
  } else if (paceActual !== null && paceActual > paceNeeded * 1.5) {
    adviceEl.textContent = "Tu prends du poids plus vite que nécessaire : une partie sera de la masse grasse. Tu peux réduire légèrement l'huile d'olive ou une collation.";
  } else {
    adviceEl.textContent = "Rythme cohérent avec l'objectif. Continue comme ça et pèse-toi 1 à 2 fois par semaine, toujours dans les mêmes conditions (à jeun, au réveil).";
  }

  renderWeightChart(sorted);
  renderWeightLogTable(sorted);
}

function renderWeightChart(sorted) {
  const svgContainer = document.getElementById("weight-chart");
  const width = svgContainer.clientWidth || 600;
  const height = 220;
  const padding = 30;

  if (sorted.length === 0) {
    svgContainer.innerHTML = "";
    return;
  }

  const weights = sorted.map((e) => e.weight).concat([START_WEIGHT, GOAL_WEIGHT]);
  const minW = Math.min(...weights) - 1;
  const maxW = Math.max(...weights) + 1;

  const dates = sorted.map((e) => new Date(e.date).getTime());
  const minD = Math.min(...dates);
  const maxD = Math.max(...dates, new Date(getGoalDate()).getTime());

  const xScale = (d) => padding + ((d - minD) / Math.max(1, maxD - minD)) * (width - 2 * padding);
  const yScale = (w) => height - padding - ((w - minW) / Math.max(1, maxW - minW)) * (height - 2 * padding);

  const points = sorted.map((e) => `${xScale(new Date(e.date).getTime())},${yScale(e.weight)}`).join(" ");

  const goalY = yScale(GOAL_WEIGHT);
  const startY = yScale(START_WEIGHT);

  svgContainer.innerHTML = `
    <svg viewBox="0 0 ${width} ${height}" width="100%" height="${height}">
      <line x1="${padding}" y1="${goalY}" x2="${width - padding}" y2="${goalY}" stroke="var(--accent)" stroke-dasharray="4 4" stroke-width="1.5" />
      <text x="${width - padding}" y="${goalY - 6}" text-anchor="end" class="chart-label">Objectif ${GOAL_WEIGHT}kg</text>
      <line x1="${padding}" y1="${startY}" x2="${width - padding}" y2="${startY}" stroke="var(--muted)" stroke-dasharray="2 4" stroke-width="1" />
      <polyline points="${points}" fill="none" stroke="var(--primary)" stroke-width="2.5" />
      ${sorted
        .map((e) => `<circle cx="${xScale(new Date(e.date).getTime())}" cy="${yScale(e.weight)}" r="4" fill="var(--primary)" />`)
        .join("")}
    </svg>
  `;
}

function renderWeightLogTable(sorted) {
  const tbody = document.querySelector("#weight-log-table tbody");
  tbody.innerHTML = [...sorted]
    .reverse()
    .map(
      (e) => `<tr><td>${new Date(e.date).toLocaleDateString("fr-FR")}</td><td>${fmt(e.weight, 1)} kg</td></tr>`
    )
    .join("");
}

// ===================================================================
// Liste de courses (le même plan répété sur 7 jours)
// ===================================================================
const DAYS_PER_WEEK = 7;

function renderShoppingList() {
  const totals = {};
  MEAL_PLAN.meals.forEach((meal) => {
    meal.items.forEach((item) => {
      totals[item.food] = (totals[item.food] || 0) + item.qty * DAYS_PER_WEEK;
    });
  });

  const list = document.getElementById("shopping-list");
  list.innerHTML = Object.entries(totals)
    .sort((a, b) => FOODS[b[0]].name.localeCompare(FOODS[a[0]].name))
    .map(([foodKey, qty]) => {
      const f = FOODS[foodKey];
      const bigUnit = f.unit === "ml" ? "L" : "kg";
      const display = qty >= 1000 ? `${fmt(qty / 1000, 2)} ${bigUnit}` : `${fmt(qty)} ${f.unit}`;
      return `<li><span>${f.name}</span><span class="qty">${display} / semaine</span></li>`;
    })
    .join("");
}

// ===================================================================
// Navigation entre onglets principaux
// ===================================================================
function initNav() {
  const navButtons = document.querySelectorAll(".nav-btn");
  const sections = document.querySelectorAll(".view");
  navButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      navButtons.forEach((b) => b.classList.remove("active"));
      sections.forEach((s) => s.classList.remove("active"));
      btn.classList.add("active");
      document.getElementById(btn.dataset.view).classList.add("active");
    });
  });
}

// ===================================================================
// Init
// ===================================================================
document.addEventListener("DOMContentLoaded", () => {
  initNav();
  renderMealPlan();
  initWeightTracker();
  renderShoppingList();
});
