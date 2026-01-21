#!/bin/sh
set -eu

# --- CONFIGURA ESTO ---
REPO_DIR="/volume1/docker/n8n"   # Ruta al repo en tu Synology
REMOTE="origin"
BRANCH="main"                   # o "master" o la rama que uses
CLEAN_UNTRACKED="true"          # "true" borra también archivos no trackeados; "false" los conserva
# ----------------------

echo "[INFO] Repo: $REPO_DIR"
cd "$REPO_DIR"

# Validación básica
if [ ! -d ".git" ]; then
  echo "[ERROR] No parece un repo git: $REPO_DIR"
  exit 1
fi

echo "[INFO] Fetch de $REMOTE..."
git fetch --prune "$REMOTE"

# Asegura que estamos en la rama correcta
CURRENT_BRANCH="$(git rev-parse --abbrev-ref HEAD)"
if [ "$CURRENT_BRANCH" != "$BRANCH" ]; then
  echo "[INFO] Cambiando de rama: $CURRENT_BRANCH -> $BRANCH"
  git checkout "$BRANCH"
fi

echo "[INFO] Hard reset a $REMOTE/$BRANCH (sobrescribe cambios locales)..."
git reset --hard "$REMOTE/$BRANCH"

if [ "$CLEAN_UNTRACKED" = "true" ]; then
  echo "[INFO] Eliminando archivos no trackeados (git clean -fd)..."
  git clean -fd
else
  echo "[INFO] Manteniendo archivos no trackeados (sin git clean)."
fi

# Pull final (en realidad ya estás alineado con el remoto, pero asegura que queda todo actualizado)
echo "[INFO] Pull final..."
git pull --ff-only "$REMOTE" "$BRANCH" || true

echo "[OK] Repo actualizado y local limpiado. Estado:"
git status -sb