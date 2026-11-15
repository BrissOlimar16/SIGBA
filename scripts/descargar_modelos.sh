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
