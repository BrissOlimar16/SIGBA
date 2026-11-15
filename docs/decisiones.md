# Decisiones de diseño

1. **Sin InsightFace en producción.** El código es MIT, pero los modelos preentrenados (`buffalo_l`) son solo para uso no comercial.
2. **YuNet + SFace + MiniFASNet.** Licencias permisivas, CPU, sin descargas en tiempo de ejecución.
3. **Modelos versionados en el repositorio.** El sistema no depende de servidores de terceros.
4. **HTTPS interno.** El navegador exige HTTPS para usar la cámara fuera de localhost.
5. **bytea y no pgvector.** 300 a 500 alumnos, verificación 1:1.
6. **La sexta falta no cancela sola.** La beca pasa a `pendiente_baja` y un Admin confirma.
7. **Umbrales provisionales.** Se calibran con rostros reales (`scripts/calibrar.py`).
