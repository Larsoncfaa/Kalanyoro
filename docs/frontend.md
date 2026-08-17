# Documentation frontend

## Présentation

Le frontend est une application React TypeScript utilisant Vite et Material UI. Il offre une interface moderne pour la gestion des apprenants, des séances, du curriculum et des validations.

## Structure du frontend

### Pages principales
- Login : écran de connexion
- Dashboard : tableau de bord de synthèse
- Students : gestion des étudiants
- Teachers : gestion des enseignants
- Darasa : gestion des séances de cours
- Progress : suivi de progression
- Curriculum : présentation du parcours pédagogique
- LevelValidation : validation des niveaux
- Reports : rapports et synthèses
- Profile : profil utilisateur
- Settings : préférences de l’application

### Dossiers clés
- [front/frontend/src/api](front/frontend/src/api) : appel HTTP et clients API
- [front/frontend/src/hooks](front/frontend/src/hooks) : logique réutilisable et données
- [front/frontend/src/routes](front/frontend/src/routes) : configuration du routage
- [front/frontend/src/layouts](front/frontend/src/layouts) : structure générale de l’interface
- [front/frontend/src/theme](front/frontend/src/theme) : thème visuel centralisé

## Composants et style

Le design repose sur :
- Material UI pour les composants,
- un thème centralisé dans [front/frontend/src/theme/theme.ts](front/frontend/src/theme/theme.ts),
- des layouts responsives via Box et breakpoints.

## Responsive

L’interface est responsive grâce à :
- des layouts flexibles avec Box,
- des breakpoints adaptés selon la largeur d’écran,
- des composants qui s’adaptent en colonne ou en ligne selon la taille de l’écran.

## Routage

Le routage est défini dans [front/frontend/src/routes/AppRouter.tsx](front/frontend/src/routes/AppRouter.tsx).

Les routes sont protégées par un mécanisme de garde d’accès qui redirige vers la page de connexion si l’utilisateur n’est pas authentifié.

## Intéractions avec l’API

Le frontend utilise des hooks spécifiques pour isoler la logique réseau. Cela rend l’architecture plus propre et plus facile à maintenir.

## Bonnes pratiques

- Centraliser les appels API dans les modules de [front/frontend/src/api](front/frontend/src/api)
- Réutiliser les hooks pour l’accès aux données
- Éviter les logiques métier directement dans les composants
- Ajouter des tests pour les pages importantes
- Conserver le thème et les styles dans le dossier theme
