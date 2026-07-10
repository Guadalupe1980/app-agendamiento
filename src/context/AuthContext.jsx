import { useEffect, useState } from "react";
import { createContext } from "react";
import { supabase } from "../utils/supabase";

const AuthContext = createContext();

function AuthProvider({ children }) {
  const [session, setSession] = useState(null); //verifica que la secion exista
  const [loading, setLoading] = useState(true); //estado de carga para la demora de traer los datos
  const [perfil, setPerfil] = useState(null); //Guarda el perfil traido de la funcion traer Perfil

  useEffect(() => {
    //verificar si hay una seccion activa
    async function verificarSesion() {
      const { data, error } = await supabase.auth.getSession(); //detecta el inicio de secion activa
      setLoading(false);
      setSession(data.session); //almacena la secion activa, ojo solo nos metemos al apartado de seccion del objeto de getSession
      if (error) {
        console.log("Problemas con identificar la secion");
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
    if (!session) { // verificamos si el inicio de secion tiene valor
      return;
    }
    async function traerPerfil() {
      try {
        const { data, error } = await supabase
          .from("perfiles")
          .select("*")
          .eq("id", session.user.id)
          .single(); //Devuelve un valor unico
        setPerfil(data);
        if (error) {
          console.error("Problemas en traer el perfil");
        } else {
          console.log("perfil cargado exitosamente");
        }
      } catch (error) {
        console.error(error);
      }
    }
    traerPerfil();
  }, [session]);

  //Cerrar Secion
  async function cerrarSesion() {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Problemas con cerrar sesion");
    } else {
      console.log("Secion Cerrada correctamente");
    }
  }

  const value = { session, loading, perfil, cerrarSesion };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export { AuthContext, AuthProvider };
