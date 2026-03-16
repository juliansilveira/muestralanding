import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Logo from "../assets/Iconos GestionaApp/Logo.svg";
import homeIcon from "../assets/Iconos GestionaApp/Inicio.svg";
import calculadoraIcon from "../assets/Iconos GestionaApp/Calculadora.svg";
import facturaIcon from "../assets/Iconos GestionaApp/Factura electronica.svg";
import GestionDineroIcon from "../assets/Iconos GestionaApp/Gestion del dinero.svg";
import GestionTiempoIcon from "../assets/Iconos GestionaApp/Gestion del tiempo.svg";

const BarraNav = () => {
  const [showCotizaciones, setShowCotizaciones] = useState(false);
  const [showCalculadoraValorHora, setShowCalculadoraValorHora] =
    useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    const usr = localStorage.getItem("usuario");
    if (usr) {
      setUsuario(JSON.parse(usr));
    }
  }, []);

  const getTrialMessage = () => {
    if (!usuario || usuario.estadoSuscripcion !== "trial" || !usuario.fechaFinPrueba) return null;
    
    // Calcular días restantes
    const hoy = new Date();
    const finP = new Date(usuario.fechaFinPrueba);
    const difTiempo = finP.getTime() - hoy.getTime();
    const diasRestantes = Math.ceil(difTiempo / (1000 * 3600 * 24));
    
    if (diasRestantes > 0) {
      return `Prueba: Quedan ${diasRestantes} días`;
    } else {
      return "Prueba vencida";
    }
  };

  return (
    <>
      {/* Botón de Hamburguesa Flotante (FAB) - Visible solo en móvil */}
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="fixed bottom-4 left-4 md:hidden bg-gray-100 p-3 rounded-full shadow-lg z-50 focus:outline-none"
      >
        <svg
          className="w-8 h-8 text-gray-800"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          {isMenuOpen ? (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          )}
        </svg>
      </button>

      {/* Overlay para cerrar el menú al hacer clic fuera (solo en móvil y cuando el menú está abierto) */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsMenuOpen(false)}
        ></div>
      )}

      {/* Menú de navegación real - Se desliza desde la izquierda */}
      <nav
        className={`bg-gray-100 shadow-md h-screen fixed top-0 left-0 font-poppins 
        ${
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        } // Transforma para ocultar/mostrar
        md:translate-x-0 // Siempre visible en desktop
        w-64 // Ancho del menú cuando está abierto en móvil
        md:w-72 // Ancho en desktop
        transition-transform duration-300 ease-in-out z-50`}
      >
        {/* El logo grande y los enlaces */}
        <div className="flex flex-col items-center py-4 md:py-6 w-full">
          {/* Logo */}
          <div className="mb-4 md:mb-8">
            <Link
              to="/login"
              className="text-cl-boton-login text-2xl font-bold"
              onClick={() => setIsMenuOpen(false)}
            >
              <img
                src={Logo}
                alt="Logo GestionaApp"
                className="w-64 bg-fondoOscuro rounded-lg px-2"
              />
            </Link>
          </div>

          <div className="flex flex-col space-y-2 md:space-y-4 w-full px-1 md:px-4">
            {/* Item de navegación "Inicio" */}
            <Link
              to="/home"
              className="flex items-center justify-start gap-2 p-2 md:px-3 md:py-2 text-black hover:bg-slate-200 rounded-md text-sm font-bold"
              onClick={() => setIsMenuOpen(false)}
            >
              <img className="w-5" src={homeIcon} alt="Inicio" />
              <span>Inicio</span>
            </Link>

            {/* Nuevo Dropdown de Calculadora Valor Hora */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowCalculadoraValorHora(!showCalculadoraValorHora);
                  setShowCotizaciones(false);
                }}
                className="w-full flex items-center justify-between gap-2 p-2 md:px-3 md:py-2 text-black hover:bg-slate-200 rounded-md text-sm font-bold"
              >
                <div className="flex items-center gap-2">
                  <img
                    className="w-5"
                    src={calculadoraIcon}
                    alt="Calculadora Valor Hora"
                  />
                  <span>Calculadora Valor Hora</span>
                </div>
                <svg
                  className={`w-4 h-4 transform transition-transform ${
                    showCalculadoraValorHora ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {showCalculadoraValorHora && (
                <div className="ml-2 md:ml-8 mt-1 space-y-1 md:space-y-2">
                  <Link
                    to="/valor-hora?step=1"
                    className="flex items-center justify-start gap-2 p-2 md:px-3 md:py-2 text-black hover:bg-slate-200 rounded-md text-sm font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <span>Gastos Personales</span>
                  </Link>
                  <Link
                    to="/valor-hora?step=2"
                    className="flex items-center justify-start gap-2 p-2 md:px-3 md:py-2 text-black hover:bg-slate-200 rounded-md text-sm font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <span>Gastos Fijos del negocio</span>
                  </Link>
                  <Link
                    to="/valor-hora?step=3"
                    className="flex items-center justify-start gap-2 p-2 md:px-3 md:py-2 text-black hover:bg-slate-200 rounded-md text-sm font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <span>Horas de trabajo</span>
                  </Link>
                </div>
              )}
            </div>

            {/* Dropdown de Cotizaciones */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowCotizaciones(!showCotizaciones);
                  setShowCalculadoraValorHora(false);
                }}
                className="w-full flex items-center justify-start md:justify-between gap-2 p-2 md:px-3 md:py-2 text-black hover:bg-slate-200 rounded-md text-sm font-bold"
              >
                <div className="flex items-center gap-2">
                  <img className="w-5" src={facturaIcon} alt="Cotizaciones" />
                  <span>Cotización de Servicios</span>
                </div>
                <svg
                  className={`w-4 h-4 transform transition-transform ${
                    showCotizaciones ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {showCotizaciones && (
                <div className="ml-2 md:ml-8 mt-1 space-y-1 md:space-y-2">
                  <Link
                    to="/historial-servicios"
                    className="flex items-center justify-start gap-2 p-2 md:px-3 md:py-2 text-black hover:bg-slate-200 rounded-md text-sm font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <span>Nueva Cotización</span>
                  </Link>
                  <Link
                    to="/historial-cotizaciones"
                    className="flex items-center justify-start gap-2 p-2 md:px-3 md:py-2 text-black hover:bg-slate-200 rounded-md text-sm font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <span>Historial de Cotizaciones</span>
                  </Link>
                </div>
              )}
            </div>

            {/* Resto de los Items de navegación */}
            {[
              {
                to: "/actividades",
                icon: GestionTiempoIcon,
                text: "Gestión de Tiempo",
              },
              {
                to: "/control",
                icon: GestionDineroIcon,
                text: "Gestión de Dinero",
              },
            ].map((item, index) => (
              <Link
                key={index}
                to={item.to}
                className="flex items-center justify-start gap-2 p-2 md:px-3 md:py-2 text-black hover:bg-slate-200 rounded-md text-sm font-bold"
                onClick={() => setIsMenuOpen(false)}
              >
                <img className="w-5" src={item.icon} alt={item.text} />
                <span>{item.text}</span>
              </Link>
            ))}
          </div>

          {/* Banner de Trial */}
          {usuario && usuario.estadoSuscripcion === "trial" && (
            <div className="mt-auto w-full px-4 pt-8">
              <Link to="/suscripcion">
                <div className="bg-yellow-100 border border-yellow-300 rounded-lg p-3 text-center cursor-pointer hover:bg-yellow-200 transition-colors">
                  <span className="text-yellow-800 text-xs font-bold block mb-1">
                    {getTrialMessage()}
                  </span>
                  <span className="text-blue-600 text-[10px] font-semibold underline">
                    Mejorar a Pro
                  </span>
                </div>
              </Link>
            </div>
          )}

        </div>
      </nav>
    </>
  );
};

export default BarraNav;
