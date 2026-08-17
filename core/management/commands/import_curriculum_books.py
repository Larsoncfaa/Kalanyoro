from django.core.management.base import BaseCommand

from core.models import CurriculumLevel


class Command(BaseCommand):
    help = "Crée les 6 niveaux du curriculum Kalanyoro."

    LEVELS = [
        {
            "level_number": 1,
            "name": "Mécanique de la prière",
            "description": (
                "Pratique gestuelle de l'ablution et de la prière. "
                "Mémorisation phonétique d'Al-Fatihah et de cinq courtes sourates."
            ),
        },
        {
            "level_number": 2,
            "name": "Phonétique arabe & Consolidation",
            "description": (
                "Alphabétisation via Muʿallim al-Dīn, "
                "invocations d'ablution, Adhan et Iqamah."
            ),
        },
        {
            "level_number": 3,
            "name": "Juz 'Amma & Invocations",
            "description": (
                "Mémorisation et lecture de Juz 'Amma "
                "et apprentissage des invocations quotidiennes."
            ),
        },
        {
            "level_number": 4,
            "name": "Progression Coranique",
            "description": (
                "Mémorisation et lecture approfondie du Coran "
                "avec révision des acquis des niveaux précédents."
            ),
        },
        {
            "level_number": 5,
            "name": "Niveau Avancé Intégré",
            "description": (
                "Initiation au Fiqh de la prière, Sīrah, "
                "Tajwīd appliqué et étude des 40 Hadiths."
            ),
        },
        {
            "level_number": 6,
            "name": "Spécialisation",
            "description": (
                "Parcours personnalisé selon l'orientation de l'élève : "
                "Tajwīd, Hifz, Fiqh, Hadith, Tafsīr, Naḥw ou Sīrah."
            ),
        },
    ]

    def handle(self, *args, **options):

        self.stdout.write("")
        self.stdout.write("=" * 50)
        self.stdout.write(" CRÉATION DU CURRICULUM KALANYORO")
        self.stdout.write("=" * 50)

        for data in self.LEVELS:

            level, created = CurriculumLevel.objects.update_or_create(
                level_number=data["level_number"],
                defaults={
                    "name": data["name"],
                    "description": data["description"],
                    "is_active": True,
                },
            )

            if created:
                self.stdout.write(
                    self.style.SUCCESS(
                        f"✓ Niveau {level.level_number} créé : {level.name}"
                    )
                )
            else:
                self.stdout.write(
                    f"✓ Niveau {level.level_number} déjà existant : {level.name}"
                )

        self.stdout.write("")
        self.stdout.write(
            self.style.SUCCESS("✓ Curriculum Kalanyoro prêt.")
        )