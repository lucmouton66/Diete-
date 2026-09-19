// Widget "Prochain repas" — Prise de Masse
// À coller tel quel dans un nouveau script Scriptable (app gratuite, App Store).
// Fonctionne en widget écran d'accueil (small/medium) et écran verrouillé (accessoryRectangular/circular).
// Affichage minimal : juste l'heure et ce qu'il y a à manger.
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
      return meal;
    }
  }
  // Après le dernier repas de la journée -> premier repas de demain
  return sorted[0];
}

function shortItemList(meal, maxItems) {
  return meal.items
    .slice(0, maxItems)
    .map((item) => `${item.name} ${item.display}`)
    .join(", ");
}

function buildWidget(weekData) {
  const widget = new ListWidget();
  widget.backgroundColor = new Color("#0f1115");

  if (!weekData) {
    const errText = widget.addText("Connexion impossible");
    errText.textColor = Color.white();
    errText.font = Font.systemFont(12);
    return widget;
  }

  const todayKey = String(new Date().getDay());
  const meals = weekData[todayKey];
  const meal = pickNextMeal(meals);
  const family = config.widgetFamily;

  if (family === "accessoryCircular") {
    const timeText = widget.addText(meal.time);
    timeText.font = Font.boldSystemFont(18);
    timeText.centerAlignText();
    return widget;
  }

  if (family === "accessoryRectangular") {
    const timeText = widget.addText(meal.time);
    timeText.font = Font.boldSystemFont(15);
    timeText.textColor = new Color("#ff6b35");
    widget.addSpacer(2);
    const itemsText = widget.addText(shortItemList(meal, 3));
    itemsText.font = Font.systemFont(11);
    itemsText.lineLimit = 2;
    return widget;
  }

  // Widget écran d'accueil (small / medium)
  const timeText = widget.addText(meal.time);
  timeText.font = Font.boldSystemFont(20);
  timeText.textColor = new Color("#ff6b35");

  widget.addSpacer(8);

  const maxItems = family === "medium" ? 6 : 4;
  meal.items.slice(0, maxItems).forEach((item) => {
    const line = widget.addText(`• ${item.name} — ${item.display}`);
    line.font = Font.systemFont(13);
    line.textColor = Color.white();
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
