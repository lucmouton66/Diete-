// ===================================================================
// Base de données nutritionnelle (valeurs approximatives pour 100g/100ml)
// kcal, protéines (p), glucides (c), lipides (f) en grammes
// Aliments choisis pour être bon marché et rapides à préparer
// (courses hard-discount / marque distributeur, peu de cuisson)
// ===================================================================
const FOODS = {
  oats:        { name: "Flocons d'avoine",              unit: "g",  kcal: 375, p: 13,   c: 60,  f: 7 },
  milk:        { name: "Lait demi-écrémé",               unit: "ml", kcal: 47,  p: 3.3,  c: 4.8, f: 1.6 },
  eggs:        { name: "Œufs entiers",                   unit: "g",  kcal: 155, p: 13,   c: 1.1, f: 11 },
  banana:      { name: "Banane",                         unit: "g",  kcal: 89,  p: 1.1,  c: 23,  f: 0.3 },
  peanutbutter:{ name: "Beurre de cacahuète",             unit: "g",  kcal: 588, p: 25,   c: 20,  f: 50 },
  skyr:        { name: "Skyr / fromage blanc 0% (nature)", unit: "g", kcal: 63,  p: 11,   c: 4,   f: 0.2 },
  rice:        { name: "Riz (cru)",                       unit: "g",  kcal: 350, p: 7.5,  c: 77,  f: 0.9 },
  chicken:     { name: "Blanc/cuisse de poulet (cuit)",    unit: "g",  kcal: 165, p: 31,   c: 0,   f: 3.6 },
  veggies:     { name: "Légumes surgelés (mélange)",       unit: "g",  kcal: 32,  p: 2,    c: 5.5, f: 0.3 },
  oliveoil:    { name: "Huile (olive ou colza)",          unit: "g",  kcal: 884, p: 0,    c: 0,   f: 100 },
  whey:        { name: "Whey protéine (poudre)",          unit: "g",  kcal: 380, p: 75,   c: 8,   f: 5 },
  apple:       { name: "Pomme",                           unit: "g",  kcal: 52,  p: 0.3,  c: 14,  f: 0.2 },
  honey:       { name: "Miel ou confiture",               unit: "g",  kcal: 304, p: 0.3,  c: 82,  f: 0 },
  tuna:        { name: "Thon au naturel (boîte, égoutté)", unit: "g", kcal: 116, p: 26,   c: 0,   f: 1 },
  potato:      { name: "Pomme de terre (cuite)",           unit: "g", kcal: 87,  p: 2,    c: 20,  f: 0.1 },
};

// ===================================================================
// Plans de repas — quantités en grammes (ou ml)
// "training" = jour de muscu et/ou tennis (majorité des jours)
// "rest"     = jour de repos complet
//
// Pensé pour un budget étudiant et un minimum de temps en cuisine :
// - aliments simples, bon marché, faciles à trouver en promo/marque repère
// - cuisson en lot 1-2x/semaine (riz + poulet) pour n'avoir qu'à réchauffer
// - repas "zéro cuisson" (thon, skyr, whey, flocons) pour les jours pressés
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
          { food: "eggs", qty: 100 },
          { food: "banana", qty: 120 },
          { food: "peanutbutter", qty: 20 },
        ],
        note: "3-4 min : flocons + lait chaud au micro-ondes (2 min), 2 œufs à la poêle en même temps.",
      },
      {
        name: "Collation matin",
        time: "10h00",
        items: [
          { food: "skyr", qty: 150 },
          { food: "peanutbutter", qty: 15 },
        ],
        note: "Zéro cuisson, à emporter facilement (pot de skyr + cuillère de beurre de cacahuète).",
      },
      {
        name: "Déjeuner",
        time: "12h30",
        items: [
          { food: "rice", qty: 185 },
          { food: "chicken", qty: 80 },
          { food: "veggies", qty: 150 },
          { food: "oliveoil", qty: 15 },
        ],
        note: "Cuis le riz + le poulet en grande quantité 1-2x/semaine (dimanche + mercredi par ex.), garde au frigo en tupperware : ici juste 2 min de micro-ondes. Légumes surgelés directement à la poêle/micro-ondes, pas de découpe.",
      },
      {
        name: "Collation pré-entraînement",
        time: "16h00",
        items: [
          { food: "oats", qty: 30 },
          { food: "milk", qty: 250 },
          { food: "apple", qty: 200 },
        ],
        note: "Zéro cuisson : flocons + lait froid (pas besoin de chauffer) + une pomme.",
      },
      {
        name: "Shaker post-entraînement",
        time: "18h30",
        items: [
          { food: "whey", qty: 25 },
          { food: "banana", qty: 160 },
          { food: "honey", qty: 15 },
        ],
        note: "Zéro cuisson, 1 min chrono : whey + eau dans le shaker, banane à côté.",
      },
      {
        name: "Dîner",
        time: "20h30",
        items: [
          { food: "potato", qty: 280 },
          { food: "tuna", qty: 120 },
          { food: "veggies", qty: 200 },
          { food: "oliveoil", qty: 15 },
        ],
        note: "Version zéro cuisson : pommes de terre déjà cuites en lot (ou riz restant du déjeuner) + thon en boîte + légumes surgelés réchauffés. 2x/semaine, remplace le thon par un steak haché 5% (poêle, 5 min) ou un pavé de poisson surgelé (four, 15-20 min sans surveillance) pour varier.",
      },
      {
        name: "Avant coucher",
        time: "22h00",
        items: [
          { food: "skyr", qty: 150 },
          { food: "honey", qty: 10 },
        ],
        note: "Zéro cuisson. Protéine lente pour la nuit (récupération musculaire pendant le sommeil).",
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
          { food: "skyr", qty: 130 },
          { food: "peanutbutter", qty: 15 },
        ],
      },
      {
        name: "Déjeuner",
        time: "13h00",
        items: [
          { food: "rice", qty: 190 },
          { food: "chicken", qty: 100 },
          { food: "veggies", qty: 150 },
          { food: "oliveoil", qty: 20 },
        ],
        note: "Reste du riz/poulet cuit en lot — juste à réchauffer.",
      },
      {
        name: "Collation après-midi",
        time: "16h30",
        items: [
          { food: "skyr", qty: 120 },
          { food: "apple", qty: 180 },
          { food: "banana", qty: 150 },
        ],
      },
      {
        name: "Dîner",
        time: "20h00",
        items: [
          { food: "potato", qty: 230 },
          { food: "tuna", qty: 150 },
          { food: "veggies", qty: 200 },
          { food: "oliveoil", qty: 20 },
        ],
        note: "Zéro cuisson : pommes de terre déjà cuites + thon + légumes surgelés réchauffés.",
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
