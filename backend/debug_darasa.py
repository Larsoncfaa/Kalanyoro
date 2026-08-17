import os
import sys
import django
from datetime import date
import json

root = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
sys.path.insert(0, root)
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.test_settings')
django.setup()

from django.contrib.auth import get_user_model
from django.test import Client
from core.models import Student, Surah

User = get_user_model()
admin = User.objects.create_user(username='admin', password='adminpass', role=User.ADMIN, phone='123')
teacher = User.objects.create_user(username='teacher', password='teachpass', role=User.TEACHER, phone='321')
student = Student.objects.create(matricule='STU001', full_name='Ali Traore', birth_date=date(2010, 1, 1))
surah = Surah.objects.create(number=1, name_ar='الفاتحة', name_fr='Al-Fatiha', total_verses=7)

client = Client()
login_resp = client.post('/api/login/', json.dumps({'username': 'teacher', 'password': 'teachpass'}), content_type='application/json')
print('LOGIN', login_resp.status_code, login_resp.content.decode())

if login_resp.status_code == 200:
    token = login_resp.json().get('access')
    headers = {'HTTP_AUTHORIZATION': f'Bearer {token}'}
    darasa_resp = client.post(
        '/api/darasa/',
        json.dumps({
            'student': student.id,
            'surah': surah.id,
            'verse_start': 1,
            'verse_end': 3,
            'date': date.today().isoformat(),
            'start_time': '08:00:00',
            'end_time': '09:00:00',
            'notes': 'Première séance',
        }),
        content_type='application/json',
        **headers,
    )
    print('DARASA STATUS', darasa_resp.status_code)
    print(darasa_resp.content.decode())
    try:
        print('DARASA JSON', darasa_resp.json())
    except Exception:
        pass
else:
    print('Login failed, cannot test Darasa endpoint')
