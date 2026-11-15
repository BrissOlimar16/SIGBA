# Plan de proyecto corregido: Sistema de Beca Alimentaria

> Versión corregida del archivo `plan_de_proyecto_de_becas.md`. Las versiones de paquetes se consultaron en PyPI el 8 de noviembre de 2026.
> Los checksums SHA-256 de los tres modelos y la licencia Apache-2.0 de facenox se comprobaron contra sus repositorios.
> Lo que **no** pude comprobar desde aquí está marcado con ⚠️ y es lo que debes verificar tú.

---

## A. Qué estaba mal en el plan original y qué se cambió

Cada fila apunta a la sección donde aparece la corrección.

| # | Problema del plan original | Por qué era un problema | Qué cambió en esta versión |
|---|---|---|---|
| 1 | El `Caddyfile` solo escuchaba en `:80` (HTTP), aunque se publicaba el puerto 443. | Los navegadores solo dan acceso a la cámara (`getUserMedia`) en `localhost` o por HTTPS. Desde las PCs de las cafeterías, el reconocimiento facial no habría funcionado y el error se habría descubierto en el piloto. | Caddy sirve por **HTTPS** con certificado interno (`tls internal`) y un nombre de host configurable. Se explica cómo instalar el certificado en las PCs (§4.6, §6.3). |
| 2 | Los modelos se descargaban con un script, pero el paso del commit pedía que los `.onnx` aparecieran en Git. Era contradictorio. | Si dependes de descargarlos de GitHub/Hugging Face, tu sistema depende de un tercero, lo que rompe tu requisito de **no depender de nada externo**. Los archivos pueden cambiar de lugar o desaparecer. | Los modelos **se versionan en el repositorio** (unos 39 MB en total). El script solo verifica el SHA-256 y descarga únicamente si falta algo. Se crea `backend/models/LICENSES/`, que el plan prometía y nunca creaba (§5). |
| 3 | `requirements.txt` incompleto, con versiones viejas y con pruebas mezcladas con producción. | Faltaban `alembic`, `apscheduler`, `weasyprint` y `jinja2`, que el propio plan usa en sprints posteriores. Las versiones eran de principios de 2025 (por ejemplo, FastAPI 0.115.6 frente a 0.162.2 actual) y pueden tener fallas de seguridad ya corregidas. `pytest` y `httpx` no deben ir en la imagen de producción. | `requirements.txt` completo con versiones vigentes, `requirements-dev.txt` aparte y `pip-audit` como paso de revisión (§4.8). |
| 3b | Se usaba la imagen `pgvector` y el paquete `pgvector`, pero nunca se creaba la extensión ni se usaba. | Es una dependencia sin función. Con 300 a 500 alumnos y verificación 1:1, no hace falta búsqueda vectorial en SQL. Decidirlo después obligaría a rehacer la primera migración. | Se usa **PostgreSQL 16 estándar** y el embedding se guarda como `bytea` (128 floats de SFace = 512 bytes) (§4.4, §10). |
| 4 | El spike de liveness (anti-spoofing) asumía el preprocesamiento y la salida del modelo, y evaluaba un solo fotograma. | Si el modelo espera otra normalización o el orden de las clases es distinto, marcaría todo como real o todo como falso **sin avisar**. Con un solo fotograma, además, un destello o un movimiento cambia el resultado. | El spike imprime la forma de entrada y salida del modelo para que las compares con su README, **promedia 5 fotogramas** y no deja enrolar si el liveness falla (§7.2). Queda marcado ⚠️ para verificar. |
| 5 | La calibración consistía en probar con tu cara y la de otra persona. | Con dos personas no se puede elegir un umbral. El 0.363 es el valor de la documentación de OpenCV, no uno calibrado para tus cámaras y tu luz. | Se agrega `scripts/calibrar.py` y un protocolo de unas 20 personas, que calcula las distribuciones "misma persona" frente a "personas distintas" y sugiere un umbral (§7.3). |
| 6 | Las tablas del Sprint 0 no coincidían con lo que acordamos. | Faltaban `lista_espera`, `alertas`, `dias_inhabiles`, `faltas` con anulación, `intentos_verificacion`, el tipo de credencial (`ficha`/`credencial`) y el estatus `pendiente_baja`. El cupo "100/200" aparecía fijo. | Esquema completo, con cupo configurable por periodo y cafetería (§10). |
| 7 | "Importar lista de aceptados" en el Sprint 1. | Dijiste que la lista es manual y los técnicos registran alumno por alumno. | Pasa a **opcional**, con una pregunta abierta (§11). |
| 8 | Token de acceso de 60 minutos sin renovación. | Las cafeterías usan el sistema todo el día. A la hora la sesión caería en medio del servicio. | Se documenta la renovación automática (refresh token) como requisito del Sprint 0 (§10). |
| 9 | Detalles de arranque: no se creaban `__init__.py` en los submódulos, `alembic/` quedaba vacía, no había frontend, se usaba `gh` sin instalarlo, `newgrp docker` abre una subshell confusa, no se copiaban los requerimientos a `docs/`. | Son errores pequeños que hacen perder tiempo o dejan el árbol incompleto. | Corregidos en §1 a §3. |
| 10 | `.gitignore` ignoraba `*.pdf`; no ignoraba datos biométricos de prueba. | Bloquearía plantillas y documentación en PDF, y dejaba abierta la posibilidad de subir por accidente fotos de personas. | Se quita `*.pdf` y se agregan `fotos_calibracion/`, `data/` y `*.npy` (§4.1). |
| 11 | `docker-compose.override.yml` se aplica automáticamente con `docker compose up`. | En el servidor real se aplicaría también, con configuración de desarrollo. | El override incluye `--reload` y montaje de código, y se indica `docker compose -f docker-compose.yml up -d` para producción (§4.5, §6). |
| 12 | `.env.example` duplicado en la raíz y en `backend/`. | Dos archivos que mantener y que se desincronizan. | Un único `.env.example` en la raíz (§4.2). |
| 13 | Licencias: Lucide listado como MIT; no se mencionaba que `psycopg` es LGPL. | Es un aviso de terceros impreciso. | Lucide como ISC (⚠️ confírmalo en su repo) y `psycopg` como LGPL-3.0, libre y usado sin modificar (§4.14). |
| 14 | Se asumía que el Python del equipo servía para el spike. | `numpy` actual exige Python ≥ 3.12 y `onnxruntime` ≥ 3.11. Linux Mint 21 trae 3.10. | Se explica cómo comprobarlo y qué hacer (§1). |
| 15 | `roles` como tabla en el Sprint 0. | Con tres roles fijos, una tabla agrega joins sin beneficio. | Se usa `enum` (§10). Si algún día necesitas roles personalizados, se migra. |
| 16 | GitHub presentado como parte natural del sistema. | Es un servicio externo. Para desarrollar sirve, pero no debe ser requisito para operar. | Se aclara que es solo para desarrollo y se ofrece Forgejo o GitLab CE como alternativa autoalojada (§2). |

**Lo que estaba bien y se conserva:** el stack libre, los tres contenedores, la red interna con la base de datos expuesta solo en `127.0.0.1`, un solo worker de uvicorn, los checksums de los modelos (verificados) y el orden "spike facial antes del CRUD".

---

## 0. Datos que debes reemplazar

| Variable | Ejemplo |
|---|---|
| `TU_USUARIO` | tu usuario de GitHub (o de tu Forgejo) |
| `TU_CORREO` | tu correo |
| `TU_NOMBRE` | tu nombre |
| `SITE_ADDRESS` | `localhost` en desarrollo; `becas.universidad.local` en el servidor |

Tiempo estimado: **2 a 3 horas** para dejar repositorio, Docker, HTTPS y spike funcionando.

---

## 1. Instalar herramientas (Linux Mint / Ubuntu)

```bash
sudo apt update
sudo apt install -y git curl ca-certificates gnupg v4l-utils \
  python3 python3-venv python3-pip openssl gh

# Docker Engine + Compose (NO Docker Desktop)
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | \
  sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] \
  https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo "$UBUNTU_CODENAME") stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io \
  docker-buildx-plugin docker-compose-plugin
sudo usermod -aG docker "$USER"
```

**Cierra sesión y vuelve a entrar** (corrección 9: `newgrp docker` abría una subshell que confundía). Después:

```bash
docker run hello-world
docker compose version
git --version
python3 --version
```

**Python del equipo (corrección 14).** El spike corre fuera de Docker porque necesita la cámara y una ventana, y sus paquetes actuales exigen **Python 3.12 o superior** (`numpy` ≥ 3.12, `onnxruntime` ≥ 3.11). Linux Mint 22 trae 3.12. Si `python3 --version` muestra 3.10 (Mint 21), actualiza a Mint 22 o instala Python 3.12 con `pyenv` o `uv`. El backend en Docker usa 3.12 y no depende del Python del equipo.

Configura Git:

```bash
git config --global user.name "TU_NOMBRE"
git config --global user.email "TU_CORREO"
git config --global init.defaultBranch main
```

Node y Angular (para el frontend, con nvm):

```bash
# Revisa la versión vigente del script en github.com/nvm-sh/nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
# cierra y abre la terminal
nvm install --lts
npm install -g @angular/cli
ng version
```

---

## 2. Crear el repositorio remoto

Crea un repositorio **privado y vacío** (sin README, sin `.gitignore`, sin licencia), por la web o con:

```bash
gh auth login
gh repo create beca-alimentaria --private
```

> **Corrección 16.** GitHub sirve para colaborar durante el desarrollo, pero **no forma parte del sistema**: el sistema funciona sin él. Si quieres independencia total, instala **Forgejo** o **GitLab CE** en un servidor de la universidad. Los comandos de Git son los mismos.

Llave SSH:

```bash
ssh-keygen -t ed25519 -C "TU_CORREO"
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_ed25519
cat ~/.ssh/id_ed25519.pub
# Pega la salida en GitHub → Settings → SSH and GPG keys
ssh -T git@github.com
```

---

## 3. Crear la estructura

```bash
mkdir -p "$HOME/proyectos" && cd "$HOME/proyectos"
mkdir beca-alimentaria && cd beca-alimentaria

# Backend: un paquete Python por módulo, con __init__.py   (corrección 9)
for m in auth usuarios catalogos estudiantes becas facial asistencia faltas reportes auditoria; do
  mkdir -p backend/app/$m
  touch backend/app/$m/__init__.py
done
mkdir -p backend/models/LICENSES backend/tests
touch backend/app/__init__.py
touch backend/app/{main,config,database,seguridad}.py
touch backend/app/facial/{motor,motor_opencv,liveness,repositorio,rutas}.py
touch backend/{Dockerfile,requirements.txt,requirements-dev.txt}

# Resto
mkdir -p proxy scripts docs/requerimientos
touch proxy/Caddyfile
touch scripts/{descargar_modelos.sh,spike_facial.py,calibrar.py,requirements-spike.txt}
touch docker-compose.yml docker-compose.override.yml .env.example .gitignore
touch README.md THIRD_PARTY_NOTICES.md docs/{licencias.md,arquitectura.md,decisiones.md}

# Copia tus requerimientos (corrección 9)
cp RUTA/requerimientos_delsistema_de_becas.md docs/requerimientos/
cp RUTA/Aclaraciones_de_los_requerimientos.md docs/requerimientos/

# Frontend (corrección 9: el plan original no lo creaba)
ng new frontend --routing --style=css --skip-git
```

`--skip-git` evita que Angular cree un repositorio dentro del tuyo. Después agrega **Tailwind** con la guía oficial de Angular en tailwindcss.com (los pasos cambian entre versiones).

`alembic/` no se crea a mano. Se genera en el Sprint 0 con `alembic init`, dentro del contenedor.

---

## 4. Crear los archivos base

### 4.1 `.gitignore`  *(correcciones 10 y 2)*

Se quitó `*.pdf` y se agregaron las carpetas con datos biométricos. Los modelos `.onnx` **no** se ignoran.

```bash
cat > .gitignore <<'EOF'
# Entornos y secretos
.env
.env.*
!.env.example
.venv/
.venv-*/
venv/
__pycache__/
*.py[cod]
.pytest_cache/
.mypy_cache/
.ruff_cache/

# Node/Angular
node_modules/
frontend/dist/
frontend/.angular/
npm-debug.log*

# Datos biométricos y de prueba: NUNCA al repositorio
fotos_calibracion/
data/
*.npy

# Artefactos
pgdata/
backups/
*.log
caddy-root.crt
.DS_Store
EOF
```

### 4.2 `.env.example` (único, en la raíz)  *(corrección 12)*

```bash
cat > .env.example <<'EOF'
POSTGRES_USER=becas
POSTGRES_PASSWORD=CAMBIA_ESTA_CONTRASENA
POSTGRES_DB=becas
JWT_SECRET=CAMBIA_ESTO_POR_UN_SECRETO_DE_64_CARACTERES
SITE_ADDRESS=localhost
CORS_ORIGINS=https://localhost,http://localhost:4200
TZ=America/Mexico_City
FACE_MATCH_THRESHOLD=0.363
LIVENESS_LOGIT_THRESHOLD=0.0
EOF
```

`SITE_ADDRESS` es el nombre con el que se entra al sistema. Si usas caracteres especiales en `POSTGRES_PASSWORD`, tendrías que codificarlos en la URL de conexión. Usa letras y números, por ejemplo `openssl rand -hex 16`.

### 4.3 (eliminado)

El plan original traía un segundo `backend/.env.example`. Ya no existe, porque Docker Compose lee el `.env` de la raíz.

### 4.4 `docker-compose.yml`  *(correcciones 1 y 3b)*

Cambios: imagen `postgres:16` estándar en lugar de `pgvector`, `SITE_ADDRESS` para Caddy, `start_period` en el healthcheck (el backend tarda en cargar los modelos) y `MODELS_DIR`.

```bash
cat > docker-compose.yml <<'EOF'
services:
  db:
    image: postgres:16
    container_name: becas-db
    restart: unless-stopped
    environment:
      POSTGRES_USER: ${POSTGRES_USER}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      POSTGRES_DB: ${POSTGRES_DB}
      TZ: ${TZ}
    volumes:
      - pgdata:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${POSTGRES_USER} -d ${POSTGRES_DB}"]
      interval: 5s
      timeout: 5s
      retries: 10
    networks:
      - internal

  backend:
    build: ./backend
    container_name: becas-backend
    restart: unless-stopped
    environment:
      DATABASE_URL: postgresql+psycopg://${POSTGRES_USER}:${POSTGRES_PASSWORD}@db:5432/${POSTGRES_DB}
      JWT_SECRET: ${JWT_SECRET}
      CORS_ORIGINS: ${CORS_ORIGINS}
      TZ: ${TZ}
      FACE_MATCH_THRESHOLD: ${FACE_MATCH_THRESHOLD}
      LIVENESS_LOGIT_THRESHOLD: ${LIVENESS_LOGIT_THRESHOLD}
      MODELS_DIR: /app/models
    volumes:
      - ./backend/models:/app/models:ro
    depends_on:
      db:
        condition: service_healthy
    healthcheck:
      test: ["CMD", "python", "-c", "import urllib.request; urllib.request.urlopen('http://localhost:8000/health')"]
      interval: 10s
      timeout: 5s
      retries: 5
      start_period: 40s
    networks:
      - internal

  proxy:
    image: caddy:2-alpine
    container_name: becas-proxy
    restart: unless-stopped
    environment:
      SITE_ADDRESS: ${SITE_ADDRESS}
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./proxy/Caddyfile:/etc/caddy/Caddyfile:ro
      - caddy_data:/data
      - caddy_config:/config
    depends_on:
      backend:
        condition: service_healthy
    networks:
      - internal

volumes:
  pgdata:
  caddy_data:
  caddy_config:

networks:
  internal:
    driver: bridge
EOF
```

### 4.5 `docker-compose.override.yml` (solo desarrollo)  *(corrección 11)*

Se aplica automáticamente con `docker compose up`. Agrega recarga en caliente y expone los puertos solo en `127.0.0.1`. **En el servidor no lo uses**: ejecuta `docker compose -f docker-compose.yml up -d`.

```bash
cat > docker-compose.override.yml <<'EOF'
services:
  backend:
    ports:
      - "127.0.0.1:8000:8000"
    volumes:
      - ./backend/app:/app/app
      - ./backend/models:/app/models:ro
    command: uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
  db:
    ports:
      - "127.0.0.1:5432:5432"
EOF
```

### 4.6 `proxy/Caddyfile` con HTTPS  *(corrección 1)*

```bash
cat > proxy/Caddyfile <<'EOF'
{$SITE_ADDRESS} {
    tls internal
    encode gzip

    handle /api/* {
        reverse_proxy backend:8000
    }

    handle /health {
        reverse_proxy backend:8000
    }

    handle {
        respond "Beca Alimentaria API" 200
    }
}
EOF
```

`tls internal` hace que Caddy cree su **propia autoridad certificadora local**: no hay que pagar ni contactar a nadie. A cambio, cada navegador debe confiar en esa autoridad (se explica en §6.3). Cuando exista el frontend compilado, aquí se agregará un `file_server` para servir Angular.

### 4.7 `backend/Dockerfile`

Se agregó `fonts-dejavu-core` para que WeasyPrint tenga una fuente al generar PDFs. La imagen no necesita `build-essential`.

```bash
cat > backend/Dockerfile <<'EOF'
FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1

RUN apt-get update && apt-get install -y --no-install-recommends \
    libglib2.0-0 libgomp1 libpango-1.0-0 libpangoft2-1.0-0 libharfbuzz0b \
    fonts-dejavu-core \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY app ./app

EXPOSE 8000
# Un solo worker: cada worker cargaría los modelos en RAM.
# Cuando exista Alembic (Sprint 0) este comando pasará a:
#   sh -c "alembic upgrade head && uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 1"
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "1"]
EOF
```

### 4.8 `requirements.txt` y `requirements-dev.txt`  *(corrección 3)*

Versiones vigentes al 8 de noviembre de 2026. Se agregaron `alembic`, `apscheduler`, `weasyprint` y `jinja2`, y se quitó `pgvector`.

```bash
cat > backend/requirements.txt <<'EOF'
fastapi==0.162.2
uvicorn[standard]==0.54.0
sqlalchemy==2.1.8
alembic==1.20.1
psycopg[binary]==3.3.8
pydantic-settings==2.16.2
pyjwt==2.15.1
pwdlib[argon2]==0.3.1
python-multipart==0.0.33
apscheduler==3.11.3
weasyprint==70.0
jinja2==3.1.6
numpy==2.5.4
opencv-python-headless==5.0.0.93
onnxruntime==1.31.1
EOF

cat > backend/requirements-dev.txt <<'EOF'
-r requirements.txt
pytest==9.2.0
httpx==0.28.1
ruff==0.17.4
pip-audit==2.10.1
EOF
```

> ⚠️ Son versiones **mayores recientes** que no probé juntas. Si `pip` reporta un conflicto, empieza por bajar `sqlalchemy` a la serie 2.0 (`sqlalchemy>=2.0.36,<2.1`) y vuelve a construir. Cuando todo funcione, congela el resultado exacto con `pip freeze` y revisa vulnerabilidades con `pip-audit -r requirements.txt`.

### 4.9 `backend/app/config.py`

```bash
cat > backend/app/config.py <<'EOF'
from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    database_url: str = "postgresql+psycopg://becas:becas@db:5432/becas"
    jwt_secret: str = "cambia-esto-en-produccion"
    jwt_algorithm: str = "HS256"
    # Las cafeterías usan el sistema todo el día: en el Sprint 0 se agrega
    # un refresh token para renovar la sesión sin que el usuario la note.
    access_token_minutes: int = 60
    cors_origins: str = "https://localhost"
    tz: str = "America/Mexico_City"
    models_dir: str = "/app/models"
    face_match_threshold: float = 0.363
    liveness_logit_threshold: float = 0.0

    @property
    def cors_origin_list(self) -> list[str]:
        return [o.strip() for o in self.cors_origins.split(",") if o.strip()]


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
EOF
```

### 4.10 `backend/app/database.py`

```bash
cat > backend/app/database.py <<'EOF'
from collections.abc import Generator

from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, Session, sessionmaker

from app.config import settings

engine = create_engine(settings.database_url, pool_pre_ping=True)
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)


class Base(DeclarativeBase):
    pass


def get_db() -> Generator[Session, None, None]:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
EOF
```

### 4.11 `backend/app/seguridad.py`

```bash
cat > backend/app/seguridad.py <<'EOF'
from datetime import datetime, timedelta, timezone

import jwt
from pwdlib import PasswordHash

from app.config import settings

password_hash = PasswordHash.recommended()


def hash_password(password: str) -> str:
    return password_hash.hash(password)


def verify_password(password: str, hashed: str) -> bool:
    return password_hash.verify(password, hashed)


def create_access_token(subject: str, rol: str) -> str:
    now = datetime.now(timezone.utc)
    payload = {
        "sub": subject,
        "rol": rol,
        "iat": now,
        "exp": now + timedelta(minutes=settings.access_token_minutes),
    }
    return jwt.encode(payload, settings.jwt_secret, algorithm=settings.jwt_algorithm)
EOF
```

### 4.12 `backend/app/main.py`

Ahora `/api/health` responde 503 si la base de datos no contesta, en lugar de un error genérico.

```bash
cat > backend/app/main.py <<'EOF'
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text

from app.config import settings
from app.database import engine

app = FastAPI(
    title="Beca Alimentaria API",
    version="0.1.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    openapi_url="/api/openapi.json",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root() -> dict[str, str]:
    return {"servicio": "beca-alimentaria", "docs": "/api/docs"}


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.get("/api/health")
def api_health() -> dict[str, str]:
    try:
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
    except Exception:
        raise HTTPException(status_code=503, detail="Base de datos no disponible")
    return {"status": "ok", "db": "ok"}
EOF
```

### 4.13 `README.md`

```bash
cat > README.md <<'EOF'
# Beca Alimentaria

Sistema de control de beca alimentaria con reconocimiento facial y stack 100 % libre.

## Stack
- FastAPI + SQLAlchemy + Alembic + PostgreSQL
- Angular + Tailwind
- Docker Engine + Compose
- Caddy (HTTPS con certificado interno)
- YuNet + SFace + MiniFASNet (ONNX), sin servicios externos

## Inicio rápido (desarrollo)
1. `cp .env.example .env` y cambia `POSTGRES_PASSWORD` y `JWT_SECRET` (`openssl rand -hex 32`).
2. `./scripts/descargar_modelos.sh` (verifica los modelos incluidos en el repo).
3. `docker compose up -d --build`
4. `curl -k https://localhost/api/health`
5. Documentación de la API: `https://localhost/api/docs`

## Producción
`docker compose -f docker-compose.yml up -d --build`  (sin el archivo override).

## Spike facial y calibración
Ver `scripts/spike_facial.py` y `scripts/calibrar.py`. Requieren Python 3.12 o superior.

## Licencias
Ver `THIRD_PARTY_NOTICES.md` y `docs/licencias.md`.
EOF
```

### 4.14 `THIRD_PARTY_NOTICES.md`  *(correcciones 3b y 13)*

```bash
cat > THIRD_PARTY_NOTICES.md <<'EOF'
# Avisos de terceros

Este proyecto usa componentes de código abierto. No se requiere pago de licencias.

| Componente | Licencia | Uso |
|---|---|---|
| FastAPI, SQLAlchemy, Alembic, Pydantic, PyJWT | MIT | Backend |
| APScheduler | MIT | Tareas programadas |
| Uvicorn, NumPy, Jinja2 | BSD-3-Clause | Backend |
| psycopg 3 | LGPL-3.0 (software libre; se usa sin modificar) | Conexión a PostgreSQL |
| PostgreSQL | PostgreSQL License | Base de datos |
| Angular, Tailwind CSS, Node.js | MIT | Frontend |
| Lucide | ISC (verificar en su repositorio) | Íconos |
| Docker Engine, Caddy | Apache 2.0 | Infraestructura |
| OpenCV | Apache 2.0 | Visión |
| ONNX Runtime | MIT | Inferencia |
| YuNet | MIT | Detección facial |
| SFace | Apache 2.0 | Reconocimiento facial |
| MiniFASNet (facenox) | Apache 2.0 | Anti-spoofing |
| WeasyPrint | BSD-3-Clause | PDF |

## Modelos incluidos en `backend/models/`

| Archivo | Origen | SHA-256 | Licencia |
|---|---|---|---|
| `face_detection_yunet_2026may.onnx` | OpenCV Zoo | `ebafce4e3c118d6554634be5c27ab333b4c047a9a8c3faf1d7cf93101c22f0f0` | MIT |
| `face_recognition_sface_2021dec.onnx` | OpenCV Zoo | `0ba9fbfa01b5270c96627c4ef784da859931e02f04419c829e83484087c34e79` | Apache 2.0 |
| `best_model_quantized.onnx` | facenox/face-antispoof-onnx | `fde20585635cae62ed1d41796f76b6f8bc4b92cd91ec1cf0f1bc6485d2d587a9` | Apache 2.0 |

El texto de cada licencia está en `backend/models/LICENSES/`.

## Nota sobre datos de entrenamiento
Las licencias anteriores cubren el código y los pesos declarados por sus autores. La procedencia de los datos de entrenamiento de algunos modelos (por ejemplo WIDER FACE y los datasets de SFace) puede tener términos adicionales. Para este sistema de uso interno universitario no comercial se acepta y documenta este riesgo residual; el área legal debe revisarlo antes de cualquier explotación comercial.
EOF
```

### 4.15 `docs/licencias.md`

```bash
cat > docs/licencias.md <<'EOF'
# Licencias y cumplimiento

## Regla
Todo el software debe ser libre/open source y autoalojado. No se usan servicios cloud, CDN, Google Fonts ni APIs externas en tiempo de ejecución.

## Obligaciones
- MIT/BSD/ISC: conservar copyright y aviso de licencia.
- Apache 2.0: conservar LICENSE, NOTICE si existe, y marcar archivos modificados.
- LGPL (psycopg): no modificar la librería; usarla como dependencia.
- Los modelos se distribuyen con su LICENSE en `backend/models/LICENSES/`.

## Riesgo residual
SFace y YuNet declaran licencias permisivas sobre sus pesos, pero la procedencia de sus datos de entrenamiento no está completamente documentada. Se acepta para uso interno no comercial y se documenta para revisión legal.

## Datos biométricos
Los rostros son datos personales sensibles. Se guardan solo los embeddings (no las fotos). Requieren aviso de privacidad y consentimiento firmado. Consultar con el área jurídica de la universidad.
EOF
```

### 4.16 `docs/arquitectura.md` y `docs/decisiones.md`

```bash
cat > docs/arquitectura.md <<'EOF'
# Arquitectura

- `proxy`: Caddy con HTTPS (certificado interno). Más adelante sirve el Angular compilado.
- `backend`: FastAPI, reglas de negocio, YuNet + SFace, MiniFASNet, PDF y planificador de faltas.
- `db`: PostgreSQL 16. Los embeddings van en `bytea`.
- Red interna de Docker; solo `proxy` expone 80/443.
- Modelos ONNX versionados en `backend/models`, montados en modo lectura.
- Un worker de uvicorn; endpoints faciales con `def` (no `async def`).
- El cliente captura y muestra; el servidor decide (incluida la hora).
EOF

cat > docs/decisiones.md <<'EOF'
# Decisiones de diseño

1. **Sin InsightFace en producción.** El código es MIT, pero los modelos preentrenados (`buffalo_l`) son solo para uso no comercial.
2. **YuNet + SFace + MiniFASNet.** Licencias permisivas, CPU, sin descargas en tiempo de ejecución.
3. **Modelos versionados en el repositorio.** El sistema no depende de servidores de terceros.
4. **HTTPS interno.** El navegador exige HTTPS para usar la cámara fuera de localhost.
5. **bytea y no pgvector.** 300 a 500 alumnos, verificación 1:1.
6. **La sexta falta no cancela sola.** La beca pasa a `pendiente_baja` y un Admin confirma.
7. **Umbrales provisionales.** Se calibran con rostros reales (`scripts/calibrar.py`).
EOF
```

---

## 5. Modelos ONNX: versionados y verificados  *(corrección 2)*

Los tres modelos viven en `backend/models/` **dentro del repositorio** (unos 39 MB, caben en GitHub sin LFS). El script ya no es el mecanismo principal: solo descarga si falta un archivo y siempre verifica el SHA-256.

### 5.1 `scripts/descargar_modelos.sh`

```bash
cat > scripts/descargar_modelos.sh <<'EOF'
#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
MODELS_DIR="$ROOT_DIR/backend/models"
mkdir -p "$MODELS_DIR"

YUNET_URL="https://media.githubusercontent.com/media/opencv/opencv_zoo/main/models/face_detection_yunet/face_detection_yunet_2026may.onnx"
YUNET_SHA="ebafce4e3c118d6554634be5c27ab333b4c047a9a8c3faf1d7cf93101c22f0f0"

SFACE_URL="https://media.githubusercontent.com/media/opencv/opencv_zoo/main/models/face_recognition_sface/face_recognition_sface_2021dec.onnx"
SFACE_SHA="0ba9fbfa01b5270c96627c4ef784da859931e02f04419c829e83484087c34e79"

MINIFAS_URL="https://raw.githubusercontent.com/facenox/face-antispoof-onnx/main/models/best_model_quantized.onnx"
MINIFAS_SHA="fde20585635cae62ed1d41796f76b6f8bc4b92cd91ec1cf0f1bc6485d2d587a9"

descargar() {
  local url="$1" destino="$2" esperado="$3"
  if [[ -f "$destino" ]]; then
    echo "Ya existe: $destino"
  else
    echo "Descargando: $destino"
    curl -fL --retry 3 --progress-bar "$url" -o "$destino"
  fi
  local real
  real="$(sha256sum "$destino" | awk '{print $1}')"
  if [[ "$real" != "$esperado" ]]; then
    echo "ERROR: checksum no coincide para $destino" >&2
    echo "esperado: $esperado" >&2
    echo "real:     $real" >&2
    exit 1
  fi
  echo "OK: $destino"
}

descargar "$YUNET_URL"   "$MODELS_DIR/face_detection_yunet_2026may.onnx"   "$YUNET_SHA"
descargar "$SFACE_URL"   "$MODELS_DIR/face_recognition_sface_2021dec.onnx" "$SFACE_SHA"
descargar "$MINIFAS_URL" "$MODELS_DIR/best_model_quantized.onnx"           "$MINIFAS_SHA"
EOF

chmod +x scripts/descargar_modelos.sh
./scripts/descargar_modelos.sh
```

> ⚠️ Los SHA-256 y tamaños de los tres modelos los comprobé contra sus repositorios (para YuNet y SFace, contra el puntero de Git LFS de OpenCV Zoo). **No descargué yo YuNet ni SFace** desde estas URLs, porque mi entorno no tiene acceso a ese dominio. Si el script falla con una URL, el checksum te protege: descarga el archivo desde el repositorio de OpenCV Zoo y colócalo a mano en `backend/models/`.

Verifica:

```bash
ls -l backend/models
sha256sum backend/models/*.onnx
```

Tamaños esperados: `229738`, `38696353` y `626197` bytes.

### 5.2 Licencias de los modelos

Descarga el archivo `LICENSE` de cada proyecto y guárdalo en `backend/models/LICENSES/`:

```
backend/models/LICENSES/
├── yunet-LICENSE          (OpenCV Zoo, carpeta models/face_detection_yunet)
├── sface-LICENSE          (OpenCV Zoo, carpeta models/face_recognition_sface)
└── facenox-LICENSE        (repositorio facenox/face-antispoof-onnx)
```

> ⚠️ Confirma en cada repositorio que la ruta del archivo es esa y que la licencia sigue siendo la declarada. Esa carpeta es obligatoria por Apache 2.0 (conservar el texto de la licencia).

---

## 6. Levantar Docker

### 6.1 Preparar el entorno

```bash
cp .env.example .env
openssl rand -hex 32     # copia el resultado en JWT_SECRET
openssl rand -hex 16     # úsalo como POSTGRES_PASSWORD
nano .env
```

### 6.2 Arrancar

```bash
docker compose up -d --build
docker compose ps
docker compose logs -f backend
```

Prueba (con `-k` porque aún no confías en el certificado):

```bash
curl -k https://localhost/health
curl -k https://localhost/api/health
```

Debe responder `{"status":"ok"}` y `{"status":"ok","db":"ok"}`. Documentación: `https://localhost/api/docs`.

Si el puerto 80 o el 443 están ocupados:

```bash
sudo ss -ltnp | grep -E ':80 |:443 '
```

y cambia los puertos en `docker-compose.yml` (por ejemplo `"8080:80"` y `"8443:443"`).

### 6.3 Confiar en el certificado interno  *(corrección 1)*

Caddy generó su propia autoridad certificadora. Extrae su certificado raíz:

```bash
docker compose cp proxy:/data/caddy/pki/authorities/local/root.crt ./caddy-root.crt
```

Instálalo en **cada equipo** que usará el sistema (técnicos y cafeterías). En Firefox: Ajustes → Privacidad y seguridad → Certificados → Ver certificados → Autoridades → Importar. En Chrome/Chromium en Linux: Ajustes → Privacidad y seguridad → Seguridad → Administrar certificados → Autoridades → Importar. Marca "confiar para identificar sitios web".

Para que el nombre de host funcione en la red local, pídele a quien administre el DNS de la universidad que apunte `becas.universidad.local` (o el nombre que elijas) a la IP del servidor. Mientras tanto, en cada PC puedes agregar una línea al archivo `/etc/hosts`:

```
IP_DEL_SERVIDOR   becas.universidad.local
```

y poner `SITE_ADDRESS=becas.universidad.local` en el `.env` del servidor.

### 6.4 Comandos útiles

```bash
docker compose logs -f backend
docker compose exec db psql -U becas -d becas -c "SELECT 1;"
docker compose down
docker compose down -v      # borra la base de datos
```

---

## 7. Spike facial y calibración  *(correcciones 4 y 5)*

### 7.1 `scripts/requirements-spike.txt`

```bash
cat > scripts/requirements-spike.txt <<'EOF'
numpy==2.5.4
opencv-python==5.0.0.93
onnxruntime==1.31.1
EOF
```

Se usa `opencv-python` (con ventana) y no `-headless`, porque el spike muestra la cámara.

### 7.2 `scripts/spike_facial.py`

Cambios respecto al original:
- Imprime la forma de entrada y salida del modelo de liveness para que la compares con su README.
- **Promedia 5 fotogramas** de liveness antes de decidir.
- **No permite enrolar** si el liveness no pasa.

```bash
cat > scripts/spike_facial.py <<'EOF'
"""Spike facial: YuNet + SFace + MiniFASNet (facenox) con webcam.

Teclas:
  e = enrolar el rostro actual (solo si el liveness pasa)
  v = imprimir el último estado en la terminal
  q = salir
"""
from __future__ import annotations

import argparse
from collections import deque
from pathlib import Path

import cv2
import numpy as np
import onnxruntime as ort

ROOT = Path(__file__).resolve().parent.parent
MODELS = ROOT / "backend" / "models"

YUNET = MODELS / "face_detection_yunet_2026may.onnx"
SFACE = MODELS / "face_recognition_sface_2021dec.onnx"
MINIFAS = MODELS / "best_model_quantized.onnx"

SFACE_COSINE = getattr(cv2, "FaceRecognizerSF_FR_COSINE", 0)


def load_liveness(path: Path):
    opts = ort.SessionOptions()
    opts.graph_optimization_level = ort.GraphOptimizationLevel.ORT_ENABLE_ALL
    session = ort.InferenceSession(
        str(path), sess_options=opts, providers=["CPUExecutionProvider"]
    )
    entrada = session.get_inputs()[0]
    salida = session.get_outputs()[0]
    # VERIFICA estos datos contra el README de facenox/face-antispoof-onnx:
    print(f"[liveness] entrada: {entrada.name} {entrada.shape} {entrada.type}")
    print(f"[liveness] salida : {salida.name} {salida.shape} {salida.type}")
    return session, entrada.name


def crop_square(img, bbox, expansion: float = 1.5):
    x, y, w, h = bbox
    max_dim = max(w, h)
    cx, cy = x + w / 2, y + h / 2
    size = int(max_dim * expansion)
    x1 = int(cx - size / 2)
    y1 = int(cy - size / 2)
    x2 = x1 + size
    y2 = y1 + size
    ih, iw = img.shape[:2]
    crop = img[max(0, y1):min(ih, y2), max(0, x1):min(iw, x2)]
    if crop.size == 0:
        raise ValueError("crop vacío")
    return cv2.copyMakeBorder(
        crop,
        max(0, -y1), max(0, y2 - ih), max(0, -x1), max(0, x2 - iw),
        cv2.BORDER_REFLECT_101,
    )


def preprocess_liveness(img_rgb, size: int = 128):
    h, w = img_rgb.shape[:2]
    ratio = size / max(h, w)
    nw, nh = int(w * ratio), int(h * ratio)
    interp = cv2.INTER_LANCZOS4 if ratio > 1.0 else cv2.INTER_AREA
    resized = cv2.resize(img_rgb, (nw, nh), interpolation=interp)
    dw, dh = size - nw, size - nh
    top, bottom = dh // 2, dh - dh // 2
    left, right = dw // 2, dw - dw // 2
    padded = cv2.copyMakeBorder(
        resized, top, bottom, left, right, cv2.BORDER_REFLECT_101
    )
    return padded.transpose(2, 0, 1).astype(np.float32) / 255.0


def liveness_diff(session, input_name, img_rgb) -> float:
    """real - spoof. Supone logits [real, spoof]: VERIFICAR contra el README."""
    batch = preprocess_liveness(img_rgb)[None, ...]
    logits = session.run([], {input_name: batch})[0][0]
    return float(logits[0]) - float(logits[1])


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--camera", type=int, default=0)
    parser.add_argument("--threshold", type=float, default=0.363)
    parser.add_argument("--liveness-logit-threshold", type=float, default=0.0)
    parser.add_argument("--liveness-frames", type=int, default=5)
    args = parser.parse_args()

    for p in (YUNET, SFACE, MINIFAS):
        if not p.exists():
            raise SystemExit(f"Falta el modelo: {p}. Ejecuta scripts/descargar_modelos.sh")

    detector = cv2.FaceDetectorYN.create(str(YUNET), "", (320, 320), 0.9, 0.3, 5000)
    recognizer = cv2.FaceRecognizerSF.create(str(SFACE), "")
    liveness, liveness_input = load_liveness(MINIFAS)

    cap = cv2.VideoCapture(args.camera)
    if not cap.isOpened():
        raise SystemExit(f"No se pudo abrir la cámara {args.camera}")

    enrolled = None
    ultimo = ""
    hist: deque[float] = deque(maxlen=args.liveness_frames)
    live_ok = False

    while True:
        ok, frame = cap.read()
        if not ok:
            break

        h, w = frame.shape[:2]
        detector.setInputSize((w, h))
        _, faces = detector.detect(frame)

        if faces is None or len(faces) == 0:
            hist.clear()
            live_ok = False
        else:
            face = max(faces, key=lambda f: f[2] * f[3])
            x, y, fw, fh = [int(v) for v in face[:4]]
            cv2.rectangle(frame, (x, y), (x + fw, y + fh), (0, 255, 0), 2)
            try:
                rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
                hist.append(liveness_diff(liveness, liveness_input, crop_square(rgb, (x, y, fw, fh))))
                media = sum(hist) / len(hist)
                lleno = len(hist) == hist.maxlen
                live_ok = lleno and media >= args.liveness_logit_threshold

                feature = recognizer.feature(recognizer.alignCrop(frame, face))
                estado = (
                    f"liveness={'OK' if live_ok else ('SPOOF' if lleno else '...')} "
                    f"d={media:.2f}"
                )
                if enrolled is not None:
                    score = float(recognizer.match(enrolled, feature, SFACE_COSINE))
                    estado += f" | match={score:.3f} {'OK' if score >= args.threshold else 'NO'}"
                color = (0, 255, 0) if live_ok else (0, 0, 255)
                cv2.putText(frame, estado, (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 0.6, color, 2)
                ultimo = estado
            except Exception as exc:
                cv2.putText(frame, f"error: {exc}", (10, 30),
                            cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 0, 255), 1)

        cv2.putText(frame, "e=enrolar v=estado q=salir", (10, h - 15),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 255, 255), 1)
        cv2.imshow("Spike facial", frame)

        key = cv2.waitKey(1) & 0xFF
        if key == ord("q"):
            break
        if key == ord("e"):
            if faces is not None and len(faces) > 0 and live_ok:
                face = max(faces, key=lambda f: f[2] * f[3])
                enrolled = recognizer.feature(recognizer.alignCrop(frame, face)).copy()
                print("Rostro enrolado en memoria.")
            else:
                print("No se enrola: sin rostro o liveness no válido.")
        if key == ord("v"):
            print(f"Último estado: {ultimo}")

    cap.release()
    cv2.destroyAllWindows()


if __name__ == "__main__":
    main()
EOF
```

Ejecutar:

```bash
python3 -m venv .venv-spike
source .venv-spike/bin/activate
pip install --upgrade pip
pip install -r scripts/requirements-spike.txt
python scripts/spike_facial.py --camera 0
```

Si no encuentra la cámara: `v4l2-ctl --list-devices` y prueba `--camera 1`.

**Antes de confiar en el resultado de liveness (⚠️):** compara lo que imprime `[liveness] entrada/salida` con el README de `facenox/face-antispoof-onnx`. Debes confirmar tres cosas: el tamaño de entrada (el script usa 128 × 128), la normalización (el script divide entre 255 y no resta media) y el orden de las salidas (el script supone `[real, spoof]`). Si algo difiere, ajusta `preprocess_liveness` y `liveness_diff`.

Pruebas rápidas:
1. Tu rostro real: `liveness=OK`, y tras pulsar `e`, `match` alto.
2. Una foto impresa y la pantalla de un celular con tu foto: debe decir `SPOOF`.
3. Otra persona: `match` bajo.

### 7.3 Calibración con muchas personas: `scripts/calibrar.py`  *(corrección 5)*

El spike es una prueba de humo. Para elegir el umbral hacen falta datos de muchas personas.

**Protocolo mínimo:**
- Unas **20 personas** (compañeros, voluntarios).
- **3 a 5 fotos de cada una**, tomadas con **la misma cámara y la luz de la cafetería**, algunas con lentes y otras sin ellos.
- Guárdalas así (esa carpeta está en `.gitignore`; son datos biométricos y **no se suben al repositorio**):

```
fotos_calibracion/
├── persona01/  foto1.jpg foto2.jpg foto3.jpg
├── persona02/  ...
```

```bash
cat > scripts/calibrar.py <<'EOF'
"""Calcula distribuciones de similitud 'misma persona' vs 'personas distintas'.

Uso: python scripts/calibrar.py fotos_calibracion
"""
from __future__ import annotations

import itertools
import sys
from pathlib import Path

import cv2
import numpy as np

ROOT = Path(__file__).resolve().parent.parent
MODELS = ROOT / "backend" / "models"
YUNET = MODELS / "face_detection_yunet_2026may.onnx"
SFACE = MODELS / "face_recognition_sface_2021dec.onnx"
COSINE = getattr(cv2, "FaceRecognizerSF_FR_COSINE", 0)


def main() -> None:
    if len(sys.argv) != 2:
        raise SystemExit("Uso: python scripts/calibrar.py CARPETA_FOTOS")
    carpeta = Path(sys.argv[1])

    detector = cv2.FaceDetectorYN.create(str(YUNET), "", (320, 320), 0.9, 0.3, 5000)
    recognizer = cv2.FaceRecognizerSF.create(str(SFACE), "")

    personas: dict[str, list[np.ndarray]] = {}
    for d in sorted(p for p in carpeta.iterdir() if p.is_dir()):
        feats = []
        for ruta in sorted(d.iterdir()):
            img = cv2.imread(str(ruta))
            if img is None:
                continue
            h, w = img.shape[:2]
            detector.setInputSize((w, h))
            _, faces = detector.detect(img)
            if faces is None or len(faces) != 1:
                print(f"  omitida (rostros detectados != 1): {ruta}")
                continue
            feats.append(recognizer.feature(recognizer.alignCrop(img, faces[0])).copy())
        if len(feats) >= 2:
            personas[d.name] = feats
        else:
            print(f"  persona descartada (menos de 2 fotos válidas): {d.name}")

    if len(personas) < 2:
        raise SystemExit("Se necesitan al menos 2 personas con 2 fotos válidas.")

    genuinos = [
        float(recognizer.match(a, b, COSINE))
        for feats in personas.values()
        for a, b in itertools.combinations(feats, 2)
    ]
    impostores = [
        float(recognizer.match(a, b, COSINE))
        for (_, f1), (_, f2) in itertools.combinations(personas.items(), 2)
        for a in f1 for b in f2
    ]
    g, i = np.array(genuinos), np.array(impostores)

    print(f"\nPersonas: {len(personas)} | pares misma persona: {len(g)} | pares distintos: {len(i)}")
    print(f"Misma persona : mín={g.min():.3f}  p5={np.percentile(g, 5):.3f}  mediana={np.median(g):.3f}")
    print(f"Personas dist.: máx={i.max():.3f}  p95={np.percentile(i, 95):.3f}  mediana={np.median(i):.3f}")

    print("\numbral | rechazo a la persona correcta (FRR) | aceptación de otra persona (FAR)")
    for t in np.arange(0.20, 0.61, 0.05):
        frr = float((g < t).mean()) * 100
        far = float((i >= t).mean()) * 100
        print(f" {t:.2f}  |        {frr:5.1f} %                |        {far:5.2f} %")

    sugerido = round(float(i.max()) + 0.01, 3)
    print(f"\nPrimer umbral con FAR = 0 en esta muestra: {sugerido}")
    print("Con pocas personas esto es una estimación optimista: úsalo como punto de partida,")
    print("elige el umbral con la persona encargada y repite la prueba en cada cafetería.")


if __name__ == "__main__":
    main()
EOF
```

```bash
python scripts/calibrar.py fotos_calibracion
```

Con el resultado, ajusta `FACE_MATCH_THRESHOLD` en tu `.env`. Un umbral alto rechaza más a la persona correcta (se enoja la fila); uno bajo acepta a la equivocada (se cuela alguien). Para una beca alimentaria, con una persona supervisando, suele ser preferible un umbral algo conservador y apoyarse en la aprobación manual con motivo cuando el sistema no reconozca a alguien.

---

## 8. Primer commit y push

```bash
cd "$HOME/proyectos/beca-alimentaria"

git init
git add .
git status
```

Verifica que:
- `.env`, `.venv-spike/`, `fotos_calibracion/` y `caddy-root.crt` **no** aparezcan.
- `backend/models/*.onnx` y `backend/models/LICENSES/*` **sí** aparezcan.

```bash
git commit -m "chore: estructura inicial, Docker con HTTPS y modelos ONNX verificados"
git branch -M main
git remote add origin git@github.com:TU_USUARIO/beca-alimentaria.git
git push -u origin main

git checkout -b develop
git push -u origin develop
```

Comprobación final:

```bash
git ls-files | grep -E '(^|/)\.env$|\.venv|fotos_calibracion|caddy-root' || echo "OK: sin secretos ni datos biométricos"
git ls-files backend/models
```

En el sitio del repositorio, protege `main` y `develop` para exigir Pull Request y una revisión. Nunca subas `.env`.

Flujo diario:

```bash
git checkout develop && git pull
git checkout -b feature/nombre-corto
# trabajas...
git add . && git commit -m "feat(estudiantes): alta y búsqueda por credencial"
git push -u origin feature/nombre-corto
# abres Pull Request hacia develop
```

---

## 9. Criterios para continuar

No avances al CRUD hasta cumplir todo esto:

- [ ] `docker compose ps` muestra `db`, `backend` y `proxy` arriba y sanos.
- [ ] `curl -k https://localhost/api/health` devuelve `{"status":"ok","db":"ok"}`.
- [ ] Los 3 modelos existen y sus SHA-256 coinciden.
- [ ] `backend/models/LICENSES/` tiene los 3 archivos de licencia.
- [ ] Confirmaste en el README de facenox el tamaño de entrada, la normalización y el orden de salidas del modelo de liveness.
- [ ] El spike detecta rostro, enrola y verifica.
- [ ] El spike marca `SPOOF` con una foto impresa y con una pantalla.
- [ ] Corriste `calibrar.py` con unas 20 personas y anotaste el resultado.
- [ ] La cámara funciona desde **otra PC** de la red usando `https://NOMBRE_DEL_HOST` con el certificado instalado.
- [ ] El repositorio está en GitHub (o Forgejo), sin secretos, con `main` y `develop` protegidas.

Si el liveness pasivo falla mucho:
1. Ajusta el umbral y exige más fotogramas.
2. Agrega un reto activo con MediaPipe (parpadeo o giro de cabeza).
3. Apóyate en la supervisión de la persona de cafetería.

---

## 10. Sprints siguientes, alineados con lo acordado  *(correcciones 6, 8 y 15)*

### Sprint 0: Núcleo
- `alembic init` dentro del contenedor y primera migración.
- Login con JWT, **refresh token** (las cafeterías no pueden perder sesión en pleno servicio) y protección por rol.
- Roles como `enum`: `superadmin`, `admin`, `cafeteria`. El usuario de cafetería queda ligado a **una sola** cafetería.
- Seed del primer SuperAdmin y de las dos cafeterías.

### Esquema de base de datos completo

| Tabla | Campos clave |
|---|---|
| `usuarios` | id, username, password_hash, nombre, rol (enum), cafeteria_id (nulo salvo rol cafetería), activo |
| `cafeterias` | id, nombre, activa |
| `periodos` | id, nombre, fecha_inicio, fecha_fin, max_faltas (6), umbral_alerta (5), activo |
| `periodo_cafeteria` | periodo_id, cafeteria_id, **cupo** (configurable; hoy ~100 y ~200) |
| `parciales` | id, periodo_id, numero (1 a 3), fecha_inicio, fecha_fin |
| `tipos_servicio` | id, nombre (desayuno/comida), hora_inicio (07:30 / 13:00), hora_fin (12:00 / 15:30) |
| `dias_inhabiles` | id, periodo_id, fecha_inicio, fecha_fin, motivo, creado_por |
| `estudiantes` | id, matricula (única), nombres, apellidos, carrera, contacto, activo |
| `credenciales` | id, estudiante_id, codigo (10 dígitos), **tipo (`ficha`/`credencial`)**, activa, creada_en, desactivada_en |
| `becas` | id, estudiante_id, periodo_id, cafeteria_id, **estatus (`activa`/`pendiente_baja`/`cancelada`/`finalizada`)**, fecha_activacion, fecha_cancelacion, motivo |
| `lista_espera` | id, periodo_id, nombres, apellidos, matricula (opcional), contacto, posicion (editable), estatus (`esperando`/`promovido`/`descartado`), creado_en |
| `rostros` | id, estudiante_id, **embedding (bytea, 128 floats de SFace)**, version_modelo, calidad, creado_por, creado_en |
| `asistencias` | id, beca_id, cafeteria_id, tipo_servicio_id, fecha_hora, similitud, liveness_score, metodo_identificacion (`credencial`/`matricula_manual`), origen (`normal`/`contingencia`), motivo, registrado_por |
| `faltas` | id, beca_id, tipo_servicio_id, fecha, anulada, motivo_anulacion, anulada_por |
| `alertas` | id, beca_id, tipo (`riesgo` a las 5 / `baja` a las 6), estatus (`pendiente`/`atendida`), creada_en, atendida_por, atendida_en |
| `intentos_verificacion` | id, estudiante_id (nulo), cafeteria_id, fecha_hora, resultado, similitud, motivo (sin foto) |
| `auditoria` | id, usuario_id, accion, entidad, entidad_id, detalle (JSON), creado_en |

Restricciones clave:
- `UNIQUE (estudiante_id, periodo_id)` en `becas`.
- `UNIQUE (beca_id, fecha, tipo_servicio_id)` en `asistencias` y en `faltas` (evita duplicados si el proceso corre dos veces).
- `codigo` de `credenciales` único **solo entre las activas** (índice parcial).
- El contador de faltas cuenta las que tienen `anulada = false`.

### Sprint 1: Registro de alumnos
- CRUD de estudiantes con búsqueda por matrícula y por código de credencial.
- Credenciales con historial (la ficha del propedéutico se reemplaza por la definitiva sin perder el rostro).
- Alta de beca con **cafetería indicada en la lista del técnico** y control de cupo configurable.
- Consentimiento biométrico.
- Auditoría de altas, ediciones y bajas.
- Pantallas de Angular: login, lista de estudiantes y formulario de registro con captura del lector (el lector actúa como teclado; escucha las teclas a nivel de ventana y agrupa las que llegan muy rápido, con Enter al final).
- Importación de lista: **opcional** (ver §11).

### Sprint 2: Biometría
- Mover el spike a `backend/app/facial/motor_opencv.py` y `liveness.py`, detrás de una interfaz `MotorFacial`.
- Enrolamiento con 3 a 5 fotos y liveness también al enrolar.
- Verificación 1:1 y detección de duplicados 1:N antes de guardar.
- Repositorio de rostros en Postgres (`bytea`), identificando por `estudiante_id`.
- Pruebas con fotos reales de la universidad.

### Sprints 3 a 5
- **Asistencia en cafetería**: credencial o matrícula tecleada, luego rostro, resultado y reinicio automático. Contingencia con registro manual posterior y auditoría.
- **Faltas y alertas**: planificador al cerrar cada ventana (12:05 y 15:35), solo lunes a viernes y sin días inhábiles. Alertas a las 5 y 6 faltas. La sexta pasa la beca a `pendiente_baja` y un Admin confirma. Botón "Anular faltas del día".
- **Reportes**: PDF por parcial, con WeasyPrint.

---

## 11. Preguntas que siguen abiertas

1. **¿Habrá una lista digital de aceptados?** Si alguien la captura en Excel/CSV, vale la pena importarla (el técnico solo escanea y confirma). Si es solo papel, se omite la importación.
2. **Orden de la lista de espera**: llegada, puntaje de la entrevista o decisión manual del Admin. El campo `posicion` editable cubre los tres.
3. **Contenido del PDF por parcial.** Propuesta, por cafetería: fechas del parcial, becarios activos, asistencias y faltas, porcentaje de asistencia, tabla por alumno, altas y bajas del parcial y alumnos en riesgo. ¿Piden algo más las autoridades?
4. **Servidor real**: sistema operativo, RAM y nombre de host. Una máquina de 4 núcleos y 8 GB sobra para esta carga.
5. **Fichas de nuevo ingreso**: confirma con dos credenciales distintas que cada ficha devuelve un código diferente.
6. **Licencias de los modelos** (⚠️): revisa los `LICENSE` actuales y, antes del piloto, que el área jurídica valide el uso de datos biométricos y el aviso de privacidad. Yo no soy abogado.
7. **Rostros entre semestres**: dijiste que se conservan. Define por cuánto tiempo y cuándo se borran (por ejemplo, al egresar el alumno).
