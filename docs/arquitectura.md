# Arquitectura

- `proxy`: Caddy con HTTPS (certificado interno). Más adelante sirve el Angular compilado.
- `backend`: FastAPI, reglas de negocio, YuNet + SFace, MiniFASNet, PDF y planificador de faltas.
- `db`: PostgreSQL 16. Los embeddings van en `bytea`.
- Red interna de Docker; solo `proxy` expone 80/443.
- Modelos ONNX versionados en `backend/models`, montados en modo lectura.
- Un worker de uvicorn; endpoints faciales con `def` (no `async def`).
- El cliente captura y muestra; el servidor decide (incluida la hora).
