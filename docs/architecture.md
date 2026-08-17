# Architecture du projet

## Vue générale

Le projet suit une architecture web full-stack composée de :
- un backend Django REST API,
- un frontend React TypeScript,
- une logique pédagogique centralisée dans les modèles et vues du backend.

## Couche backend

Le backend est organisé autour de l’application Django principale appelée core.

### Rôles des principaux fichiers
- [backend/settings.py](backend/settings.py) : configuration globale, applications installées, JWT, base de données et CORS.
- [backend/urls.py](backend/urls.py) : point d’entrée des routes globales.
- [core/models.py](core/models.py) : modèle de données principal.
- [core/serializers.py](core/serializers.py) : transformation des données entre Django et l’API.
- [core/views.py](core/views.py) : logique des endpoints REST.
- [core/urls.py](core/urls.py) : routes spécifiques de l’application core.

## Couche frontend

Le frontend est une application React Vite organisée par domaine.

### Structure principale
- [front/frontend/src/pages](front/frontend/src/pages) : pages de l’application
- [front/frontend/src/hooks](front/frontend/src/hooks) : logique d’accès aux API
- [front/frontend/src/api](front/frontend/src/api) : clients HTTP et appels API
- [front/frontend/src/layouts](front/frontend/src/layouts) : structure générale de navigation
- [front/frontend/src/theme](front/frontend/src/theme) : thème graphique et design system

## Flux de travail typique

1. L’utilisateur ouvre une page du frontend.
2. Le composant appelle un hook de la couche API.
3. Le hook fait une requête vers l’API Django.
4. Le backend traite la demande, contrôle les permissions et renvoie les données.
5. Le frontend affiche les informations et met à jour l’état local.

## Logique pédagogique

Le cœur pédagogique du système est structuré en niveaux, modules, compétences et leçons.

Le parcours est conçu pour :
- organiser les contenus par niveau,
- segmenter les apprentissages par modules,
- définir des micro-compétences,
- permettre l’évaluation et la validation de niveau.

## Sécurité

- L’authentification repose sur des tokens JWT.
- Les vues sensibles exigent l’authentification via DRF.
- Les opérations sensibles sont limitées à certains rôles, notamment les administrateurs.

## Extensibilité

Pour ajouter une fonctionnalité :
1. définir le modèle dans [core/models.py](core/models.py),
2. créer ou modifier le serializer dans [core/serializers.py](core/serializers.py),
3. exposer la logique dans [core/views.py](core/views.py),
4. ajouter la route dans [core/urls.py](core/urls.py),
5. créer la page ou le hook côté frontend.
