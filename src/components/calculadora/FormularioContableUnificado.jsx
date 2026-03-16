import { useState } from "react";
import BarraNav from "../BarraNav";
import "./FormularioContableUnificado.css";
import ContenedorUser from "../contenedorUser/ContenedorUser";
import { Link, useSearchParams } from "react-router-dom";
import { useValorHora } from "../context/ValorHoraContext";

// ✅ Exportar la función de cálculo para que pueda ser importada en otros componentes
export const calcularValorHora = (
  gastosFijos,
  gastosPersonales,
  horasTrabajo
) => {
  const totalGF = gastosFijos.total || 0;
  const totalGP = gastosPersonales.total || 0;
  const horas = horasTrabajo.totalMensual || 1;

  const res = (totalGF + totalGP) / horas;
  return Math.round(res);
};

// ✅ Hook personalizado para usar el valor hora en cualquier componente
export const useValorHoraCalculado = () => {
  const [datosCompletos, setDatosCompletos] = useState(() => {
    // Recuperar datos del localStorage si existen
    const saved = localStorage.getItem("datosFormularioContable");
    return saved
      ? JSON.parse(saved)
      : {
          gastosPersonales: { categorias: [], total: 0 },
          gastosFijos: { categorias: [], total: 0 },
          horasTrabajo: { diasPorSemana: "", horasPorDia: "", totalMensual: 0 },
        };
  });

  const valorHora = calcularValorHora(
    datosCompletos.gastosFijos,
    datosCompletos.gastosPersonales,
    datosCompletos.horasTrabajo
  );

  const actualizarDatos = (nuevosDatos) => {
    setDatosCompletos(nuevosDatos);
    localStorage.setItem(
      "datosFormularioContable",
      JSON.stringify(nuevosDatos)
    );
  };

  return { valorHora, datosCompletos, actualizarDatos };
};

const FormularioContableUnificado = ({ onComplete }) => {
  const [searchParams] = useSearchParams();
  const stepFromUrl = searchParams.get("step");

  // ✅ Usar el hook del contexto directamente
  const { setValorHora } = useValorHora();

  // ✅ Inicializar con el paso de la URL si existe, sino paso 1
  const [currentStep, setCurrentStep] = useState(() => {
    const step = parseInt(stepFromUrl);
    return step >= 1 && step <= 3 ? step : 1;
  });

  const [resultadoFinal, setResultadoFinal] = useState(null);

  // ✅ Usar nuestro hook personalizado para manejar los datos
  const { valorHora, datosCompletos, actualizarDatos } =
    useValorHoraCalculado();

  const [formData, setFormData] = useState(datosCompletos);

  // Estados auxiliares
  const [nuevaCategoriaPersonal, setNuevaCategoriaPersonal] = useState("");
  const [nuevoMontoPersonal, setNuevoMontoPersonal] = useState("");
  const [nuevaCategoriaFijo, setNuevaCategoriaFijo] = useState("");
  const [nuevoMontoFijo, setNuevoMontoFijo] = useState("");

  // 🔧 FUNCIONES DE FORMATEO DE NÚMEROS
  const formatearNumero = (numero) => {
    if (!numero && numero !== 0) return "";
    // Convertir a número entero y formatear con separadores de miles
    const numeroEntero = Math.round(Number(numero));
    return numeroEntero.toLocaleString("es-ES");
  };

  const parsearNumeroFormateado = (texto) => {
    // Remover todos los puntos y convertir a número
    const numeroLimpio = texto.replace(/\./g, "");
    return numeroLimpio === "" ? "" : Math.round(Number(numeroLimpio));
  };

  const manejarCambioMonto = (valor, setter) => {
    // Permitir solo números y remover caracteres no numéricos
    const soloNumeros = valor.replace(/[^\d]/g, "");

    if (soloNumeros === "") {
      setter("");
    } else {
      // Formatear el número con separadores de miles
      const numeroFormateado = formatearNumero(soloNumeros);
      setter(numeroFormateado);
    }
  };

  // 📊 Función de cálculo principal - ACTUALIZADA para usar datos persistentes
  const calcularResumen = () => {
    const valorHoraRedondeado = calcularValorHora(
      formData.gastosFijos,
      formData.gastosPersonales,
      formData.horasTrabajo
    );

    // ✅ Actualizar datos persistentes
    actualizarDatos(formData);

    setValorHora(valorHoraRedondeado);
    setResultadoFinal(valorHoraRedondeado);
    return valorHoraRedondeado;
  };

  // --- Gestión de categorías ---
  const agregarCategoriaPersonal = () => {
    if (nuevaCategoriaPersonal.trim() && nuevoMontoPersonal) {
      const montoNumerico = parsearNumeroFormateado(nuevoMontoPersonal);

      const nuevoGasto = {
        categoria: nuevaCategoriaPersonal.trim(),
        monto: montoNumerico,
      };

      setFormData((prev) => {
        const nuevosDatos = {
          ...prev,
          gastosPersonales: {
            ...prev.gastosPersonales,
            categorias: [...prev.gastosPersonales.categorias, nuevoGasto],
            total: prev.gastosPersonales.total + nuevoGasto.monto,
          },
        };
        return nuevosDatos;
      });

      setNuevaCategoriaPersonal("");
      setNuevoMontoPersonal("");
    }
  };

  const eliminarCategoriaPersonal = (index) => {
    const categoriaEliminada = formData.gastosPersonales.categorias[index];
    setFormData((prev) => {
      const nuevosDatos = {
        ...prev,
        gastosPersonales: {
          ...prev.gastosPersonales,
          categorias: prev.gastosPersonales.categorias.filter(
            (_, i) => i !== index
          ),
          total: prev.gastosPersonales.total - categoriaEliminada.monto,
        },
      };
      return nuevosDatos;
    });
  };

  const agregarCategoriaFija = () => {
    if (nuevaCategoriaFijo.trim() && nuevoMontoFijo) {
      const montoNumerico = parsearNumeroFormateado(nuevoMontoFijo);

      const nuevoGasto = {
        categoria: nuevaCategoriaFijo.trim(),
        monto: montoNumerico,
      };

      setFormData((prev) => {
        const nuevosDatos = {
          ...prev,
          gastosFijos: {
            ...prev.gastosFijos,
            categorias: [...prev.gastosFijos.categorias, nuevoGasto],
            total: prev.gastosFijos.total + nuevoGasto.monto,
          },
        };
        return nuevosDatos;
      });

      setNuevaCategoriaFijo("");
      setNuevoMontoFijo("");
    }
  };

  const eliminarCategoriaFija = (index) => {
    const categoriaEliminada = formData.gastosFijos.categorias[index];
    setFormData((prev) => {
      const nuevosDatos = {
        ...prev,
        gastosFijos: {
          ...prev.gastosFijos,
          categorias: prev.gastosFijos.categorias.filter((_, i) => i !== index),
          total: prev.gastosFijos.total - categoriaEliminada.monto,
        },
      };
      return nuevosDatos;
    });
  };

  const actualizarHorasTrabajo = (campo, valor) => {
    const soloNumeros = valor.replace(/[^0-9]/g, "");
    setFormData((prev) => {
      const nuevoHorasTrabajo = {
        ...prev.horasTrabajo,
        [campo]: soloNumeros,
      };
      const dias = parseFloat(nuevoHorasTrabajo.diasPorSemana) || 0;
      const horas = parseFloat(nuevoHorasTrabajo.horasPorDia) || 0;
      nuevoHorasTrabajo.totalMensual = Math.round(dias * horas * 4);

      const nuevosDatos = { ...prev, horasTrabajo: nuevoHorasTrabajo };
      return nuevosDatos;
    });
  };

  const siguientePaso = () => setCurrentStep((prev) => prev + 1);
  const pasoAnterior = () => setCurrentStep((prev) => prev - 1);

  const handleSubmit = (e) => {
    e.preventDefault();
    const valorCalculado = calcularResumen();
    setCurrentStep(4);
    onComplete && onComplete(formData);

    // ✅ Mostrar mensaje de éxito con el valor calculado
    // console.log(`✅ Valor hora calculado: $${valorCalculado}`);
  };

  // --- Render de cada paso ---
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="font-poppins bg-white mx-auto p-6 rounded-lg shadow-md max-w-3xl">
            <BarraNav></BarraNav>
            <h2 className="text-2xl font-bold mb-4 text-gray-800">
              1. Carga Tus Gastos Personales Mensuales
            </h2>

            {/* Formulario */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div className="sm:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                <input
                  type="text"
                  placeholder="Nombre de categoría"
                  value={nuevaCategoriaPersonal}
                  onChange={(e) => setNuevaCategoriaPersonal(e.target.value)}
                  className="p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:col-span-2"
                />
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Monto"
                    value={nuevoMontoPersonal}
                    onChange={(e) =>
                      manejarCambioMonto(e.target.value, setNuevoMontoPersonal)
                    }
                    className="p-2 w-full border rounded text-right focus:ring-2 focus:ring-blue-500 focus:border-blue-500 flex-1"
                  />
                  <button
                    type="button"
                    onClick={agregarCategoriaPersonal}
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Lista */}
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {formData.gastosPersonales.categorias.map((item, i) => (
                <div
                  key={i}
                  className="flex justify-between items-center p-3 border rounded-lg bg-white"
                >
                  <span className="font-medium text-gray-800">
                    {item.categoria}
                  </span>
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-green-600">
                      ${formatearNumero(item.monto)}
                    </span>
                    <button
                      onClick={() => eliminarCategoriaPersonal(i)}
                      className="text-red-500 hover:text-red-700 font-bold text-lg"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center mt-6 pt-4 border-t">
              <p className="font-semibold text-lg text-gray-800">
                Total:{" "}
                <span className="text-blue-600">
                  ${formatearNumero(formData.gastosPersonales.total)}
                </span>
              </p>
              <button
                onClick={siguientePaso}
                className="bg-rosadoFuerte text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors font-medium"
              >
                Siguiente
              </button>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="font-poppins mx-auto bg-white p-6 rounded-lg shadow-md max-w-3xl">
            <BarraNav />
            <h2 className="text-2xl font-bold mb-4 text-gray-800">
              2. Carga los Gastos Fijos del Negocio
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div className="sm:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                <input
                  type="text"
                  placeholder="Nombre de categoría"
                  value={nuevaCategoriaFijo}
                  onChange={(e) => setNuevaCategoriaFijo(e.target.value)}
                  className="p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:col-span-2"
                />
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Monto"
                    value={nuevoMontoFijo}
                    onChange={(e) =>
                      manejarCambioMonto(e.target.value, setNuevoMontoFijo)
                    }
                    className="p-2 w-full border rounded text-right focus:ring-2 focus:ring-blue-500 focus:border-blue-500 flex-1"
                  />
                  <button
                    type="button"
                    onClick={agregarCategoriaFija}
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-2 max-h-96 overflow-y-auto">
              {formData.gastosFijos.categorias.map((item, i) => (
                <div
                  key={i}
                  className="flex justify-between items-center p-3 border rounded-lg bg-white"
                >
                  <span className="font-medium text-gray-800">
                    {item.categoria}
                  </span>
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-green-600">
                      ${formatearNumero(item.monto)}
                    </span>
                    <button
                      onClick={() => eliminarCategoriaFija(i)}
                      className="text-red-500 hover:text-red-700 font-bold text-lg"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* SECCIÓN CORREGIDA - Botones y total responsive */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6 pt-4 border-t">
              <button
                onClick={pasoAnterior}
                className="w-full sm:w-auto bg-gray-500 text-white px-6 py-3 rounded hover:bg-gray-600 transition-colors font-medium order-2 sm:order-1"
              >
                Atrás
              </button>

              <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto order-1 sm:order-2">
                <p className="font-semibold text-lg text-gray-800 text-center sm:text-right w-full">
                  Total:{" "}
                  <span className="text-blue-600">
                    ${formatearNumero(formData.gastosFijos.total)}
                  </span>
                </p>
                <button
                  onClick={siguientePaso}
                  className="w-full sm:w-auto bg-rosadoFuerte text-white px-6 py-3 rounded hover:bg-blue-700 transition-colors font-medium"
                >
                  Siguiente
                </button>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="font-poppins mx-auto bg-white p-6 rounded-lg shadow-md max-w-md">
            <BarraNav></BarraNav>
            <h2 className="text-2xl font-bold mb-4 text-gray-800">
              3. Carga Tus Horas de Trabajo
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Días de trabajo por semana
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  value={formData.horasTrabajo.diasPorSemana}
                  onChange={(e) =>
                    actualizarHorasTrabajo("diasPorSemana", e.target.value)
                  }
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-center text-lg"
                  placeholder="Ej: 5"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Horas de trabajo por día
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  value={formData.horasTrabajo.horasPorDia}
                  onChange={(e) =>
                    actualizarHorasTrabajo("horasPorDia", e.target.value)
                  }
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-center text-lg"
                  placeholder="Ej: 8"
                />
              </div>

              <div className="p-4 bg-blue-50 rounded-lg text-center">
                <p className="text-gray-600">Total de horas mensuales</p>
                <p className="text-2xl font-bold text-fondoPao">
                  {formatearNumero(formData.horasTrabajo.totalMensual)} horas
                </p>
              </div>

              <div className="flex justify-between gap-4 pt-4">
                <button
                  type="button"
                  onClick={pasoAnterior}
                  className="flex-1 bg-gray-500 text-white py-3 rounded-lg hover:bg-gray-600 transition-colors font-medium"
                >
                  Atrás
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-rosadoFuerte text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Calcular Valor Hora
                </button>
              </div>
            </form>
          </div>
        );

      case 4:
        return (
          <div className="font-poppins mx-auto bg-white p-6 rounded-lg shadow-md max-w-2xl">
            <BarraNav />
            <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">
              Resumen Final
            </h2>

            <div className="space-y-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-lg text-gray-700 mb-3">
                  Gastos Personales
                </h3>
                <ul className="space-y-2 text-gray-600">
                  {formData.gastosPersonales.categorias.map((item, i) => (
                    <li key={i} className="flex justify-between">
                      <span>{item.categoria}</span>
                      <span className="font-medium">
                        ${formatearNumero(item.monto)}
                      </span>
                    </li>
                  ))}
                </ul>
                <p className="font-bold mt-3 pt-2 border-t border-gray-200 text-right">
                  Total: ${formatearNumero(formData.gastosPersonales.total)}
                </p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-lg text-gray-700 mb-3">
                  Gastos Fijos del Negocio
                </h3>
                <ul className="space-y-2 text-gray-600">
                  {formData.gastosFijos.categorias.map((item, i) => (
                    <li key={i} className="flex justify-between">
                      <span>{item.categoria}</span>
                      <span className="font-medium">
                        ${formatearNumero(item.monto)}
                      </span>
                    </li>
                  ))}
                </ul>
                <p className="font-bold mt-3 pt-2 border-t border-gray-200 text-right">
                  Total: ${formatearNumero(formData.gastosFijos.total)}
                </p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-lg text-gray-700 mb-3">
                  Horas de Trabajo
                </h3>
                <div className="text-gray-600">
                  <p className="flex justify-between">
                    <span>Días por semana:</span>
                    <span className="font-medium">
                      {formData.horasTrabajo.diasPorSemana}
                    </span>
                  </p>
                  <p className="flex justify-between">
                    <span>Horas por día:</span>
                    <span className="font-medium">
                      {formData.horasTrabajo.horasPorDia}
                    </span>
                  </p>
                </div>
                <p className="font-bold mt-3 pt-2 border-t border-gray-200 text-right">
                  Total mensual:{" "}
                  {formatearNumero(formData.horasTrabajo.totalMensual)} horas
                </p>
              </div>
            </div>

            <div className="mt-8 bg-gradient-to-r from-fondoPao to-rosadoFuerte p-6 rounded-lg text-center text-white">
              <p className="text-xl font-bold mb-2">💰 Valor Hora Sugerido</p>
              <p className="text-4xl font-extrabold mt-2">
                ${formatearNumero(resultadoFinal)}
              </p>
              <p className="text-sm opacity-90 mt-2">
                Este es el valor que deberías cobrar por hora para cubrir todos
                tus gastos
              </p>

              {/* ✅ NUEVO: Información adicional sobre el valor exportado */}
              <div className="mt-4 p-3 bg-white bg-opacity-20 rounded-lg">
                <p className="text-sm font-medium">
                  ✅ Este valor ha sido guardado y está disponible para usar en
                  el Cotizador de Servicios
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mt-6">
              <button
                onClick={() => setCurrentStep(1)}
                className="flex-1 bg-gray-500 text-white py-3 rounded-lg hover:bg-gray-600 transition-colors font-medium"
              >
                Volver al Inicio
              </button>
              <Link
                to="/historial-servicios"
                className="flex w-auto mx-screen justify-center bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors font-medium"
              >
                🚀 Ir al Cotizador
              </Link>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-fondoRosaClaro py-8 px-4">
      {/* Indicador de progreso */}
      <ContenedorUser />
      {currentStep < 4 && (
        <div className="max-w-4xl mx-auto mb-8 my-8">
          <div className="flex justify-between items-center">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex flex-col items-center flex-1">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${
                    currentStep >= step
                      ? "bg-fondoPao text-white"
                      : "bg-gray-300 text-gray-600"
                  }`}
                >
                  {step}
                </div>
                <span className="text-sm mt-2 text-gray-600 text-center">
                  {step === 1 && "Gastos Personales"}
                  {step === 2 && "Gastos Fijos"}
                  {step === 3 && "Horas Trabajo"}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {renderStep()}
    </div>
  );
};

export default FormularioContableUnificado;
