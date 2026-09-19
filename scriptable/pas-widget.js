// Widget "Pas" — indépendant du widget Diète
// À coller dans un NOUVEAU script Scriptable, nommé "Pas".
// Lit le nombre de pas du jour depuis iCloud Drive/Scriptable/pas.txt,
// écrit par le Raccourci "MAJ Pas" (voir README.md du projet Diete-).

const STEPS_FILENAME = "pas.txt";
const STEP_GOAL = 10000;

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

function formatNumber(n) {
  return n.toLocaleString("fr-FR");
}

function buildWidget(steps) {
  const widget = new ListWidget();
  widget.backgroundColor = new Color("#0f1115");
  const family = config.widgetFamily;
  const pct = steps !== null ? Math.min(100, Math.round((steps / STEP_GOAL) * 100)) : null;

  if (family === "accessoryCircular") {
    const stack = widget.addStack();
    stack.layoutVertically();
    stack.centerAlignContent();
    const valText = stack.addText(pct !== null ? `${pct}%` : "—");
    valText.font = Font.boldSystemFont(16);
    valText.centerAlignText();
    const icon = stack.addText("👟");
    icon.font = Font.systemFont(11);
    icon.centerAlignText();
    return widget;
  }

  if (family === "accessoryRectangular") {
    const valText = widget.addText(steps !== null ? `${formatNumber(steps)} / ${formatNumber(STEP_GOAL)}` : "—");
    valText.font = Font.boldSystemFont(16);
    return widget;
  }

  // small / medium (écran d'accueil)
  const valText = widget.addText(steps !== null ? formatNumber(steps) : "—");
  valText.font = Font.boldSystemFont(30);
  valText.textColor = Color.white();

  const goalText = widget.addText(`/ ${formatNumber(STEP_GOAL)}`);
  goalText.font = Font.systemFont(13);
  goalText.textColor = Color.gray();

  if (pct !== null) {
    widget.addSpacer(8);
    const barBg = widget.addStack();
    barBg.backgroundColor = new Color("#22262f");
    barBg.cornerRadius = 4;
    barBg.size = new Size(0, 8);
    const barFillWrap = barBg.addStack();
    barFillWrap.layoutHorizontally();
    const fillWidth = 140 * (pct / 100);
    const barFill = barFillWrap.addStack();
    barFill.backgroundColor = new Color("#2ec4b6");
    barFill.cornerRadius = 4;
    barFill.size = new Size(fillWidth, 8);
    barFillWrap.addSpacer();
  }

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
