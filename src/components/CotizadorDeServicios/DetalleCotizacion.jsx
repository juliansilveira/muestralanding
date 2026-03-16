import { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../services/api";

export default function DetalleCotizacion() {
  const { id } = useParams();

  const navigate = useNavigate();
  const [quotationData, setQuotationData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ✅ Usar useCallback para evitar recreaciones innecesarias
  const cargarDetalleCotizacion = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // ✅ CORRECCIÓN: Convertir a número antes de validar
      if (!id || isNaN(Number(id))) {
        setError("ID de cotización inválido");
        setLoading(false);
        return;
      }

      const response = await api.get(`/cotizaciones/${id}`);

      // ✅ Validación más robusta
      if (
        response.data &&
        response.data.estado === true &&
        response.data.cotizacion
      ) {
        setQuotationData(response.data.cotizacion);
      } else {
        setError(
          response.data?.mensaje ||
            "Cotización no encontrada o estructura inválida"
        );
      }
    } catch (error) {
      console.error("❌ Error cargando cotización:", error);

      // ✅ Manejo específico por tipo de error
      if (error.response?.status === 404) {
        setError("Cotización no encontrada");
      } else if (error.response?.status === 500) {
        setError("Error del servidor al cargar la cotización");
      } else if (error.request) {
        setError("Error de conexión con el servidor");
      } else {
        setError("Error inesperado al cargar los detalles");
      }
    } finally {
      setLoading(false);
    }
  }, [id]); // ✅ Dependencia correcta

  // Función auxiliar para formatear números
  const formatNumber = (value, isCurrency = true) => {
    if (value === null || value === undefined || isNaN(Number(value))) {
      return isCurrency ? "0,00" : "0";
    }
    const num = Number(value);
    if (isCurrency) {
      return num.toLocaleString("es-AR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    } else {
      return num.toLocaleString("es-AR", {
        minimumFractionDigits: num % 1 === 0 ? 0 : 2,
        maximumFractionDigits: 2,
      });
    }
  };

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      // ✅ Validación simplificada - la lógica compleja está en cargarDetalleCotizacion
      if (!id) {
        setError("ID no proporcionado");
        setLoading(false);
        return;
      }

      await cargarDetalleCotizacion();
    };

    if (isMounted) {
      loadData();
    }

    return () => {
      isMounted = false;
    };
  }, [id, cargarDetalleCotizacion]);

  if (loading) {
    return (
      <div className="min-h-screen bg-fondoHome flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
          <p className="text-gray-500 text-lg">
            Cargando detalles de la cotización...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-fondoHome flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md text-center">
          <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded">
            <h3 className="text-xl font-bold mb-2">Error</h3>
            <p className="mb-4">{error}</p>
            <div className="flex gap-2 justify-center">
              <button
                onClick={() => navigate(-1)}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors"
              >
                Volver atrás
              </button>
              <button
                onClick={cargarDetalleCotizacion}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
              >
                Reintentar
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!quotationData) {
    return (
      <div className="min-h-screen bg-fondoHome flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 text-lg mb-4">
            No se encontró la cotización solicitada
          </p>
          <button
            onClick={() => navigate(-1)}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors"
          >
            Volver atrás
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="font-poppins min-h-screen bg-fondoHome py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Encabezado */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                {quotationData.nombreCotizacion}
              </h1>
              <p className="text-gray-600 text-lg">
                Cliente:{" "}
                <span className="font-semibold">
                  {quotationData.nombreCliente}
                </span>
              </p>
            </div>
            <div className="text-right">
              <span className="block text-sm text-gray-500 mb-2">
                Fecha:{" "}
                {new Date(quotationData.fechaCreacion).toLocaleDateString(
                  "es-AR"
                )}
              </span>
              <span
                className={`px-4 py-2 rounded-full text-sm font-semibold ${
                  quotationData.estado === "pendiente"
                    ? "bg-yellow-100 text-yellow-800 border border-yellow-300"
                    : quotationData.estado === "aprobada"
                    ? "bg-green-100 text-green-800 border border-green-300"
                    : "bg-red-100 text-red-800 border border-red-300"
                }`}
              >
                {quotationData.estado?.toUpperCase() || "PENDIENTE"}
              </span>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mb-6">
          {/* Resumen de costos */}
          <div className="bg-white rounded-xl shadow-lg p-6 lg:col-span-2">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">
              Resumen de Costos
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Tarifa por hora:</span>
                <span className="font-semibold">
                  ${formatNumber(quotationData.tarifaValorHora)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total horas asignables:</span>
                <span className="font-semibold">
                  {formatNumber(quotationData.horasTotales, false)} horas
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total costo horas:</span>
                <span className="font-semibold">
                  ${formatNumber(quotationData.totalCostoHoras)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total otros costos:</span>
                <span className="font-semibold">
                  ${formatNumber(quotationData.totalOtrosCostos)}
                </span>
              </div>
              <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                <span className="font-bold text-gray-800">
                  Costo directo total:
                </span>
                <span className="font-bold text-lg">
                  ${formatNumber(quotationData.costoDirectoTotal)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Margen de ganancia:</span>
                <span className="font-semibold">
                  {formatNumber(quotationData.margenGanancia, false)}%
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Monto ganancia:</span>
                <span className="font-semibold text-green-600">
                  ${formatNumber(quotationData.montoGanancia)}
                </span>
              </div>
              <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                <span className="font-bold text-lg text-gray-800">
                  Precio final:
                </span>
                <span className="font-bold text-2xl text-green-600">
                  ${formatNumber(quotationData.precioFinal)}
                </span>
              </div>
            </div>
          </div>

          {/* Información rápida */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">
              Información
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-700 mb-2">
                  Tareas del servicio
                </h3>
                <p className="text-2xl font-bold text-blue-600">
                  {quotationData.tareas?.length || 0}
                </p>
                <p className="text-sm text-gray-500">tareas registradas</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-700 mb-2">
                  Otros costos
                </h3>
                <p className="text-2xl font-bold text-purple-600">
                  {quotationData.otrosCostos?.length || 0}
                </p>
                <p className="text-sm text-gray-500">conceptos adicionales</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Tareas del servicio */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">
              Tareas del Servicio
            </h2>
            {quotationData.tareas && quotationData.tareas.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tarea
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Horas
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Costo
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {quotationData.tareas.map((tarea, index) => (
                      <tr
                        key={index}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {tarea.nombreTarea}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900 text-right">
                          {formatNumber(tarea.horas, false)}
                        </td>
                        <td className="px-4 py-3 text-sm font-semibold text-gray-900 text-right">
                          ${formatNumber(tarea.costoCalculado)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">
                No hay tareas registradas
              </p>
            )}
          </div>

          {/* Otros costos */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">
              Otros Costos
            </h2>
            {quotationData.otrosCostos &&
            quotationData.otrosCostos.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Concepto
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Valor
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {quotationData.otrosCostos.map((costo, index) => (
                      <tr
                        key={index}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {costo.nombreCosto}
                        </td>
                        <td className="px-4 py-3 text-sm font-semibold text-gray-900 text-right">
                          ${formatNumber(costo.valor)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">
                No hay otros costos registrados
              </p>
            )}
          </div>
        </div>

        {/* Botones de acción */}
        <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="bg-gray-500 text-white px-8 py-3 rounded-lg hover:bg-gray-600 transition-colors font-medium"
          >
            Volver atrás
          </button>
          {/* <button
            onClick={() => navigate('/cotizaciones')}
            className="bg-blue-500 text-white px-8 py-3 rounded-lg hover:bg-blue-600 transition-colors font-medium"
          >
            Ver todas las cotizaciones
          </button> */}
          <button
            onClick={() => window.print()}
            className="bg-green-500 text-white px-8 py-3 rounded-lg hover:bg-green-600 transition-colors font-medium"
          >
            Imprimir cotización
          </button>
        </div>
      </div>
    </div>
  );
}
