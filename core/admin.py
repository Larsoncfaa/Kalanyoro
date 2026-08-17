from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from .models import (
    User,
    Student,
    Surah,
    DarasaSession,
    StudentProgress
)

@admin.register(User)
class CustomUserAdmin(UserAdmin):

    list_display = (
        "username",
        "first_name",
        "last_name",
        "role",
        "phone",
        "is_active",
    )

    list_filter = (
        "role",
        "is_active",
        "is_staff",
    )

    search_fields = (
        "username",
        "first_name",
        "last_name",
        "phone",
    )

    ordering = ("username",)

    fieldsets = UserAdmin.fieldsets + (
        (
            "Informations complémentaires",
            {
                "fields": (
                    "phone",
                    "role",
                )
            },
        ),
    )

@admin.register(Student)
class StudentAdmin(admin.ModelAdmin):

    list_display = (
        "matricule",
        "full_name",
        "phone",
        "birth_date",
        "created_at",
    )

    search_fields = (
        "matricule",
        "full_name",
        "phone",
    )

    ordering = ("full_name",)

    list_per_page = 25  

@admin.register(Surah)
class SurahAdmin(admin.ModelAdmin):

    list_display = (
        "number",
        "name_fr",
        "name_ar",
        "total_verses",
    )

    ordering = ("number",)

    search_fields = (
        "name_fr",
        "name_ar",
    )

@admin.register(DarasaSession)
class DarasaSessionAdmin(admin.ModelAdmin):

    list_display = (
        "teacher",
        "student",
        "surah",
        "verse_start",
        "verse_end",
        "date",
    )

    list_filter = (
        "date",
        "surah",
        "teacher",
    )

    search_fields = (
        "student__full_name",
        "teacher__username",
    )

    autocomplete_fields = (
        "teacher",
        "student",
        "surah",
    )

    date_hierarchy = "date"

    ordering = ("-date",)
# Register your models here.
