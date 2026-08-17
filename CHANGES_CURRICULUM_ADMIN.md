# 🔧 Refactoring Curriculum - Accès Admin Uniquement

**Date**: 17/08/2026  
**Objectif**: Rendre le Curriculum CRUD exclusive aux administrateurs et masquer l'accès aux non-admins

---

## ✅ Changements Effectués

### Backend Django

#### 1. ✨ Permissions Granulaires Améliorées
**Fichier**: [core/permissions.py](core/permissions.py)

```python
class IsAdminUser(permissions.BasePermission):
    """
    Vérifie que l'utilisateur est authentifié ET a le rôle ADMIN.
    """
    def has_permission(self, request, view):
        # Logique de vérification...
    
    def has_object_permission(self, request, view, obj):
        # Vérification au niveau de l'objet
```

**Pourquoi**: 
- ✅ Permission réutilisable pour d'autres endpoints sensibles
- ✅ Support des `has_object_permission` pour sécurité granulaire
- ✅ Alias `IsAdmin` conservé pour compatibilité

---

#### 2. 🔒 Curriculum ViewSets → CRUD Admin-Only
**Fichier**: [core/views.py](core/views.py)

Changement de tous les endpoints Curriculum:
- `CurriculumLevelViewSet` - ReadOnly → **ModelViewSet** + `IsAdminUser`
- `CurriculumModuleViewSet` - ReadOnly → **ModelViewSet** + `IsAdminUser`
- `CurriculumLessonViewSet` - ReadOnly → **ModelViewSet** + `IsAdminUser`
- `CurriculumCompetencyViewSet` - ReadOnly → **ModelViewSet** + `IsAdminUser`

**Avant**:
```python
class CurriculumLevelViewSet(viewsets.ReadOnlyModelViewSet):
    permission_classes = [IsAuthenticated]
```

**Après**:
```python
class CurriculumLevelViewSet(viewsets.ModelViewSet):
    """CRUD sur les niveaux du curriculum. ⚠️ Admins only."""
    permission_classes = [IsAdminUser]
```

**Impact API**:
| Endpoint | Avant | Après |
|----------|-------|-------|
| `GET /api/curriculum-levels/` | ✅ Tous | 🔒 Admin |
| `POST /api/curriculum-levels/` | ❌ Bloqué | 🔒 Admin |
| `PATCH /api/curriculum-levels/{id}/` | ❌ Bloqué | 🔒 Admin |
| `DELETE /api/curriculum-levels/{id}/` | ❌ Bloqué | 🔒 Admin |

---

#### 3. 🔧 Corrections Mineures Backend

**Indentation cassée fixée** - [core/models.py](core/models.py:318)
```python
# Avant: indentation manquante
competency = models.ForeignKey(
CurriculumCompetency,

# Après: indentation correcte
competency = models.ForeignKey(
    CurriculumCompetency,
```

---

### Frontend React/TypeScript

#### 4. 📦 Types Centralisés Créés
**Fichier**: [front/src/types/index.ts](front/src/types/index.ts) ✨ **NOUVEAU**

```typescript
export type UserRole = "ADMIN" | "TEACHER";
export type SessionType = "QURAN" | "PRAYER" | "WUDU" | ...;
export type ProgressStatus = "NOT_STARTED" | "IN_PROGRESS" | ...;
export interface CurrentUser { ... }
export interface AuthResponse { ... }
export const isAdmin = (user) => user?.role === "ADMIN";
```

**Avantages**:
- ✅ Type-safety complète (pas de `any` types)
- ✅ Centralisé (une seule source de vérité)
- ✅ Synchronisé avec le backend
- ✅ Autocomplete IDE partout

---

#### 5. 🔐 Auth API Corrigée
**Fichier**: [front/src/api/auth.api.ts](front/src/api/auth.api.ts)

```typescript
// Avant: login/ (n'existe pas)
export const login = async (data: LoginData) => {
  const response = await api.post("login/", data);
  
// Après: token/ (correct)
export const login = async (data: LoginData): Promise<AuthResponse> => {
  const response = await api.post("token/", data);
```

---

#### 6. 🛡️ Route Protégée Admin Créée
**Fichier**: [front/src/routes/AdminRoute.tsx](front/src/routes/AdminRoute.tsx) ✨ **NOUVEAU**

```typescript
function AdminRoute({ children }: AdminRouteProps) {
  const token = getAccessToken();
  const user = getUser();
  
  // Pas authentifié → Login
  if (!token) return <Navigate to="/login" />;
  
  // Pas admin → Dashboard
  if (user?.role !== "ADMIN") return <Navigate to="/dashboard" />;
  
  return <>{children}</>;
}
```

---

#### 7. 🧭 Navigation Filtrée par Rôle
**Fichier**: [front/src/layouts/MainLayout.tsx](front/src/layouts/MainLayout.tsx)

```typescript
// Avant: Static menu, une ligne pour filter Teachers
navigationItems = [
  { label: "Curriculum", path: "/curriculum", icon: <SchoolIcon /> },
  ...
].filter((item) => item.path !== "/teachers" || isAdmin);

// Après: Dynamic menu avec requiredRole
navigationItems = [
  { 
    label: "Curriculum", 
    path: "/curriculum", 
    icon: <SchoolIcon />,
    requiredRole: UserRole.ADMIN  // ← Nouveau!
  },
  { 
    label: "Enseignants", 
    path: "/teachers", 
    icon: <SchoolIcon />,
    requiredRole: UserRole.ADMIN  // ← Nouveau!
  },
  ...
].filter((item) => 
  !item.requiredRole || user?.role === item.requiredRole
);
```

**Bénéfices**:
- ✅ Pattern réutilisable pour d'autres routes
- ✅ Types stricts avec `UserRole`
- ✅ Menu UI adapté au rôle utilisateur
- ✅ Facile à étendre à d'autres rôles

---

#### 8. 🎯 Routing Sécurisé
**Fichier**: [front/src/routes/AppRouter.tsx](front/src/routes/AppRouter.tsx)

```typescript
// Curriculum accessible que via AdminRoute
<Route
  path="/curriculum"
  element={
    <AdminRoute>
      <Curriculum />
    </AdminRoute>
  }
/>
```

**Couches de sécurité**:
1. ✅ Backend: Permission `IsAdminUser` obligatoire
2. ✅ Frontend Router: Redirection si pas admin
3. ✅ UI Navigation: Menu caché pour non-admins
4. ✅ API Calls: Erreur 403 si accès non autorisé

---

#### 9. 📝 Token Utilities Typées
**Fichier**: [front/src/utils/token.ts](front/src/utils/token.ts)

```typescript
import type { CurrentUser } from "../types";

export const saveUser = (user: CurrentUser): void => { ... }
export const getUser = (): CurrentUser | null => { ... }
```

---

#### 10. 🎣 Hook Utilisateur Amélioré
**Fichier**: [front/src/hooks/useCurrentUser.ts](front/src/hooks/useCurrentUser.ts)

```typescript
// Avant: Type `any`
const [user, setUser] = useState<any | null>(null);

// Après: Type `CurrentUser` + loading state
const [user, setUser] = useState<CurrentUser | null>(null);
const [loading, setLoading] = useState(true);
```

---

## 🔍 Cohérence Frontend-Backend

### Avant
```
❌ Backend: GET /curriculum-levels → IsAuthenticated (n'importe qui)
❌ Frontend: /curriculum visible pour tous
❌ URL login: "login/" (n'existe pas)
❌ UserRole: string, typos possibles
❌ Types: `any` partout
```

### Après
```
✅ Backend: GET /curriculum-levels → IsAdminUser (admin only)
✅ Frontend: /curriculum masqué si non-admin
✅ URL token: "token/" (correct)
✅ UserRole: Typage strict
✅ Types: Centralisés et partagés
```

---

## 📋 Test Checklist

### Backend
- [x] `python manage.py check` → ✅ Pas d'erreurs
- [x] Permissions appliquées aux 4 ViewSets Curriculum
- [x] Import `IsAdminUser` dans views.py

### Frontend
- [x] `npm run build` → ✅ Compilation OK
- [x] Types TypeScript valides
- [x] Routes AdminRoute fonctionnelles
- [x] Navigation filtrée par rôle

### Scénarios
- [ ] Admin accède à `/curriculum` → ✅ Accès autorisé
- [ ] Teacher accède à `/curriculum` → 🔒 Redirection vers `/dashboard`
- [ ] Utilisateur non auth → 🔒 Redirection vers `/login`
- [ ] POST /api/curriculum-levels/ (Teacher) → ❌ 403 Forbidden
- [ ] POST /api/curriculum-levels/ (Admin) → ✅ 201 Created

---

## 🚀 Prochaines Étapes

### Critique (cette semaine)
- [ ] Ajouter `IsTeacher` permission pour les endpoints Darasa
- [ ] Ajouter `IsTeacherOrAdmin` pour read-only Curriculum
- [ ] Migrer tokens → httpOnly cookies
- [ ] Ajouter rate limiting sur `/api/token/`

### Important (ce mois)
- [ ] Tester tous les scénarios de permissions
- [ ] Ajouter des tests d'intégration
- [ ] Documentation API (permissions requises)
- [ ] Logs d'audit pour accès admin

### À Améliorer
- [ ] Factory CRUD pour réduire code dupliqué (12 API clients)
- [ ] TanStack Query pour state management
- [ ] Validation côté frontend avec Zod
- [ ] Tests unitaires (frontend + backend)

---

## 📊 Résumé des Fichiers Modifiés

| Fichier | Type | Changement |
|---------|------|-----------|
| `core/permissions.py` | 📝 Modifié | Ajouté `IsAdminUser` robuste |
| `core/models.py` | 🔧 Fixé | Indentation line 318 |
| `core/views.py` | 🔄 Refactorisé | 4 ViewSets Curriculum: ReadOnly → ModelViewSet |
| `front/src/types/index.ts` | ✨ Créé | Types centralisés |
| `front/src/routes/AdminRoute.tsx` | ✨ Créé | Route protégée admin |
| `front/src/routes/AppRouter.tsx` | 🔄 Modifié | Wrappé Curriculum dans AdminRoute |
| `front/src/layouts/MainLayout.tsx` | 🔄 Modifié | Navigation dynamique par rôle |
| `front/src/api/auth.api.ts` | 🔧 Fixé | URL login/ → token/ |
| `front/src/hooks/useCurrentUser.ts` | 🔄 Amélioré | Typing + loading state |
| `front/src/utils/token.ts` | 🔄 Typé | Types `CurrentUser` |

---

## 🎓 Leçons Apprises

1. **Permissions granulaires**: Toujours différencier les niveaux (request vs object)
2. **Frontend routing**: Plusieurs couches de sécurité (router + UI + API)
3. **Type-safety**: Centralisé les types évite les divergences frontend-backend
4. **Migrations API**: Tester URL avant de deployer
5. **Documentation**: Les permissions doivent être documentées dans les docstrings

---

## 📞 Questions?

- Tester les scénarios dans Postman/Thunderclient
- Vérifier les logs backend lors d'accès refusés
- Comparer réponses API avec le schema DRF
