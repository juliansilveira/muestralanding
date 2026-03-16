import { useState, useEffect } from "react";
import axios from "axios";
import BarraNav from "../components/BarraNav";

export default function Perfil() {
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const cargarPerfilUsuario = async () => {
      try {
        // 1. Obtener token de localStorage
        const token = localStorage.getItem("token");

        if (!token) {
          throw new Error("No se encontró token de autenticación");
        }

        // 2. Obtener idUsuario de localStorage
        const usuarioStorage = localStorage.getItem("usuario");
        if (!usuarioStorage) {
          throw new Error("No se encontró información del usuario");
        }

        const { idUsuario } = JSON.parse(usuarioStorage);

        // 3. Hacer petición al backend
        const response = await axios.get(
          `http://localhost:3010/api/usuario/${idUsuario}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.estado && response.data.usuario) {
          setUsuario(response.data.usuario);
        } else {
          throw new Error(
            response.data.mensaje || "Datos de usuario no recibidos"
          );
        }
      } catch (error) {
        console.error("Error cargando perfil:", error);
        setError(error.response?.data?.mensaje || error.message);
      } finally {
        setLoading(false);
      }
    };

    cargarPerfilUsuario();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-fondoHome p-4 md:p-8 font-poppins flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
          <p className="text-gray-500 text-lg">Cargando perfil...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-fondoHome p-4 md:p-8 font-poppins flex items-center justify-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-8 py-6 rounded max-w-md text-center">
          <h3 className="text-xl font-bold mb-2">Error al cargar el perfil</h3>
          <p>{error}</p>
          <p className="mt-4 text-sm">
            Por favor, intenta recargar la página o inicia sesión nuevamente.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-fondoHome p-4 md:p-8 font-poppins">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        <BarraNav />

        {/* Encabezado */}
        <div className="bg-fondoOscuro p-6 relative">
          <h1 className="text-2xl md:text-3xl font-bold text-white">Perfil</h1>
          <button className="absolute top-4 right-4 text-white hover:text-blue-200 transition-colors">
            Editar
          </button>
        </div>

        {/* Cuerpo */}
        <div className="p-6 md:p-8 space-y-6">
          {/* Avatar y Nombre */}
          <div className="flex flex-col items-center space-y-4">
            <div className="w-20 h-20 bg-rosadoFuerte rounded-full border-2 border-black flex items-center justify-center">
              <span className="text-2xl font-bold text-fondoOscuro">
                {usuario.nombre?.[0] || ""}
                {usuario.apellido?.[0] || ""}
              </span>
            </div>
            <h2 className="text-xl font-semibold text-gray-800">
              {usuario.nombre} {usuario.apellido}
            </h2>
            <div className={`px-4 py-1 rounded-full text-sm font-bold ${
              usuario.estadoSuscripcion === 'activa' ? 'bg-green-100 text-green-700' :
              usuario.estadoSuscripcion === 'trial' ? 'bg-yellow-100 text-yellow-700' :
              'bg-red-100 text-red-700'
            }`}>
              {usuario.estadoSuscripcion === 'activa' ? 'Plan Pro Activo' :
               usuario.estadoSuscripcion === 'trial' ? 'Período de Prueba' : 'Suscripción Vencida'}
            </div>
          </div>

          {/* Información */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-600">
            <div className="space-y-2">
              <InfoItem label="Correo Electrónico" value={usuario.correo} />
              <InfoItem
                label="Fecha de Nacimiento"
                value={
                  usuario.fechaNacimiento
                    ? new Date(usuario.fechaNacimiento).toLocaleDateString()
                    : "N/A"
                }
              />
              {usuario.estadoSuscripcion === 'trial' && usuario.fechaFinPrueba && (
                <InfoItem
                  label="Fin del Período de Prueba"
                  value={new Date(usuario.fechaFinPrueba).toLocaleDateString()}
                />
              )}
            </div>
            <div className="space-y-2">
              <InfoItem
                label="Empresa"
                value={usuario.empresa || "Sin asignar"}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Componente auxiliar para mostrar cada campo
import PropTypes from "prop-types";

const InfoItem = ({ label, value }) => (
  <div className="bg-gray-50 p-3 rounded-lg">
    <p className="text-sm text-gray-400">{label}</p>
    <p className="font-medium text-gray-700 break-words">
      {value || "No especificado"}
    </p>
  </div>
);

InfoItem.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string,
};
