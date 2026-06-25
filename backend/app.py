from flask import Flask
from flask_cors import CORS
from config.config import Config
from extensions import db, ma

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

    # Ruta de prueba
    @app.route("/")
    def home():
        return {
            "status":"success",
            "message":"Microservicio de Gestion Academica funcionando"
        }
    
    return app

app = create_app()

if __name__ == "__main__":
    with app.app_context():
        db.create_all()
    
    app.run(
        host="0.0.0.0",
        port = 5000,
        debug=True
    )