// Widget "Prochain repas" — Prise de Masse
// À coller tel quel dans un nouveau script Scriptable (app gratuite, App Store).
// Fonctionne en widget écran d'accueil (small/medium) et écran verrouillé (accessoryRectangular/circular).
//
// Pour les pas, voir le script séparé scriptable/pas-widget.js.

const MEALS_URL = "https://lucmouton66.github.io/Diete-/meals.json";

function timeToMinutes(timeStr) {
  // "12h30" -> 750
  const [h, m] = timeStr.replace("h", ":").split(":").map(Number);
  return h * 60 + (m || 0);
}

async function getMeals() {
  try {
    const req = new Request(MEALS_URL);
    req.timeoutInterval = 8;
    const meals = await req.loadJSON();
    return meals;
  } catch (e) {
    return null;
  }
}

function pickNextMeal(meals) {
  const now = new Date();
  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  const sorted = [...meals].sort((a, b) => timeToMinutes(a.time) - timeToMinutes(b.time));

  for (const meal of sorted) {
    if (timeToMinutes(meal.time) > nowMinutes) {
      return { meal, isTomorrow: false };
    }
  }
  // Après le dernier repas de la journée -> premier repas de demain
  return { meal: sorted[0], isTomorrow: true };
}

function buildWidget(meals) {
  const widget = new ListWidget();
  widget.backgroundColor = new Color("#0f1115");

  if (!meals) {
    const errText = widget.addText("Impossible de charger le plan (vérifie la connexion).");
    errText.textColor = Color.white();
    errText.font = Font.systemFont(12);
    return widget;
  }

  const { meal, isTomorrow } = pickNextMeal(meals);
  const family = config.widgetFamily;

  if (family === "accessoryRectangular" || family === "accessoryCircular") {
    // Widget écran verrouillé — version condensée
    if (family === "accessoryCircular") {
      const stack = widget.addStack();
      stack.layoutVertically();
      const timeText = stack.addText(meal.time);
      timeText.font = Font.boldSystemFont(16);
      const kcalText = stack.addText(`${meal.kcal}kcal`);
      kcalText.font = Font.systemFont(10);
      return widget;
    }
    const title = widget.addText(isTomorrow ? "Demain" : "Prochain repas");
    title.font = Font.systemFont(11);
    title.textColor = Color.gray();
    widget.addSpacer(2);
    const nameLine = widget.addText(`${meal.name} · ${meal.time}`);
    nameLine.font = Font.boldSystemFont(14);
    return widget;
  }

  // Widget écran d'accueil (small / medium)
  const header = widget.addStack();
  header.layoutHorizontally();
  const title = header.addText(isTomorrow ? "🌅 Demain" : "🍽️ Prochain repas");
  title.font = Font.boldSystemFont(13);
  title.textColor = new Color("#2ec4b6");
  header.addSpacer();
  const kcalBadge = header.addText(`${meal.kcal} kcal`);
  kcalBadge.font = Font.systemFont(11);
  kcalBadge.textColor = Color.gray();

  widget.addSpacer(6);

  const nameText = widget.addText(`${meal.name}`);
  nameText.font = Font.boldSystemFont(17);
  nameText.textColor = Color.white();

  const timeText = widget.addText(meal.time);
  timeText.font = Font.systemFont(12);
  timeText.textColor = new Color("#ff6b35");

  widget.addSpacer(8);

  const maxItems = config.widgetFamily === "medium" ? 5 : 3;
  meal.items.slice(0, maxItems).forEach((item) => {
    const line = widget.addText(`• ${item.name} — ${item.qty}${item.unit}`);
    line.font = Font.systemFont(11);
    line.textColor = Color.lightGray();
  });

  widget.url = "https://lucmouton66.github.io/Diete-/";
  return widget;
}

const meals = await getMeals();
const widget = buildWidget(meals);

if (config.runsInWidget) {
  Script.setWidget(widget);
} else {
  // Aperçu quand on lance le script manuellement dans l'app
  await widget.presentMedium();
}
Script.complete();
