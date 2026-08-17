# 🚀 GUIDE DE DÉPLOIEMENT & SÉCURITÉ - Kalanyoro LMS

**Dernière mise à jour**: 17/08/2026  
**Version**: 1.0  
**Status**: ✅ Production-Ready (avec configurations)

---

## 📋 PRÉ-DÉPLOIEMENT CHECKLIST

### Backend Django

- [ ] **Créer `.env` à partir de `.env.example`**
  ```bash
  cp .env.example .env
  # Éditer .env et changer les valeurs sensibles
  ```

- [ ] **Configurer les secrets**
  ```bash
  # Générer une nouvelle SECRET_KEY
  python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
  # Copier-coller dans DJANGO_SECRET_KEY dans .env
  ```

- [ ] **Base de données**
  ```bash
  # Vérifier connexion PostgreSQL
  python manage.py dbshell
  # Lancer migrations
  python manage.py migrate
  ```

- [ ] **Créer superuser admin**
  ```bash
  python manage.py createsuperuser
  # username: admin
  # password: *** (secure!)
  # email: admin@example.com
  # role: ADMIN
  ```

- [ ] **Tester permissions**
  ```bash
  # Voir guide: PERMISSIONS_GUIDE.md
  python manage.py test core.tests
  ```

### Frontend React

- [ ] **Build en production**
  ```bash
  cd front/frontend
  npm run build
  # Génère dist/ prêt pour production
  ```

- [ ] **Vérifier .env frontend** (si nécessaire)
  ```typescript
  // Configurer API_BASE en prod
  const API_BASE = process.env.VITE_API_BASE || "https://api.example.com/api/";
  ```

---

## 🔐 CONFIGURATIONS DE SÉCURITÉ

### Production Checklist

#### Django

```python
# settings.py en production

DEBUG = False  # JAMAIS True en prod!
ALLOWED_HOSTS = ["example.com", "www.example.com"]

# HTTPS
SECURE_SSL_REDIRECT = True
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True

# HSTS (recommandé 6 mois = 15552000)
SECURE_HSTS_SECONDS = 31536000  # 1 an
SECURE_HSTS_INCLUDE_SUBDOMAINS = True
SECURE_HSTS_PRELOAD = True

# Cookies
SESSION_COOKIE_HTTPONLY = True
CSRF_COOKIE_HTTPONLY = True

# CORS
CORS_ALLOW_ALL_ORIGINS = False
CORS_ALLOWED_ORIGINS = [
    "https://example.com",
    "https://app.example.com",
]
```

#### Database

```python
# Utiliser PostgreSQL en production (pas SQLite)
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': os.getenv('DB_NAME'),
        'USER': os.getenv('DB_USER'),
        'PASSWORD': os.getenv('DB_PASSWORD'),  # Fort!
        'HOST': os.getenv('DB_HOST'),
        'PORT': os.getenv('DB_PORT'),
        # Connexions SSL
        'OPTIONS': {
            'sslmode': 'require',
        }
    }
}
```

#### Static Files

```bash
# Collecter les fichiers statiques
python manage.py collectstatic --noinput

# Servir avec Nginx/Apache (PAS avec Django)
# Configuration Nginx:
location /static/ {
    alias /var/www/kalanyoro/staticfiles/;
    expires 1y;
}
```

### Frontend

```bash
# .env.production
VITE_API_BASE=https://api.example.com/api/
VITE_ENABLE_ANALYTICS=true
```

---

## 🚀 DÉPLOIEMENT (Exemple avec Nginx + Gunicorn)

### 1. Setup Serveur (Ubuntu/Debian)

```bash
# Dépendances système
sudo apt update
sudo apt install -y python3.11 python3-pip postgresql nginx

# Créer utilisateur de service
sudo useradd -m -d /opt/kalanyoro kalanyoro
```

### 2. Installation Backend

```bash
cd /opt/kalanyoro
git clone <repository> .
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Copier .env en production
cp .env.example .env
nano .env  # Éditer avec vraies valeurs

# Migrations
python manage.py migrate
python manage.py collectstatic --noinput
```

### 3. Gunicorn Configuration

```bash
# /opt/kalanyoro/gunicorn.conf.py
import multiprocessing

bind = "127.0.0.1:8000"
workers = multiprocessing.cpu_count() * 2 + 1
worker_class = "sync"
worker_connections = 1000
max_requests = 1000
max_requests_jitter = 50
timeout = 30
keepalive = 5
preload_app = True
errorlog = "/var/log/gunicorn/error.log"
accesslog = "/var/log/gunicorn/access.log"
loglevel = "info"
```

### 4. Systemd Service

```bash
# /etc/systemd/system/kalanyoro.service
[Unit]
Description=Kalanyoro LMS Gunicorn Service
After=network.target postgresql.service

[Service]
Type=notify
User=kalanyoro
Group=www-data
WorkingDirectory=/opt/kalanyoro
Environment="PATH=/opt/kalanyoro/venv/bin"
ExecStart=/opt/kalanyoro/venv/bin/gunicorn \
    --config /opt/kalanyoro/gunicorn.conf.py \
    backend.wsgi:application
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target

# Activer
sudo systemctl enable kalanyoro
sudo systemctl start kalanyoro
```

### 5. Nginx Configuration

```nginx
# /etc/nginx/sites-available/kalanyoro
upstream kalanyoro {
    server 127.0.0.1:8000;
}

server {
    listen 443 ssl http2;
    server_name api.example.com;
    
    # SSL Certificates (Let's Encrypt)
    ssl_certificate /etc/letsencrypt/live/api.example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.example.com/privkey.pem;
    
    # Security headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-Frame-Options "DENY" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    
    # Compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript;
    gzip_min_length 1000;
    
    # Static files
    location /static/ {
        alias /opt/kalanyoro/staticfiles/;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # Media files
    location /media/ {
        alias /opt/kalanyoro/media/;
        expires 7d;
    }
    
    # API reverse proxy
    location / {
        proxy_pass http://kalanyoro;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_redirect off;
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
}

# Redirect HTTP -> HTTPS
server {
    listen 80;
    server_name api.example.com;
    return 301 https://$server_name$request_uri;
}
```

### 6. Frontend (Nginx Static)

```nginx
# /etc/nginx/sites-available/kalanyoro-app
server {
    listen 443 ssl http2;
    server_name app.example.com;
    
    ssl_certificate /etc/letsencrypt/live/app.example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/app.example.com/privkey.pem;
    
    # Security headers
    add_header Strict-Transport-Security "max-age=31536000" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    
    root /var/www/kalanyoro-app;
    
    # SPA routing
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # API proxy
    location /api/ {
        proxy_pass https://api.example.com/api/;
        proxy_set_header Host api.example.com;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto https;
    }
}
```

---

## 📊 MONITORING

### Logs

```bash
# Backend
tail -f /var/log/gunicorn/error.log
tail -f /var/log/gunicorn/access.log

# System
journalctl -u kalanyoro -f
```

### Health Check

```bash
# Script de vérification
curl -X POST https://api.example.com/api/token/ \
  -H "Content-Type: application/json" \
  -d '{"username":"test","password":"test"}'

# Doit retourner 401 ou 429 (rate limited), pas 500
```

### Rate Limiting Monitor

```bash
# Voir les requêtes rate-limited
grep "Rate limit" /var/log/gunicorn/access.log
```

---

## 🔄 MISES À JOUR

### Migration en prod

```bash
# 1. Backup DB
pg_dump kalanyoro > backup_$(date +%Y%m%d).sql

# 2. Pull les changements
cd /opt/kalanyoro
git pull origin main

# 3. Installer dépendances
source venv/bin/activate
pip install -r requirements.txt

# 4. Migrations
python manage.py migrate

# 5. Collecte statiques
python manage.py collectstatic --noinput

# 6. Redémarrer service
sudo systemctl restart kalanyoro
```

---

## 🧪 TESTS DE SÉCURITÉ

### Tester Rate Limiting

```bash
for i in {1..6}; do
  echo "Tentative $i"
  curl -X POST https://api.example.com/api/token/ \
    -H "Content-Type: application/json" \
    -d '{"username":"wrong","password":"wrong"}' \
    -w "\nStatus: %{http_code}\n\n"
done
# Attendu: 5 × 401, puis 1 × 429
```

### Tester Permissions

```bash
# Teacher essaie d'accéder à /curriculum
TOKEN=$(curl -s -X POST https://api.example.com/api/token/ \
  -d '{"username":"teacher1","password":"***"}' | jq -r .access)

curl -H "Authorization: Bearer $TOKEN" \
  https://api.example.com/api/curriculum-levels/
# Attendu: 403 Forbidden
```

### Tester HTTPS

```bash
# Vérifier certificat SSL
openssl s_client -connect api.example.com:443 -showcerts

# Tester HSTS
curl -i https://api.example.com/
# Attendu: header Strict-Transport-Security
```

---

## 📞 TROUBLESHOOTING

### Service ne démarre pas

```bash
sudo systemctl status kalanyoro
journalctl -u kalanyoro -n 50
```

### Migrations échouent

```bash
python manage.py makemigrations
python manage.py migrate --plan
python manage.py migrate
```

### Rate limiting pas appliqué

```bash
# Vérifier que django-ratelimit est installé
pip show django-ratelimit

# Vérifier les logs
grep "ratelimit" /var/log/gunicorn/error.log
```

### CORS errors

```bash
# Vérifier CORS settings
# Dans .env:
CORS_ALLOWED_ORIGINS=https://app.example.com

# Tester:
curl -i -H "Origin: https://app.example.com" \
  https://api.example.com/api/surahs/
```

---

## 📚 RESSOURCES

- Django Security Docs: https://docs.djangoproject.com/en/stable/topics/security/
- DRF Permissions: https://www.django-rest-framework.org/api-guide/permissions/
- OWASP Top 10: https://owasp.org/www-project-top-ten/
- Let's Encrypt: https://letsencrypt.org/
- Gunicorn Docs: https://docs.gunicorn.org/

---

## ✅ POST-DÉPLOIEMENT

Après le déploiement en production:

- [ ] Tester tous les scénarios (voir PERMISSIONS_GUIDE.md)
- [ ] Vérifier les logs pour erreurs
- [ ] Configurer monitoring (Sentry, NewRelic, etc.)
- [ ] Configurer backups automatiques
- [ ] Tester recovery de backup
- [ ] Documenter runbook d'exploitation
- [ ] Former l'équipe opérationnelle
