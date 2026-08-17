from rest_framework import permissions


class IsAdminUser(permissions.BasePermission):
    """
    Vérifie que l'utilisateur est authentifié ET a le rôle ADMIN.
    Utilisé pour les opérations critiques (Curriculum, Users).
    """

    def has_permission(self, request, view):
        user = request.user
        return bool(
            user 
            and user.is_authenticated 
            and getattr(user, "role", None) == "ADMIN"
        )

    def has_object_permission(self, request, view, obj):
        user = request.user
        return bool(
            user 
            and user.is_authenticated 
            and getattr(user, "role", None) == "ADMIN"
        )


class IsTeacher(permissions.BasePermission):
    """
    Vérifie que l'utilisateur est authentifié ET a le rôle TEACHER.
    Utilisé pour les opérations réservées aux enseignants.
    """

    def has_permission(self, request, view):
        user = request.user
        return bool(
            user 
            and user.is_authenticated 
            and getattr(user, "role", None) == "TEACHER"
        )

    def has_object_permission(self, request, view, obj):
        user = request.user
        return bool(
            user 
            and user.is_authenticated 
            and getattr(user, "role", None) == "TEACHER"
        )


class IsTeacherOrAdmin(permissions.BasePermission):
    """
    Vérifie que l'utilisateur est TEACHER ou ADMIN.
    Utilisé pour les endpoints accessibles aux enseignants et admins.
    """

    def has_permission(self, request, view):
        user = request.user
        print("\n========== PERMISSION ==========")
        print("USER       :", user)
        print("USERNAME   :", getattr(user, "username", None))
        print("AUTH       :", user.is_authenticated)
        print("ROLE       :", getattr(user, "role", None))
        print("USER ID    :", getattr(user, "id", None))
        print("================================\n")

        if not (user and user.is_authenticated):
            return False
        
        role = getattr(user, "role", None)
        return role in ["TEACHER", "ADMIN"]

    def has_object_permission(self, request, view, obj):
        user = request.user
        if not (user and user.is_authenticated):
            return False
        
        role = getattr(user, "role", None)
        return role in ["TEACHER", "ADMIN"]


class IsOwnerOrAdmin(permissions.BasePermission):
    """
    Vérifie que l'utilisateur est le propriétaire de l'objet ou un admin.
    """

    def has_object_permission(self, request, view, obj):
        user = request.user
        
        # Admin a toujours accès
        if getattr(user, "role", None) == "ADMIN":
            return True
        
        # Vérifier si l'utilisateur est le propriétaire
        # Supporte plusieurs champs propriétaire (user, teacher, created_by, etc.)
        return any([
            getattr(obj, "user", None) == user,
            getattr(obj, "teacher", None) == user,
            getattr(obj, "created_by", None) == user
        ])
class IsAdminOrTeacherReadOnly(permissions.BasePermission):
    """
    Admin :
        accès complet au curriculum.

    Teacher :
        accès en lecture uniquement.

    Permet aux enseignants de consulter le curriculum
    pour enregistrer leurs séances de Darasa.
    """

    def has_permission(self, request, view):
        user = request.user

        if not user or not user.is_authenticated:
            return False

        role = getattr(user, "role", None)

        # Admin : accès complet
        if role == "ADMIN":
            return True

        # Teacher : lecture uniquement
        if role == "TEACHER":
            return request.method in permissions.SAFE_METHODS

        return False


# Alias pour compatibilité
IsAdmin = IsAdminUser
