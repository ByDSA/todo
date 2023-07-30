#!/bin/bash
set -e

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]:-$0}")" &>/dev/null && pwd 2>/dev/null)"
PROJECT_PATH=$(realpath "$SCRIPT_DIR"/../../..)

source "$PROJECT_PATH"/bin/.core/import_env.sh

echo "Carpeta raíz del proyecto" "$PROJECT_PATH"

echo "Limpiando node_modules ..."
cd "$PROJECT_PATH"
sudo yarn clean

docker compose up
