

from django.contrib import admin
from django.http import JsonResponse
from django.urls import include, path
from django.views.decorators.cache import cache_page
from django_ratelimit.decorators import ratelimit
from django.shortcuts import redirect

from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)


# =========================================================
# RATE LIMITING
# =========================================================
# Applique un rate limit de 5 tentatives par heure par IP
# Prévient les brute-force attacks sur l'authentification
ratelimited_token_view = ratelimit(
    key='ip', 
    rate='5/h',
    method=['POST']
)(TokenObtainPairView.as_view())

def home(request):
    return  redirect("https://front-kalanyoro1.vercel.app/")

urlpatterns = [
    path("", home, name="home"),
    path('admin/', admin.site.urls),
    path('api/', include('core.urls')),
    
    # Authentication endpoints - avec rate limiting
    path('api/token/', ratelimited_token_view, name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]
