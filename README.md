# Prise de Masse — 75kg → 85kg

Application web simple (HTML/CSS/JS, aucune dépendance) pour suivre une diète de prise de masse propre, avec un plan alimentaire précis en grammes, un suivi de poids et une liste de courses générée automatiquement.

## Utiliser l'application

Aucune installation nécessaire : ouvre simplement `index.html` dans un navigateur, ou lance un petit serveur local :

```bash
python3 -m http.server 8080
# puis ouvre http://localhost:8080
```

Fonctionne aussi hébergée gratuitement (GitHub Pages, Netlify, Vercel...).

## Fonctionnalités

- **Plan alimentaire** : un seul menu, identique tous les jours (entraînement ou repos), 7 repas détaillés avec quantités exactes en grammes et calcul automatique des calories/macros par repas et pour la journée. Pensé pour un budget étudiant et peu de temps en cuisine (aliments simples, batch cooking, repas zéro cuisson).
- **Suivi de poids** : enregistrement des pesées (stocké dans le navigateur), calcul du rythme de prise de poids nécessaire pour atteindre 85kg à la date objectif, comparaison avec le rythme réel, graphique d'évolution, et conseils automatiques (trop vite = trop de gras, trop lent = augmenter les portions).
- **Liste de courses** : quantités hebdomadaires agrégées automatiquement (le plan × 7 jours).
- **Infos & conseils** : explication du raisonnement nutritionnel (calories, protéines, glucides, timing, whey, budget, ajustements).
- **Widget "prochain repas"** (iPhone) : script Scriptable optionnel qui affiche le prochain repas en widget écran d'accueil ou écran verrouillé — voir [Widget iPhone](#widget-iphone-prochain-repas).

## Repères nutritionnels du plan

Calculés pour un profil de 75kg, 1m81, 22 ans, ~17-18% de masse grasse, actif (muscu 5x/semaine + tennis) : métabolisme de base ~1740 kcal (moyenne Mifflin-St Jeor / Katch-McArdle), maintien ~2870 kcal/jour avec l'activité.

- **~3370 kcal/jour**, ~196g protéines, ~459g glucides, ~87g lipides (surplus de ~400-500 kcal), appliqué tous les jours de la semaine

Protéines volontairement gardées entre 150 et 200g/jour (~2-2.4g/kg) — suffisant pour la synthèse musculaire sans excès inutile. Les glucides sont volontairement élevés pour soutenir les séances et la récupération.

## Personnaliser le plan

Toutes les données (aliments et repas) sont centralisées dans `js/data.js` :
- `FOODS` : base de données nutritionnelle (kcal/protéines/glucides/lipides pour 100g de chaque aliment)
- `MEAL_PLAN` : composition des 7 repas de la journée (aliment + quantité en grammes)

Modifie simplement les quantités ou remplace un aliment par un autre déjà présent dans `FOODS` (ou ajoute-en un nouveau avec ses valeurs pour 100g) — tous les calculs (macros par repas, totaux journaliers, liste de courses) se recalculent automatiquement.

Si tu modifies `js/data.js`, régénère aussi `meals.json` (utilisé par le widget iPhone) :

```bash
node scripts/generate-meals-json.js
```

## Widget iPhone (prochain repas)

Pour afficher le prochain repas directement en widget (écran d'accueil ou écran verrouillé), sans ouvrir l'appli :

1. Installe l'app gratuite **Scriptable** (App Store)
2. Ouvre-la, appuie sur **+** pour créer un nouveau script
3. Colle le contenu de [`scriptable/diete-widget.js`](scriptable/diete-widget.js), renomme le script (ex: "Diète")
4. Sauvegarde (flèche retour en haut à gauche)
5. Ajoute le widget :
   - **Écran d'accueil** : appui long sur l'écran → **+** → cherche "Scriptable" → choisis la taille (small/medium) → une fois ajouté, appuie dessus → sélectionne le script "Diète"
   - **Écran verrouillé** : appui long sur l'écran verrouillé → **Personnaliser** → **Widgets** → cherche "Scriptable" → choisis-le → sélectionne le script "Diète"

Le widget va chercher `meals.json` sur GitHub Pages et affiche automatiquement le nom, l'heure et les aliments du prochain repas selon l'heure actuelle.

### Ajouter le nombre de pas (Garmin) au widget

Ni Apple Santé, ni l'app Forme, ni Garmin Connect ne proposent de widget "pas" pour l'écran verrouillé. Solution : un Raccourci (Shortcuts) qui écrit le nombre de pas dans un fichier que le widget Scriptable va lire.

1. Ouvre l'app **Raccourcis**, onglet **Raccourcis** → **+** pour en créer un nouveau
2. Ajoute une action : cherche **"pas"** dans la liste (catégorie Santé) → choisis l'action qui donne le nombre de pas, règle la période sur **"Aujourd'hui"**
3. Ajoute l'action **"Enregistrer le fichier"** :
   - Contenu = la variable renvoyée par l'action précédente (le nombre de pas)
   - Emplacement = **iCloud Drive → Scriptable** → nomme le fichier **`pas.txt`**
   - Active **"Écraser si un fichier existe"**
4. Renomme le raccourci **"MAJ Pas"** et sauvegarde

Pour que ça se mette à jour automatiquement, ajoute une automatisation :

5. Onglet **Automatisation** → **Créer une automatisation personnelle** → **Heure de la journée**
6. Choisis un horaire (ex: 12h00), répète tous les jours
7. Ajoute l'action **"Exécuter le raccourci"** → sélectionne **"MAJ Pas"**
8. Désactive **"Demander avant l'exécution"** pour que ça tourne sans confirmation
9. Répète l'opération pour créer 2-3 automatisations à d'autres horaires (ex: 9h, 16h, 21h) si tu veux un chiffre plus à jour dans la journée

Une fois `pas.txt` créé au moins une fois (lance "MAJ Pas" manuellement pour tester), le widget Scriptable affiche automatiquement "👟 X pas" à côté du prochain repas — pas besoin de republier le script.

## Structure du projet

```
index.html                    Structure de la page
css/style.css                 Style (thème sombre, mobile-friendly)
js/data.js                    Base d'aliments + plan de repas
js/app.js                     Logique : calculs macros, suivi de poids, liste de courses
meals.json                    Export du plan (utilisé par le widget iPhone)
scripts/generate-meals-json.js  Régénère meals.json à partir de js/data.js
scriptable/diete-widget.js     Script du widget "prochain repas" (app Scriptable)
```

## Avertissement

Ce plan est une base généraliste construite à partir de repères nutritionnels courants pour une prise de masse (~2-2.5g de protéines/kg, léger surplus calorique). Il ne remplace pas l'avis d'un professionnel de santé ou d'un nutritionniste, en particulier en cas de pathologie, d'allergie ou de besoins spécifiques.
