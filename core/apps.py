from django.apps import AppConfig
from django.conf import settings
from django.contrib.auth import get_user_model
from django.db.models.signals import post_migrate
from django.dispatch import receiver


@receiver(post_migrate)
def create_default_admin(sender, **kwargs):
    if sender.name != "core":
        return

    if not settings.DEBUG:
        return

    User = get_user_model()
    if User.objects.filter(username='admin').exists():
        return

    User.objects.create_user(
        username='admin',
        password='adminpass',
        role=User.ADMIN,
        phone='0000000000',
        is_active=True,
    )


class CoreConfig(AppConfig):
    name = 'core'
