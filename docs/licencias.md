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
