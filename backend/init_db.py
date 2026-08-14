from app import app
from extensions import db
from seed.seed_data import cargar_datos_iniciales
from utils.auth_registro import registrar_acciones


with app.app_context():
    db.create_all()
    cargar_datos_iniciales()
    registrar_acciones()