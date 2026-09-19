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

- **Plan alimentaire** : 2 types de jours (entraînement / repos), 6-7 repas détaillés avec quantités exactes en grammes et calcul automatique des calories/macros par repas et par jour.
- **Suivi de poids** : enregistrement des pesées (stocké dans le navigateur), calcul du rythme de prise de poids nécessaire pour atteindre 85kg à la date objectif, comparaison avec le rythme réel, graphique d'évolution, et conseils automatiques (trop vite = trop de gras, trop lent = augmenter les portions).
- **Liste de courses** : quantités hebdomadaires agrégées automatiquement à partir du plan (base : 6 jours d'entraînement + 1 jour de repos).
- **Infos & conseils** : explication du raisonnement nutritionnel (calories, protéines, glucides, timing, whey, ajustements).

## Repères nutritionnels du plan

Calculés pour un profil de 75kg, 1m81, 22 ans, ~17-18% de masse grasse, actif (muscu 5x/semaine + tennis) : métabolisme de base ~1740 kcal (moyenne Mifflin-St Jeor / Katch-McArdle), maintien ~2870 kcal/jour avec l'activité.

- Jour d'entraînement (muscu/tennis) : ~3290 kcal, ~186g protéines, ~446g glucides, ~88g lipides (surplus de ~400 kcal)
- Jour de repos : ~3000 kcal, ~172g protéines, ~413g glucides, ~77g lipides (proche du maintien)

Protéines volontairement gardées entre 150 et 200g/jour (~2-2.4g/kg) — suffisant pour la synthèse musculaire sans excès inutile. Les glucides sont volontairement élevés pour soutenir les séances et la récupération, avec un léger surplus calorique pour limiter la prise de gras.

## Personnaliser le plan

Toutes les données (aliments et repas) sont centralisées dans `js/data.js` :
- `FOODS` : base de données nutritionnelle (kcal/protéines/glucides/lipides pour 100g de chaque aliment)
- `MEAL_PLANS` : composition des repas par type de jour (aliment + quantité en grammes)

Modifie simplement les quantités ou remplace un aliment par un autre déjà présent dans `FOODS` (ou ajoute-en un nouveau avec ses valeurs pour 100g) — tous les calculs (macros par repas, totaux journaliers, liste de courses) se recalculent automatiquement.

## Structure du projet

```
index.html       Structure de la page
css/style.css    Style (thème sombre, mobile-friendly)
js/data.js       Base d'aliments + plans de repas
js/app.js        Logique : calculs macros, suivi de poids, liste de courses
```

## Avertissement

Ce plan est une base généraliste construite à partir de repères nutritionnels courants pour une prise de masse (~2-2.5g de protéines/kg, léger surplus calorique). Il ne remplace pas l'avis d'un professionnel de santé ou d'un nutritionniste, en particulier en cas de pathologie, d'allergie ou de besoins spécifiques.
