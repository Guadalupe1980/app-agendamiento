import { useState } from "react";
import { supabase } from "../utils/supabase";

function Login() {
  const [formulario, setFormulario] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) =>
    setFormulario({ ...formulario, [e.target.name]: e.target.value });

  async function handleSubmit(e) {
    e.preventDefault()
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: formulario.email ,
        password: formulario.password,

      });
      if (error) {
      console.error("Problemas con el inicio de secion");
    } else {
      console.log("Inicio de secion exitoso!");
    }
    } catch (error) {
        console.error(error);   
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input type="text" name="email" onChange={handleChange} />
        <input type="text" name="password" onChange={handleChange} />
        <input type="submit" value="Iniciar Secion" />
      </form>
    </div>
  );
}

export default Login;