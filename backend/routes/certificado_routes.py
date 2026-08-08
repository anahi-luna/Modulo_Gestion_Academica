from flask import Blueprint
from auth_common.decorador import requires_permission
from controllers.certificado_controller import *

certificado_bp = Blueprint("certificado_bp", __name__)

# Emitir certificado
certificado_bp.route("/", methods=["POST"])(
    requires_permission("inscripcion.certificados.emitir")(agregar_certificado)
)

# Obtener todos los certificados
certificado_bp.route("/", methods=["GET"])(
    requires_permission("inscripcion.certificados.leer")(get_lista_certificados)
)

# Obtener los certificados del alumno autenticado
certificado_bp.route("/mis-certificados", methods=["GET"])(
    requires_permission("inscripcion.certificados.leer")(obtener_mis_certificados)
)

# Obtener un certificado
certificado_bp.route("/<int:id_certificado>", methods=["GET"])(
    requires_permission("inscripcion.certificados.leer")(get_certificado)
)

# Modificar certificado
certificado_bp.route("/<int:id_certificado>", methods=["PUT"])(
    requires_permission("inscripcion.certificados.actualizar")(
        actualizar_certificado_controller
    )
)

# Eliminar certificado
certificado_bp.route("/<int:id_certificado>", methods=["DELETE"])(
    requires_permission("inscripcion.certificados.eliminar")(
        eliminar_certificado_controller
    )
)

# Adjuntar (o reemplazar) el archivo PDF de un certificado ya emitido.
# Mismo permiso que se usa para emitir: quien puede generar el
# certificado es quien puede adjuntarle el documento.
certificado_bp.route("/<int:id_certificado>/archivo", methods=["POST"])(
    requires_permission("inscripcion.certificados.emitir")(
        subir_archivo_certificado_controller
    )
)

# Descargar el archivo de un certificado. No lleva chequeo de permiso
# propio: el nombre del archivo es un UUID no adivinable y la URL solo
# se conoce a través del certificado (que sí está protegido por el
# permiso de lectura al listarlo). Mismo criterio que usa auth para
# los documentos legales.
certificado_bp.route("/archivos/<path:nombre_archivo>", methods=["GET"])(
    descargar_archivo_certificado_controller
)
