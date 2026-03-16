import React, { useState, useEffect } from "react";
import { Link, Outlet, useNavigate, useLocation, useParams } from "react-router-dom";
import BarraNav from "../BarraNav";
import Buscador from "../buscador/Buscador";
import Usuario from "../User/Usuario";
import FormularioGastosFijos from "./GastosFijos";
import FormularioGastosPersonales from "./GastosPersonales";
import HorasDeTrabajo from "./HorasDeTrabajo";
import { useValorHora } from "../context/ValorHoraContext";
import ContenedorUser from "../contenedorUser/ContenedorUser";

// ✅ Exportar la función de cálculo para que pueda ser importada en otros componentes
export const calcularValorHora = (gastosFijos, gastosPersonales, horasTrabajo) => {
  const totalGF = Object.values(gastosFijos).reduce(
    (a, b) => a + parseFloat(b || 0),
    0,
  );
  const totalGP = Object.values(gastosPersonales).reduce(
    (a, b) => a + parseFloat(b || 0),
    0,
  );
  const horas = horasTrabajo.totalHorasMensuales || 1;
  const res = (totalGF + totalGP) / horas;
  return Math.round(res); // ✅ Redondeamos a número entero
};

// ✅ Hook personalizado para usar el valor hora en cualquier componente
export const useValorHoraCalculado = () => {
  const [datosCompletos, setDatosCompletos] = useState(() => {
    // Recuperar datos del localStorage si existen
    const saved = localStorage.getItem('datosCalculadoraValorHora');
    return saved ? JSON.parse(saved) : {
      gastosFijos: {},
      gastosPersonales: {},
      horasTrabajo: {}
    };
  });

  const valorHora = calcularValorHora(
    datosCompletos.gastosFijos,
    datosCompletos.gastosPersonales,
    datosCompletos.horasTrabajo
  );

  const actualizarDatos = (nuevosDatos) => {
    setDatosCompletos(nuevosDatos);
    localStorage.setItem('datosCalculadoraValorHora', JSON.stringify(nuevosDatos));
  };

  return { valorHora, datosCompletos, actualizarDatos };
};

export default function ContenedorCalculadora() {
  const { setValorHora } = useValorHora();
  const navigate = useNavigate();
  const location = useLocation();
  const { paso } = useParams();
  
  // ✅ Usar nuestro hook personalizado para manejar los datos
  const { valorHora, datosCompletos, actualizarDatos } = useValorHoraCalculado();

  // Determinar el paso actual basado en la ruta
  const pasoActual = location.pathname.split('/').pop();
  const pasos = {
    'gastos-personales': 1,
    'gastos-fijos-negocio': 2,
    'horas-trabajo': 3
  };
  const numeroPaso = pasos[pasoActual] || 1;

  const handleNext = (nuevoDato, siguientePaso) => {
    // Actualizar datos usando nuestra función centralizada
    let nuevosDatos = { ...datosCompletos };
    
    if (numeroPaso === 1) {
      nuevosDatos.gastosPersonales = nuevoDato;
    } else if (numeroPaso === 2) {
      nuevosDatos.gastosFijos = nuevoDato;
    } else if (numeroPaso === 3) {
      nuevosDatos.horasTrabajo = nuevoDato;
    }

    actualizarDatos(nuevosDatos);
    
    // Navegar al siguiente paso
    if (numeroPaso === 1) {
      navigate('/valor-hora/gastos-fijos-negocio');
    } else if (numeroPaso === 2) {
      navigate('/valor-hora/horas-trabajo');
    } else if (numeroPaso === 3) {
      // Calcular valor final y navegar al resumen
      const valorFinal = calcularValorHora(
        nuevosDatos.gastosFijos,
        nuevosDatos.gastosPersonales,
        nuevosDatos.horasTrabajo
      );
      setValorHora(valorFinal);
      navigate('/valor-hora/resumen');
    }
  };

  // ✅ Efecto para sincronizar con el contexto global
  useEffect(() => {
    if (valorHora > 0) {
      setValorHora(valorHora);
    }
  }, [valorHora, setValorHora]);

  // Renderizar el contenido basado en la ruta
  const renderContent = () => {
    switch (pasoActual) {
      case 'gastos-personales':
        return (
          <FormularioGastosPersonales
            datosIniciales={datosCompletos.gastosPersonales}
            onNext={handleNext}
          />
        );
      case 'gastos-fijos-negocio':
        return (
          <FormularioGastosFijos
            datosIniciales={datosCompletos.gastosFijos}
            onNext={handleNext}
          />
        );
      case 'horas-trabajo':
        return (
          <HorasDeTrabajo
            datosIniciales={datosCompletos.horasTrabajo}
            onNext={handleNext}
          />
        );
      case 'resumen':
        return (
          <div className="bg-white p-8 rounded-lg shadow-md space-y-6 max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
              Resumen Final - Valor Hora Calculado
            </h2>
            
            {/* Resumen de Gastos Personales */}
            <div className="border rounded-lg p-4">
              <h3 className="text-xl font-semibold mb-3 text-gray-700">Gastos Personales</h3>
              <div className="space-y-2">
                {Object.entries(datosCompletos.gastosPersonales).map(([categoria, monto]) => (
                  <div key={categoria} className="flex justify-between">
                    <span className="text-gray-600">{categoria}:</span>
                    <span className="font-medium">${parseFloat(monto).toLocaleString('es-ES')}</span>
                  </div>
                ))}
                <div className="flex justify-between border-t pt-2 font-bold">
                  <span>Total Gastos Personales:</span>
                  <span className="text-blue-600">
                    ${Object.values(datosCompletos.gastosPersonales).reduce((a, b) => a + parseFloat(b || 0), 0).toLocaleString('es-ES')}
                  </span>
                </div>
              </div>
            </div>

            {/* Resumen de Gastos Fijos */}
            <div className="border rounded-lg p-4">
              <h3 className="text-xl font-semibold mb-3 text-gray-700">Gastos Fijos del Negocio</h3>
              <div className="space-y-2">
                {Object.entries(datosCompletos.gastosFijos).map(([categoria, monto]) => (
                  <div key={categoria} className="flex justify-between">
                    <span className="text-gray-600">{categoria}:</span>
                    <span className="font-medium">${parseFloat(monto).toLocaleString('es-ES')}</span>
                  </div>
                ))}
                <div className="flex justify-between border-t pt-2 font-bold">
                  <span>Total Gastos Fijos:</span>
                  <span className="text-blue-600">
                    ${Object.values(datosCompletos.gastosFijos).reduce((a, b) => a + parseFloat(b || 0), 0).toLocaleString('es-ES')}
                  </span>
                </div>
              </div>
            </div>

            {/* Resumen de Horas de Trabajo */}
            <div className="border rounded-lg p-4">
              <h3 className="text-xl font-semibold mb-3 text-gray-700">Horas de Trabajo</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Días por semana:</span>
                  <span className="font-medium">{datosCompletos.horasTrabajo.diasPorSemana || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Horas por día:</span>
                  <span className="font-medium">{datosCompletos.horasTrabajo.horasPorDia || 0}</span>
                </div>
                <div className="flex justify-between border-t pt-2 font-bold">
                  <span>Total Horas Mensuales:</span>
                  <span className="text-blue-600">{datosCompletos.horasTrabajo.totalHorasMensuales || 0} horas</span>
                </div>
              </div>
            </div>

            {/* Resultado Final - Valor Hora */}
            <div className="bg-gradient-to-r from-fondoPao to-rosadoFuerte p-6 rounded-lg text-center text-white">
              <p className="text-xl font-bold mb-2">
                💰 Valor Hora Calculado
              </p>
              <p className="text-4xl font-extrabold mt-2">
                ${valorHora.toLocaleString('es-ES')}
              </p>
              <p className="text-sm opacity-90 mt-2">
                Este es el valor que deberías cobrar por hora para cubrir todos tus gastos
              </p>
            </div>

            {/* Botones de acción */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
              <button
                onClick={() => navigate('/cotizador-servicios')}
                className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium"
              >
                🚀 Usar este Valor en Cotizador
              </button>
              <button
                onClick={() => navigate('/valor-hora/gastos-personales')}
                className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition-colors font-medium"
              >
                🔄 Recalcular Valor
              </button>
            </div>
          </div>
        );
      default:
        return <div>Paso no válido</div>;
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[16rem,1fr] min-h-screen font-poppins">
      {/* Barra lateral sólo en lg+ */}
      <div className="hidden lg:block">
        <BarraNav />
      </div>

      {/* Contenido principal */}
      <div className="bg-fondoHome flex-1">
        {/* En móviles mostramos la barra encima */}
        <div className="lg:hidden mb-4">
          <BarraNav />
        </div>

        {/* Cabecera superior */}
        <div className="px-4 md:px-6 lg:px-8 pt-2">
          <ContenedorUser />
        </div>

        {/* Título añadido aquí */}
        <h1 className="text-3xl font-bold text-center mb-6 mt-4">Calculadora de Valor Hora</h1>

        {/* Contenedor de la calculadora */}
        <div className="w-full flex justify-center">
          <div className="mt-4 w-full max-w-4xl">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
}