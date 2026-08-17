
from django.db.models import Q

from rest_framework import viewsets, filters
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend

from rest_framework_simplejwt.views import TokenObtainPairView

from .permissions import IsAdmin, IsAdminOrTeacherReadOnly, IsAdminUser, IsTeacher, IsTeacherOrAdmin, IsOwnerOrAdmin

from .models import (
    User,
    Student,
    Surah,
    Verse,
    DarasaSession,
    StudentProgress,

    CurriculumLevel,
    CurriculumModule,
    CurriculumLesson,
    CurriculumCompetency,

    StudentLessonProgress,
    StudentCurriculumProgress,

    StudentGroup,
    StudentGroupMembership,

    StudentEvaluation,
    StudentObservation,
    StudentLevelValidation,

    CurriculumSpecialization,
    StudentSpecialization,

    CurriculumBook,
    CurriculumBookSection,
    CurriculumBookContent,
    LessonBookReference,
)

from .serializers import (
    CustomTokenObtainPairSerializer,

    UserSerializer,
    StudentSerializer,

    SurahSerializer,
    VerseSerializer,

    DarasaListSerializer,
    DarasaCreateSerializer,

    StudentProgressSerializer,

    CurriculumLevelSerializer,
    CurriculumModuleSerializer,
    CurriculumLessonSerializer,
    CurriculumCompetencySerializer,

    StudentLessonProgressSerializer,
    StudentCurriculumProgressSerializer,

    StudentGroupSerializer,
    StudentGroupMembershipSerializer,

    StudentEvaluationSerializer,
    StudentObservationSerializer,
    StudentLevelValidationSerializer,

    CurriculumSpecializationSerializer,
    StudentSpecializationSerializer,

    CurriculumBookSerializer,
    CurriculumBookSectionSerializer,
    CurriculumBookContentSerializer,
    LessonBookReferenceSerializer,
)


# =========================================================
# AUTHENTIFICATION
# =========================================================

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer


# =========================================================
# STUDENTS
# =========================================================

class StudentViewSet(viewsets.ModelViewSet):

    queryset = Student.objects.all().order_by("full_name")

    serializer_class = StudentSerializer

    permission_classes = [IsAuthenticated]

    filter_backends = [
        filters.SearchFilter,
        DjangoFilterBackend,
        filters.OrderingFilter,
    ]

    search_fields = [
        "full_name",
        "matricule",
        "phone",
    ]

    filterset_fields = [
        "phone",
    ]

    ordering_fields = [
        "full_name",
        "created_at",
    ]


# =========================================================
# CORAN - SOURATES
# =========================================================

class SurahViewSet(viewsets.ReadOnlyModelViewSet):

    queryset = (
        Surah.objects
        .prefetch_related("verses")
        .order_by("number")
    )

    serializer_class = SurahSerializer

    permission_classes = [IsAuthenticated]


# =========================================================
# CORAN - VERSETS
# =========================================================

class VerseViewSet(viewsets.ReadOnlyModelViewSet):

    queryset = (
        Verse.objects
        .select_related("surah")
        .order_by(
            "surah__number",
            "verse_number",
        )
    )

    serializer_class = VerseSerializer

    permission_classes = [IsAuthenticated]

    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
    ]

    filterset_fields = [
        "surah",
        "juz",
        "hizb",
        "page",
        "sajda",
    ]

    search_fields = [
        "text_ar",
        "text_fr",
        "text_en",
    ]


# =========================================================
# DARASA
# =========================================================

class DarasaViewSet(viewsets.ModelViewSet):
    """
    ViewSet pour gérer les séances de Darasa.
    ⚠️ Accessible aux enseignants et admins.
    - Enseignants: peuvent créer/voir/modifier leurs propres séances
    - Admins: accès complet
    """

    permission_classes = [IsAuthenticated, IsTeacherOrAdmin]

    filter_backends = [
        filters.SearchFilter,
        DjangoFilterBackend,
        filters.OrderingFilter,
    ]

    search_fields = [
        "student__full_name",
        "teacher__username",
        "surah__name_fr",
        "surah__name_ar",
        "notes",
    ]

    filterset_fields = [
        "student",
        "teacher",
        "surah",
        "date",
        "session_type",
        "lesson",
    ]

    ordering_fields = [
        "date",
        "start_time",
        "created_at",
    ]

    queryset = (
        DarasaSession.objects
        .select_related(
            "teacher",
            "student",
            "surah",
            "lesson",
        )
        .order_by("-date", "-start_time")
    )

    def get_queryset(self):

        queryset = super().get_queryset()

        user = self.request.user

        # Un enseignant ne voit que ses propres séances.
        if getattr(user, "role", None) == User.TEACHER:
            queryset = queryset.filter(teacher=user)

        return queryset

    def get_serializer_class(self):

        if self.action in [
            "create",
            "update",
            "partial_update",
        ]:
            return DarasaCreateSerializer

        return DarasaListSerializer

    def perform_create(self, serializer):

        user = self.request.user

        # Un enseignant est automatiquement enregistré
        # comme enseignant de la séance.
        if getattr(user, "role", None) == User.TEACHER:

            darasa = serializer.save(
                teacher=user
            )
        else:

            darasa = serializer.save()
        progress, created = StudentProgress.objects.get_or_create(
            student=darasa.student
    )

    # Toute séance compte dans le total
        progress.total_sessions += 1

    # Seule une séance Coran modifie
    # la progression coranique
        if darasa.session_type == "QURAN":
            progress.current_surah = darasa.surah
            progress.current_verse = darasa.verse_end

    # Mise à jour de la progression générale de l'élève.
        progress.save()

        
        

    def perform_update(self, serializer):

        user = self.request.user

        if getattr(user, "role", None) == User.TEACHER:

            # Un enseignant ne peut modifier que ses propres séances.
            instance = self.get_object()

            if instance.teacher != user:
                from rest_framework.exceptions import PermissionDenied

                raise PermissionDenied(
                    "Vous ne pouvez modifier que vos propres séances."
                )

            serializer.save(
                teacher=user
            )

        else:

            serializer.save()


# =========================================================
# UTILISATEURS
# =========================================================

class UserViewSet(viewsets.ModelViewSet):

    queryset = User.objects.all().order_by("username")

    serializer_class = UserSerializer

    filter_backends = [
        filters.SearchFilter,
        filters.OrderingFilter,
        DjangoFilterBackend,
    ]

    filterset_fields = [
        "role",
        "is_active",
    ]

    search_fields = [
        "username",
        "first_name",
        "last_name",
        "phone",
    ]

    ordering_fields = [
        "username",
        "role",
        "date_joined",
    ]

    def get_permissions(self):

        if self.action in [
            "list",
            "create",
            "update",
            "partial_update",
            "destroy",
        ]:
            permission_classes = [
                IsAuthenticated,
                IsAdmin,
            ]

        else:
            permission_classes = [
                IsAuthenticated,
            ]

        return [
            permission()
            for permission in permission_classes
        ]


# =========================================================
# PROGRESSION GÉNÉRALE DE L'ÉLÈVE
# =========================================================

class StudentProgressViewSet(viewsets.ReadOnlyModelViewSet):

    queryset = (
        StudentProgress.objects
        .select_related(
            "student",
            "current_surah",
        )
        .all()
    )

    serializer_class = StudentProgressSerializer

    permission_classes = [
        IsAuthenticated
    ]

    filter_backends = [
        filters.SearchFilter,
        DjangoFilterBackend,
    ]

    search_fields = [
        "student__full_name",
        "current_surah__name_fr",
    ]

    filterset_fields = [
        "student",
        "current_surah",
    ]


# =========================================================
# CURRICULUM - NIVEAUX
# =========================================================

class CurriculumLevelViewSet(viewsets.ModelViewSet):
    """
    CRUD sur les niveaux du curriculum.
    ⚠️ Réservé aux administrateurs seulement.
    """

    queryset = (
        CurriculumLevel.objects
        .prefetch_related(
            "modules__lessons__competencies",
            "specializations",
            "books",
        )
        .order_by("level_number")
    )

    serializer_class = CurriculumLevelSerializer

    permission_classes = [
        IsAdminOrTeacherReadOnly
    ]


# =========================================================
# CURRICULUM - MODULES
# =========================================================

class CurriculumModuleViewSet(viewsets.ModelViewSet):
    """
    CRUD sur les modules du curriculum.
    ⚠️ Réservé aux administrateurs seulement.
    """

    queryset = (
        CurriculumModule.objects
        .select_related("level")
        .prefetch_related(
            "lessons__competencies",
        )
        .order_by(
            "level__level_number",
            "order",
        )
    )

    serializer_class = CurriculumModuleSerializer

    permission_classes = [
       IsAdminOrTeacherReadOnly
    ]

    filter_backends = [
        DjangoFilterBackend,
    ]

    filterset_fields = [
        "level",
        "is_required",
    ]


# =========================================================
# CURRICULUM - LEÇONS
# =========================================================

class CurriculumLessonViewSet(viewsets.ModelViewSet):
    """
    CRUD sur les leçons du curriculum.
    ⚠️ Réservé aux administrateurs seulement.
    """

    queryset = (
        CurriculumLesson.objects
        .select_related(
            "module",
            "module__level",
        )
        .prefetch_related(
            "competencies",
            "book_references",
        )
        .order_by(
            "module__level__level_number",
            "module__order",
            "order",
        )
    )

    serializer_class = CurriculumLessonSerializer

    permission_classes = [
        IsAdminOrTeacherReadOnly
    ]

    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
    ]

    filterset_fields = [
        "module",
        "module__level",
        "is_required",
    ]

    search_fields = [
        "title",
        "description",
        "objectives",
    ]


# =========================================================
# CURRICULUM - COMPÉTENCES
# =========================================================

class CurriculumCompetencyViewSet(viewsets.ModelViewSet):
    """
    CRUD sur les compétences du curriculum.
    ⚠️ Réservé aux administrateurs seulement.
    """

    queryset = (
        CurriculumCompetency.objects
        .select_related(
            "lesson",
            "lesson__module",
            "lesson__module__level",
        )
        .order_by(
            "lesson__module__level__level_number",
            "lesson__module__order",
            "lesson__order",
            "order",
        )
    )

    serializer_class = CurriculumCompetencySerializer

    permission_classes = [
        IsAdminOrTeacherReadOnly
    ]

    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
    ]

    filterset_fields = [
        "lesson",
        "lesson__module",
        "lesson__module__level",
        "is_gate",
        "validation_method",
    ]

    search_fields = [
        "title",
        "description",
    ]


# =========================================================
# PROGRESSION DES LEÇONS
# =========================================================

class StudentLessonProgressViewSet(viewsets.ModelViewSet):

    queryset = (
        StudentLessonProgress.objects
        .select_related(
            "student",
            "lesson",
            "lesson__module",
            "lesson__module__level",
        )
        .order_by("-updated_at")
    )

    serializer_class = StudentLessonProgressSerializer

    permission_classes = [
        IsAuthenticated
    ]

    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
    ]

    filterset_fields = [
        "student",
        "lesson",
        "status",
        "lesson__module",
        "lesson__module__level",
    ]

    search_fields = [
        "student__full_name",
        "lesson__title",
        "notes",
    ]


# =========================================================
# PROGRESSION DES COMPÉTENCES
# =========================================================

class StudentCurriculumProgressViewSet(viewsets.ModelViewSet):

    queryset = (
        StudentCurriculumProgress.objects
        .select_related(
            "student",
            "competency",
            "competency__lesson",
            "competency__lesson__module",
            "competency__lesson__module__level",
        )
        .order_by("-updated_at")
    )

    serializer_class = StudentCurriculumProgressSerializer

    permission_classes = [
        IsAuthenticated
    ]

    filter_backends = [
        filters.SearchFilter,
        DjangoFilterBackend,
    ]

    search_fields = [
        "student__full_name",
        "competency__title",
    ]

    filterset_fields = [
        "student",
        "competency",
        "status",
        "competency__lesson",
        "competency__lesson__module",
        "competency__lesson__module__level",
    ]


# =========================================================
# GROUPES D'ÉLÈVES
# =========================================================

class StudentGroupViewSet(viewsets.ModelViewSet):

    queryset = (
        StudentGroup.objects
        .select_related("level")
        .prefetch_related(
            "memberships__student",
        )
        .order_by("name")
    )

    serializer_class = StudentGroupSerializer

    permission_classes = [
        IsAuthenticated
    ]

    filter_backends = [
        filters.SearchFilter,
        DjangoFilterBackend,
    ]

    search_fields = [
        "name",
        "description",
    ]

    filterset_fields = [
        "level",
        "is_active",
    ]


# =========================================================
# MEMBRES DES GROUPES
# =========================================================

class StudentGroupMembershipViewSet(viewsets.ModelViewSet):

    queryset = (
        StudentGroupMembership.objects
        .select_related(
            "group",
            "student",
            "group__level",
        )
    )

    serializer_class = StudentGroupMembershipSerializer

    permission_classes = [
        IsAuthenticated
    ]

    filter_backends = [
        DjangoFilterBackend
    ]

    filterset_fields = [
        "group",
        "student",
    ]


# =========================================================
# ÉVALUATIONS
# =========================================================

class StudentEvaluationViewSet(viewsets.ModelViewSet):

    queryset = (
        StudentEvaluation.objects
        .select_related(
            "student",
            "competency",
            "competency__lesson",
            "competency__lesson__module",
            "competency__lesson__module__level",
        )
        .order_by("-evaluated_at")
    )

    serializer_class = StudentEvaluationSerializer

    permission_classes = [
        IsAuthenticated
    ]

    filter_backends = [
        filters.SearchFilter,
        DjangoFilterBackend,
    ]

    search_fields = [
        "student__full_name",
        "competency__title",
        "notes",
    ]

    filterset_fields = [
        "student",
        "competency",
        "status",
        "competency__lesson",
        "competency__lesson__module",
        "competency__lesson__module__level",
    ]


# =========================================================
# OBSERVATIONS
# =========================================================

class StudentObservationViewSet(viewsets.ModelViewSet):

    queryset = (
        StudentObservation.objects
        .select_related(
            "student",
            "teacher",
        )
        .order_by("-created_at")
    )

    serializer_class = StudentObservationSerializer

    permission_classes = [
        IsAuthenticated
    ]

    filter_backends = [
        filters.SearchFilter,
        DjangoFilterBackend,
    ]

    search_fields = [
        "student__full_name",
        "title",
        "content",
        "teacher__username",
    ]

    filterset_fields = [
        "student",
        "teacher",
    ]

    def get_queryset(self):

        queryset = super().get_queryset()

        user = self.request.user

        if getattr(user, "role", None) == User.TEACHER:
            queryset = queryset.filter(
                teacher=user
            )

        return queryset

    def perform_create(self, serializer):

        user = self.request.user

        if getattr(user, "role", None) == User.TEACHER:

            serializer.save(
                teacher=user
            )

        else:

            serializer.save()


# =========================================================
# VALIDATION DES NIVEAUX
# =========================================================

class StudentLevelValidationViewSet(viewsets.ModelViewSet):

    queryset = (
        StudentLevelValidation.objects
        .select_related(
            "student",
            "level",
            "evaluated_by",
        )
        .order_by("-validated_at")
    )

    serializer_class = StudentLevelValidationSerializer

    permission_classes = [
        IsAdminUser
    ]

    filter_backends = [
        filters.SearchFilter,
        DjangoFilterBackend,
    ]

    search_fields = [
        "student__full_name",
        "level__name",
        "notes",
    ]

    filterset_fields = [
        "student",
        "level",
        "status",
    ]

    def perform_create(self, serializer):

        user = self.request.user

        serializer.save(
            evaluated_by=user
        )

    def perform_update(self, serializer):

        user = self.request.user

        serializer.save(
            evaluated_by=user
        )


# =========================================================
# SPÉCIALISATIONS
# =========================================================

class CurriculumSpecializationViewSet(
    viewsets.ReadOnlyModelViewSet
):

    queryset = (
        CurriculumSpecialization.objects
        .select_related("level")
        .filter(is_active=True)
        .order_by("level__level_number", "name")
    )

    serializer_class = CurriculumSpecializationSerializer

    permission_classes = [
        IsAuthenticated
    ]

    filter_backends = [
        DjangoFilterBackend
    ]

    filterset_fields = [
        "level",
        "name",
        "is_active",
    ]


# =========================================================
# SPÉCIALISATION DE L'ÉLÈVE
# =========================================================

class StudentSpecializationViewSet(viewsets.ModelViewSet):

    queryset = (
        StudentSpecialization.objects
        .select_related(
            "student",
            "specialization",
            "specialization__level",
        )
        .order_by("-started_at")
    )

    serializer_class = StudentSpecializationSerializer

    permission_classes = [
        IsAuthenticated
    ]

    filter_backends = [
        DjangoFilterBackend
    ]

    filterset_fields = [
        "student",
        "specialization",
        "is_active",
    ]


# =========================================================
# LIVRES DU CURRICULUM
# =========================================================

class CurriculumBookViewSet(viewsets.ReadOnlyModelViewSet):

    queryset = (
        CurriculumBook.objects
        .select_related("level")
        .prefetch_related(
            "sections__contents",
        )
        .order_by(
            "level__level_number",
            "title",
        )
    )

    serializer_class = CurriculumBookSerializer

    permission_classes = [
        IsAuthenticated
    ]

    filter_backends = [
        filters.SearchFilter,
        DjangoFilterBackend,
    ]

    search_fields = [
        "title",
        "author",
        "description",
    ]

    filterset_fields = [
        "level",
        "language",
        "is_active",
    ]


# =========================================================
# SECTIONS DES LIVRES
# =========================================================

class CurriculumBookSectionViewSet(
    viewsets.ReadOnlyModelViewSet
):

    queryset = (
        CurriculumBookSection.objects
        .select_related(
            "book",
            "book__level",
        )
        .prefetch_related(
            "contents",
        )
        .order_by(
            "book__level__level_number",
            "book__title",
            "order",
        )
    )

    serializer_class = CurriculumBookSectionSerializer

    permission_classes = [
        IsAuthenticated
    ]

    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
    ]

    filterset_fields = [
        "book",
        "book__level",
    ]

    search_fields = [
        "title",
        "description",
    ]


# =========================================================
# CONTENU DES LIVRES
# =========================================================

class CurriculumBookContentViewSet(
    viewsets.ReadOnlyModelViewSet
):

    queryset = (
        CurriculumBookContent.objects
        .select_related(
            "section",
            "section__book",
        )
        .order_by(
            "section__book__title",
            "section__order",
            "order",
        )
    )

    serializer_class = CurriculumBookContentSerializer

    permission_classes = [
        IsAuthenticated
    ]

    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
    ]

    filterset_fields = [
        "section",
        "content_type",
        "is_required",
    ]

    search_fields = [
        "title",
        "content",
    ]


# =========================================================
# RÉFÉRENCES LIVRES ↔ LEÇONS
# =========================================================

class LessonBookReferenceViewSet(
    viewsets.ReadOnlyModelViewSet
):

    queryset = (
        LessonBookReference.objects
        .select_related(
            "lesson",
            "lesson__module",
            "lesson__module__level",
            "book",
            "book__level",
            "section_start",
        )
        .order_by(
            "lesson__module__level__level_number",
            "lesson__module__order",
            "lesson__order",
        )
    )

    serializer_class = LessonBookReferenceSerializer

    permission_classes = [
        IsAuthenticated
    ]

    filter_backends = [
        DjangoFilterBackend
    ]

    filterset_fields = [
        "lesson",
        "book",
        "section_start",
    ]
