from flask_sqlalchemy import SQLAlchemy # ORM para manejar la base de datos
from flask_marshmallow import Marshmallow  # Para serializar (objeto ↔ JSON)

# INSTANCIAS GLOBALES
db= SQLAlchemy()
# Instancia de SQLAlchemy SIN asociarla aún a la app
# (se conecta después con db.init_app(app))

ma= Marshmallow()
# Instancia de Marshmallow SIN asociarla aún a la app
# (se conecta después con ma.init_app(app))