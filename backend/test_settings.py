import os

os.environ.setdefault('DJANGO_SECRET_KEY', 'test-secret-key-for-django-tests')

from .settings import *

# Use SQLite for tests to avoid requiring PostgreSQL CREATE DATABASE privileges.
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'test_db.sqlite3',
    }
}

ALLOWED_HOSTS = ['localhost', '127.0.0.1', 'testserver']
