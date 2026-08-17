from django.core.management.base import BaseCommand
from core.models import (
    CurriculumLevel,
    CurriculumModule,
    CurriculumLesson,
    CurriculumCompetency,
    CurriculumSpecialization,
)


class Command(BaseCommand):
    help = "Importe la structure pédagogique complète du curriculum Kalanyoro."

    CURRICULUM = {
        1: {
            "modules": [
                {
                    "title": "Ablution (Wudu)",
                    "description": "Apprentissage pratique des gestes essentiels de l'ablution.",
                    "duration": 120,
                    "lessons": [
                        {
                            "title": "Découverte de l'ablution",
                            "objectives": "Identifier et reproduire les principales étapes de l'ablution.",
                            "duration": 15,
                            "competencies": [
                                ("Identifier les étapes de l'ablution", "PRACTICAL"),
                                ("Réaliser correctement les gestes", "PRACTICAL"),
                            ],
                        },
                        {
                            "title": "Pratique complète de l'ablution",
                            "objectives": "Réaliser l'ablution dans l'ordre correct.",
                            "duration": 20,
                            "competencies": [
                                ("Réaliser l'ablution sans assistance", "PRACTICAL"),
                            ],
                        },
                    ],
                },
                {
                    "title": "Mécanique de la prière",
                    "description": "Apprentissage pratique des mouvements fondamentaux de la prière.",
                    "duration": 180,
                    "lessons": [
                        {
                            "title": "Positions de la prière",
                            "objectives": "Reconnaître et reproduire les différentes positions.",
                            "duration": 20,
                            "competencies": [
                                ("Reproduire correctement les positions", "PRACTICAL"),
                                ("Respecter l'ordre des mouvements", "PRACTICAL"),
                            ],
                        },
                        {
                            "title": "Enchaînement d'une prière",
                            "objectives": "Effectuer les mouvements dans leur ordre.",
                            "duration": 20,
                            "competencies": [
                                ("Effectuer une séquence complète", "PRACTICAL"),
                            ],
                        },
                    ],
                },
                {
                    "title": "Mémorisation coranique initiale",
                    "description": "Mémorisation phonétique d'Al-Fatihah et de cinq courtes sourates.",
                    "duration": 240,
                    "lessons": [
                        {
                            "title": "Al-Fatihah",
                            "objectives": "Mémoriser et réciter Al-Fatihah.",
                            "duration": 30,
                            "competencies": [
                                ("Réciter Al-Fatihah de mémoire", "ORAL"),
                            ],
                        },
                        {
                            "title": "Al-Ikhlas",
                            "objectives": "Mémoriser et réciter Al-Ikhlas.",
                            "duration": 20,
                            "competencies": [
                                ("Réciter Al-Ikhlas de mémoire", "ORAL"),
                            ],
                        },
                        {
                            "title": "An-Nas",
                            "objectives": "Mémoriser et réciter An-Nas.",
                            "duration": 20,
                            "competencies": [
                                ("Réciter An-Nas de mémoire", "ORAL"),
                            ],
                        },
                        {
                            "title": "Al-Falaq",
                            "objectives": "Mémoriser et réciter Al-Falaq.",
                            "duration": 20,
                            "competencies": [
                                ("Réciter Al-Falaq de mémoire", "ORAL"),
                            ],
                        },
                        {
                            "title": "Al-Kawthar",
                            "objectives": "Mémoriser et réciter Al-Kawthar.",
                            "duration": 20,
                            "competencies": [
                                ("Réciter Al-Kawthar de mémoire", "ORAL"),
                            ],
                        },
                        {
                            "title": "Al-Asr",
                            "objectives": "Mémoriser et réciter Al-Asr.",
                            "duration": 20,
                            "competencies": [
                                ("Réciter Al-Asr de mémoire", "ORAL"),
                            ],
                        },
                    ],
                },
                {
                    "title": "Validation du niveau 1",
                    "description": "Évaluation pratique et orale obligatoire.",
                    "duration": 30,
                    "lessons": [
                        {
                            "title": "Évaluation pratique et orale",
                            "objectives": "Valider les acquis fondamentaux du niveau 1.",
                            "duration": 30,
                            "gate": True,
                            "competencies": [
                                ("Réaliser correctement l'ablution", "PRACTICAL"),
                                ("Effectuer les gestes fondamentaux de la prière", "PRACTICAL"),
                                ("Réciter Al-Fatihah", "ORAL"),
                                ("Réciter les cinq sourates", "ORAL"),
                            ],
                        }
                    ],
                },
            ],
        },

        2: {
            "modules": [
                {
                    "title": "Phonétique arabe",
                    "description": "Alphabétisation progressive à partir de Muʿallim al-Dīn.",
                    "duration": 240,
                    "lessons": [
                        {
                            "title": "Alphabet arabe",
                            "objectives": "Reconnaître les lettres arabes.",
                            "duration": 20,
                            "competencies": [
                                ("Reconnaître les lettres arabes", "ORAL"),
                                ("Prononcer correctement les lettres", "ORAL"),
                            ],
                        },
                        {
                            "title": "Lecture progressive",
                            "objectives": "Lire progressivement les éléments étudiés dans Muʿallim al-Dīn.",
                            "duration": 20,
                            "competencies": [
                                ("Lire les éléments étudiés", "ORAL"),
                            ],
                        },
                    ],
                },
                {
                    "title": "Invocations de l'ablution",
                    "description": "Apprentissage des invocations liées à l'ablution.",
                    "duration": 120,
                    "lessons": [
                        {
                            "title": "Invocations avant et après l'ablution",
                            "objectives": "Mémoriser et réciter les invocations prévues.",
                            "duration": 20,
                            "competencies": [
                                ("Réciter les invocations correctement", "ORAL"),
                            ],
                        },
                    ],
                },
                {
                    "title": "Adhan et Iqamah",
                    "description": "Apprentissage de l'appel à la prière.",
                    "duration": 120,
                    "lessons": [
                        {
                            "title": "Adhan",
                            "objectives": "Mémoriser et réciter l'Adhan.",
                            "duration": 20,
                            "competencies": [
                                ("Réciter l'Adhan", "ORAL"),
                            ],
                        },
                        {
                            "title": "Iqamah",
                            "objectives": "Mémoriser et réciter l'Iqamah.",
                            "duration": 20,
                            "competencies": [
                                ("Réciter l'Iqamah", "ORAL"),
                            ],
                        },
                    ],
                },
                {
                    "title": "Compréhension des sourates du niveau 1",
                    "description": "Explication des sourates étudiées dans la langue locale.",
                    "duration": 180,
                    "lessons": [
                        {
                            "title": "Comprendre le sens général des sourates",
                            "objectives": "Comprendre les principaux messages des sourates.",
                            "duration": 30,
                            "competencies": [
                                ("Expliquer le sens général d'une sourate", "ORAL"),
                            ],
                        }
                    ],
                },
                {
                    "title": "Validation du niveau 2",
                    "description": "Validation orale et pratique des acquis.",
                    "duration": 30,
                    "lessons": [
                        {
                            "title": "Évaluation du niveau 2",
                            "objectives": "Valider les compétences du niveau 2.",
                            "duration": 30,
                            "gate": True,
                            "competencies": [
                                ("Lire les éléments étudiés", "ORAL"),
                                ("Réciter les invocations", "ORAL"),
                                ("Réciter Adhan et Iqamah", "ORAL"),
                            ],
                        }
                    ],
                },
            ],
        },

        3: {
            "modules": [
                {
                    "title": "Juz Amma",
                    "description": "Lecture et mémorisation progressive des sourates de Juz Amma.",
                    "duration": 360,
                    "lessons": [
                        {
                            "title": "An-Nas à Al-A'la",
                            "objectives": "Mémoriser et lire progressivement les sourates concernées.",
                            "duration": 30,
                            "competencies": [
                                ("Lire les sourates étudiées", "ORAL"),
                                ("Réciter les sourates mémorisées", "ORAL"),
                            ],
                        }
                    ],
                },
                {
                    "title": "Invocations quotidiennes",
                    "description": "Apprentissage des 25 invocations quotidiennes clés issues de Ḥiṣn al-Muslim.",
                    "duration": 300,
                    "lessons": [
                        {
                            "title": "Invocations 1 à 10",
                            "objectives": "Mémoriser les dix premières invocations.",
                            "duration": 30,
                            "competencies": [
                                ("Réciter les invocations 1 à 10", "ORAL"),
                            ],
                        },
                        {
                            "title": "Invocations 11 à 20",
                            "objectives": "Mémoriser les invocations suivantes.",
                            "duration": 30,
                            "competencies": [
                                ("Réciter les invocations 11 à 20", "ORAL"),
                            ],
                        },
                        {
                            "title": "Invocations 21 à 25",
                            "objectives": "Finaliser la mémorisation des 25 invocations.",
                            "duration": 30,
                            "competencies": [
                                ("Réciter les invocations 21 à 25", "ORAL"),
                            ],
                        },
                    ],
                },
                {
                    "title": "Validation du niveau 3",
                    "description": "Validation de la mémorisation et des invocations.",
                    "duration": 40,
                    "lessons": [
                        {
                            "title": "Évaluation du niveau 3",
                            "objectives": "Valider les acquis du niveau 3.",
                            "duration": 40,
                            "gate": True,
                            "competencies": [
                                ("Réciter les sourates demandées", "ORAL"),
                                ("Réciter les 25 invocations", "ORAL"),
                            ],
                        }
                    ],
                },
            ],
        },

        4: {
            "modules": [
                {
                    "title": "Progression coranique",
                    "description": "Mémorisation et lecture approfondie du Coran.",
                    "duration": 600,
                    "lessons": [
                        {
                            "title": "Lecture et mémorisation",
                            "objectives": "Poursuivre la mémorisation et améliorer la lecture.",
                            "duration": 30,
                            "competencies": [
                                ("Lire correctement les passages étudiés", "ORAL"),
                                ("Mémoriser les passages prévus", "ORAL"),
                            ],
                        },
                    ],
                },
                {
                    "title": "Révision des acquis",
                    "description": "Révision intégrée des acquis des niveaux 1 à 3.",
                    "duration": 240,
                    "lessons": [
                        {
                            "title": "Révision générale",
                            "objectives": "Consolider les compétences précédemment acquises.",
                            "duration": 30,
                            "competencies": [
                                ("Réciter les sourates déjà mémorisées", "ORAL"),
                                ("Réaliser correctement les pratiques étudiées", "PRACTICAL"),
                            ],
                        },
                    ],
                },
                {
                    "title": "Validation du niveau 4",
                    "description": "Évaluation globale du niveau 4.",
                    "duration": 40,
                    "lessons": [
                        {
                            "title": "Évaluation du niveau 4",
                            "objectives": "Valider la progression coranique et les acquis antérieurs.",
                            "duration": 40,
                            "gate": True,
                            "competencies": [
                                ("Lire les passages demandés", "ORAL"),
                                ("Réciter les passages mémorisés", "ORAL"),
                                ("Démontrer les acquis précédents", "PRACTICAL"),
                            ],
                        }
                    ],
                },
            ],
        },

        5: {
            "modules": [
                {
                    "title": "Fiqh de la prière",
                    "description": "Introduction aux règles fondamentales de la prière.",
                    "duration": 300,
                    "lessons": [
                        {
                            "title": "Fondements de la prière",
                            "objectives": "Comprendre les règles fondamentales de la prière.",
                            "duration": 30,
                            "competencies": [
                                ("Identifier les règles fondamentales", "ORAL"),
                                ("Appliquer les règles étudiées", "PRACTICAL"),
                            ],
                        },
                    ],
                },
                {
                    "title": "Sīrah",
                    "description": "Étude de la vie du Prophète Muhammad ﷺ.",
                    "duration": 300,
                    "lessons": [
                        {
                            "title": "Introduction à la Sīrah",
                            "objectives": "Connaître les principaux événements de la vie du Prophète ﷺ.",
                            "duration": 30,
                            "competencies": [
                                ("Identifier les principaux événements", "ORAL"),
                            ],
                        },
                    ],
                },
                {
                    "title": "Tajwīd appliqué",
                    "description": "Apprentissage et application des règles de Tajwīd.",
                    "duration": 360,
                    "lessons": [
                        {
                            "title": "Règles fondamentales du Tajwīd",
                            "objectives": "Identifier et appliquer les règles étudiées.",
                            "duration": 30,
                            "competencies": [
                                ("Identifier les règles de Tajwīd", "ORAL"),
                                ("Appliquer les règles pendant la récitation", "PRACTICAL"),
                            ],
                        },
                    ],
                },
                {
                    "title": "Les 40 Hadiths",
                    "description": "Étude progressive des 40 Hadiths.",
                    "duration": 400,
                    "lessons": [
                        {
                            "title": "Étude des Hadiths",
                            "objectives": "Mémoriser et comprendre progressivement les hadiths.",
                            "duration": 30,
                            "competencies": [
                                ("Réciter les hadiths étudiés", "ORAL"),
                                ("Expliquer leur enseignement principal", "ORAL"),
                            ],
                        },
                    ],
                },
                {
                    "title": "Validation du niveau 5",
                    "description": "Évaluation pratique et orale obligatoire.",
                    "duration": 60,
                    "lessons": [
                        {
                            "title": "Évaluation finale du niveau 5",
                            "objectives": "Valider les connaissances et compétences intégrées.",
                            "duration": 60,
                            "gate": True,
                            "competencies": [
                                ("Démontrer les règles de Fiqh étudiées", "PRACTICAL"),
                                ("Appliquer les règles de Tajwīd", "PRACTICAL"),
                                ("Répondre aux questions de Sīrah", "ORAL"),
                                ("Réciter et expliquer les Hadiths étudiés", "ORAL"),
                            ],
                        }
                    ],
                },
            ],
        },

        6: {
            "modules": [
                {
                    "title": "Parcours de spécialisation",
                    "description": "Orientation personnalisée selon le profil et les objectifs de l'élève.",
                    "duration": 600,
                    "lessons": [
                        {
                            "title": "Choix et démarrage de la spécialisation",
                            "objectives": "Identifier l'orientation et commencer le parcours spécialisé.",
                            "duration": 30,
                            "competencies": [
                                ("Identifier son domaine de spécialisation", "ORAL"),
                            ],
                        },
                    ],
                },
            ],
        },
    }

    SPECIALIZATIONS = [
        ("TAJWEED", "Tajwid", "Approfondissement de la récitation et des règles de Tajwid."),
        ("HIFZ", "Hifz", "Parcours spécialisé dans la mémorisation du Coran."),
        ("FIQH", "Fiqh", "Approfondissement de la jurisprudence islamique."),
        ("HADITH", "Hadith", "Étude approfondie des hadiths."),
        ("TAFSIR", "Tafsir", "Étude et compréhension des commentaires du Coran."),
        ("NAHW", "Nahw", "Introduction et approfondissement de la grammaire arabe."),
        ("SIRAH", "Sira", "Étude approfondie de la vie du Prophète ﷺ."),
    ]

    def handle(self, *args, **options):

        self.stdout.write("")
        self.stdout.write("=" * 60)
        self.stdout.write(" IMPORT DE LA STRUCTURE DU CURRICULUM KALANYORO")
        self.stdout.write("=" * 60)

        modules_count = 0
        lessons_count = 0
        competencies_count = 0
        specializations_count = 0

        for level_number, level_data in self.CURRICULUM.items():

            try:
                level = CurriculumLevel.objects.get(
                    level_number=level_number
                )
            except CurriculumLevel.DoesNotExist:
                self.stdout.write(
                    self.style.ERROR(
                        f"✗ Niveau {level_number} introuvable."
                    )
                )
                continue

            self.stdout.write("")
            self.stdout.write(
                self.style.SUCCESS(
                    f"→ Niveau {level_number} : {level.name}"
                )
            )

            for module_index, module_data in enumerate(
                level_data["modules"],
                start=1,
            ):

                module, created = CurriculumModule.objects.update_or_create(
                    level=level,
                    order=module_index,
                    defaults={
                        "title": module_data["title"],
                        "description": module_data.get("description", ""),
                        "duration_minutes": module_data.get(
                            "duration",
                            20
                        ),
                        "is_required": True,
                    },
                )

                modules_count += 1

                self.stdout.write(
                    f"   {'✓ Créé' if created else '✓ Mis à jour'} "
                    f"Module {module_index} : {module.title}"
                )

                for lesson_index, lesson_data in enumerate(
                    module_data["lessons"],
                    start=1,
                ):

                    lesson, lesson_created = (
                        CurriculumLesson.objects.update_or_create(
                            module=module,
                            order=lesson_index,
                            defaults={
                                "title": lesson_data["title"],
                                "objectives": lesson_data.get(
                                    "objectives",
                                    "",
                                ),
                                "description": "",
                                "duration_minutes": lesson_data.get(
                                    "duration",
                                    10,
                                ),
                                "is_required": True,
                                "content": "",
                            },
                        )
                    )

                    lessons_count += 1

                    self.stdout.write(
                        f"      {'✓ Créée' if lesson_created else '✓ Mise à jour'} "
                        f"Leçon {lesson_index} : {lesson.title}"
                    )

                    for competency_index, competency_data in enumerate(
                        lesson_data.get("competencies", []),
                        start=1,
                    ):

                        title, validation_method = competency_data

                        competency, competency_created = (
                            CurriculumCompetency.objects.update_or_create(
                                lesson=lesson,
                                order=competency_index,
                                defaults={
                                    "title": title,
                                    "description": "",
                                    "validation_method": validation_method,
                                    "is_gate": lesson_data.get(
                                        "gate",
                                        False,
                                    ),
                                },
                            )
                        )

                        competencies_count += 1

            # Niveau 6 : spécialisations
            if level_number == 6:

                for code, name, description in self.SPECIALIZATIONS:

                    specialization, created = (
                        CurriculumSpecialization.objects.update_or_create(
                            level=level,
                            name=code,
                            defaults={
                                "description": description,
                                "is_active": True,
                            },
                        )
                    )

                    specializations_count += 1

                    self.stdout.write(
                        f"   ✓ Spécialisation : {name}"
                    )

        self.stdout.write("")
        self.stdout.write("=" * 60)
        self.stdout.write(" IMPORT TERMINÉ")
        self.stdout.write("=" * 60)

        self.stdout.write(
            f"Modules : {modules_count}"
        )

        self.stdout.write(
            f"Leçons : {lessons_count}"
        )

        self.stdout.write(
            f"Compétences : {competencies_count}"
        )

        self.stdout.write(
            f"Spécialisations : {specializations_count}"
        )

        self.stdout.write("")

        self.stdout.write(
            self.style.SUCCESS(
                "✓ Structure du curriculum Kalanyoro prête."
            )
        )