// ===================================================================
// Base de données nutritionnelle (valeurs approximatives pour 100g/100ml)
// kcal, protéines (p), glucides (c), lipides (f) en grammes
// Aliments choisis pour être bon marché et rapides à préparer
// (courses hard-discount / marque distributeur, peu de cuisson)
// ===================================================================
const FOODS = {
  oats:        { name: "Flocons d'avoine",              unit: "g",  kcal: 365, p: 13,   c: 57,  f: 6.8 },
  milk:        { name: "Lait demi-écrémé",               unit: "ml", kcal: 47,  p: 3.3,  c: 4.8, f: 1.6 },
  eggs:        { name: "Œufs entiers",                   unit: "g",  kcal: 155, p: 13,   c: 1.1, f: 11, pieceWeight: 50, pieceName: "œuf", pieceNamePlural: "œufs" },
  banana:      { name: "Banane",                         unit: "g",  kcal: 89,  p: 1.1,  c: 23,  f: 0.3, pieceWeight: 120, pieceName: "banane", pieceNamePlural: "bananes" },
  peanutbutter:{ name: "Beurre de cacahuète",             unit: "g",  kcal: 610, p: 28,   c: 13,  f: 48 },
  skyr:        { name: "Skyr nature",                    unit: "g",  kcal: 60,  p: 8.8,  c: 4.8, f: 0.3 },
  rice:        { name: "Riz (cru)",                       unit: "g",  kcal: 350, p: 7.0,  c: 77,  f: 1.1 },
  pastacomplete: { name: "Pâtes complètes (crues)",       unit: "g",  kcal: 337, p: 11,   c: 65,  f: 2.0 },
  lentils:     { name: "Lentilles corail (cuites)",       unit: "g",  kcal: 116, p: 9,    c: 20,  f: 0.4 },
  chicken:     { name: "Filet de poulet (cru)",           unit: "g",  kcal: 113, p: 23,   c: 0,   f: 2.3 },
  groundbeef5: { name: "Steak haché 5% (cru)",            unit: "g",  kcal: 121, p: 19,   c: 0,   f: 5.0 },
  turkey:      { name: "Escalope de dinde (crue)",        unit: "g",  kcal: 100, p: 24,   c: 0,   f: 0.3 },
  tuna:        { name: "Thon au naturel (boîte, égoutté)", unit: "g", kcal: 116, p: 26,   c: 0,   f: 1 },
  potato:      { name: "Pomme de terre (cuite)",           unit: "g", kcal: 87,  p: 2,    c: 20,  f: 0.1 },
  veggies:     { name: "Légumes surgelés (mélange)",       unit: "g",  kcal: 32,  p: 2,    c: 5.5, f: 0.3 },
  courgette:   { name: "Courgette",                       unit: "g",  kcal: 17,  p: 1.2,  c: 3.1, f: 0.3, pieceWeight: 200, pieceName: "courgette", pieceNamePlural: "courgettes" },
  poivron:     { name: "Poivron",                         unit: "g",  kcal: 31,  p: 1,    c: 6,   f: 0.3, pieceWeight: 150, pieceName: "poivron", pieceNamePlural: "poivrons" },
  oliveoil:    { name: "Huile (olive ou colza)",          unit: "g",  kcal: 884, p: 0,    c: 0,   f: 100 },
  whey:        { name: "Whey Isolate Decathlon (poudre)", unit: "g",  kcal: 379, p: 81,   c: 11,  f: 1 },
  apple:       { name: "Pomme",                           unit: "g",  kcal: 52,  p: 0.3,  c: 14,  f: 0.2, pieceWeight: 180, pieceName: "pomme", pieceNamePlural: "pommes" },
  honey:       { name: "Confiture extra framboise",       unit: "g",  kcal: 243, p: 0.6,  c: 58,  f: 0.3 },
};

// ===================================================================
// Repas fixes — identiques tous les jours (petit-déj, collations,
// shaker, avant coucher). Seuls le déjeuner et le dîner varient
// selon le groupe de jours (voir LUNCH_VARIANTS / DINNER_VARIANTS
// plus bas) pour casser la routine sans changer les macros globales.
// ===================================================================
const BREAKFAST = {
  name: "Petit-déjeuner",
  time: "7h00",
  items: [
    { food: "oats", qty: 110 },
    { food: "milk", qty: 300 },
    { food: "eggs", qty: 75 },
    { food: "banana", qty: 100 },
    { food: "peanutbutter", qty: 15 },
  ],
  note: "3-4 min : flocons + lait chaud au micro-ondes (2 min), 1½ œuf à la poêle en même temps.",
};

const MORNING_SNACK = {
  name: "Collation matin",
  time: "10h00",
  items: [
    { food: "skyr", qty: 150 },
    { food: "peanutbutter", qty: 10 },
  ],
  note: "Zéro cuisson, à emporter facilement (pot de skyr + cuillère de beurre de cacahuète).",
};

const PRE_WORKOUT_SNACK = {
  name: "Collation pré-entraînement",
  time: "16h00",
  items: [
    { food: "oats", qty: 40 },
    { food: "milk", qty: 200 },
    { food: "apple", qty: 150 },
  ],
  note: "Zéro cuisson : flocons + lait froid (pas besoin de chauffer) + une pomme.",
};

const POST_WORKOUT_SHAKE = {
  name: "Shaker post-entraînement",
  time: "18h30",
  items: [
    { food: "whey", qty: 20 },
    { food: "banana", qty: 130 },
    { food: "honey", qty: 10 },
  ],
  note: "Zéro cuisson, 1 min chrono : whey + eau dans le shaker, banane à côté. Les jours sans entraînement, prends-le simplement en collation à la même heure.",
};

const BEFORE_BED = {
  name: "Avant coucher",
  time: "22h00",
  items: [
    { food: "skyr", qty: 150 },
    { food: "honey", qty: 10 },
  ],
  note: "Zéro cuisson. Protéine lente pour la nuit (récupération musculaire pendant le sommeil).",
};

// ===================================================================
// Recettes du soir — une recette par jour, cuisinée UNE SEULE FOIS
// (le soir) et mangée en 2 fois : petite portion au dîner du soir,
// grande portion au déjeuner du lendemain midi (les restes).
// Ça permet de ne cuisiner qu'une fois par jour pour 2 repas.
// ===================================================================
const RECIPES = {
  R1: {
    label: "Riz + poulet + courgette + poivron",
    dinner: [
      { food: "rice", qty: 125 },
      { food: "chicken", qty: 50 },
      { food: "courgette", qty: 70 },
      { food: "poivron", qty: 50 },
      { food: "oliveoil", qty: 7 },
    ],
    lunch: [
      { food: "rice", qty: 185 },
      { food: "chicken", qty: 75 },
      { food: "courgette", qty: 100 },
      { food: "poivron", qty: 75 },
      { food: "oliveoil", qty: 10 },
    ],
    note: "Poulet pesé cru. Cuis tout en une fois le soir : garde la plus grosse part au frigo en tupperware pour le lendemain midi.",
  },
  R2: {
    label: "Pâtes complètes + steak haché + courgette + poivron",
    dinner: [
      { food: "pastacomplete", qty: 135 },
      { food: "groundbeef5", qty: 45 },
      { food: "courgette", qty: 70 },
      { food: "poivron", qty: 50 },
      { food: "oliveoil", qty: 6 },
    ],
    lunch: [
      { food: "pastacomplete", qty: 190 },
      { food: "groundbeef5", qty: 60 },
      { food: "courgette", qty: 100 },
      { food: "poivron", qty: 75 },
      { food: "oliveoil", qty: 8 },
    ],
    note: "Steak haché pesé cru. Le repas le plus rapide à cuisiner — pâtes + steak + légumes à la poêle en 10 min, garde la grosse portion pour le lendemain midi.",
  },
  R3: {
    label: "Pomme de terre + thon + légumes",
    dinner: [
      { food: "potato", qty: 280 },
      { food: "tuna", qty: 85 },
      { food: "veggies", qty: 200 },
      { food: "oliveoil", qty: 10 },
    ],
    lunch: [
      { food: "potato", qty: 550 },
      { food: "tuna", qty: 85 },
      { food: "veggies", qty: 280 },
      { food: "oliveoil", qty: 22 },
    ],
    note: "Cuis les pommes de terre en une fois (grande quantité), garde au frigo. Thon en boîte ajouté à chaque repas (n'ouvre pas la boîte du lendemain avant).",
  },
  R4: {
    label: "Riz + thon + légumes",
    dinner: [
      { food: "rice", qty: 80 },
      { food: "tuna", qty: 80 },
      { food: "veggies", qty: 200 },
      { food: "oliveoil", qty: 10 },
    ],
    lunch: [
      { food: "rice", qty: 170 },
      { food: "tuna", qty: 90 },
      { food: "veggies", qty: 280 },
      { food: "oliveoil", qty: 14 },
    ],
    note: "Cuis tout le riz du jour en une fois le soir, garde la grosse part pour le lendemain midi — 5 min chrono à chaque fois.",
  },
  R5: {
    label: "Riz + lentilles + poulet + courgette",
    dinner: [
      { food: "rice", qty: 90 },
      { food: "lentils", qty: 100 },
      { food: "chicken", qty: 40 },
      { food: "courgette", qty: 70 },
      { food: "oliveoil", qty: 6 },
    ],
    lunch: [
      { food: "rice", qty: 140 },
      { food: "lentils", qty: 160 },
      { food: "chicken", qty: 60 },
      { food: "courgette", qty: 100 },
      { food: "oliveoil", qty: 8 },
    ],
    note: "Poulet pesé cru. Un peu plus long à préparer (riz + lentilles + poulet) — cuisine tout d'un coup le soir, ça vaut le coup pour 2 repas.",
  },
  R6: {
    label: "Dinde + pomme de terre + courgette + poivron",
    dinner: [
      { food: "turkey", qty: 95 },
      { food: "potato", qty: 310 },
      { food: "courgette", qty: 200 },
      { food: "poivron", qty: 75 },
      { food: "oliveoil", qty: 8 },
    ],
    lunch: [
      { food: "turkey", qty: 110 },
      { food: "potato", qty: 600 },
      { food: "courgette", qty: 280 },
      { food: "poivron", qty: 120 },
      { food: "oliveoil", qty: 14 },
    ],
    note: "Dinde pesée crue. Escalope de dinde à la poêle avec la courgette/poivron, pommes de terre cuites en grande quantité à côté.",
  },
  R7: {
    label: "Pâtes complètes + thon + légumes",
    dinner: [
      { food: "pastacomplete", qty: 110 },
      { food: "tuna", qty: 60 },
      { food: "veggies", qty: 200 },
      { food: "oliveoil", qty: 8 },
    ],
    lunch: [
      { food: "pastacomplete", qty: 180 },
      { food: "tuna", qty: 90 },
      { food: "veggies", qty: 280 },
      { food: "oliveoil", qty: 15 },
    ],
    note: "Cuis toutes les pâtes du jour en une fois le soir, garde la grosse part pour le lendemain midi.",
  },
};

// Quelle recette est cuisinée le soir de chaque jour (clé JS Date().getDay())
const RECIPE_BY_WEEKDAY = {
  1: "R1", // lundi
  2: "R2", // mardi
  3: "R3", // mercredi
  4: "R4", // jeudi
  5: "R5", // vendredi
  6: "R6", // samedi
  0: "R7", // dimanche
};

function buildDay(dayNum) {
  const todayRecipe = RECIPES[RECIPE_BY_WEEKDAY[dayNum]];
  const prevRecipe = RECIPES[RECIPE_BY_WEEKDAY[(dayNum + 6) % 7]]; // recette cuisinée la veille au soir

  const lunch = {
    name: "Déjeuner",
    time: "12h30",
    items: prevRecipe.lunch,
    note: `Restes d'hier soir (${prevRecipe.label}) — juste à réchauffer, rien à cuisiner. ${prevRecipe.note}`,
  };
  const dinner = {
    name: "Dîner",
    time: "20h30",
    items: todayRecipe.dinner,
    note: `${todayRecipe.label}. ${todayRecipe.note}`,
  };

  return {
    meals: [BREAKFAST, MORNING_SNACK, lunch, PRE_WORKOUT_SNACK, POST_WORKOUT_SHAKE, dinner, BEFORE_BED],
  };
}

// Clé JS Date().getDay() : 0=dimanche, 1=lundi, ... 6=samedi
const DAY_PLANS = {
  1: buildDay(1), // lundi
  2: buildDay(2), // mardi
  3: buildDay(3), // mercredi
  4: buildDay(4), // jeudi
  5: buildDay(5), // vendredi
  6: buildDay(6), // samedi
  0: buildDay(0), // dimanche
};

const WEEK_ORDER = [1, 2, 3, 4, 5, 6, 0]; // lundi -> dimanche, pour la liste de courses
const DAY_LABELS = {
  1: "Lundi", 2: "Mardi", 3: "Mercredi", 4: "Jeudi", 5: "Vendredi", 6: "Samedi", 0: "Dimanche",
};

function getTodayPlan() {
  return DAY_PLANS[new Date().getDay()];
}
