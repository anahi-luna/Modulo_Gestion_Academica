"""
Configuración de Gunicorn para el backend de Inscripciones.
"""

bind = "0.0.0.0:5000"

workers = 3
worker_class = "sync"

timeout = 30


def post_fork(server, worker):
    """
    Descarta las conexiones a PostgreSQL heredadas del proceso maestro
    para que cada worker utilice su propio pool de conexiones.
    """
    from app import app
    from extensions import db

    with app.app_context():
        db.engine.dispose()