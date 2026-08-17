
from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import (
    # Auth
    CustomTokenObtainPairView,

    # Utilisateurs / élèves
    UserViewSet,
    StudentViewSet,

    # Coran
    SurahViewSet,
    VerseViewSet,

    # Darasa / progression
    DarasaViewSet,
    StudentProgressViewSet,
    StudentLessonProgressViewSet,

    # Curriculum
    CurriculumLevelViewSet,
    CurriculumModuleViewSet,
    CurriculumLessonViewSet,
    CurriculumCompetencyViewSet,

    # Progression curriculum
    StudentCurriculumProgressViewSet,

    # Groupes
    StudentGroupViewSet,
    StudentGroupMembershipViewSet,

    # Évaluations
    StudentEvaluationViewSet,
    StudentObservationViewSet,
    StudentLevelValidationViewSet,

    # Spécialisations
    CurriculumSpecializationViewSet,
    StudentSpecializationViewSet,

    # Livres du curriculum
    CurriculumBookViewSet,
    CurriculumBookSectionViewSet,
    CurriculumBookContentViewSet,
    LessonBookReferenceViewSet,
)


# =========================================================
# ROUTER API
# =========================================================

router = DefaultRouter()


# =========================================================
# UTILISATEURS / ÉLÈVES
# =========================================================

router.register(
    "users",
    UserViewSet,
)

router.register(
    "students",
    StudentViewSet,
)


# =========================================================
# CORAN
# =========================================================

router.register(
    "surahs",
    SurahViewSet,
)

router.register(
    "verses",
    VerseViewSet,
)


# =========================================================
# DARASA
# =========================================================

router.register(
    "darasa",
    DarasaViewSet,
)


# =========================================================
# PROGRESSION GÉNÉRALE
# =========================================================

router.register(
    "progress",
    StudentProgressViewSet,
)


# =========================================================
# CURRICULUM
# =========================================================

router.register(
    "curriculum-levels",
    CurriculumLevelViewSet,
)

router.register(
    "curriculum-modules",
    CurriculumModuleViewSet,
)

router.register(
    "curriculum-lessons",
    CurriculumLessonViewSet,
)

router.register(
    "curriculum-competencies",
    CurriculumCompetencyViewSet,
)


# =========================================================
# PROGRESSION DES LEÇONS
# =========================================================

router.register(
    "lesson-progress",
    StudentLessonProgressViewSet,
)


# =========================================================
# PROGRESSION DES COMPÉTENCES
# =========================================================

router.register(
    "curriculum-progress",
    StudentCurriculumProgressViewSet,
)


# =========================================================
# GROUPES
# =========================================================

router.register(
    "groups",
    StudentGroupViewSet,
)

router.register(
    "group-memberships",
    StudentGroupMembershipViewSet,
)


# =========================================================
# ÉVALUATIONS
# =========================================================

router.register(
    "evaluations",
    StudentEvaluationViewSet,
)

router.register(
    "observations",
    StudentObservationViewSet,
)

router.register(
    "level-validations",
    StudentLevelValidationViewSet,
)


# =========================================================
# SPÉCIALISATIONS
# =========================================================

router.register(
    "specializations",
    CurriculumSpecializationViewSet,
)

router.register(
    "student-specializations",
    StudentSpecializationViewSet,
)


# =========================================================
# LIVRES DU CURRICULUM
# =========================================================

router.register(
    "curriculum-books",
    CurriculumBookViewSet,
)

router.register(
    "book-sections",
    CurriculumBookSectionViewSet,
)

router.register(
    "book-contents",
    CurriculumBookContentViewSet,
)

router.register(
    "lesson-book-references",
    LessonBookReferenceViewSet,
)


# =========================================================
# URLS
# =========================================================

urlpatterns = [

    # Toutes les routes REST
    path(
        "",
        include(router.urls),
    ),

    # JWT Login
    path(
        "login/",
        CustomTokenObtainPairView.as_view(),
        name="login",
    ),
]
