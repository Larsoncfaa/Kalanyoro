from django.db import models
from django.contrib.auth.models import AbstractUser



# =========================================================
#  USER DU SYSTÈME (ADMIN + ENSEIGNANT)
# =========================================================
class User(AbstractUser):
    """
    Ce modèle représente les utilisateurs qui peuvent se connecter :
    - Admin (gestion globale)
    - Teacher ( mouallim)
    """

    # Types d'utilisateurs possibles
    ADMIN = "ADMIN"
    TEACHER = "TEACHER"

    ROLE_CHOICES = [
        (ADMIN, "Administrateur"),
        (TEACHER, "Enseignant"),
    ]

    # Numéro de téléphone (optionnel)
    phone = models.CharField(max_length=20, blank=True)

    # Rôle de l'utilisateur (important pour les permissions)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES)

    def __str__(self):
        return self.username


# =========================================================
#  APPRENANT DU CORAN (ÉLÈVE)
# =========================================================
class Student(models.Model):
    """
    Représente un apprenant du Coran.
    Il ne se connecte pas forcément dans la V1.
    """

    matricule = models.CharField(max_length=50, unique=True, blank=True)
    full_name = models.CharField(max_length=255)

    phone = models.CharField(max_length=20, blank=True)
    address = models.TextField(blank=True)

    birth_date = models.DateField(null=True, blank=True)

    # Date de création de l'élève dans le système
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        if not self.matricule:
            # On prend le dernier ID et on génère un matricule du type MATR-0001, MATR-0002, etc.
            last = Student.objects.order_by("id").last()
            next_id = (last.id + 1) if last else 1
            self.matricule = f"MATR-{next_id:04d}"
        super().save(*args, **kwargs)

    def __str__(self):
        return self.full_name


# =========================================================
#  SOURATE DU CORAN
# =========================================================
class Surah(models.Model):
    """
    Les 114 sourates du Coran.
    """

    REVELATION_CHOICES = [
        ("MECCAN", "Mecquoise"),
        ("MEDINAN", "Médinoise"),
    ]

    number = models.PositiveSmallIntegerField(unique=True)

    name_ar = models.CharField(max_length=100, null=True, blank=True)

    name_fr = models.CharField(max_length=100, null=True, blank=True)

    name_en = models.CharField(max_length=100, null=True, blank=True)

    revelation_type = models.CharField(
        max_length=20,
        choices=REVELATION_CHOICES,
        default="MECCAN"
    )

    revelation_order = models.PositiveSmallIntegerField(null=True, blank=True)

    total_verses = models.PositiveSmallIntegerField(null=True, blank=True)

    bismillah = models.BooleanField(default=True)

    class Meta:
        ordering = ["number"]

    def __str__(self):
        return f"{self.number} - {self.name_fr}"

# =========================================================
#  VERSET DU CORAN
# =========================================================

class Verse(models.Model):
    """
    Représente chaque verset du Coran.
    """

    surah = models.ForeignKey(
        Surah,
        on_delete=models.CASCADE,
        related_name="verses"
    )

    verse_number = models.PositiveSmallIntegerField()

    text_ar = models.TextField()

    text_fr = models.TextField(blank=True)

    text_en = models.TextField(blank=True)

    juz = models.PositiveSmallIntegerField()

    hizb = models.PositiveSmallIntegerField()

    page = models.PositiveSmallIntegerField()

    sajda = models.BooleanField(default=False)

    class Meta:
        ordering = ["surah", "verse_number"]
        constraints = [
            models.UniqueConstraint(
                fields=["surah", "verse_number"], 
                name="unique_surah_verse"
        )
    ]

    def __str__(self):
        return f"{self.surah.number}:{self.verse_number}"



class CurriculumLevel(models.Model):
    """Niveau du curriculum islamique de Kalanyoro."""

    level_number = models.PositiveSmallIntegerField(unique=True)
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["level_number"]

    def __str__(self):
        return f"Niveau {self.level_number} - {self.name}"

class CurriculumModule(models.Model):
    """Module pédagogique rattaché à un niveau."""

    level = models.ForeignKey(
        CurriculumLevel,
        on_delete=models.CASCADE,
        related_name="modules",
    )
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    order = models.PositiveSmallIntegerField(default=1)
    duration_minutes = models.PositiveSmallIntegerField(default=20)
    is_required = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["level", "order", "title"]
        constraints = [
            models.UniqueConstraint(fields=["level", "order"], name="unique_module_order_per_level")
        ]

    def __str__(self):
        return f"{self.level} / {self.title}"


class CurriculumLesson(models.Model):
    """Leçon pédagogique associée à un module du curriculum."""

    module = models.ForeignKey(
        CurriculumModule,
        on_delete=models.CASCADE,
        related_name="lessons",
    )
    objectives = models.TextField(blank=True)
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    order = models.PositiveSmallIntegerField(default=1)
    duration_minutes = models.PositiveSmallIntegerField(default=10)
    is_required = models.BooleanField(default=True)
    content = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["module", "order", "title"]
        constraints = [
            models.UniqueConstraint(fields=["module", "order"], name="unique_lesson_order_per_module")
        ]

    def __str__(self):
        return self.title




class CurriculumCompetency(models.Model):
    """Micro-compétence évaluée au sein d'un module."""

    lesson = models.ForeignKey(
        CurriculumLesson,
        on_delete=models.CASCADE,
        related_name="competencies",
    
        
        
    )
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    order = models.PositiveSmallIntegerField(default=1)
    validation_method = models.CharField(
        max_length=30,
        choices=[
            ("PRACTICAL", "Pratique"),
            ("ORAL", "Oral"),
            ("WRITTEN", "Écrit"),
            ("QUIZ", "Quiz"),
        ],
        default="PRACTICAL",
    )
    is_gate = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["lesson", "order", "title"]
        constraints = [
            models.UniqueConstraint(fields=["lesson", "order"], name="unique_competency_order_per_lesson")
        ]

    def __str__(self):
        return self.title


    

# =========================================================
#  SÉANCE DE DARS (COEUR DU SYSTÈME)
# =========================================================
class DarasaSession(models.Model):
    """
    Une séance pédagogique donnée par un enseignant à un élève.

    Une séance peut être :
    - Coran
    - Prière
    - Ablution
    - Tajwid
    - Hadith
    - Fiqh
    - Sira
    - Invocations
    - Arabe

    Elle peut être liée à une leçon du curriculum.
    """

    SESSION_TYPE_CHOICES = [
        ("QURAN", "Coran"),
        ("PRAYER", "Prière"),
        ("WUDU", "Ablution"),
        ("TAJWEED", "Tajwid"),
        ("HADITH", "Hadith"),
        ("FIQH", "Fiqh"),
        ("SIRAH", "Sira"),
        ("DUA", "Invocations"),
        ("ARABIC", "Arabe"),
    ]

    # =====================================================
    # ACTEURS
    # =====================================================

    teacher = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="sessions_given",
    )

    student = models.ForeignKey(
        Student,
        on_delete=models.CASCADE,
        related_name="sessions_received",
    )

    competency = models.ForeignKey(
        CurriculumCompetency,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="darasa_sessions",
    )

    # =====================================================
    # TYPE DE SÉANCE
    # =====================================================

    session_type = models.CharField(
        max_length=20,
        choices=SESSION_TYPE_CHOICES,
        default="QURAN",
    )

    # =====================================================
    # CURRICULUM
    # =====================================================

    lesson = models.ForeignKey(
        CurriculumLesson,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="darasa_sessions",
    )

    # =====================================================
    # CORAN
    # =====================================================

    surah = models.ForeignKey(
        Surah,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="darasa_sessions",
    )

    verse_start = models.PositiveIntegerField(
        null=True,
        blank=True,
    )

    verse_end = models.PositiveIntegerField(
        null=True,
        blank=True,
    )

    

    # =====================================================
    # DATE / HEURE
    # =====================================================

    date = models.DateField()

    start_time = models.TimeField()

    end_time = models.TimeField(
        null=True,
        blank=True,
    )

    # =====================================================
    # OBSERVATIONS
    # =====================================================

    notes = models.TextField(
        blank=True
    )

    # =====================================================
    # SYSTÈME
    # =====================================================

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    class Meta:
        ordering = ["-date", "-start_time"]

    def __str__(self):
        return (
            f"{self.teacher} → "
            f"{self.student} → "
            f"{self.get_session_type_display()}"
        )
# =========================================================
#  PROGRESSION DE L'APPRENANT
# =========================================================
class StudentProgress(models.Model):
    """
    Permet de connaître rapidement où en est l'élève
    sans recalculer tout l'historique.
    """

    student = models.OneToOneField(Student, on_delete=models.CASCADE)

    # Dernière sourate étudiée
    current_surah = models.ForeignKey(
        Surah,
        on_delete=models.SET_NULL,
        null=True
    )

    # Dernier verset atteint
    current_verse = models.IntegerField(default=1)

    # Nombre total de séances suivies
    total_sessions = models.IntegerField(default=0)

    # Dernière mise à jour
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Progression de {self.student.full_name}"







class StudentGroup(models.Model):
    """Groupe de travail pour organiser les élèves par niveau ou classe."""

    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    level = models.ForeignKey(CurriculumLevel, on_delete=models.SET_NULL, null=True, blank=True, related_name="groups")
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["name"]

    def __str__(self):
        return self.name


class StudentGroupMembership(models.Model):
    """Association d'un élève à un groupe."""

    group = models.ForeignKey(StudentGroup, on_delete=models.CASCADE, related_name="memberships")
    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name="group_memberships")
    joined_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=["group", "student"], name="unique_group_student_membership")
        ]

    def __str__(self):
        return f"{self.student.full_name} → {self.group.name}"


class StudentEvaluation(models.Model):
    """Évaluation d'une compétence pour un élève."""

    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name="evaluations")
    competency = models.ForeignKey(CurriculumCompetency, on_delete=models.CASCADE, related_name="evaluations")
    score = models.PositiveSmallIntegerField(default=0)
    status = models.CharField(max_length=20, choices=[("PASSED", "Validé"), ("FAILED", "Non validé"), ("PENDING", "En attente")], default="PENDING")
    notes = models.TextField(blank=True)
    evaluated_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-evaluated_at"]

    def __str__(self):
        return f"{self.student.full_name} - {self.competency.title}"


class StudentObservation(models.Model):
    """Observation pédagogique ajoutée par un enseignant."""

    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name="observations")
    teacher = models.ForeignKey(User, on_delete=models.CASCADE, related_name="observations")
    title = models.CharField(max_length=255)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.student.full_name} - {self.title}"


class StudentCurriculumProgress(models.Model):
    """Suivi de progression d'un élève sur les compétences du curriculum."""

    STATUS_CHOICES = [
        ("NOT_STARTED", "Non démarré"),
        ("IN_PROGRESS", "En cours"),
        ("COMPLETED", "Terminé"),
        ("REVIEW", "À revoir"),
    ]

    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name="curriculum_progress")
    competency = models.ForeignKey(CurriculumCompetency, on_delete=models.CASCADE, related_name="student_progress")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="NOT_STARTED")
    score = models.PositiveSmallIntegerField(default=0)
    notes = models.TextField(blank=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-updated_at"]
        constraints = [
            models.UniqueConstraint(fields=["student", "competency"], name="unique_student_competency_progress")
        ]

    def __str__(self):
        return f"{self.student.full_name} → {self.competency.title}"


class StudentLevelValidation(models.Model):
    """Validation d'un niveau par un élève après évaluation pédagogique."""

    STATUS_CHOICES = [
        ("PENDING", "En attente"),
        ("PASSED", "Validé"),
        ("FAILED", "Échoué"),
    ]
    evaluated_by = models.ForeignKey(
    User,
    on_delete=models.SET_NULL,
    null=True,
    blank=True,
    related_name="level_validations_given",
)
    practical_score = models.PositiveSmallIntegerField(default=0)

    oral_score = models.PositiveSmallIntegerField(default=0)
    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name="level_validations")
    level = models.ForeignKey(CurriculumLevel, on_delete=models.CASCADE, related_name="student_validations")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="PENDING")
    score = models.PositiveSmallIntegerField(default=0)
    notes = models.TextField(blank=True)
    validated_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-validated_at"]
        constraints = [
            models.UniqueConstraint(fields=["student", "level"], name="unique_student_level_validation")
        ]

    def __str__(self):
        return f"{self.student.full_name} - {self.level.name}"


class StudentLessonProgress(models.Model):
    """Progression d'un élève sur une leçon."""

    STATUS_CHOICES = [
        ("NOT_STARTED", "Non démarrée"),
        ("IN_PROGRESS", "En cours"),
        ("COMPLETED", "Terminée"),
        ("REVIEW", "À revoir"),
    ]

    student = models.ForeignKey(
        Student,
        on_delete=models.CASCADE,
        related_name="lesson_progress",
    )

    lesson = models.ForeignKey(
        CurriculumLesson,
        on_delete=models.CASCADE,
        related_name="student_progress",
    )

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="NOT_STARTED",
    )

    notes = models.TextField(blank=True)

    completed_at = models.DateTimeField(
        null=True,
        blank=True,
    )

    updated_at = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["student", "lesson"],
                name="unique_student_lesson_progress",
            )
        ]

    def __str__(self):
        return f"{self.student.full_name} → {self.lesson.title}"

class CurriculumSpecialization(models.Model):
    """Spécialisation proposée au niveau 6."""

    SPECIALIZATION_CHOICES = [
        ("TAJWEED", "Tajwid"),
        ("HIFZ", "Hifz"),
        ("FIQH", "Fiqh"),
        ("HADITH", "Hadith"),
        ("TAFSIR", "Tafsir"),
        ("NAHW", "Nahw"),
        ("SIRAH", "Sira"),
    ]

    level = models.ForeignKey(
        CurriculumLevel,
        on_delete=models.CASCADE,
        related_name="specializations",
    )

    name = models.CharField(
        max_length=30,
        choices=SPECIALIZATION_CHOICES,
    )

    description = models.TextField(blank=True)

    is_active = models.BooleanField(default=True)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.level.name} - {self.get_name_display()}"

class StudentSpecialization(models.Model):
    """Spécialisation choisie par un élève."""

    student = models.ForeignKey(
        Student,
        on_delete=models.CASCADE,
        related_name="specializations",
    )

    specialization = models.ForeignKey(
        CurriculumSpecialization,
        on_delete=models.CASCADE,
        related_name="students",
    )

    started_at = models.DateTimeField(auto_now_add=True)

    is_active = models.BooleanField(default=True)

    notes = models.TextField(blank=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["student", "specialization"],
                name="unique_student_specialization",
            )
        ]

    def __str__(self):
        return (
            f"{self.student.full_name} → "
            f"{self.specialization.get_name_display()}"
        )

class CurriculumBook(models.Model):
    """Livre de référence utilisé dans le curriculum."""

    title = models.CharField(max_length=255)

    author = models.CharField(
        max_length=255,
        blank=True
    )

    description = models.TextField(
        blank=True
    )

    # Niveau principal auquel le livre est rattaché
    level = models.ForeignKey(
        CurriculumLevel,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="books"
    )

    language = models.CharField(
        max_length=50,
        default="Arabe"
    )

    is_active = models.BooleanField(
        default=True
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    class Meta:
        ordering = ["level", "title"]

    def __str__(self):
        return self.title

class CurriculumBookSection(models.Model):
    """Chapitre ou section d'un livre."""

    book = models.ForeignKey(
        CurriculumBook,
        on_delete=models.CASCADE,
        related_name="sections"
    )

    title = models.CharField(
        max_length=255
    )

    description = models.TextField(
        blank=True
    )

    order = models.PositiveSmallIntegerField(
        default=1
    )

    class Meta:
        ordering = ["book", "order"]

        constraints = [
            models.UniqueConstraint(
                fields=["book", "order"],
                name="unique_book_section_order"
            )
        ]

    def __str__(self):
        return f"{self.book.title} - {self.title}"

class CurriculumBookContent(models.Model):
    """Contenu pédagogique d'une section de livre."""

    CONTENT_TYPE_CHOICES = [
        ("TEXT", "Texte"),
        ("EXERCISE", "Exercice"),
        ("RULE", "Règle"),
        ("EXAMPLE", "Exemple"),
        ("MEMORIZATION", "Mémorisation"),
        ("PRACTICE", "Pratique"),
    ]

    section = models.ForeignKey(
        CurriculumBookSection,
        on_delete=models.CASCADE,
        related_name="contents"
    )

    title = models.CharField(
        max_length=255,
        blank=True
    )

    content_type = models.CharField(
        max_length=20,
        choices=CONTENT_TYPE_CHOICES,
        default="TEXT"
    )

    content = models.TextField()

    order = models.PositiveIntegerField(
        default=1
    )

    is_required = models.BooleanField(
        default=True
    )

    class Meta:
        ordering = ["section", "order"]

        constraints = [
            models.UniqueConstraint(
                fields=["section", "order"],
                name="unique_book_content_order"
            )
        ]

    def __str__(self):
        return self.title or f"Contenu {self.order}"

class LessonBookReference(models.Model):
    """Indique quelle partie d'un livre est utilisée dans une leçon."""

    lesson = models.ForeignKey(
        CurriculumLesson,
        on_delete=models.CASCADE,
        related_name="book_references"
    )

    book = models.ForeignKey(
        CurriculumBook,
        on_delete=models.CASCADE,
        related_name="lesson_references"
    )

    section_start = models.ForeignKey(
        CurriculumBookSection,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="references_starting_here"
    )

    instructions = models.TextField(
        blank=True
    )

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["lesson", "book"],
                name="unique_lesson_book_reference"
            )
        ]
