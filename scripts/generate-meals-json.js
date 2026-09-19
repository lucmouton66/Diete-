// Régénère meals.json à partir de js/data.js (à relancer si le plan change).
// Usage : node scripts/generate-meals-json.js
const fs = require("fs");
const path = require("path");

const dataPath = path.join(__dirname, "..", "js", "data.js");
const outPath = path.join(__dirname, "..", "meals.json");

const code = fs.readFileSync(dataPath, "utf8");
const { FOODS, MEAL_PLAN } = new Function(code + "; return {FOODS, MEAL_PLAN};")();

const meals = MEAL_PLAN.meals.map((meal) => {
  let kcal = 0;
  const items = meal.items.map((it) => {
    const f = FOODS[it.food];
    kcal += (f.kcal * it.qty) / 100;
    return { name: f.name, qty: it.qty, unit: f.unit };
  });
  return { name: meal.name, time: meal.time, kcal: Math.round(kcal), items };
});

fs.writeFileSync(outPath, JSON.stringify(meals, null, 2) + "\n");
console.log(`meals.json régénéré (${meals.length} repas).`);
