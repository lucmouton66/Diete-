// Widget "Pas" — indépendant du widget Diète
// À coller dans un NOUVEAU script Scriptable, nommé "Pas".
// Lit le nombre de pas du jour depuis iCloud Drive/Scriptable/pas.txt,
// écrit par le Raccourci "MAJ Pas" (voir README.md du projet Diete-).

const STEPS_FILENAME = "pas.txt";

async function getSteps() {
  try {
    const fm = FileManager.iCloud();
    const path = fm.joinPath(fm.documentsDirectory(), STEPS_FILENAME);
    if (!fm.fileExists(path)) return null;
    if (!fm.isFileDownloaded(path)) {
      await fm.downloadFileFromiCloud(path);
    }
    const raw = fm.readString(path).trim();
    const steps = parseInt(raw.replace(/\s/g, ""), 10);
    return isNaN(steps) ? null : steps;
  } catch (e) {
    return null;
  }
}

function formatSteps(steps) {
  return steps.toLocaleString("fr-FR");
}

function buildWidget(steps) {
  const widget = new ListWidget();
  widget.backgroundColor = new Color("#0f1115");
  const family = config.widgetFamily;
  const value = steps !== null ? formatSteps(steps) : "—";

  if (family === "accessoryCircular") {
    const stack = widget.addStack();
    stack.layoutVertically();
    stack.centerAlignContent();
    const icon = stack.addText("👟");
    icon.font = Font.systemFont(14);
    icon.centerAlignText();
    const valText = stack.addText(steps !== null ? String(steps) : "—");
    valText.font = Font.boldSystemFont(13);
    valText.centerAlignText();
    return widget;
  }

  if (family === "accessoryRectangular") {
    const title = widget.addText("👟 Pas aujourd'hui");
    title.font = Font.systemFont(11);
    title.textColor = Color.gray();
    widget.addSpacer(2);
    const valText = widget.addText(value);
    valText.font = Font.boldSystemFont(18);
    return widget;
  }

  // small / medium (écran d'accueil)
  const title = widget.addText("👟 Pas aujourd'hui");
  title.font = Font.boldSystemFont(13);
  title.textColor = new Color("#2ec4b6");
  widget.addSpacer(8);
  const valText = widget.addText(value);
  valText.font = Font.boldSystemFont(30);
  valText.textColor = Color.white();
  return widget;
}

const steps = await getSteps();
const widget = buildWidget(steps);

if (config.runsInWidget) {
  Script.setWidget(widget);
} else {
  await widget.presentMedium();
}
Script.complete();
