import logging

# ==========================================================
# Configuración general del sistema de logs.
# ==========================================================

logging.basicConfig(
    level=logging.INFO,
    format=(
        "%(asctime)s | "
        "%(levelname)s | "
        "%(filename)s:%(lineno)d | "
        "%(message)s"
    )
)

logger = logging.getLogger("gestion_academica")