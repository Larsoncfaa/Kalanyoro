# Documentation backend

## Présentation

Le backend est construit avec Django et Django REST Framework. Il sert de couche métier, d’API et de stockage des données pédagogiques.

## Applications principales

### core
L’application core contient toute la logique métier du système.

## Modèles principaux

### User
Représente un utilisateur du système. Deux rôles sont pris en charge :
- ADMIN
- TEACHER

### Student
Représente un apprenant du centre. Chaque étudiant possède un matricule généré automatiquement.

### Surah et Verse
Représentent les sourates et les versets du Coran. Ces modèles servent de base documentaire et de support à la progression.

### DarasaSession
Enregistre une séance pédagogique donnée par un enseignant à un élève. C’est le cœur de l’historique du système.

### StudentProgress
Stocke une vue synthétique de la progression actuelle d’un apprenant.

### CurriculumLevel, CurriculumModule, CurriculumCompetency, CurriculumLesson
Organisent le curriculum pédagogique par niveau, module, compétence et leçon.

### StudentEvaluation, StudentObservation, StudentLevelValidation
Permettent le suivi pédagogique et la validation de passage de niveau.

## Sérialisation

Les serializers définissent ce qui est exposé sur l’API et comment les données sont transformées.

### Rôles des serializers
- UserSerializer : gestion des comptes et mots de passe
- StudentSerializer : données élèves
- SurahSerializer / VerseSerializer : contenu coranique
- DarasaListSerializer / DarasaCreateSerializer : séances de darasa
- StudentProgressSerializer : progression
- Curriculum serializers : curriculum et compétences
- StudentLevelValidationSerializer : validation de niveau

## Vues et endpoints

Les vues Django REST Framework exposent les ressources via des ViewSets.

### Endpoints principaux
- /api/students/
- /api/surahs/
- /api/verses/
- /api/darasa/
- /api/progress/
- /api/curriculum-levels/
- /api/level-validations/

## Permissions

Le système s’appuie sur :
- authentication JWT,
- permissions IsAuthenticated,
- permission spécifique IsAdmin pour les actions sensibles.

## Bonnes pratiques de maintenance

- Toujours garder les modèles et les serializers cohérents.
- Ajouter des tests pour toute nouvelle logique métier.
- Utiliser les préfetch/select_related pour éviter les requêtes inutiles.
- Éviter les modifications brutales dans les modèles existants sans migration.
- Documenter toute nouvelle route API.
