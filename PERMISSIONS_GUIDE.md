# =========================================================
# PERMISSIONS PAR ENDPOINT - Kalanyoro LMS
# =========================================================

Synchronisation Frontend-Backend des permissions d'accès

## 🔒 AUTHENTICATION

| Endpoint | Méthode | Permission | Note |
|----------|---------|-----------|------|
| `/api/token/` | POST | ❌ Aucune | Rate limited: 5/heure |
| `/api/token/refresh/` | POST | ❌ Aucune | Pas de rate limit |

---

## 👥 UTILISATEURS (Users)

| Endpoint | Méthode | Permission | Notes |
|----------|---------|-----------|-------|
| `/api/users/` | GET | ✅ IsAdminUser | Lister tous les users |
| `/api/users/` | POST | ✅ IsAdminUser | Créer un nouvel user |
| `/api/users/{id}/` | GET | ✅ IsAuthenticated | Voir détails |
| `/api/users/{id}/` | PATCH | ✅ IsAdminUser | Modifier (admins only) |
| `/api/users/{id}/` | DELETE | ✅ IsAdminUser | Supprimer (admins only) |

---

## 👨‍🎓 ÉTUDIANTS (Students)

| Endpoint | Méthode | Permission | Notes |
|----------|---------|-----------|-------|
| `/api/students/` | GET | ✅ IsAuthenticated | Lister tous |
| `/api/students/` | POST | ✅ IsAuthenticated | Créer étudiant |
| `/api/students/{id}/` | GET | ✅ IsAuthenticated | Voir détails |
| `/api/students/{id}/` | PATCH | ✅ IsAuthenticated | Modifier |
| `/api/students/{id}/` | DELETE | ✅ IsAuthenticated | Supprimer |

---

## 📖 CORAN (Surahs & Verses)

| Endpoint | Méthode | Permission | Notes |
|----------|---------|-----------|-------|
| `/api/surahs/` | GET | ✅ IsAuthenticated | Lister (cached 1 an) |
| `/api/surahs/{id}/` | GET | ✅ IsAuthenticated | Voir détails |
| `/api/verses/` | GET | ✅ IsAuthenticated | Lister versets |
| `/api/verses/{id}/` | GET | ✅ IsAuthenticated | Voir détail verset |

---

## 🎓 CURRICULUM (Admin Only)

| Endpoint | Méthode | Permission | Notes |
|----------|---------|-----------|-------|
| `/api/curriculum-levels/` | GET | 🔒 IsAdminUser | **Admin only** |
| `/api/curriculum-levels/` | POST | 🔒 IsAdminUser | Créer niveau |
| `/api/curriculum-levels/{id}/` | PATCH | 🔒 IsAdminUser | Modifier |
| `/api/curriculum-levels/{id}/` | DELETE | 🔒 IsAdminUser | Supprimer |
| `/api/curriculum-modules/` | GET | 🔒 IsAdminUser | **Admin only** |
| `/api/curriculum-modules/` | POST | 🔒 IsAdminUser | Créer module |
| `/api/curriculum-lessons/` | GET | 🔒 IsAdminUser | **Admin only** |
| `/api/curriculum-lessons/` | POST | 🔒 IsAdminUser | Créer leçon |
| `/api/curriculum-competencies/` | GET | 🔒 IsAdminUser | **Admin only** |
| `/api/curriculum-competencies/` | POST | 🔒 IsAdminUser | Créer compétence |

---

## 🎓 DARASA (Teacher + Admin)

| Endpoint | Méthode | Permission | Notes |
|----------|---------|-----------|-------|
| `/api/darasa/` | GET | 🔒 IsTeacherOrAdmin | Teachers/Admins |
| `/api/darasa/` | POST | 🔒 IsTeacherOrAdmin | Créer séance |
| `/api/darasa/{id}/` | GET | 🔒 IsTeacherOrAdmin | Voir séance |
| `/api/darasa/{id}/` | PATCH | 🔒 IsTeacherOrAdmin | Modifier (owner/admin) |
| `/api/darasa/{id}/` | DELETE | 🔒 IsTeacherOrAdmin | Supprimer (owner/admin) |

**Notes Darasa:**
- Teachers: Voient + modifient/suppriment **leurs propres** séances
- Admins: Accès complet à toutes les séances
- Filtre automatique: `get_queryset()` applique les restrictions

---

## 📊 PROGRESSION (Students)

| Endpoint | Méthode | Permission | Notes |
|----------|---------|-----------|-------|
| `/api/progress/` | GET | ✅ IsAuthenticated | Lire progression |
| `/api/progress/{id}/` | GET | ✅ IsAuthenticated | Détails |

---

## 🎯 ÉVALUATIONS

| Endpoint | Méthode | Permission | Notes |
|----------|---------|-----------|-------|
| `/api/evaluations/` | GET | ✅ IsAuthenticated | Lire évaluations |
| `/api/evaluations/` | POST | 🔒 IsTeacherOrAdmin | Créer évaluation |
| `/api/level-validations/` | GET | ✅ IsAuthenticated | Lire validations |
| `/api/level-validations/` | POST | 🔒 IsTeacherOrAdmin | Valider niveau |

---

## 🛡️ HIÉRARCHIE DES PERMISSIONS

```
┌─────────────────────────────────────────┐
│          IsAuthenticated ✅              │  Base: utilisateur loggé
├─────────────────────────────────────────┤
│                                         │
├─ IsTeacher                              │  Rôle: TEACHER
├─ IsAdmin                                │  Rôle: ADMIN
├─ IsTeacherOrAdmin                       │  Rôles: TEACHER OR ADMIN
├─ IsAdminUser                            │  Rôle: ADMIN (strictement)
├─ IsOwnerOrAdmin                         │  Propriétaire OR ADMIN
└─────────────────────────────────────────┘
```

---

## 🔄 SCÉNARIOS DE TEST

### Scenario 1: Student (Pas d'accès spécial)
```
❌ GET /api/curriculum-levels/        → 403 Forbidden
❌ POST /api/darasa/                  → 403 Forbidden
✅ GET /api/students/                 → 200 OK
✅ GET /api/progress/                 → 200 OK
```

### Scenario 2: Teacher
```
❌ GET /api/curriculum-levels/        → 403 Forbidden
✅ GET /api/darasa/                   → 200 OK (ses séances)
✅ POST /api/darasa/                  → 201 Created
✅ PATCH /api/darasa/1/               → 200 OK (si owner)
❌ PATCH /api/darasa/2/               → 403 Forbidden (pas owner)
```

### Scenario 3: Admin
```
✅ GET /api/curriculum-levels/        → 200 OK (tous)
✅ POST /api/curriculum-levels/       → 201 Created
✅ GET /api/darasa/                   → 200 OK (tous)
✅ PATCH /api/darasa/1/               → 200 OK (n'importe quel)
✅ PATCH /api/users/1/                → 200 OK
```

---

## 📝 CODE EXAMPLES

### Django: Vérifier permission dans perform_create
```python
def perform_create(self, serializer):
    user = self.request.user
    
    # Teacher → auto-assign teacher
    if user.role == "TEACHER":
        serializer.save(teacher=user)
    else:
        serializer.save()
```

### Frontend: Vérifier permission avant afficher
```typescript
import { isAdmin, isTeacher } from "../types";
import { useCurrentUser } from "../hooks/useCurrentUser";

export function AdminPanel() {
  const { user } = useCurrentUser();
  
  // Masquer le menu si pas admin
  if (!isAdmin(user)) return null;
  
  return <CurriculumManager />;
}
```

### Frontend: Gérer erreur 403
```typescript
try {
  await updateDarasa(id, payload);
} catch (error) {
  if (error.status === 403) {
    toast.error("Vous n'avez pas la permission de modifier cette séance");
  }
}
```

---

## 🔐 RATE LIMITING

### `/api/token/` (Authentication)
- **Limite**: 5 tentatives par heure
- **Clé**: Adresse IP
- **Réponse 429**: Too Many Requests
- **Objectif**: Prévenir brute-force attacks

```bash
# Test rate limiting
for i in {1..6}; do
  curl -X POST http://localhost:8000/api/token/ \
    -H "Content-Type: application/json" \
    -d '{"username":"test","password":"wrong"}'
done
# 6ème requête → 429 Too Many Requests
```

---

## 🔄 RÉCAPITULATIF MIGRATION

| Feature | Avant | Après | Status |
|---------|-------|-------|--------|
| Curriculum CRUD | ReadOnly + IsAuth | ModelViewSet + IsAdmin | ✅ |
| Darasa Permissions | IsAuth (tous) | IsTeacherOrAdmin | ✅ |
| Rate Limiting | ❌ Aucun | 5/h sur /token/ | ✅ |
| Permissions granulaires | IsAdmin seulement | IsAdmin, IsTeacher, etc. | ✅ |
| Frontend Types | ❌ `any` | ✅ Centralisés | ✅ |
| Route Protection | ProtectedRoute | ProtectedRoute + AdminRoute | ✅ |

