#Genera una respuesta exitosa con el formato estándar del proyecto.
def success_response(data=None, message="", total=None,status_code = 200):
    
    response = {
        "status": "success",
        "data": data if data is not None else [],
        "message": message
    }

    if total is not None:
        response["total"] = total

    return response, status_code

#Genera una respuesta de error con el formato estándar del proyecto.
def error_response(message, errors=None, status_code=400):
    
    response = {
        "status": "error",
        "message": message
    }

    if errors:
        response["errors"] = errors

    return response, status_code