# Guide de maintenance

## Objectif

Ce guide permet à toute autre personne de continuer le projet sans perdre le fil de l’architecture ni des conventions déjà en place.

## Avant de modifier le projet

1. Comprendre la fonctionnalité à ajouter ou à corriger.
2. Vérifier si le changement touche au backend, au frontend ou aux deux.
3. Ajouter ou mettre à jour les tests si nécessaire.
4. Vérifier le build et les tests après modification.

## Workflow recommandé

### Backend
- Modifier le modèle si nécessaire.
- Mettre à jour le serializer.
- Adapter la vue ou la logique métier.
- Ajouter les tests associés.
- Exécuter les tests Django.

### Frontend
- Ajouter ou modifier les composants/pages.
- Réutiliser les hooks et l’API layer existants.
- Respecter le thème centralisé.
- Vérifier la responsive du changement.
- Exécuter les tests frontend et le build.

## Commandes de vérification

### Backend
```bash
python manage.py test
```

### Frontend
```bash
npm test
npm run build
```

## Conseils d’évolution

- Garder le code simple et lisible.
- Favoriser les composants réutilisables.
- Préférer les hooks et services dédiés plutôt que les logiques dispersées.
- Documenter chaque nouvelle feature importante.
- Conserver un état de navigation clair et une séparation claire entre logique métier et interface.

## Points à surveiller

- Les migrations Django si les modèles changent.
- Les dépendances Python et Node si l’environnement évolue.
- Les permissions d’accès et les rôles utilisateur.
- La cohérence des données entre le backend et le frontend.
