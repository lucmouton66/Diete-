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

- Jour d'entraînement (muscu/tennis) : ~3200 kcal, ~230g protéines, ~380g glucides, ~90g lipides
- Jour de repos : ~2600 kcal, ~200g protéines, ~290g glucides, ~77g lipides

Ces valeurs sont volontairement légèrement plus riches en glucides et calories les jours d'entraînement pour soutenir 5 séances de musculation + tennis par semaine, tout en limitant la prise de gras les jours peu actifs.

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
