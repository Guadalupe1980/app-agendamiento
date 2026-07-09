import { useEffect, useState } from "react";
import { createContext } from "react";
import { supabase } from "../utils/supabase";

const AuthContext = createContext();

function AuthProvider({ children }) {
  const [session, setSession] = useState(null); //verifica que la secion exista
  const [loading, setLoading] = useState(true); //estado de carga para la demora de traer los datos
  const [perfil, setPerfil] = useState(null); //Guarda el perfil traido de la funcion traer Perfil

  useEffect(() => {
    async function verificarSesion() {
      const { data, error } = await supabase.auth.getSession(); //detecta el inicio de secion activa
      setSession(data); //alamacena la secion activa
      setLoading(false);
      if (error) {
        console.log("Problemas en iniciar la secion");
      } else {
        console.log("Secion identificada");
        //console.log(data);
      }
    }
    verificarSesion();
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT") {
        setSession(null);
      } else if (session) {
        setSession(session);
      }
    });
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  //trae el perfil del usuario de la secion activa
useEffect(() => {
  async function traerPerfil() {
    try {
      const { data } = await supabase
        .from("perfiles")
        .select("*")
        .eq("id", session.user.id)
        .single(); //Devuelve un valor unico
      setPerfil(data);
      if (error) {
        console.error("Problemas en iniciar el perfil");
      } else {
        console.log("perfil cargado exitosamente");
      }
    } catch (error) {
      console.error(error);
    }
  }
  traerPerfil();
}, [session]);


async function cerrarSesion() {
  const { error } = await supabase.auth.signOut()
  if (error) {
    console.error("Problemas con cerrar sesion");
  } else {
    console.log("Secion Cerrada exitosamente");
  }
}


  const value = { session, loading };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export { AuthContext, AuthProvider };
