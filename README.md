# Kalanyoro LMS

Kalanyoro LMS est une application web de gestion pédagogique islamique conçue pour suivre les apprenants, les séances de darasa, la progression, le curriculum et la validation des niveaux.

## Vue d’ensemble

Ce projet combine :
- un backend Django REST API pour la logique métier et les données,
- un frontend React + TypeScript + Material UI pour l’interface utilisateur,
- un modèle pédagogique structuré autour de niveaux, modules, compétences, leçons, évaluations et validations.

## Objectif du produit

Le système vise à offrir une expérience opérationnelle pour :
- gérer les étudiants et les enseignants,
- enregistrer les séances de darasa,
- suivre la progression des apprenants,
- organiser un curriculum par niveaux,
- valider la montée de niveau selon des critères pédagogiques.

## Stack technique

### Backend
- Python
- Django
- Django REST Framework
- JWT (Simple JWT)
- PostgreSQL (configuration par défaut)

### Frontend
- React
- TypeScript
- Vite
- Material UI
- React Router
- TanStack Query
- Vitest + Testing Library

## Structure du repository

- [backend](backend) : configuration Django et routes API
- [core](core) : modèles, serializers, vues, permissions et logique métier
- [front/frontend](front/frontend) : application React
- [front/frontend/src/pages](front/frontend/src/pages) : pages principales de l’interface
- [front/frontend/src/hooks](front/frontend/src/hooks) : appels API et logique côté interface
- [front/frontend/src/theme](front/frontend/src/theme) : thème design système

## Architecture fonctionnelle

Le flux principal suit ce modèle :
1. Un enseignant ou administrateur se connecte.
2. L’interface charge les données via l’API.
3. Les actions de création, modification ou suivi sont envoyées au backend.
4. Les modèles métier mettent à jour la progression et le curriculum.

## Modèle de données principal

Le cœur du système repose sur les entités suivantes :
- User : administrateur ou enseignant
- Student : apprenant
- Surah / Verse : contenu coranique
- DarasaSession : séance pédagogique enregistrée
- StudentProgress : progression rapide de l’élève
- CurriculumLevel / CurriculumModule / CurriculumCompetency / CurriculumLesson : structure pédagogique
- StudentEvaluation / StudentObservation : suivi pédagogique
- StudentLevelValidation : validation de passage de niveau

## Responsive

Oui, l’interface a été pensée pour être responsive. Les écrans principaux utilisent des layouts flexibles et des breakpoints Material UI pour s’adapter aux mobiles, tablettes et ordinateurs. Les composants de navigation, formulaires, tableaux et pages de contenu ont été conçus pour se reflow correctement selon la taille d’écran.

## Démarrage rapide

### 1. Backend
```bash
cd c:/developpement/gestion_coran
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

### 2. Frontend
```bash
cd c:/developpement/gestion_coran/front/frontend
npm install
npm run dev
```

## Commandes utiles

### Backend
```bash
python manage.py test
python manage.py makemigrations
python manage.py migrate
```

### Frontend
```bash
npm run test
npm run build
npm run lint
```

## API principale

Les routes principales sont exposées sous le préfixe /api/.

Exemples :
- /api/login/
- /api/students/
- /api/darasa/
- /api/progress/
- /api/curriculum-levels/
- /api/level-validations/

## Points de maintenance recommandés

- Ajouter de nouveaux modèles dans [core/models.py](core/models.py)
- Exposer les changements dans [core/serializers.py](core/serializers.py) et [core/views.py](core/views.py)
- Ajouter les routes dans [core/urls.py](core/urls.py)
- Mettre à jour le frontend dans [front/frontend/src](front/frontend/src)
- Ajouter des tests pour toute nouvelle logique métier

## Références rapides

- Backend : [backend/settings.py](backend/settings.py)
- Routes API : [backend/urls.py](backend/urls.py)
- Modèles : [core/models.py](core/models.py)
- Vues API : [core/views.py](core/views.py)
- Frontend router : [front/frontend/src/routes/AppRouter.tsx](front/frontend/src/routes/AppRouter.tsx)
- Thème UI : [front/frontend/src/theme/theme.ts](front/frontend/src/theme/theme.ts)
