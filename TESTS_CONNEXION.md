# 🧪 TESTS DE CONNEXION BACKEND/FRONTEND

## Exécution Rapide des Tests

### 1. **Test Backend - Vérifier les Endpoints**

```bash
# Aller dans le répertoire backend
cd c:\developpement\gestion_coran

# Vérifier la configuration Django
python manage.py check

# Exécuter les migrations
python manage.py migrate

# Lancer le serveur
python manage.py runserver
```

### 2. **Test Frontend - Vérifier TypeScript et Build**

```bash
# Aller dans le répertoire frontend
cd c:\developpement\gestion_coran\front\frontend

# Installer les dépendances
npm install

# Vérifier les erreurs TypeScript
npm run type-check

# Construire l'application
npm run build

# Lancer en développement
npm run dev
```

---

## Tests d'API Manuels (cURL)

### **Test 1: Authentification**

```bash
# Login
curl -X POST http://127.0.0.1:8000/api/token/ \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'

# Réponse attendue:
# {
#   "access": "eyJ...",
#   "refresh": "eyJ...",
#   "user": {
#     "id": 1,
#     "username": "admin",
#     "role": "ADMIN",
#     ...
#   }
# }
```

### **Test 2: Récupérer les Étudiants**

```bash
# Remplacer YOUR_TOKEN par le token reçu ci-dessus
curl -X GET http://127.0.0.1:8000/api/students/ \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json"

# Réponse attendue: Liste paginée d'étudiants
```

### **Test 3: Créer un Étudiant**

```bash
curl -X POST http://127.0.0.1:8000/api/students/ \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "full_name": "Ahmed Ali",
    "phone": "212612345678",
    "address": "Casablanca",
    "birth_date": "2010-01-15"
  }'
```

### **Test 4: Créer une Séance Darasa**

```bash
curl -X POST http://127.0.0.1:8000/api/darasa/ \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "student": 1,
    "session_type": "QURAN",
    "lesson": 1,
    "surah": 1,
    "verse_start": 1,
    "verse_end": 7,
    "date": "2026-08-17",
    "start_time": "10:00:00",
    "end_time": "11:00:00",
    "notes": "Bonne séance"
  }'
```

### **Test 5: Vérifier la Progression**

```bash
curl -X GET http://127.0.0.1:8000/api/progress/ \
  -H "Authorization: Bearer YOUR_TOKEN"

# Doit montrer que total_sessions a augmenté
# et que current_surah a été mis à jour
```

---

## Tests Python (Django)

### **Test 6: Permissions - Teacher**

```python
# Dans manage.py shell
python manage.py shell

# Importer les modèles
from core.models import User, DarasaSession, StudentProgress, Student
from django.test import TestCase
from rest_framework.test import APIClient

# Créer un teacher
teacher = User.objects.create_user(
    username='teacher1',
    password='test123',
    role='TEACHER'
)

# Créer un étudiant
student = Student.objects.create(
    full_name='Ahmed',
    phone='212612345678'
)

# Créer une séance avec le teacher
darasa = DarasaSession.objects.create(
    teacher=teacher,
    student=student,
    session_type='QURAN',
    lesson_id=1,
    surah_id=1,
    verse_start=1,
    verse_end=7,
    date='2026-08-17',
    start_time='10:00:00'
)

# Vérifier que StudentProgress a été créé/mis à jour
progress = StudentProgress.objects.get(student=student)
print(f"Total sessions: {progress.total_sessions}")  # Doit être 1
print(f"Current surah: {progress.current_surah}")    # Doit être 1
```

### **Test 7: Permissions - Cannot Modify Other's Darasa**

```python
# Créer un deuxième teacher
teacher2 = User.objects.create_user(
    username='teacher2',
    password='test123',
    role='TEACHER'
)

# Teacher2 essaie de modifier la séance de Teacher1
# Doit lever PermissionDenied

try:
    # Simuler l'update en tant que teacher2
    darasa.teacher = teacher2
    darasa.save()
    print("ERROR: Teacher2 ne devrait pas pouvoir modifier!")
except Exception as e:
    print(f"CORRECT: {e}")
```

---

## Tests Cypress (Frontend)

### **Test 8: Flux Complet de Login**

```javascript
// cypress/e2e/login.cy.ts

describe('Login Flow', () => {
  it('should login and redirect to dashboard', () => {
    cy.visit('http://localhost:5173/login');
    
    cy.get('[data-testid="username"]').type('admin');
    cy.get('[data-testid="password"]').type('admin123');
    cy.get('[data-testid="submit"]').click();
    
    // Doit rediriger vers /dashboard
    cy.url().should('include', '/dashboard');
    
    // Doit afficher le nom d'utilisateur
    cy.get('[data-testid="user-name"]').should('contain', 'Admin');
  });
});
```

### **Test 9: Flux Complet - Créer un Étudiant**

```javascript
describe('Student Management', () => {
  beforeEach(() => {
    // Login d'abord
    cy.login('admin', 'admin123');
    cy.visit('http://localhost:5173/students');
  });

  it('should create a new student', () => {
    cy.get('[data-testid="add-student"]').click();
    
    cy.get('[data-testid="full_name"]').type('Ahmed Ali');
    cy.get('[data-testid="phone"]').type('212612345678');
    cy.get('[data-testid="address"]').type('Casablanca');
    cy.get('[data-testid="birth_date"]').type('2010-01-15');
    
    cy.get('[data-testid="submit"]').click();
    
    // Vérifier que le student a été créé
    cy.get('[data-testid="students-table"]')
      .should('contain', 'Ahmed Ali');
  });
});
```

---

## Tests avec Postman

### **Collection Postman à Importer**

Créer un fichier `postman_collection.json`:

```json
{
  "info": {
    "name": "Gestion Coran API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Authentication",
      "item": [
        {
          "name": "Login",
          "request": {
            "method": "POST",
            "url": {
              "raw": "{{base_url}}/api/token/",
              "host": ["{{base_url}}"],
              "path": ["api", "token"]
            },
            "body": {
              "mode": "raw",
              "raw": "{\"username\":\"admin\",\"password\":\"admin123\"}"
            }
          }
        }
      ]
    },
    {
      "name": "Students",
      "item": [
        {
          "name": "List Students",
          "request": {
            "method": "GET",
            "url": {
              "raw": "{{base_url}}/api/students/",
              "host": ["{{base_url}}"],
              "path": ["api", "students"]
            },
            "header": {
              "Authorization": "Bearer {{access_token}}"
            }
          }
        }
      ]
    }
  ],
  "variable": [
    {
      "key": "base_url",
      "value": "http://127.0.0.1:8000"
    },
    {
      "key": "access_token",
      "value": ""
    }
  ]
}
```

---

## Checklist de Vérification

### **Backend ✅**

- [ ] `python manage.py check` ✓
- [ ] `python manage.py migrate` ✓
- [ ] Serveur démarre: `python manage.py runserver` ✓
- [ ] `GET /api/token/` retourne les tokens ✓
- [ ] `GET /api/students/` retourne la liste ✓
- [ ] `POST /api/students/` crée un étudiant ✓
- [ ] `POST /api/darasa/` crée une séance ✓
- [ ] `GET /api/progress/` montre la progression ✓
- [ ] Permissions: Teacher ne peut modifier que ses séances ✓
- [ ] Permissions: Admin peut modifier toute séance ✓

### **Frontend ✅**

- [ ] `npm install` ✓
- [ ] `npm run type-check` ✓
- [ ] `npm run build` ✓
- [ ] `npm run dev` ✓
- [ ] Login page charge ✓
- [ ] Login avec admin marche ✓
- [ ] Dashboard affiche les stats ✓
- [ ] Créer un étudiant fonctionne ✓
- [ ] Lister les étudiants fonctionne ✓
- [ ] Créer une séance Darasa fonctionne ✓

### **Integration ✅**

- [ ] Login → Dashboard → Students ✓
- [ ] Créer Student → Vérifier dans la liste ✓
- [ ] Créer Darasa → Vérifier StudentProgress ✓
- [ ] Teacher ne peut pas modifier autres séances ✓
- [ ] Admin peut tout modifier ✓
- [ ] Logout → Login à nouveau ✓

---

## Commandes Utiles

### **Django**
```bash
# Créer un superuser
python manage.py createsuperuser

# Accéder à la base de données
python manage.py dbshell

# Générer les migrations
python manage.py makemigrations

# Appliquer les migrations
python manage.py migrate

# Lancer les tests
python manage.py test

# Vérifier la configuration
python manage.py check

# Afficher les routes
python manage.py show_urls
```

### **React**
```bash
# Installer les dépendances
npm install

# Vérifier TypeScript
npm run type-check

# Lancer en développement
npm run dev

# Construire pour la production
npm run build

# Lancer les tests
npm run test

# Lancer les tests avec couverture
npm run test:coverage
```

---

## Dépannage Courant

### **Erreur 404 sur `/api/students/`**
```
Vérifier:
1. Le serveur Django démarre ✓
2. L'URL est correcte (pas de typo) ✓
3. L'authentification est active ✓
4. Utiliser le bon token JWT ✓
```

### **Erreur 403 Forbidden**
```
Vérifier:
1. L'utilisateur a le bon rôle ✓
2. L'utilisateur n'est pas bloqué ✓
3. Les permissions sont correctes ✓
4. Le token n'est pas expiré ✓
```

### **Erreur CORS**
```
Vérifier:
1. CORS_ALLOW_ALL_ORIGINS = True en DEV ✓
2. L'origine du frontend est dans ALLOWED_HOSTS ✓
3. Le backend utilise corsheaders middleware ✓
```

### **Token Expiré**
```
Frontend doit:
1. Détecte erreur 401 ✓
2. Utilise le refresh token ✓
3. Récupère un nouveau access token ✓
4. Réessaye l'appel original ✓
```

---

## Résultats Attendus

✅ Tous les tests doivent passer  
✅ Aucune erreur TypeScript  
✅ Aucune erreur 404 ou 403  
✅ StudentProgress se met à jour automatiquement  
✅ Permissions fonctionnent correctement  
✅ Login/Logout fonctionne  

**Si tous ces tests passent:** ✅ Le système est correctement connecté!
