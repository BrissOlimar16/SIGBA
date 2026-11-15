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
