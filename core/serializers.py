
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from .models import (
    User,
    Student,
    Surah,
    Verse,
    DarasaSession,
    StudentProgress,
    StudentLessonProgress,

    # Curriculum
    CurriculumLevel,
    CurriculumModule,
    CurriculumLesson,
    CurriculumCompetency,

    # Livres du curriculum
    CurriculumBook,
    CurriculumBookSection,
    CurriculumBookContent,
    LessonBookReference,

    # Progression
    StudentCurriculumProgress,

    # Groupes
    StudentGroup,
    StudentGroupMembership,

    # Évaluations
    StudentEvaluation,
    StudentObservation,
    StudentLevelValidation,

    # Spécialisations
    CurriculumSpecialization,
    StudentSpecialization,
)


# =========================================================
# AUTHENTIFICATION
# =========================================================

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):

    def validate(self, attrs):
        data = super().validate(attrs)

        data["user"] = {
            "id": self.user.id,
            "username": self.user.username,
            "role": self.user.role,
            "phone": self.user.phone,
            "first_name": self.user.first_name,
            "last_name": self.user.last_name,
            "is_active": self.user.is_active,
        }

        return data


# =========================================================
# USER
# =========================================================

class UserSerializer(serializers.ModelSerializer):

    password = serializers.CharField(
        write_only=True,
        required=False,
        allow_blank=True,
        min_length=8,
    )

    class Meta:
        model = User

        fields = [
            "id",
            "username",
            "first_name",
            "last_name",
            "phone",
            "role",
            "is_active",
            "password",
        ]

    def create(self, validated_data):

        password = validated_data.pop("password", None)

        user = User(**validated_data)

        if password:
            user.set_password(password)

        user.save()

        return user

    def update(self, instance, validated_data):

        password = validated_data.pop("password", None)

        if password:
            instance.set_password(password)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        instance.save()

        return instance


# =========================================================
# STUDENT
# =========================================================


class StudentSerializer(serializers.ModelSerializer):

    age = serializers.SerializerMethodField()

    class Meta:
        model = Student
        fields = "__all__"

    def get_age(self, obj):

        from datetime import date

        if not obj.birth_date:
            return None

        today = date.today()

        return (
            today.year
            - obj.birth_date.year
            - (
                (today.month, today.day)
                < (obj.birth_date.month, obj.birth_date.day)
            )
        )


# =========================================================
# VERSET DU CORAN
# =========================================================

class VerseSerializer(serializers.ModelSerializer):

    class Meta:
        model = Verse

        fields = [
            "id",
            "verse_number",
            "text_ar",
            "text_fr",
            "text_en",
            "juz",
            "hizb",
            "page",
            "sajda",
        ]


# =========================================================
# SOURATE
# =========================================================

class SurahSerializer(serializers.ModelSerializer):

    verses = VerseSerializer(
        many=True,
        read_only=True
    )

    class Meta:
        model = Surah

        fields = [
            "id",
            "number",
            "name_ar",
            "name_fr",
            "name_en",
            "revelation_type",
            "revelation_order",
            "total_verses",
            "bismillah",
            "verses",
        ]


# =========================================================
# PROGRESSION CORANIQUE
# =========================================================

class StudentProgressSerializer(serializers.ModelSerializer):

    student_name = serializers.CharField(
        source="student.full_name",
        read_only=True
    )

    surah_name = serializers.CharField(
        source="current_surah.name_fr",
        read_only=True
    )

    class Meta:
        model = StudentProgress
        fields = "__all__"


# =========================================================
# =========================================================
#                 CURRICULUM KALANYORO
# =========================================================
# =========================================================


# =========================================================
# LIVRE
# =========================================================

class CurriculumBookContentSerializer(serializers.ModelSerializer):
    """
    Contenu pédagogique d'une section de livre.
    """

    class Meta:
        model = CurriculumBookContent

        fields = [
            "id",
            "section",
            "title",
            "content_type",
            "content",
            "order",
            "is_required",
        ]


# =========================================================
# SECTION DU LIVRE
# =========================================================

class CurriculumBookSectionSerializer(serializers.ModelSerializer):
    """
    Section / chapitre d'un livre.
    """

    contents = CurriculumBookContentSerializer(
        many=True,
        read_only=True
    )

    class Meta:
        model = CurriculumBookSection

        fields = [
            "id",
            "book",
            "title",
            "description",
            "order",
            "contents",
        ]


# =========================================================
# LIVRE COMPLET
# =========================================================

class CurriculumBookSerializer(serializers.ModelSerializer):
    """
    Livre du curriculum avec ses sections et contenus.
    """

    sections = CurriculumBookSectionSerializer(
        many=True,
        read_only=True
    )

    level_name = serializers.CharField(
        source="level.name",
        read_only=True
    )

    class Meta:
        model = CurriculumBook

        fields = [
            "id",
            "title",
            "author",
            "description",
            "level",
            "level_name",
            "language",
            "is_active",
            "created_at",
            "sections",
        ]


# =========================================================
# RÉFÉRENCE LIVRE → LEÇON
# =========================================================

class LessonBookReferenceSerializer(serializers.ModelSerializer):
    """
    Indique quelle partie d'un livre est utilisée
    dans une leçon du curriculum.
    """

    book_title = serializers.CharField(
        source="book.title",
        read_only=True
    )

    section_title = serializers.CharField(
        source="section_start.title",
        read_only=True
    )

    class Meta:
        model = LessonBookReference

        fields = [
            "id",
            "lesson",
            "book",
            "book_title",
            "section_start",
            "section_title",
            "instructions",
        ]


# =========================================================
# COMPÉTENCE
# =========================================================

class CurriculumCompetencySerializer(serializers.ModelSerializer):
    """
    Micro-compétence évaluée dans une leçon.
    """

    class Meta:
        model = CurriculumCompetency

        fields = [
            "id",
            "lesson",
            "title",
            "description",
            "order",
            "validation_method",
            "is_gate",
            "created_at",
        ]


# =========================================================
# LEÇON
# =========================================================

class CurriculumLessonSerializer(serializers.ModelSerializer):
    """
    Leçon du curriculum.

    Une leçon peut contenir :
    - des compétences
    - des références vers des livres
    """

    competencies = CurriculumCompetencySerializer(
        many=True,
        read_only=True
    )

    book_references = LessonBookReferenceSerializer(
        many=True,
        read_only=True
    )

    class Meta:
        model = CurriculumLesson

        fields = [
            "id",
            "module",
            "title",
            "objectives",
            "description",
            "order",
            "duration_minutes",
            "is_required",
            "content",
            "created_at",
            "competencies",
            "book_references",
        ]


# =========================================================
# MODULE
# =========================================================

class CurriculumModuleSerializer(serializers.ModelSerializer):
    """
    Module pédagogique.

    Structure :
    Niveau
        ↓
    Module
        ↓
    Leçons
        ↓
    Compétences
    """

    lessons = CurriculumLessonSerializer(
        many=True,
        read_only=True
    )

    class Meta:
        model = CurriculumModule

        fields = [
            "id",
            "level",
            "title",
            "description",
            "order",
            "duration_minutes",
            "is_required",
            "created_at",
            "lessons",
        ]


# =========================================================
# NIVEAU
# =========================================================

class CurriculumLevelSerializer(serializers.ModelSerializer):
    """
    Niveau complet du curriculum.

    Contient :
    - modules
    - leçons
    - compétences
    - livres
    """

    modules = CurriculumModuleSerializer(
        many=True,
        read_only=True
    )

    books = CurriculumBookSerializer(
        many=True,
        read_only=True
    )

    class Meta:
        model = CurriculumLevel

        fields = [
            "id",
            "level_number",
            "name",
            "description",
            "is_active",
            "created_at",
            "modules",
            "books",
        ]


# =========================================================
# PROGRESSION SUR LES COMPÉTENCES
# =========================================================

class StudentCurriculumProgressSerializer(serializers.ModelSerializer):

    student_name = serializers.CharField(
        source="student.full_name",
        read_only=True
    )

    competency_title = serializers.CharField(
        source="competency.title",
        read_only=True
    )

    class Meta:
        model = StudentCurriculumProgress
        fields = "__all__"


# =========================================================
# GROUPES
# =========================================================

class StudentGroupSerializer(serializers.ModelSerializer):

    class Meta:
        model = StudentGroup
        fields = "__all__"


class StudentGroupMembershipSerializer(serializers.ModelSerializer):

    student_name = serializers.CharField(
        source="student.full_name",
        read_only=True
    )

    group_name = serializers.CharField(
        source="group.name",
        read_only=True
    )

    class Meta:
        model = StudentGroupMembership
        fields = "__all__"


# =========================================================
# ÉVALUATION
# =========================================================

class StudentEvaluationSerializer(serializers.ModelSerializer):

    student_name = serializers.CharField(
        source="student.full_name",
        read_only=True
    )

    competency_title = serializers.CharField(
        source="competency.title",
        read_only=True
    )

    class Meta:
        model = StudentEvaluation
        fields = "__all__"


# =========================================================
# OBSERVATION
# =========================================================

class StudentObservationSerializer(serializers.ModelSerializer):

    student_name = serializers.CharField(
        source="student.full_name",
        read_only=True
    )

    teacher_name = serializers.CharField(
        source="teacher.username",
        read_only=True
    )

    class Meta:
        model = StudentObservation
        fields = "__all__"


# =========================================================
# VALIDATION DU NIVEAU
# =========================================================

class StudentLevelValidationSerializer(serializers.ModelSerializer):

    student_name = serializers.CharField(
        source="student.full_name",
        read_only=True
    )

    level_name = serializers.CharField(
        source="level.name",
        read_only=True
    )

    can_access_next_level = serializers.SerializerMethodField()

    next_level_name = serializers.SerializerMethodField()

    class Meta:
        model = StudentLevelValidation

        fields = [
            "id",
            "student",
            "student_name",
            "evaluated_by",
            "practical_score",
            "oral_score",
            "level",
            "level_name",
            "status",
            "score",
            "notes",
            "validated_at",
            "can_access_next_level",
            "next_level_name",
        ]

    def get_can_access_next_level(self, obj):

        if obj.status != "PASSED":
            return False

        return CurriculumLevel.objects.filter(
            level_number=obj.level.level_number + 1
        ).exists()

    def get_next_level_name(self, obj):

        next_level = CurriculumLevel.objects.filter(
            level_number=obj.level.level_number + 1
        ).first()

        return next_level.name if next_level else None


# =========================================================
# SPÉCIALISATIONS
# =========================================================

class CurriculumSpecializationSerializer(serializers.ModelSerializer):

    level_name = serializers.CharField(
        source="level.name",
        read_only=True
    )

    class Meta:
        model = CurriculumSpecialization

        fields = [
            "id",
            "level",
            "level_name",
            "name",
            "description",
            "is_active",
            "created_at",
        ]


class StudentSpecializationSerializer(serializers.ModelSerializer):

    student_name = serializers.CharField(
        source="student.full_name",
        read_only=True
    )

    specialization_name = serializers.CharField(
        source="specialization.get_name_display",
        read_only=True
    )

    class Meta:
        model = StudentSpecialization

        fields = [
            "id",
            "student",
            "student_name",
            "specialization",
            "specialization_name",
            "started_at",
            "is_active",
            "notes",
        ]


# =========================================================
# DARASA — LIST
# =========================================================

class DarasaListSerializer(serializers.ModelSerializer):

    teacher_name = serializers.CharField(
        source="teacher.username",
        read_only=True
    )

    student_name = serializers.CharField(
        source="student.full_name",
        read_only=True
    )

    session_type_display = serializers.CharField(
        source="get_session_type_display",
        read_only=True
    )

    surah_name = serializers.CharField(
        source="surah.name_fr",
        read_only=True
    )

    lesson_title = serializers.CharField(
        source="lesson.title",
        read_only=True
    )

    module_title = serializers.CharField(
        source="lesson.module.title",
        read_only=True
    )

    level_name = serializers.CharField(
        source="lesson.module.level.name",
        read_only=True
    )

    competency_title = serializers.CharField(
        source="competency.title",
        read_only=True
    )

    class Meta:
        model = DarasaSession

        fields = [
            "id",

            "teacher",
            "teacher_name",

            "student",
            "student_name",

            "session_type",
            "session_type_display",

            "lesson",
            "lesson_title",

            "competency",
            "competency_title",

            "module_title",
            "level_name",

            "surah",
            "surah_name",
            "verse_start",
            "verse_end",

            "date",
            "start_time",
            "end_time",

            "notes",
            "created_at",
        ]


# =========================================================
# DARASA — CREATE
# =========================================================
class DarasaCreateSerializer(serializers.ModelSerializer):

    teacher = serializers.PrimaryKeyRelatedField(
        read_only=True
    )

    class Meta:
        model = DarasaSession

        fields = [
            "teacher",
            "student",

            "session_type",

            "lesson",
            "competency",

            "surah",
            "verse_start",
            "verse_end",

            "date",
            "start_time",
            "end_time",

            "notes",
        ]

    def validate(self, attrs):

        session_type = attrs.get("session_type")
        lesson = attrs.get("lesson")
        competency = attrs.get("competency")

        surah = attrs.get("surah")
        verse_start = attrs.get("verse_start")
        verse_end = attrs.get("verse_end")

        # =================================================
        # CURRICULUM
        # =================================================

        if lesson:
            # Vérifier que la compétence appartient
            # bien à la leçon sélectionnée

            if competency and competency.lesson_id != lesson.id:
                raise serializers.ValidationError({
                    "competency": (
                        "Cette compétence n'appartient pas "
                        "à la leçon sélectionnée."
                    )
                })

        # =================================================
        # SÉANCE CORAN
        # =================================================

        if session_type == "QURAN":

            if not surah:
                raise serializers.ValidationError({
                    "surah": (
                        "La sourate est obligatoire "
                        "pour une séance de Coran."
                    )
                })

            if verse_start is None:
                raise serializers.ValidationError({
                    "verse_start": (
                        "Le verset de début est obligatoire."
                    )
                })

            if verse_end is None:
                raise serializers.ValidationError({
                    "verse_end": (
                        "Le verset de fin est obligatoire."
                    )
                })

            if verse_end < verse_start:
                raise serializers.ValidationError({
                    "verse_end": (
                        "Le verset de fin doit être supérieur "
                        "ou égal au verset de début."
                    )
                })

            if verse_start < 1:
                raise serializers.ValidationError({
                    "verse_start": (
                        "Le verset de début doit être supérieur à 0."
                    )
                })

        else:

            # Les autres types de séances
            # ne doivent pas avoir de données Coran.

            if surah or verse_start is not None or verse_end is not None:
                raise serializers.ValidationError({
                    "quran": (
                        "La sourate et les versets sont réservés "
                        "aux séances de Coran."
                    )
                })

        return attrs

    def create(self, validated_data):

        request = self.context.get("request")

        if not request or not request.user.is_authenticated:
            raise serializers.ValidationError(
                "Utilisateur non authentifié."
            )

        validated_data["teacher"] = request.user

        return DarasaSession.objects.create(
            **validated_data
        )
# =========================================================
# PROGRESSION SUR LES LEÇONS
# =========================================================

class StudentLessonProgressSerializer(serializers.ModelSerializer):
    """
    Progression d'un élève sur une leçon du curriculum.
    """

    student_name = serializers.CharField(
        source="student.full_name",
        read_only=True
    )

    lesson_title = serializers.CharField(
        source="lesson.title",
        read_only=True
    )

    module_title = serializers.CharField(
        source="lesson.module.title",
        read_only=True
    )

    level_name = serializers.CharField(
        source="lesson.module.level.name",
        read_only=True
    )

    class Meta:
        model = StudentLessonProgress

        fields = [
            "id",
            "student",
            "student_name",
            "lesson",
            "lesson_title",
            "module_title",
            "level_name",
            "status",
            "notes",
            "completed_at",
            "updated_at",
            "created_at",
        ]

        read_only_fields = [
            "updated_at",
            "created_at",
        ]