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
