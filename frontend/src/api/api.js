import { LOGIN_ROUTE } from "../auth/config";

const API_URL = 
    import.meta.env.VITE_API_URL || "http://localhost:5000"; //se declara la url de la api general

export default API_URL; //lo exportamos para q lo usen en otros archivos. 

const API_PLANES =
    import.meta.env.VITE_API_URL_PLANES || "";

const API_AUTH =
    import.meta.env.VITE_API_URL_AUTH || "";
// Sobreescribimos la función fetch para agregar el token de autenticación a las solicitudes a nuestra API 
// Esto permite que todas las solicitudes a nuestra API incluyan automáticamente el token de autenticación
//  si está disponible en el sessionStorage.    

const STORAGE_KEY = "auth"; // mismo valor que auth/config.js 

const fetchOriginal = window.fetch;

window.fetch = async (url, options = {}) => {
    const esNuestraApi = typeof url === "string" && [
            API_URL,
            API_PLANES,
            API_AUTH,
        ]
            .filter(Boolean)
            .some(api => url.startsWith(api));

    if (!esNuestraApi) {
        return fetchOriginal(url, options);
    }

    let token = null;
    try {
        const sesion = JSON.parse(sessionStorage.getItem(STORAGE_KEY));
        token = sesion?.access_token ?? null;
    } catch {
        token = null;
    }

    const headers = {
        ...options.headers,
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };

    const response = await fetchOriginal(url, { ...options, headers });

    if(response.status === 401) {
        sessionStorage.removeItem(STORAGE_KEY);
        window.location.replace(LOGIN_ROUTE );
    }

    return response;
};