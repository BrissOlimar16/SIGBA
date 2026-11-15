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
