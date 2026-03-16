import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api"; // ← Usar la instancia configurada
import Logo from "../assets/Iconos GestionaApp/Logo.svg";

export default function Registro() {
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    fechaNacimiento: "",
    correo: "",
    clave: "",
    empresa: "",
  });

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");

    // Validación de campos obligatorios
    const { empresa, ...camposObligatorios } = formData;
    if (
      Object.values(camposObligatorios).some((value) => value.trim() === "")
    ) {
      setErrorMessage("Los campos marcados con * son obligatorios.");
      setIsLoading(false);
      return;
    }

    // Validación de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.correo)) {
      setErrorMessage("Por favor ingresa un email válido.");
      setIsLoading(false);
      return;
    }

    // Validación de contraseña
    if (formData.clave.length < 6) {
      setErrorMessage("La contraseña debe tener al menos 6 caracteres.");
      setIsLoading(false);
      return;
    }

    try {
      // ✅ USAR LA API CONFIGURADA - URL base ya incluida
      const response = await api.post("/registrar", formData);

      if (response.data.estado) {
        // Guardar token y datos de usuario
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("idUsuario", response.data.idUsuario);
        localStorage.setItem("userData", JSON.stringify(response.data.usuario));

        // Éxito: limpiar formulario y mostrar modal
        setFormData({
          nombre: "",
          apellido: "",
          fechaNacimiento: "",
          correo: "",
          clave: "",
          empresa: "",
        });

        setShowSuccessModal(true);

        // Redirigir después de 2 segundos
        setTimeout(() => {
          navigate("/Login");
        }, 2000);
      }
    } catch (error) {
      console.error("Error en registro:", error);
      if (error.response) {
        switch (error.response.status) {
          case 409:
            setErrorMessage("Este correo ya está registrado");
            break;
          case 400:
            setErrorMessage(error.response.data.mensaje || "Datos inválidos");
            break;
          case 500:
            setErrorMessage(
              "Error en el servidor. Por favor, intenta más tarde.",
            );
            break;
          default:
            setErrorMessage("Error inesperado. Por favor, intenta nuevamente.");
        }
      } else if (error.request) {
        setErrorMessage("Error de conexión. Verifica tu internet.");
      } else {
        setErrorMessage("Error inesperado. Por favor, intenta nuevamente.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-fondoOscuro font-poppins min-h-screen flex items-center justify-center p-4">
      {/* Popup de éxito */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg text-center max-w-sm">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-green-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                ></path>
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              ¡Registro exitoso!
            </h3>
            <p className="text-gray-600 mb-4">
              Tu cuenta ha sido creada correctamente.
            </p>
            <p className="text-sm text-gray-500 mb-4">
              Redirigiendo al login...
            </p>
            <button
              onClick={() => {
                setShowSuccessModal(false);
                navigate("/Login");
              }}
              className="bg-rosadoFuerte text-white px-6 py-2 rounded-lg hover:bg-fondoPao transition-colors"
            >
              Ir al Login
            </button>
          </div>
        </div>
      )}

      <div className="max-w-md w-full space-y-6">
        {/* Logo */}
        <div className="flex justify-center">
          <img
            src={Logo}
            alt="Logo GestionaApp"
            className="w-full md:w-40 lg:w-full mb-8 md:mb-12"
          />
        </div>

        {/* Formulario */}
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 space-y-4">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 text-center">
            Crear Cuenta
          </h1>

          {errorMessage && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              <div className="flex items-center">
                <svg
                  className="w-5 h-5 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  ></path>
                </svg>
                {errorMessage}
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-1">
                  Nombre *
                </label>
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-rosadoFuerte focus:border-rosadoFuerte transition-colors"
                  required
                  disabled={isLoading}
                />
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-medium mb-1">
                  Apellido *
                </label>
                <input
                  type="text"
                  name="apellido"
                  value={formData.apellido}
                  onChange={handleChange}
                  className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-rosadoFuerte focus:border-rosadoFuerte transition-colors"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-medium mb-1">
                Fecha de Nacimiento *
              </label>
              <input
                type="date"
                name="fechaNacimiento"
                value={formData.fechaNacimiento}
                onChange={handleChange}
                className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-rosadoFuerte focus:border-rosadoFuerte transition-colors"
                required
                disabled={isLoading}
              />
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-medium mb-1">
                Empresa (Opcional)
              </label>
              <input
                type="text"
                name="empresa"
                value={formData.empresa}
                onChange={handleChange}
                placeholder="Nombre de tu empresa"
                className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-rosadoFuerte focus:border-rosadoFuerte transition-colors"
                disabled={isLoading}
              />
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-medium mb-1">
                Email *
              </label>
              <input
                type="email"
                name="correo"
                value={formData.correo}
                onChange={handleChange}
                className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-rosadoFuerte focus:border-rosadoFuerte transition-colors"
                required
                disabled={isLoading}
              />
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-medium mb-1">
                Contraseña *
              </label>
              <input
                type="password"
                name="clave"
                value={formData.clave}
                onChange={handleChange}
                minLength="6"
                placeholder="Mínimo 6 caracteres"
                className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-rosadoFuerte focus:border-rosadoFuerte transition-colors"
                required
                disabled={isLoading}
              />
            </div>

            {/* Separador */}
            <div className="flex items-center my-4">
              <div className="flex-1 border-t border-gray-300"></div>
              <span className="px-4 text-gray-500 text-sm">o</span>
              <div className="flex-1 border-t border-gray-300"></div>
            </div>

            {/* Botón de Google */}
            <button
              type="button"
              onClick={() => {
                window.location.href = "http://localhost:3010/api/auth/google";
              }}
              className="w-full bg-white text-gray-700 py-3 px-4 rounded-lg
                        border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50
                        transition-colors duration-200 font-medium text-base
                        flex items-center justify-center gap-3"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continuar con Google
            </button>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 px-4 rounded-lg transition-colors duration-200 font-medium text-base ${
                isLoading
                  ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                  : "bg-rosadoFuerte text-white hover:bg-fondoPao shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              }`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Creando cuenta...
                </div>
              ) : (
                "Crear Cuenta"
              )}
            </button>
          </form>
        </div>

        <p className="text-gray-600 text-center text-sm">
          ¿Ya tienes cuenta?{" "}
          <Link
            to="/login"
            className="text-rosadoFuerte hover:text-fondoPao font-medium transition-colors"
          >
            Iniciar Sesión
          </Link>
        </p>
      </div>
    </div>
  );
}
