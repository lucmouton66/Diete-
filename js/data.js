// ===================================================================
// Base de données nutritionnelle (valeurs approximatives pour 100g/100ml)
// kcal, protéines (p), glucides (c), lipides (f) en grammes
// ===================================================================
const FOODS = {
  oats:        { name: "Flocons d'avoine",              unit: "g",  kcal: 375, p: 13,   c: 60,  f: 7 },
  milk:        { name: "Lait demi-écrémé",               unit: "ml", kcal: 47,  p: 3.3,  c: 4.8, f: 1.6 },
  eggs:        { name: "Œufs entiers",                   unit: "g",  kcal: 155, p: 13,   c: 1.1, f: 11 },
  banana:      { name: "Banane",                         unit: "g",  kcal: 89,  p: 1.1,  c: 23,  f: 0.3 },
  peanutbutter:{ name: "Beurre de cacahuète",             unit: "g",  kcal: 588, p: 25,   c: 20,  f: 50 },
  greekyogurt: { name: "Yaourt grec nature",              unit: "g",  kcal: 100, p: 9,    c: 4,   f: 5 },
  almonds:     { name: "Amandes",                        unit: "g",  kcal: 579, p: 21,   c: 22,  f: 50 },
  rice:        { name: "Riz basmati (cru)",               unit: "g",  kcal: 350, p: 7.5,  c: 77,  f: 0.9 },
  chicken:     { name: "Blanc de poulet (cuit)",          unit: "g",  kcal: 165, p: 31,   c: 0,   f: 3.6 },
  broccoli:    { name: "Brocolis",                        unit: "g",  kcal: 34,  p: 2.8,  c: 7,   f: 0.4 },
  oliveoil:    { name: "Huile d'olive",                   unit: "g",  kcal: 884, p: 0,    c: 0,   f: 100 },
  whey:        { name: "Whey protéine (poudre)",          unit: "g",  kcal: 380, p: 75,   c: 8,   f: 5 },
  apple:       { name: "Pomme",                           unit: "g",  kcal: 52,  p: 0.3,  c: 14,  f: 0.2 },
  sweetpotato: { name: "Patate douce (cuite)",            unit: "g",  kcal: 90,  p: 2,    c: 21,  f: 0.2 },
  cod:         { name: "Cabillaud (cuit)",                unit: "g",  kcal: 105, p: 23,   c: 0,   f: 1 },
  salmon:      { name: "Saumon (cuit)",                   unit: "g",  kcal: 208, p: 20,   c: 0,   f: 13 },
  redmeat:     { name: "Viande rouge maigre (cuite)",      unit: "g",  kcal: 190, p: 28,   c: 0,   f: 8 },
  skyr:        { name: "Skyr / fromage blanc 0%",         unit: "g",  kcal: 63,  p: 11,   c: 4,   f: 0.2 },
  honey:       { name: "Miel",                            unit: "g",  kcal: 304, p: 0.3,  c: 82,  f: 0 },
  veggies:     { name: "Légumes variés (courgette, poivron...)", unit: "g", kcal: 30, p: 1.5, c: 5, f: 0.3 },
};

// ===================================================================
// Plans de repas — quantités en grammes (ou ml)
// "training" = jour de muscu et/ou tennis (majorité des jours)
// "rest"     = jour de repos complet
// ===================================================================
const MEAL_PLANS = {
  training: {
    label: "Jour d'entraînement (muscu / tennis)",
    meals: [
      {
        name: "Petit-déjeuner",
        time: "7h00",
        items: [
          { food: "oats", qty: 100 },
          { food: "milk", qty: 330 },
          { food: "eggs", qty: 50 },
          { food: "banana", qty: 120 },
          { food: "peanutbutter", qty: 20 },
        ],
        note: "Cuire les flocons dans le lait, ajouter le beurre de cacahuète. 1 œuf brouillé ou à la poêle à côté.",
      },
      {
        name: "Collation matin",
        time: "10h00",
        items: [
          { food: "greekyogurt", qty: 130 },
          { food: "almonds", qty: 15 },
        ],
      },
      {
        name: "Déjeuner",
        time: "12h30",
        items: [
          { food: "rice", qty: 160 },
          { food: "chicken", qty: 90 },
          { food: "broccoli", qty: 150 },
          { food: "oliveoil", qty: 15 },
        ],
        note: "Riz pesé cru (≈ 370g cuit). Assaisonner librement (épices, citron, sel).",
      },
      {
        name: "Collation pré-entraînement",
        time: "16h00",
        items: [
          { food: "oats", qty: 30 },
          { food: "milk", qty: 250 },
          { food: "apple", qty: 200 },
        ],
        note: "À manger ~1h30 avant la séance pour l'énergie.",
      },
      {
        name: "Shaker post-entraînement",
        time: "18h30",
        items: [
          { food: "whey", qty: 25 },
          { food: "banana", qty: 160 },
          { food: "honey", qty: 15 },
        ],
        note: "À boire dans les 30-45 min après la séance (whey + eau, banane écrasée ou à côté).",
      },
      {
        name: "Dîner",
        time: "20h30",
        items: [
          { food: "sweetpotato", qty: 260 },
          { food: "cod", qty: 140 },
          { food: "veggies", qty: 200 },
          { food: "oliveoil", qty: 15 },
          { food: "honey", qty: 10 },
        ],
        note: "Remplacer le cabillaud par 100g de saumon 2x/semaine, ou 130g de viande rouge maigre 1x/semaine.",
      },
      {
        name: "Avant coucher",
        time: "22h00",
        items: [
          { food: "skyr", qty: 150 },
          { food: "honey", qty: 10 },
        ],
        note: "Protéine à digestion lente pour la nuit (récupération musculaire pendant le sommeil).",
      },
    ],
  },
  rest: {
    label: "Jour de repos complet",
    meals: [
      {
        name: "Petit-déjeuner",
        time: "8h00",
        items: [
          { food: "oats", qty: 100 },
          { food: "milk", qty: 300 },
          { food: "eggs", qty: 50 },
          { food: "banana", qty: 120 },
        ],
      },
      {
        name: "Collation matin",
        time: "10h30",
        items: [
          { food: "greekyogurt", qty: 130 },
          { food: "almonds", qty: 15 },
        ],
      },
      {
        name: "Déjeuner",
        time: "13h00",
        items: [
          { food: "rice", qty: 190 },
          { food: "chicken", qty: 100 },
          { food: "broccoli", qty: 150 },
          { food: "oliveoil", qty: 20 },
        ],
      },
      {
        name: "Collation après-midi",
        time: "16h30",
        items: [
          { food: "skyr", qty: 120 },
          { food: "apple", qty: 180 },
          { food: "almonds", qty: 10 },
          { food: "banana", qty: 150 },
        ],
      },
      {
        name: "Dîner",
        time: "20h00",
        items: [
          { food: "sweetpotato", qty: 260 },
          { food: "cod", qty: 150 },
          { food: "veggies", qty: 200 },
          { food: "oliveoil", qty: 10 },
        ],
      },
      {
        name: "Avant coucher",
        time: "22h00",
        items: [
          { food: "skyr", qty: 150 },
          { food: "honey", qty: 10 },
        ],
      },
    ],
  },
};

// Répartition par défaut de la semaine (5 muscu + tennis "à côté" ≈ 6 jours actifs)
const WEEK_DEFAULT = ["training", "training", "training", "training", "training", "training", "rest"];
