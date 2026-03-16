import { useState, useEffect } from "react";
import BarraNav from "../BarraNav";
import ContenedorUser from "../contenedorUser/ContenedorUser.jsx";
import api from "../../services/api.js"; // ✅ Importar la API configurada

const ContenedorGestorDeDinero = () => {
  const [transacciones, setTransacciones] = useState([]);
  const [descripcion, setDescripcion] = useState("");
  const [monto, setMonto] = useState("");
  const [tipo, setTipo] = useState("ingreso");
  const [moneda, setMoneda] = useState("ARS");
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [transaccionAEliminar, setTransaccionAEliminar] = useState(null);
  const tasaCambio = 1012.5;

  // ✅ Cargar transacciones desde el backend
  const cargarTransacciones = async () => {
    try {
      setCargando(true);
      setError(null);

      const response = await api.get("/obtener-transacciones");

      if (response.data.estado) {
        setTransacciones(response.data.operaciones || []);
      } else {
        setError(response.data.mensaje || "Error al cargar transacciones");
      }
    } catch (error) {
      console.error("Error cargando transacciones:", error);
      setError(
        error.response?.data?.mensaje || "Error de conexión con el servidor"
      );
    } finally {
      setCargando(false);
    }
  };

  // ✅ Cargar transacciones al montar el componente
  useEffect(() => {
    cargarTransacciones();
  }, []);

  const convertirMoneda = (valor) => {
    return moneda === "ARS" ? valor : valor / tasaCambio;
  };

  // ✅ Función actualizada para agregar transacción en el backend
  const agregarTransaccion = async () => {
    if (!descripcion || !monto || isNaN(monto) || monto <= 0) {
      alert("Por favor, completa todos los campos correctamente.");
      return;
    }

    try {
      setError(null);

      const transaccionData = {
        descripcion,
        monto: parseFloat(monto),
        tipo,
        fecha: new Date().toISOString().split("T")[0], // Formato YYYY-MM-DD
      };

      const response = await api.post(
        "/registro-control-financiero",
        transaccionData
      );

      if (response.data.estado) {
        // ✅ Transacción guardada exitosamente, recargar la lista
        await cargarTransacciones();
        setDescripcion("");
        setMonto("");
        setTipo("ingreso");
      } else {
        setError(response.data.mensaje || "Error al guardar la transacción");
      }
    } catch (error) {
      console.error("Error guardando transacción:", error);
      setError(
        error.response?.data?.mensaje || "Error al conectar con el servidor"
      );
    }
  };

  // ✅ Función para mostrar modal de confirmación
  const solicitarConfirmacionEliminar = (transaccion) => {
    setTransaccionAEliminar(transaccion);
    setMostrarModal(true);
  };

  // ✅ Función para cancelar eliminación
  const cancelarEliminacion = () => {
    setMostrarModal(false);
    setTransaccionAEliminar(null);
  };

  // ✅ Función para confirmar y eliminar transacción
  const confirmarEliminacion = async () => {
    if (!transaccionAEliminar) return;

    try {
      setError(null);
      setMostrarModal(false);
      const response = await api.delete(
        `/eliminar-transaccion/${transaccionAEliminar.idControlFinanciero}`
      );

      if (response.data.estado) {
        // ✅ Transacción eliminada exitosamente, recargar la lista
        await cargarTransacciones();
      } else {
        setError(response.data.mensaje || "Error al eliminar la transacción");
      }
    } catch (err) {
      console.error("Error eliminando transacción:", err);
      setError(
        err.response?.data?.mensaje || "Error al eliminar la transacción"
      );
    } finally {
      setTransaccionAEliminar(null);
    }
  };

  const calcularTotal = (tipo) => {
    return transacciones
      .filter((transaccion) => transaccion.tipo === tipo)
      .reduce(
        (acc, transaccion) => acc + convertirMoneda(transaccion.monto),
        0
      );
  };

  const calcularBalance = () => {
    return calcularTotal("ingreso") - calcularTotal("egreso");
  };

  // ✅ Función para formatear fecha
  const formatearFecha = (fechaString) => {
    if (!fechaString) return "Sin fecha";
    try {
      return new Date(fechaString).toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    } catch {
      return "Fecha inválida";
    }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen font-poppins">
      {/* Barra de navegación lateral */}
      <div className="w-60">
        <BarraNav />
      </div>

      {/* Contenido principal */}
      <div className="lg:w-screen bg-fondoHome flex flex-col items-center p-4 sm:p-5 md:p-6">
        {/* Cabecera superior */}
        <ContenedorUser />

        {/* Contenido centrado */}
        <div className="flex justify-center flex-1 w-full mt-10">
          <div className="w-full max-w-4xl flex flex-col items-center gap-5 md:gap-6">
            {/* Sección principal */}
            <div className="bg-white rounded-xl shadow p-5 md:p-6 w-full">
              <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-800 mb-6 text-center">
                Control Financiero
              </h2>

              {/* ✅ Mensaje de error */}
              {error && (
                <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                  <strong>Error: </strong>
                  {error}
                  <button
                    onClick={() => setError(null)}
                    className="float-right font-bold"
                  >
                    ×
                  </button>
                </div>
              )}

              {/* ✅ Estado de carga */}
              {cargando && (
                <div className="mb-4 bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded text-center">
                  <div className="inline-block animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-blue-500 mr-2"></div>
                  Cargando transacciones...
                </div>
              )}

              {/* Controles superiores */}
              <div className="mb-6 mx-auto max-w-md">
                <select
                  value={moneda}
                  onChange={(e) => setMoneda(e.target.value)}
                  className="w-full p-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-rosadoFuerte text-sm md:text-base"
                >
                  <option value="ARS">Pesos Argentinos (ARS)</option>
                  <option value="USD">Dólares Estadounidenses (USD)</option>
                </select>
              </div>

              {/* Formulario */}
              <div className="space-y-4 mb-6 mx-auto max-w-md">
                <input
                  type="text"
                  placeholder="Descripción"
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                  className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:border-rosadoFuerte text-sm md:text-base"
                  disabled={cargando}
                />
                <input
                  type="number"
                  placeholder="Monto"
                  value={monto}
                  onChange={(e) => setMonto(e.target.value)}
                  className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:border-rosadoFuerte text-sm md:text-base"
                  disabled={cargando}
                />
                <select
                  value={tipo}
                  onChange={(e) => setTipo(e.target.value)}
                  className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:border-rosadoFuerte text-sm md:text-base"
                  disabled={cargando}
                >
                  <option value="ingreso">Ingreso</option>
                  <option value="egreso">Egreso</option>
                </select>
                <button
                  onClick={agregarTransaccion}
                  disabled={cargando}
                  className={`w-full py-3 rounded-lg transition-colors duration-300 text-sm md:text-base font-semibold ${
                    cargando
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-green-500 hover:bg-green-600 text-white"
                  }`}
                >
                  {cargando ? "Guardando..." : "Agregar Transacción"}
                </button>
              </div>

              {/* Resumen */}
              <div className="bg-gray-50 p-4 md:p-5 rounded-xl shadow-inner mb-6">
                <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-4 text-center">
                  Resumen
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="bg-white p-3 md:p-4 rounded-lg shadow-sm">
                    <p className="text-gray-600 text-sm md:text-base">
                      Balance Total
                    </p>
                    <p
                      className={`text-lg md:text-xl font-bold ${
                        calcularBalance() >= 0
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {moneda} ${calcularBalance().toFixed(2)}
                    </p>
                  </div>
                  <div className="bg-green-50 p-3 md:p-4 rounded-lg shadow-sm">
                    <p className="text-green-600 text-sm md:text-base">
                      Ingresos
                    </p>
                    <p className="text-lg md:text-xl font-bold text-green-600">
                      {moneda} ${calcularTotal("ingreso").toFixed(2)}
                    </p>
                  </div>
                  <div className="bg-red-50 p-3 md:p-4 rounded-lg shadow-sm">
                    <p className="text-red-600 text-sm md:text-base">Egresos</p>
                    <p className="text-lg md:text-xl font-bold text-red-600">
                      {moneda} ${calcularTotal("egreso").toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Lista de Transacciones */}
              <div className="bg-white rounded-xl shadow p-4 md:p-5">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg md:text-xl font-bold text-gray-800">
                    Transacciones
                  </h3>
                  <button
                    onClick={cargarTransacciones}
                    disabled={cargando}
                    className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600 disabled:bg-gray-400"
                  >
                    🔄 Actualizar
                  </button>
                </div>

                {transacciones.length === 0 ? (
                  <div className="text-center py-8">
                    {cargando ? (
                      <div className="flex flex-col items-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mb-2"></div>
                        <p className="text-gray-500 text-sm md:text-base">
                          Cargando transacciones...
                        </p>
                      </div>
                    ) : (
                      <div>
                        <p className="text-gray-500 text-sm md:text-base mb-4">
                          No hay transacciones registradas
                        </p>
                        <p className="text-gray-400 text-xs">
                          Agrega tu primera transacción usando el formulario
                          superior
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <ul className="space-y-3">
                    {transacciones.map((transaccion) => (
                      <li
                        key={transaccion.idControlFinanciero}
                        className="flex flex-col md:flex-row justify-between items-start md:items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                      >
                        <div className="flex-1 mb-2 md:mb-0">
                          <p className="text-base font-medium text-gray-800">
                            {transaccion.descripcion}
                          </p>
                          <p className="text-xs md:text-sm text-gray-500">
                            {formatearFecha(transaccion.fecha)}
                            {transaccion.idControlFinanciero && (
                              <span className="ml-2 text-gray-400">
                                ID: {transaccion.idControlFinanciero}
                              </span>
                            )}
                          </p>
                        </div>
                        <div className="flex items-center gap-3 w-full md:w-auto">
                          <span
                            className={`text-sm md:text-base font-semibold ${
                              transaccion.tipo === "ingreso"
                                ? "text-green-600"
                                : "text-red-600"
                            }`}
                          >
                            {transaccion.tipo === "ingreso" ? "+" : "-"}
                            {moneda} $
                            {convertirMoneda(transaccion.monto).toFixed(2)}
                          </span>
                          <button
                            onClick={() =>
                              solicitarConfirmacionEliminar(transaccion)
                            }
                            className="text-red-500 hover:text-red-700 transition-colors duration-200 px-2 py-1 md:px-3 rounded-md hover:bg-red-50 text-sm md:text-base font-medium"
                            title="Eliminar transacción"
                            disabled={cargando}
                          >
                            🗑️
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* ✅ Información del backend */}
              <div className="mt-4 p-3 bg-blue-50 rounded-lg text-center">
                <p className="text-xs text-blue-600">
                  💡 Datos guardados en el servidor - {transacciones.length}{" "}
                  transacciones cargadas
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Confirmación de Eliminación */}
      {mostrarModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 animate-fadeIn">
            {/* Header del Modal */}
            <div className="bg-red-50 rounded-t-2xl p-4 md:p-6 border-b border-red-100">
              <div className="flex items-center gap-3">
                <div className="bg-red-100 rounded-full p-2 md:p-3">
                  <svg
                    className="w-6 h-6 md:w-8 md:h-8 text-red-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg md:text-xl font-bold text-gray-800">
                  Confirmar Eliminación
                </h3>
              </div>
            </div>

            {/* Contenido del Modal */}
            <div className="p-4 md:p-6">
              <p className="text-gray-700 text-sm md:text-base mb-4">
                ¿Estás seguro de que deseas eliminar esta transacción?
              </p>

              {transaccionAEliminar && (
                <div className="bg-gray-50 rounded-lg p-3 md:p-4 mb-4 border border-gray-200">
                  <p className="font-semibold text-gray-800 text-sm md:text-base mb-1">
                    {transaccionAEliminar.descripcion}
                  </p>
                  <p
                    className={`text-base md:text-lg font-bold ${
                      transaccionAEliminar.tipo === "ingreso"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {transaccionAEliminar.tipo === "ingreso" ? "+" : "-"}
                    {moneda} $
                    {convertirMoneda(transaccionAEliminar.monto).toFixed(2)}
                  </p>
                  <p className="text-xs md:text-sm text-gray-500 mt-1">
                    {formatearFecha(transaccionAEliminar.fecha)}
                  </p>
                </div>
              )}

              <p className="text-xs md:text-sm text-gray-500">
                Esta acción no se puede deshacer.
              </p>
            </div>

            {/* Botones de Acción */}
            <div className="flex flex-col sm:flex-row gap-2 md:gap-3 p-4 md:p-6 pt-0">
              <button
                onClick={cancelarEliminacion}
                className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200 font-semibold text-sm md:text-base order-2 sm:order-1"
              >
                Cancelar
              </button>
              <button
                onClick={confirmarEliminacion}
                className="flex-1 px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200 font-semibold text-sm md:text-base order-1 sm:order-2"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContenedorGestorDeDinero;
