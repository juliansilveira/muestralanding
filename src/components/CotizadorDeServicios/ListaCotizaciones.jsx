import { useState, useEffect } from "react";
import axios from "axios";

import { Link, useNavigate } from "react-router-dom"; // Importa useNavigate
import BarraNav from "../BarraNav";

export default function ListaCotizaciones() {
  const [cotizaciones, setCotizaciones] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [filtro, setFiltro] = useState("");
  const navigate = useNavigate(); // Obtiene la función de navegación

  // Obtener cotizaciones desde el backend
  const obtenerCotizaciones = async () => {
    try {
      setCargando(true);
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("No se encontró token de autenticación");
      }

      const usuarioStorage = localStorage.getItem("usuario");
      if (!usuarioStorage) {
        throw new Error("No se encontró información del usuario");
      }

      const { idUsuario } = JSON.parse(usuarioStorage);

      const response = await axios.get(
        `http://localhost:3010/api/obtenerCotizaciones`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: { idUsuario },
        }
      );

      if (response.data.estado && response.data.cotizaciones) {
        setCotizaciones(response.data.cotizaciones);
      } else {
        throw new Error(
          response.data.mensaje || "Error al obtener cotizaciones"
        );
      }
    } catch (error) {
      console.error("Error al cargar cotizaciones:", error);
      setError(error.response?.data?.mensaje || error.message);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    obtenerCotizaciones();
  }, []);

  // Filtrar cotizaciones por nombre
  const cotizacionesFiltradas = cotizaciones.filter(
    (cotizacion) =>
      cotizacion.nombreCotizacion
        .toLowerCase()
        .includes(filtro.toLowerCase()) ||
      cotizacion.nombreCliente.toLowerCase().includes(filtro.toLowerCase())
  );

  if (cargando) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <p className="ml-4 text-gray-600">Cargando cotizaciones...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        <h3 className="font-bold">Error al cargar cotizaciones</h3>
        <p>{error}</p>
        <button
          onClick={obtenerCotizaciones}
          className="mt-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-2 py-4 sm:px-4 sm:py-6 font-poppins max-w-7xl">
      {/* Botón para volver atrás */}
      <BarraNav />
      <div className="mb-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-blue-600 hover:text-blue-800 text-sm sm:text-base"
        >
          <svg
            className="w-4 h-4 sm:w-5 sm:h-5 mr-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Volver atrás
        </button>
      </div>

      {/* Encabezado responsive */}
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">
            Cotizaciones Guardadas
          </h1>
          <p className="mt-1 text-gray-600 text-sm hidden sm:block">
            Lista completa de tus cotizaciones
          </p>
        </div>
        <div className="relative w-full sm:w-64 md:w-80">
          <input
            type="text"
            placeholder="Buscar por nombre o cliente..."
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
            className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
          />
          <svg
            className="absolute left-3 top-3 h-4 w-4 sm:h-5 sm:w-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      {/* Estado vacío */}
      {cotizacionesFiltradas.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-6 sm:p-8 text-center">
          <svg
            className="mx-auto h-14 w-14 sm:h-16 sm:w-16 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <h3 className="mt-3 text-lg sm:text-xl font-medium text-gray-900">
            No se encontraron cotizaciones
          </h3>
          <p className="mt-2 text-sm text-gray-500">
            {filtro
              ? "No hay resultados para tu búsqueda"
              : "Aún no has creado ninguna cotización"}
          </p>
          {!filtro && (
            <div className="mt-6">
              <Link
                to="/historial-servicios"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <svg
                  className="mr-2 h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                Crear nueva cotización
              </Link>
            </div>
          )}
        </div>
      ) : (
        <>
          {/* Vista de tabla para pantallas medianas y grandes */}
          <div className="hidden md:block">
            <div className="bg-white shadow overflow-hidden rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-4 py-3 sm:px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Nombre
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 sm:px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Cliente
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 sm:px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Fecha
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 sm:px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Estado
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 sm:px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Precio
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 sm:px-6 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {cotizacionesFiltradas.map((cotizacion) => (
                    <tr
                      key={cotizacion.idCotizacion}
                      className="hover:bg-gray-50"
                    >
                      <td className="px-4 py-4 sm:px-6 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {cotizacion.nombreCotizacion}
                        </div>
                      </td>
                      <td className="px-4 py-4 sm:px-6 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {cotizacion.nombreCliente}
                        </div>
                      </td>
                      <td className="px-4 py-4 sm:px-6 whitespace-nowrap text-sm text-gray-500">
                        {new Date(
                          cotizacion.fechaCreacion
                        ).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-4 sm:px-6 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${
                            cotizacion.estado === "aprobada"
                              ? "bg-green-100 text-green-800"
                              : cotizacion.estado === "rechazada"
                              ? "bg-red-100 text-red-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {cotizacion.estado}
                        </span>
                      </td>
                      <td className="px-4 py-4 sm:px-6 whitespace-nowrap text-sm text-gray-900 font-medium">
                        ${cotizacion.precioFinal.toLocaleString()}
                      </td>
                      <td className="px-4 py-4 sm:px-6 whitespace-nowrap text-right text-sm font-medium">
                        <Link
                          to={`/cotizaciones/${cotizacion.idCotizacion}`}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Ver detalles
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Vista de tarjetas para dispositivos móviles */}
          <div className="md:hidden grid grid-cols-1 gap-3">
            {cotizacionesFiltradas.map((cotizacion) => (
              <div
                key={cotizacion.idCotizacion}
                className="bg-white shadow rounded-lg p-4 border border-gray-100"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-base font-semibold text-gray-900 line-clamp-1">
                      {cotizacion.nombreCotizacion}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {cotizacion.nombreCliente}
                    </p>
                  </div>
                  <span
                    className={`px-2 py-1 text-xs leading-4 font-semibold rounded-full 
                    ${
                      cotizacion.estado === "aprobada"
                        ? "bg-green-100 text-green-800"
                        : cotizacion.estado === "rechazada"
                        ? "bg-red-100 text-red-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {cotizacion.estado}
                  </span>
                </div>

                <div className="mt-3 grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs text-gray-500">Fecha</p>
                    <p className="text-sm font-medium">
                      {new Date(cotizacion.fechaCreacion).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Precio Final</p>
                    <p className="text-sm font-medium">
                      ${cotizacion.precioFinal.toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-gray-100">
                  <Link
                    to={`/cotizaciones/${cotizacion.idCotizacion}`}
                    className="w-full text-center block px-4 py-2 border border-blue-600 text-blue-600 hover:bg-blue-50 rounded-md text-sm font-medium"
                  >
                    Ver detalles
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
