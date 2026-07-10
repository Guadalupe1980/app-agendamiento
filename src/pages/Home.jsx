import { useEffect, useState } from "react";
import { supabase } from "../utils/supabase";
import { useContext } from "react";
import { AuthContext, AuthProvider } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function Home() {
  const {perfil, cerrarSesion} =useContext(AuthContext)
  const [servicios, setServicios] = useState([]);
  const navigate = useNavigate()

  useEffect(() => {
    async function traerServicios() {
      try {
        let { data } = await supabase.from("servicios").select("nombre, precio");
        setServicios(data);
      } catch (error) {
        console.error(error);
      }
    }
    traerServicios();
  }, []);

async function handLogOut(){
  await cerrarSesion ()
  navigate("/") //te redirecciona al home
}

  return (
    <>
      {console.log(perfil)}
      <h1>Home {perfil ? `Bienvenido ${perfil.nombre}`: "" }</h1>

      <section>
        {servicios.map((servicio, index) => (
          <p key={index}>{servicio.nombre}</p>
        ))}
      </section>
      <button onClick={cerrarSesion}>Cerrar secion</button>
    </>
  );
}

export default Home;
