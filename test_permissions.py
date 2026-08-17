#!/usr/bin/env python
"""
🧪 TEST SUITE - Permissions & Security Validation
Kalanyoro LMS v2.0.0

Usage:
    python test_permissions.py
    python test_permissions.py --admin-only
    python test_permissions.py --verbose

À utiliser AVANT mise en production pour valider toutes les permissions.
"""

import os
import sys
import json
import argparse
from pathlib import Path
from typing import Dict, List, Tuple, Optional

# Django setup
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
import django
django.setup()

from django.test import TestCase, Client
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework_simplejwt.tokens import RefreshToken

User = get_user_model()


class PermissionTestCase:
    """Test scenario pour une permission donnée"""

    def __init__(self, name: str, method: str, endpoint: str, 
                 expected_status: Dict[str, int], verbose: bool = False):
        self.name = name
        self.method = method
        self.endpoint = endpoint
        self.expected_status = expected_status  # {"admin": 200, "teacher": 403, ...}
        self.verbose = verbose
        self.results = {}

    def run(self, clients: Dict[str, APIClient]) -> Dict[str, Tuple[bool, int]]:
        """Exécute le test pour tous les rôles"""
        results = {}
        
        for role, client in clients.items():
            try:
                if self.method.upper() == "GET":
                    response = client.get(self.endpoint)
                elif self.method.upper() == "POST":
                    response = client.post(self.endpoint, {})
                elif self.method.upper() == "PATCH":
                    response = client.patch(self.endpoint, {})
                elif self.method.upper() == "DELETE":
                    response = client.delete(self.endpoint)
                else:
                    response = None

                expected = self.expected_status.get(role, 999)
                passed = response.status_code == expected
                results[role] = (passed, response.status_code)

                if self.verbose:
                    status_icon = "✅" if passed else "❌"
                    print(f"  {status_icon} {role:12} {self.method:6} {self.endpoint:40} "
                          f"→ {response.status_code} (expected {expected})")

            except Exception as e:
                results[role] = (False, str(e))
                if self.verbose:
                    print(f"  ❌ {role:12} {self.method:6} {self.endpoint:40} → ERROR: {e}")

        self.results = results
        return results

    def summary(self) -> str:
        """Retourne un résumé du test"""
        passed = sum(1 for passed, _ in self.results.values() if passed)
        total = len(self.results)
        icon = "✅" if passed == total else "⚠️" if passed > 0 else "❌"
        return f"{icon} {self.name:50} {passed}/{total} passed"


class PermissionTestSuite:
    """Suite complète de tests de permissions"""

    def __init__(self, verbose: bool = False, admin_only: bool = False):
        self.verbose = verbose
        self.admin_only = admin_only
        self.client = APIClient()
        self.test_users = {}
        self.test_clients = {}
        self.test_cases = []
        self.results = []

    def setup_test_users(self):
        """Crée les utilisateurs de test"""
        print("\n📝 Setup: Créer utilisateurs de test...")
        
        # Admin
        admin = User.objects.filter(username="test_admin").first()
        if not admin:
            admin = User.objects.create_user(
                username="test_admin",
                password="testpass123",
                role="ADMIN"
            )
        self.test_users["admin"] = admin

        # Teacher
        teacher = User.objects.filter(username="test_teacher").first()
        if not teacher:
            teacher = User.objects.create_user(
                username="test_teacher",
                password="testpass123",
                role="TEACHER"
            )
        self.test_users["teacher"] = teacher

        # Student (no special role)
        student = User.objects.filter(username="test_student").first()
        if not student:
            student = User.objects.create_user(
                username="test_student",
                password="testpass123",
                role="STUDENT"
            )
        self.test_users["student"] = student

        # Unauthenticated
        self.test_users["anonymous"] = None

        print(f"✅ Created {len(self.test_users)} test users")

    def setup_test_clients(self):
        """Crée les clients API avec tokens"""
        print("\n🔑 Setup: Créer clients API avec tokens...")
        
        for role, user in self.test_users.items():
            client = APIClient()
            
            if user:
                refresh = RefreshToken.for_user(user)
                client.credentials(HTTP_AUTHORIZATION=f'Bearer {str(refresh.access_token)}')
                if self.verbose:
                    print(f"  ✅ {role:12} → Token generated")
            else:
                if self.verbose:
                    print(f"  ⚠️  {role:12} → No auth")

            self.test_clients[role] = client

    def add_test(self, name: str, method: str, endpoint: str, expected_status: Dict[str, int]):
        """Ajoute un test à la suite"""
        test = PermissionTestCase(name, method, endpoint, expected_status, self.verbose)
        self.test_cases.append(test)

    def add_curriculum_tests(self):
        """Ajoute les tests CURRICULUM (admin-only)"""
        tests = [
            ("Curriculum: LIST levels", "GET", "/api/curriculum-levels/",
             {"admin": 200, "teacher": 403, "student": 403, "anonymous": 401}),

            ("Curriculum: CREATE level", "POST", "/api/curriculum-levels/",
             {"admin": 201, "teacher": 403, "student": 403, "anonymous": 401}),

            ("Curriculum: LIST modules", "GET", "/api/curriculum-modules/",
             {"admin": 200, "teacher": 403, "student": 403, "anonymous": 401}),

            ("Curriculum: CREATE module", "POST", "/api/curriculum-modules/",
             {"admin": 201, "teacher": 403, "student": 403, "anonymous": 401}),

            ("Curriculum: LIST lessons", "GET", "/api/curriculum-lessons/",
             {"admin": 200, "teacher": 403, "student": 403, "anonymous": 401}),

            ("Curriculum: LIST competencies", "GET", "/api/curriculum-competencies/",
             {"admin": 200, "teacher": 403, "student": 403, "anonymous": 401}),
        ]

        for test in tests:
            self.add_test(*test)

    def add_darasa_tests(self):
        """Ajoute les tests DARASA (teacher + admin)"""
        tests = [
            ("Darasa: LIST sessions", "GET", "/api/darasa/",
             {"admin": 200, "teacher": 200, "student": 403, "anonymous": 401}),

            ("Darasa: CREATE session", "POST", "/api/darasa/",
             {"admin": 201, "teacher": 201, "student": 403, "anonymous": 401}),
        ]

        for test in tests:
            self.add_test(*test)

    def add_auth_tests(self):
        """Ajoute les tests AUTHENTICATION"""
        tests = [
            ("Auth: GET token", "POST", "/api/token/",
             {"admin": 200, "teacher": 200, "student": 200, "anonymous": 200}),
        ]

        for test in tests:
            self.add_test(*test)

    def add_public_tests(self):
        """Ajoute les tests DONNÉES PUBLIQUES"""
        tests = [
            ("Public: LIST surahs", "GET", "/api/surahs/",
             {"admin": 200, "teacher": 200, "student": 200, "anonymous": 401}),

            ("Public: LIST verses", "GET", "/api/verses/",
             {"admin": 200, "teacher": 200, "student": 200, "anonymous": 401}),
        ]

        for test in tests:
            self.add_test(*test)

    def run_all_tests(self) -> bool:
        """Exécute tous les tests"""
        print(f"\n🧪 Exécuter {len(self.test_cases)} tests de permission...\n")

        all_passed = True
        for i, test in enumerate(self.test_cases, 1):
            test.run(self.test_clients)
            summary = test.summary()
            print(f"  {i:2}. {summary}")
            
            # Vérifier si tous les tests du cas sont passés
            if not all(passed for passed, _ in test.results.values()):
                all_passed = False

        return all_passed

    def test_rate_limiting(self) -> bool:
        """Test le rate limiting sur /api/token/"""
        print("\n⏱️  Test: Rate Limiting (5/h sur /api/token/)...")
        
        # Faire 6 tentatives rapides
        passed_count = 0
        for i in range(6):
            response = self.client.post('/api/token/', {
                "username": "wrong",
                "password": "wrong"
            })
            
            if i < 5:
                # Les 5 premières tentatives doivent retourner 401/400
                if response.status_code in [401, 400, 422]:
                    passed_count += 1
                    if self.verbose:
                        print(f"  ✅ Attempt {i+1}: {response.status_code} (as expected)")
            else:
                # La 6ème doit être rate-limitée (429)
                if response.status_code == 429:
                    passed_count += 1
                    if self.verbose:
                        print(f"  ✅ Attempt {i+1}: {response.status_code} RATE LIMITED (as expected)")
                else:
                    if self.verbose:
                        print(f"  ❌ Attempt {i+1}: {response.status_code} (expected 429)")

        success = passed_count == 6
        icon = "✅" if success else "❌"
        print(f"  {icon} Rate limiting: {passed_count}/6 passed")
        return success

    def run(self) -> bool:
        """Exécute la suite complète de tests"""
        print("=" * 80)
        print("🧪 PERMISSION TEST SUITE - Kalanyoro LMS v2.0.0")
        print("=" * 80)

        try:
            # Setup
            self.setup_test_users()
            self.setup_test_clients()

            # Ajouter les tests
            self.add_auth_tests()
            self.add_public_tests()

            if not self.admin_only:
                self.add_curriculum_tests()
                self.add_darasa_tests()

            # Exécuter les tests
            permission_tests_passed = self.run_all_tests()

            # Test rate limiting
            rate_limit_passed = self.test_rate_limiting()

            # Résumé final
            print("\n" + "=" * 80)
            if permission_tests_passed and rate_limit_passed:
                print("✅ ALL TESTS PASSED - System ready for deployment")
                return True
            else:
                print("❌ SOME TESTS FAILED - Review security configuration")
                return False

        except Exception as e:
            print(f"\n❌ ERROR: {e}")
            import traceback
            traceback.print_exc()
            return False

        finally:
            # Cleanup
            print("\n🧹 Cleanup: Supprimer utilisateurs de test...")
            for user in self.test_users.values():
                if user:
                    user.delete()
            print("✅ Test users deleted")


def main():
    parser = argparse.ArgumentParser(
        description="🧪 Permission Test Suite - Kalanyoro LMS"
    )
    parser.add_argument(
        "--verbose", "-v",
        action="store_true",
        help="Output détaillé pour chaque test"
    )
    parser.add_argument(
        "--admin-only",
        action="store_true",
        help="Tester seulement les endpoints admin"
    )

    args = parser.parse_args()

    suite = PermissionTestSuite(
        verbose=args.verbose,
        admin_only=args.admin_only
    )

    success = suite.run()
    sys.exit(0 if success else 1)


if __name__ == "__main__":
    main()
