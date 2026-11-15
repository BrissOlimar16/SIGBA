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

## Frontend (desarrollo)
1. `cd frontend`
2. `npm install`
3. `npm start`

El servidor de desarrollo queda en `http://localhost:4200` y redirige `/api` al backend en `http://localhost:8000`.
Para compilar: `npm run build`; la salida queda en `frontend/dist/frontend`.

## Spike facial y calibración
Ver `scripts/spike_facial.py` y `scripts/calibrar.py`. Requieren Python 3.12 o superior.

## Licencias
Ver `THIRD_PARTY_NOTICES.md` y `docs/licencias.md`.
