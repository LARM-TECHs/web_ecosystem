import { useNavigate, Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

export const ProtectedRoute = ( {rol, children }) => {
  const [token, setToken] = useState("");
  const [usuario, setUsuario] = useState({});
  const navigate = useNavigate();


  
  const fetchDatos = async () => {
    try {
   
      const storedToken = localStorage.getItem("token");
      setToken(storedToken);
      if(!token){
        return
      }
      const response = await axios.get(
        "http://localhost:3000/auth/verificar",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status !== 201) {
        navigate("/");
        return;
      }
      const data = response.data;
      setUsuario(data[0]);
    
    } catch (response) {
      if (response.status !== 201) {
        navigate("/");
      }
    }
  };

  useEffect(() => {fetchDatos();
  }, [token]);
  //navigate, usuario, token



 
 

  useEffect(() => {
    const validarRol = async () => {
  
    if(usuario.rol !== undefined){
      
      if (usuario.rol.trim() !== rol) {
        console.log(usuario.rol)
        console.log(rol)
        navigate("/");
    }else{
          return;
         }} }

         validarRol();

 }, [token, usuario]);


  

  return children ? children : <Outlet />;
  
};
