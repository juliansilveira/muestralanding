import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../components/context/AuthContext";
import Logo from "../assets/Iconos GestionaApp/Logo.svg";

export default function GoogleCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [error, setError] = useState("");

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Obtener parámetros de la URL
        const token = searchParams.get("token");
        const userDataEncoded = searchParams.get("user");
        const errorParam = searchParams.get("error");

        // Manejar errores de autenticación
        if (errorParam) {
          const errorMessages = {
            auth_failed: "Autenticación con Google fallida",
            user_not_found: "No se pudo crear el usuario",
            server_error: "Error del servidor",
          };
          setError(errorMessages[errorParam] || "Error desconocido");
          setTimeout(() => navigate("/login"), 3000);
          return;
        }

        // Validar que existan los datos necesarios
        if (!token || !userDataEncoded) {
          setError("Datos de autenticación incompletos");
          setTimeout(() => navigate("/login"), 3000);
          return;
        }

        // Decodificar datos del usuario
        const userData = JSON.parse(decodeURIComponent(userDataEncoded));

        // Guardar token y datos de usuario en localStorage
        localStorage.setItem("token", token);
        localStorage.setItem(
          "usuario",
          JSON.stringify({
            idUsuario: userData.idUsuario,
            nombre: userData.nombre,
            apellido: userData.apellido,
            correo: userData.correo,
            empresa: userData.empresa,
          }),
        );
        localStorage.setItem("idUsuario", userData.idUsuario);

        // Actualizar estado de autenticación
        login();

        // Redirigir al home
        navigate("/home");
      } catch (error) {
        console.error("Error procesando callback de Google:", error);
        setError("Error procesando la autenticación");
        setTimeout(() => navigate("/login"), 3000);
      }
    };

    handleCallback();
  }, [searchParams, navigate, login]);

  return (
    <div className="flex flex-col items-center justify-center bg-bg-login min-h-screen w-full font-poppins p-4">
      <div className="max-w-md w-full space-y-6 md:space-y-8 lg:space-y-10">
        <div className="flex justify-center">
          <img src={Logo} alt="Logo GestionaApp" className="mx-auto" />
        </div>

        <div className="rounded-xl p-6 md:p-8 lg:p-10 space-y-4 md:space-y-6 bg-white">
          {error ? (
            <>
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-red-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-gray-800 text-center">
                Error de Autenticación
              </h2>
              <p className="text-gray-600 text-center">{error}</p>
              <p className="text-sm text-gray-500 text-center">
                Redirigiendo al login...
              </p>
            </>
          ) : (
            <>
              <div className="flex justify-center">
                <svg
                  className="animate-spin h-12 w-12 text-rosadoFuerte"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-gray-800 text-center">
                Autenticando con Google...
              </h2>
              <p className="text-gray-600 text-center">
                Por favor espera mientras completamos tu inicio de sesión
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
