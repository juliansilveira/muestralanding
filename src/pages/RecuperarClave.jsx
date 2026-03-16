import { useState } from "react";
import { Link } from "react-router-dom";
import Logo from "../assets/Iconos GestionaApp/Logo.svg";

export default function RecuperarClave() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState(null); // Para mostrar mensaje de éxito o error (simulado por ahora)

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulación de envío
    setTimeout(() => {
      setIsLoading(false);
      setMessage({
        type: "success",
        text: "Si el correo existe en nuestra base de datos, recibirás las instrucciones en breve.",
      });
    }, 1500);
  };

  return (
    <div className="flex flex-col items-center justify-center bg-bg-login min-h-screen w-full font-poppins p-4">
      <div className="max-w-md w-full space-y-6 md:space-y-8 lg:space-y-10">
        <div className="flex justify-center">
          <img src={Logo} alt="Logo GestionaApp" className="mx-auto" />
        </div>

        <div className="rounded-xl p-6 md:p-8 lg:p-10 space-y-4 md:space-y-6">
          <h1 className="text-2xl md:text-3xl font-bold text-white text-center mb-2">
            Recuperar Contraseña
          </h1>

          <p className="text-white text-center text-sm md:text-base opacity-90">
            Ingresa tu correo electrónico y te enviaremos instrucciones para
            restablecer tu contraseña.
          </p>

          {message && (
            <div
              className={`p-4 rounded-lg text-sm ${message.type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
            >
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5">
            <div>
              <label className="block text-white text-md md:text-base mb-1">
                Correo Electrónico
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 md:p-3 rounded-full border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                disabled={isLoading}
                placeholder="ejemplo@correo.com"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-rosadoFuerte text-white py-3 md:py-3 px-4 rounded-full
                          hover:bg-fondoRosaClaro hover:text-black transition-colors duration-200 font-bold
                          text-lg md:text-lg flex justify-center items-center"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
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
                  Enviando...
                </>
              ) : (
                "Enviar instrucciones"
              )}
            </button>
          </form>

          <div className="text-center mt-4">
            <Link
              to="/login"
              className="text-white hover:text-gray-200 text-sm md:text-base hover:underline flex items-center justify-center gap-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Volver al inicio de sesión
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
