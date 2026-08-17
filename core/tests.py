from datetime import date

from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from .models import (
    Student,
    Surah,
    StudentProgress,
    CurriculumLevel,
    CurriculumModule,
    CurriculumCompetency,
    StudentCurriculumProgress,
    CurriculumLesson,
)


User = get_user_model()


class CoreApiTests(APITestCase):
    def setUp(self):
        self.admin = User.objects.create_user(
            username="admin",
            password="adminpass",
            role=User.ADMIN,
            phone="123456789",
        )

        self.teacher = User.objects.create_user(
            username="teacher",
            password="teachpass",
            role=User.TEACHER,
            phone="987654321",
        )

        self.student = Student.objects.create(
            matricule="STU001",
            full_name="Ali Traoré",
            phone="770000000",
            address="Bamako",
            birth_date=date(2010, 1, 1),
        )

        self.surah = Surah.objects.create(
            number=1,
            name_ar="الفاتحة",
            name_fr="Al-Fatiha",
            total_verses=7,
        )

        self.level = CurriculumLevel.objects.create(
            level_number=1,
            name="Niveau 1 : Mécanique de la prière",
            description="Apprentissage pratique de l'ablution et de la prière.",
            is_active=True,
        )

        self.next_level = CurriculumLevel.objects.create(
            level_number=2,
            name="Niveau 2 : Lecture et mémorisation",
            description="Approfondissement de la lecture et de la mémorisation.",
            is_active=True,
        )

        self.module = CurriculumModule.objects.create(
            level=self.level,
            title="Ablution et prière",
            description="Les bases pratiques de l'ablution et de la prière.",
            order=1,
            duration_minutes=20,
            is_required=True,
        )

        self.competency = CurriculumCompetency.objects.create(
            module=self.module,
            title="Faire l'ablution correctement",
            description="Réaliser l'ablution en suivant la méthode correcte.",
            order=1,
            validation_method="PRACTICAL",
            is_gate=True,
        )

    def authenticate(self, username: str, password: str) -> str:
        response = self.client.post(
            reverse("login"),
            {"username": username, "password": password},
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        return response.data["access"]

    def test_login_returns_token_and_user_data(self):
        token = self.authenticate("admin", "adminpass")
        self.assertIsInstance(token, str)

    def test_surah_list_requires_authentication(self):
        response = self.client.get("/api/surahs/")
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

        access = self.authenticate("admin", "adminpass")
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {access}")
        response = self.client.get("/api/surahs/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["count"], 1)
        self.assertEqual(response.data["results"][0]["name_fr"], "Al-Fatiha")

    def test_student_crud_and_search(self):
        access = self.authenticate("admin", "adminpass")
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {access}")

        create_response = self.client.post(
            "/api/students/",
            {
                "matricule": "STU002",
                "full_name": "Fatoumata Diallo",
                "phone": "770111222",
                "address": "Sikasso",
                "birth_date": "2012-03-05",
            },
            format="json",
        )
        self.assertEqual(create_response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(create_response.data["matricule"], "STU002")

        search_response = self.client.get("/api/students/?search=fatoumata")
        self.assertEqual(search_response.status_code, status.HTTP_200_OK)
        self.assertEqual(search_response.data["count"], 1)
        self.assertEqual(search_response.data["results"][0]["full_name"], "Fatoumata Diallo")

    def test_darasa_create_updates_progress(self):
        access = self.authenticate("teacher", "teachpass")
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {access}")

        response = self.client.post(
            "/api/darasa/",
            {
                "student": self.student.id,
                "surah": self.surah.id,
                "verse_start": 1,
                "verse_end": 3,
                "date": date.today().isoformat(),
                "start_time": "08:00:00",
                "end_time": "09:00:00",
                "notes": "Première séance",
            },
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["teacher"], self.teacher.id)
        self.assertEqual(response.data["student"], self.student.id)

        progress = StudentProgress.objects.get(student=self.student)
        self.assertEqual(progress.total_sessions, 1)
        self.assertEqual(progress.current_surah, self.surah)
        self.assertEqual(progress.current_verse, 3)

    def test_user_list_requires_admin(self):
        access_teacher = self.authenticate("teacher", "teachpass")
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {access_teacher}")
        response = self.client.get("/api/users/")
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

        access_admin = self.authenticate("admin", "adminpass")
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {access_admin}")
        response = self.client.get("/api/users/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(response.data["count"], 2)

    def test_curriculum_structure_and_progress_are_available(self):
        access = self.authenticate("admin", "adminpass")
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {access}")

        levels_response = self.client.get("/api/curriculum-levels/")
        self.assertEqual(levels_response.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(levels_response.data["count"], 1)
        self.assertTrue(any(item["id"] == self.level.id for item in levels_response.data["results"]))

        modules_response = self.client.get(f"/api/curriculum-modules/?level={self.level.id}")
        self.assertEqual(modules_response.status_code, status.HTTP_200_OK)
        self.assertEqual(modules_response.data["count"], 1)

        competencies_response = self.client.get(f"/api/curriculum-competencies/?module={self.module.id}")
        self.assertEqual(competencies_response.status_code, status.HTTP_200_OK)
        self.assertEqual(competencies_response.data["count"], 1)

        lesson = CurriculumLesson.objects.create(
            module=self.module,
            title="La méthode de l'ablution",
            description="Apprendre l'ablution pas à pas.",
            order=1,
            duration_minutes=10,
            is_required=True,
        )

        lessons_response = self.client.get(f"/api/curriculum-lessons/?module={self.module.id}")
        self.assertEqual(lessons_response.status_code, status.HTTP_200_OK)
        self.assertEqual(lessons_response.data["count"], 1)
        self.assertEqual(lessons_response.data["results"][0]["title"], lesson.title)

        progress_response = self.client.post(
            "/api/curriculum-progress/",
            {
                "student": self.student.id,
                "competency": self.competency.id,
                "status": "COMPLETED",
                "score": 100,
                "notes": "Validation pratique réussie",
            },
            format="json",
        )
        self.assertEqual(progress_response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(progress_response.data["status"], "COMPLETED")

        saved_progress = StudentCurriculumProgress.objects.get(
            student=self.student,
            competency=self.competency,
        )
        self.assertEqual(saved_progress.score, 100)

    def test_level_validation_gate_requires_passed_status_for_next_level(self):
        access = self.authenticate("teacher", "teachpass")
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {access}")

        create_response = self.client.post(
            "/api/level-validations/",
            {
                "student": self.student.id,
                "level": self.level.id,
                "status": "PENDING",
                "score": 60,
                "notes": "À valider",
            },
            format="json",
        )

        self.assertEqual(create_response.status_code, status.HTTP_201_CREATED)
        self.assertFalse(create_response.data["can_access_next_level"])
        self.assertEqual(create_response.data["next_level_name"], self.next_level.name)

        update_response = self.client.patch(
            f"/api/level-validations/{create_response.data['id']}/",
            {"status": "PASSED", "score": 85},
            format="json",
        )

        self.assertEqual(update_response.status_code, status.HTTP_200_OK)
        self.assertTrue(update_response.data["can_access_next_level"])
