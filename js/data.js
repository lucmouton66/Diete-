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
// Variantes du déjeuner et du dîner par groupe de jours
// A = lundi-mercredi, B = jeudi-vendredi, C = week-end
// Toutes visent les mêmes macros globales à chaque fois (~960 kcal
// au déjeuner, ~580 kcal au dîner) avec des aliments différents.
// ===================================================================
const LUNCH_VARIANTS = {
  A: {
    name: "Déjeuner",
    time: "12h30",
    items: [
      { food: "rice", qty: 185 },
      { food: "chicken", qty: 75 },
      { food: "courgette", qty: 100 },
      { food: "poivron", qty: 75 },
      { food: "oliveoil", qty: 10 },
    ],
    note: "Poulet pesé cru (~75g). Cuis le riz + le poulet en grande quantité 1-2x/semaine (dimanche + mercredi par ex.), garde au frigo en tupperware : ici juste 2 min de micro-ondes. Courgette et poivron coupés en dés, à la poêle 5-6 min avec le poulet.",
  },
  B: {
    name: "Déjeuner",
    time: "12h30",
    items: [
      { food: "pastacomplete", qty: 190 },
      { food: "groundbeef5", qty: 60 },
      { food: "courgette", qty: 100 },
      { food: "poivron", qty: 75 },
      { food: "oliveoil", qty: 8 },
    ],
    note: "Steak haché pesé cru (~60g). Pâtes complètes cuites 8-10 min, steak haché + courgette/poivron à la poêle 5 min pendant ce temps-là — le repas le plus rapide de la semaine.",
  },
  C: {
    name: "Déjeuner",
    time: "12h30",
    items: [
      { food: "rice", qty: 140 },
      { food: "lentils", qty: 160 },
      { food: "chicken", qty: 60 },
      { food: "courgette", qty: 100 },
      { food: "oliveoil", qty: 8 },
    ],
    note: "Poulet pesé cru (~60g). Version week-end, un peu plus longue à préparer (riz + lentilles + poulet) — profites-en quand t'as plus de temps devant toi.",
  },
};

const DINNER_VARIANTS = {
  A: {
    name: "Dîner",
    time: "20h30",
    items: [
      { food: "potato", qty: 280 },
      { food: "tuna", qty: 85 },
      { food: "veggies", qty: 200 },
      { food: "oliveoil", qty: 10 },
    ],
    note: "Version zéro cuisson : pommes de terre déjà cuites en lot (ou riz restant du déjeuner) + thon en boîte + légumes surgelés réchauffés.",
  },
  B: {
    name: "Dîner",
    time: "20h30",
    items: [
      { food: "rice", qty: 80 },
      { food: "tuna", qty: 80 },
      { food: "veggies", qty: 200 },
      { food: "oliveoil", qty: 10 },
    ],
    note: "Reste de riz du déjeuner + thon en boîte + légumes surgelés — 5 minutes chrono.",
  },
  C: {
    name: "Dîner",
    time: "20h30",
    items: [
      { food: "turkey", qty: 95 },
      { food: "potato", qty: 310 },
      { food: "courgette", qty: 200 },
      { food: "poivron", qty: 75 },
      { food: "oliveoil", qty: 8 },
    ],
    note: "Dinde pesée crue (~95g). Petit changement du week-end : escalope de dinde à la poêle 6-8 min avec la courgette/poivron.",
  },
};

function buildDay(group) {
  return {
    meals: [
      BREAKFAST,
      MORNING_SNACK,
      LUNCH_VARIANTS[group],
      PRE_WORKOUT_SNACK,
      POST_WORKOUT_SHAKE,
      DINNER_VARIANTS[group],
      BEFORE_BED,
    ],
  };
}

// Clé JS Date().getDay() : 0=dimanche, 1=lundi, ... 6=samedi
const DAY_PLANS = {
  1: buildDay("A"), // lundi
  2: buildDay("A"), // mardi
  3: buildDay("A"), // mercredi
  4: buildDay("B"), // jeudi
  5: buildDay("B"), // vendredi
  6: buildDay("C"), // samedi
  0: buildDay("C"), // dimanche
};

const WEEK_ORDER = [1, 2, 3, 4, 5, 6, 0]; // lundi -> dimanche, pour la liste de courses
const DAY_LABELS = {
  1: "Lundi", 2: "Mardi", 3: "Mercredi", 4: "Jeudi", 5: "Vendredi", 6: "Samedi", 0: "Dimanche",
};

function getTodayPlan() {
  return DAY_PLANS[new Date().getDay()];
}
