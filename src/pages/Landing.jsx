import { Link } from "react-router-dom";
import Logo from "../assets/Iconos GestionaApp/Logo.svg";

export default function Landing() {
  return (
    <div className="min-h-screen bg-bg-login text-white font-poppins selection:bg-rosadoFuerte selection:text-white">
      {/* Header / Navbar */}
      <header className="container mx-auto px-4 md:px-6 py-4 flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-0">
        <div className="flex items-center gap-2">
          <img src={Logo} alt="Logo GestionaApp" className="h-8 md:h-10 w-auto" />
          <span className="text-lg md:text-xl font-bold tracking-wide">GestionaApp</span>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 w-full sm:w-auto">
          <Link
            to="/login"
            className="w-full sm:w-auto text-center text-white hover:text-rosa-claro transition-colors font-medium py-2 sm:py-0"
          >
            Iniciar Sesión
          </Link>
          <Link
            to="/registro"
            className="w-full sm:w-auto text-center bg-rosadoFuerte text-white px-6 py-2 rounded-full hover:bg-fondoRosaClaro hover:text-black transition-colors font-bold shadow-lg shadow-rosadoFuerte/30"
          >
            Registrarse
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 md:px-6 pt-12 md:pt-20 pb-20 md:pb-32 flex flex-col items-center text-center">
        <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-4 md:mb-6 leading-tight">
          Simplifica tu gestión <br className="hidden sm:block" />
          <span className="text-rosadoFuerte">con un clic.</span>
        </h1>
        <p className="text-base sm:text-lg md:text-xl text-gray-300 mb-8 md:mb-10 max-w-2xl px-2">
          Controla tus finanzas, organiza tu tiempo y cotiza tus servicios en
          una sola plataforma de manera inteligente y sencilla.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto px-4 sm:px-0">
          <Link
            to="/registro"
            className="w-full sm:w-auto bg-rosadoFuerte text-white px-8 py-3 md:py-4 rounded-full text-base md:text-lg font-bold hover:bg-fondoRosaClaro hover:text-black transition-all shadow-xl shadow-rosadoFuerte/40 hover:scale-105"
          >
            Comienza Gratis
          </Link>
          <Link
            to="/login"
            className="w-full sm:w-auto bg-transparent border-2 border-white text-white px-8 py-3 md:py-4 rounded-full text-base md:text-lg font-bold hover:bg-white hover:text-bg-login transition-all"
          >
            Ya tengo cuenta
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-fondoOscuro py-16 md:py-20 border-t border-gray-800">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold text-center mb-10 md:mb-16">
            Todo lo que necesitas para <br className="hidden sm:block" />
            <span className="text-rosadoFuerte">crecer tu negocio</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
            {/* Feature 1 */}
            <div className="bg-bg-login border border-gray-700 p-8 rounded-2xl hover:border-rosadoFuerte transition-colors group">
              <div className="bg-rosadoFuerte/20 w-14 h-14 flex items-center justify-center rounded-xl mb-6 text-rosadoFuerte group-hover:scale-110 transition-transform">
                <svg
                  className="w-8 h-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">
                Gestor de Dinero
              </h3>
              <p className="text-gray-400 leading-relaxed">
                Lleva el control exacto de tus ingresos y egresos. Toma
                decisiones financieras informadas al instante.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-bg-login border border-gray-700 p-8 rounded-2xl hover:border-rosadoFuerte transition-colors group">
              <div className="bg-rosadoFuerte/20 w-14 h-14 flex items-center justify-center rounded-xl mb-6 text-rosadoFuerte group-hover:scale-110 transition-transform">
                <svg
                  className="w-8 h-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">
                Gestor de Tiempo
              </h3>
              <p className="text-gray-400 leading-relaxed">
                Registra tus actividades, calcula el valor de tu hora y optimiza
                tus jornadas de trabajo de forma eficiente.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-bg-login border border-gray-700 p-8 rounded-2xl hover:border-rosadoFuerte transition-colors group">
              <div className="bg-rosadoFuerte/20 w-14 h-14 flex items-center justify-center rounded-xl mb-6 text-rosadoFuerte group-hover:scale-110 transition-transform">
                <svg
                  className="w-8 h-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2zM10 8.5a.5.5 0 11-1 0 .5.5 0 011 0zm5 5a.5.5 0 11-1 0 .5.5 0 011 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">
                Cotizador de Servicios
              </h3>
              <p className="text-gray-400 leading-relaxed">
                Genera presupuestos precisos basados en tus costos operativos,
                tiempo estimado y margen de ganancia.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing / CTA Section */}
      <section className="container mx-auto px-4 md:px-6 py-16 md:py-20 text-center">
        <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold mb-4 md:mb-6">
          Suscripción <span className="text-rosadoFuerte">Premium</span>
        </h2>
        <p className="text-base sm:text-lg text-gray-300 mb-8 md:mb-10 max-w-2xl mx-auto px-2">
          Accede a todas las funcionalidades sin límites. Potencia tu negocio
          con reportes detallados, cotizador inteligente y copias de seguridad
          en la nube.
        </p>

        <div className="bg-gradient-to-br from-bg-login to-fondoOscuro border border-rosadoFuerte p-6 sm:p-8 md:p-10 rounded-3xl max-w-lg mx-4 sm:mx-auto shadow-2xl shadow-rosadoFuerte/20">
          <h3 className="text-2xl font-bold mb-2">Plan Mensual</h3>
          <div className="text-5xl font-bold text-rosadoFuerte mb-6">
            $4.99{" "}
            <span className="text-xl text-gray-400 font-normal">/mes</span>
          </div>

          <ul className="text-left space-y-4 mb-8">
            <li className="flex items-center gap-3">
              <svg
                className="w-5 h-5 text-verdePastel"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span>Gestión de dinero ilimitada</span>
            </li>
            <li className="flex items-center gap-3">
              <svg
                className="w-5 h-5 text-verdePastel"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span>Cotizador de servicios avanzado</span>
            </li>
            <li className="flex items-center gap-3">
              <svg
                className="w-5 h-5 text-verdePastel"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span>Control de tiempo detallado</span>
            </li>
            <li className="flex items-center gap-3">
              <svg
                className="w-5 h-5 text-verdePastel"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span>Soporte prioritario</span>
            </li>
          </ul>

          <Link
            to="/registro"
            className="block w-full bg-rosadoFuerte text-white py-4 rounded-full font-bold text-lg hover:bg-fondoRosaClaro hover:text-black transition-colors"
          >
            Obtener Premium Ahora
          </Link>
          <p className="mt-4 text-sm text-gray-400">*Incluye prueba gratuita</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-8 bg-fondoOscuro text-center text-gray-500">
        <p>
          &copy; {new Date().getFullYear()} GestionaApp. Todos los derechos
          reservados.
        </p>
      </footer>
    </div>
  );
}
