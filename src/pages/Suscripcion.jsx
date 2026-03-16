import { useState, useEffect } from "react";
import BarraNav from "../components/BarraNav";
import api from "../services/api";

export default function Suscripcion() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [usuario, setUsuario] = useState({});

  useEffect(() => {
    // Try to load user data from local storage
    const usuarioDB = localStorage.getItem("usuario");
    if (usuarioDB) setUsuario(JSON.parse(usuarioDB));
  }, []);

  const handlePagar = async () => {
    setLoading(true);
    setError("");
    try {
      const resp = await api.post("/suscripcion/checkout");
      if (resp.data && resp.data.init_point) {
        // Redirigir a MercadoPago
        window.location.href = resp.data.init_point;
      } else {
        setError("Error al generar el link de pago.");
      }
    } catch (e) {
      console.error(e);
      setError("No se pudo conectar con MercadoPago. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  const isTrialFinished = usuario.estadoSuscripcion === "trial" && 
                          new Date(usuario.fechaFinPrueba) < new Date();
  
  const isVencida = usuario.estadoSuscripcion === "vencida" || 
                    usuario.estadoSuscripcion === "cancelada";

  return (
    <div className="min-h-screen bg-fondoHome p-4 md:p-8 font-poppins text-gray-800">
      <div className="max-w-4xl mx-auto">
        <BarraNav />
        
        <div className="bg-white rounded-xl shadow-lg mt-8 overflow-hidden flex flex-col md:flex-row">
          {/* Izquierda: Info de Suscripción */}
          <div className="p-8 md:w-1/2 flex flex-col justify-center border-b md:border-b-0 md:border-r border-gray-200">
            {isTrialFinished || isVencida ? (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
                <h3 className="text-red-800 font-bold">Acceso Suspendido</h3>
                <p className="text-sm text-red-600">
                  {isTrialFinished ? "Tu período de prueba gratuito de 14 días ha finalizado." : "Tu suscripción se encuentra vencida."}
                </p>
              </div>
            ) : null}

            <h1 className="text-3xl font-extrabold text-fondoOscuro mb-2">
              Suscripción Pro
            </h1>
            <p className="text-gray-500 mb-6">
              Desbloquea el poder total de GestiónApp y lleva el control de tus finanzas y tiempo al siguiente nivel.
            </p>

            <ul className="space-y-4 mb-8">
              <FeatureItem text="Acceso ilimitado al Cotizador de Servicios" />
              <FeatureItem text="Gestión avanzada de ingresos y egresos" />
              <FeatureItem text="Gráficos y reportes de progreso" />
              <FeatureItem text="Soporte técnico prioritario" />
            </ul>
          </div>

          {/* Derecha: Pricing y Pago */}
          <div className="bg-fondoOscuro p-8 md:w-1/2 flex flex-col justify-center items-center text-white text-center">
            <h2 className="text-xl font-medium mb-4 text-blue-200">Plan Mensual</h2>
            <div className="flex items-baseline justify-center mb-6">
              <span className="text-5xl font-extrabold">ARS 15.000</span>
              <span className="text-xl text-gray-300 ml-2">/mes</span>
            </div>

            {error && (
              <div className="text-red-400 bg-red-900 bg-opacity-30 p-2 rounded mb-4 w-full">
                {error}
              </div>
            )}

            <button
              onClick={handlePagar}
              disabled={loading}
              className={`w-full py-4 rounded-full font-bold text-lg shadow-lg flex justify-center items-center transition-all ${
                loading 
                  ? "bg-gray-400 text-gray-200 cursor-not-allowed" 
                  : "bg-rosadoFuerte hover:bg-white hover:text-black hover:scale-105"
              }`}
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Procesando pago...
                </>
              ) : (
                "Suscribirme Ahora con MercadoPago"
              )}
            </button>
            <p className="text-xs text-gray-400 mt-6">
              Cancelación en cualquier momento. Pagos procesados de forma 100% segura.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

const FeatureItem = ({ text }) => (
  <li className="flex items-center">
    <svg className="h-6 w-6 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
    </svg>
    <span className="text-gray-700">{text}</span>
  </li>
);
