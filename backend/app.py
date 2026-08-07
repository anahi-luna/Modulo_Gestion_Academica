from flask import Flask
from flask_cors import CORS
from config.config import Config
from extensions import db, ma
from routes import *
from seed.seed_data import cargar_datos_iniciales
from models import *
from auth_common import AuthCommon
from utils.auth_registro import registrar_acciones
from flask_jwt_extended import JWTManager

#Crea y configura la aplicación Flask.
def create_app():

    app = Flask(__name__) #Inicializar app 

    # Cargar configuración
    app.config.from_object(Config)

    # Habilitar CORS
    CORS(app)

    # Inicializar extensiones
    db.init_app(app)
    ma.init_app(app)

    jwt_manager = JWTManager(app)

    def guardar_log(evento):
        """
        Callback que auth_common invoca desde su hook after_request (o
        teardown_request, para excepciones no controladas) con el
        evento ya armado y sanitizado. Inserta en la tabla
        logs_auditoria propia de Inscripción, usando el mismo
        db.session que el resto de la app.
        """
        log = LogAuditoria(
            request_id=evento["request_id"],
            metodo_http=evento["metodo_http"],
            endpoint=evento["endpoint"],
            path=evento["path"],
            query_params=evento["query_params"],
            request_body=evento["request_body"],
            response_body=evento["response_body"],
            status_code=evento["status_code"],
            duracion_ms=evento["duracion_ms"],
            ip_origen=evento["ip_origen"],
            user_agent=evento["user_agent"],
            id_usuario=evento["id_usuario"],
            roles=evento["roles"],
            error_type=evento["error_type"],
            error_message=evento["error_message"],
        )
        db.session.add(log)
        db.session.commit()

    # Inicializar Auth Common
    AuthCommon(app, guardar_log=guardar_log)


    app.register_blueprint(inscripcion_bp, url_prefix="/inscripciones")
    app.register_blueprint(clase_bp, url_prefix="/clases")
    app.register_blueprint(asistencia_bp, url_prefix ="/asistencias")
    app.register_blueprint(evaluacion_bp,url_prefix ="/evaluaciones")
    app.register_blueprint(calificacion_bp,url_prefix ="/calificaciones")
    app.register_blueprint(resultado_academico_bp,url_prefix ="/resultados-academicos")
    app.register_blueprint(resultado_plan_bp, url_prefix ="/resultados-planes")
    app.register_blueprint(certificado_bp, url_prefix ="/certificados")
    app.register_blueprint(catalogo_bp, url_prefix="/catalogos")
    
    # Ruta de prueba
    @app.route("/status")
    def home():
        return {
            "status":"success",
            "message":"Microservicio de Gestion Academica funcionando"
        }
    
    return app

app = create_app()

# Solo se ejecuta al iniciar la aplicación directamente.
# Crea las tablas y carga los datos iniciales.
if __name__ == "__main__":
    with app.app_context():
        db.create_all()
        cargar_datos_iniciales()
        registrar_acciones()

    app.run(
        host="0.0.0.0",
        port = 5000,
        debug=True
    )