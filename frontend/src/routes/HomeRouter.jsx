import useAuth from "../auth/hooks/useAuth";
import HomeAdmin from "../pages/HomeAdmin";
import HomeAlumno from "../pages/HomeAlumno";

export default function HomeRouter(){
    const {hasPermission} = useAuth();

    if(hasPermission("inscripcion.inscripciones.leer")) {
        return <HomeAdmin/>;
    }

    return <HomeAlumno/>;
}