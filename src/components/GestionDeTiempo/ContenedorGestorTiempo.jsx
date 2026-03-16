import { useState } from "react";
import BarraNav from "../BarraNav";
import ResumenActividades from "./ResumenActividades";
import ContenedorUser from "../contenedorUser/ContenedorUser";

const ContenedorGestorTiempo = () => {
  const [actividades, setActividades] = useState([]);
  const [actividadSeleccionada, setActividadSeleccionada] = useState("");
  const [tiempoInvertido, setTiempoInvertido] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [mensajeExito, setMensajeExito] = useState("");
  const [mostrarError, setMostrarError] = useState(false); // Nuevo estado para controlar el popup de error
  const listaDeActividades = ["Creatividad", "Estrategia", "Operaciones"];

  const manejarRegistro = () => {
    if (!actividadSeleccionada || !tiempoInvertido || !descripcion) {
      setMostrarError(true); // Mostrar popup en lugar de alert
      return;
    }

    const nuevoRegistro = {
      actividad: actividadSeleccionada,
      tiempo: tiempoInvertido,
      descripcion,
      fecha: new Date().toLocaleString(),
    };

    setActividades([...actividades, nuevoRegistro]);
    setActividadSeleccionada("");
    setTiempoInvertido("");
    setDescripcion("");
    setMensajeExito("¡Actividad registrada con éxito!");
    setTimeout(() => setMensajeExito(""), 3000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[16rem,1fr] min-h-screen font-poppins">
      {/* Popup de error */}
      {mostrarError && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 max-w-sm w-full mx-4">
            <div className="flex justify-center mb-4">
              <div className="bg-red-100 rounded-full p-3">
                <svg
                  className="w-8 h-8 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
            </div>

            <h3 className="text-xl font-bold text-gray-800 mb-3 text-center">
              Campos incompletos
            </h3>

            <p className="text-gray-600 mb-5 text-center">
              Por favor, completa todos los campos antes de registrar.
            </p>

            <div className="flex justify-center">
              <button
                onClick={() => setMostrarError(false)}
                className="px-6 py-2 bg-colorbotonPao text-white rounded-lg hover:bg-rosadoFuerte transition-colors font-medium"
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Barra de navegación lateral */}
      <div className="hidden lg:block">
        <BarraNav />
      </div>

      {/* Contenido principal */}
      <div className="lg:col-span-1 bg-fondoHome px-4 md:px-6 lg:px-8 py-4 pb-8">
        {/* Barra de navegación móvil */}
        <div className="lg:hidden mb-5">
          <BarraNav />
        </div>

        {/* Encabezado */}
        <div className="mb-8">
          <ContenedorUser />
        </div>

        {/* Contenedor principal */}
        <div className="max-w-2xl mx-auto">
          {/* Formulario de registro */}
          <div className="bg-white rounded-xl shadow-lg p-5 md:p-7 mb-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
              Registro de Actividades
            </h3>

            <div className="space-y-6">
              {/* Selector de actividad */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <label className="text-gray-700 font-medium md:w-2/5">
                  Selecciona una actividad:
                </label>
                <select
                  value={actividadSeleccionada}
                  onChange={(e) => setActividadSeleccionada(e.target.value)}
                  className="w-full md:w-3/5 p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-300"
                >
                  <option value="">-- Selecciona --</option>
                  {listaDeActividades.map((actividad) => (
                    <option key={actividad} value={actividad}>
                      {actividad}
                    </option>
                  ))}
                </select>
              </div>

              {/* Tiempo invertido */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <label className="text-gray-700 font-medium md:w-2/5">
                  Tiempo invertido (horas):
                </label>
                <input
                  type="number"
                  value={tiempoInvertido}
                  onChange={(e) => setTiempoInvertido(e.target.value)}
                  className="w-full md:w-1/3 p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-300"
                  min="0"
                  step="0.5"
                />
              </div>

              {/* Descripción */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Descripción:
                </label>
                <textarea
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                  placeholder="Breve descripción de la actividad"
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-300 min-h-[120px]"
                />
              </div>

              {/* Botón de registro */}
              <button
                onClick={manejarRegistro}
                className="w-full py-3 bg-colorbotonPao text-white font-semibold rounded-lg hover:bg-rosadoFuerte hover:underline transition-colors focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2"
              >
                Registrar Actividad
              </button>

              {mensajeExito && (
                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-green-700 text-center">
                    <svg
                      className="inline-block w-5 h-5 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    {mensajeExito}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Lista de actividades */}
          <div className="bg-white rounded-xl shadow-lg p-5 md:p-7 mb-8">
            <h4 className="text-xl font-semibold text-gray-800 mb-5">
              Actividades Registradas
            </h4>

            {actividades.length > 0 ? (
              <ul className="divide-y divide-gray-100">
                {actividades.map((registro, index) => (
                  <li key={index} className="py-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h5 className="font-medium text-gray-800">
                          {registro.actividad}
                        </h5>
                        <p className="text-gray-600 mt-2 text-sm">
                          {registro.descripcion}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="block font-semibold">
                          {registro.tiempo} horas
                        </span>
                        <span className="text-xs text-gray-500 mt-1">
                          {registro.fecha}
                        </span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 text-center py-6">
                No hay actividades registradas aún
              </p>
            )}
          </div>

          {/* Resumen de actividades */}
          <ResumenActividades
            actividades={actividades}
            listaDeActividades={listaDeActividades}
          />
        </div>
      </div>
    </div>
  );
};

export default ContenedorGestorTiempo;
