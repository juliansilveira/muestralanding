import { useState, useEffect } from "react";
import BarraNav from "../BarraNav";
import ContenedorUser from "../contenedorUser/ContenedorUser";
import { useValorHora } from "../context/ValorHoraContext";
import { useNavigate } from "react-router-dom"; // Importa useNavigate
import api from "../../services/api";

export default function ContenedorCotizadorDeServicios() {
  const [serviceHoursItems, setServiceHoursItems] = useState([
    { name: "", hours: "", value: "" },
  ]);
  const [otherCostItems, setOtherCostItems] = useState([
    { name: "", value: "" },
  ]);
  const [hourlyRate, setHourlyRate] = useState("");
  const [profitMargin, setProfitMargin] = useState("");
  const [clientName, setClientName] = useState("");
  const [quotationName, setQuotationName] = useState("");
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [savedQuotationId, setSavedQuotationId] = useState(null);

  const navigate = useNavigate(); // Para redireccionar
  const { valorHora } = useValorHora();

  useEffect(() => {
    if (valorHora) {
      setHourlyRate(valorHora);
    }
  }, [valorHora]);

  const formatNumber = (value, isCurrency = true) => {
    if (value === "" || value === null || isNaN(Number(value))) {
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

  // Funciones para manejar los items (se mantienen igual)
  const handleAddServiceHourItem = () => {
    setServiceHoursItems([
      ...serviceHoursItems,
      { name: "", hours: "", value: "" },
    ]);
  };

  const handleServiceHourItemChange = (index, field, input_value) => {
    const newItems = [...serviceHoursItems];
    newItems[index][field] = input_value;
    setServiceHoursItems(newItems);
  };

  const handleRemoveServiceHourItem = (index) => {
    if (serviceHoursItems.length > 1) {
      const newItems = serviceHoursItems.filter((_, i) => i !== index);
      setServiceHoursItems(newItems);
    }
  };

  const handleAddOtherCostItem = () => {
    setOtherCostItems([...otherCostItems, { name: "", value: "" }]);
  };

  const handleOtherCostItemChange = (index, field, value) => {
    const newItems = [...otherCostItems];
    newItems[index][field] = value;
    setOtherCostItems(newItems);
  };

  const handleRemoveOtherCostItem = (index) => {
    if (otherCostItems.length > 1) {
      const newItems = otherCostItems.filter((_, i) => i !== index);
      setOtherCostItems(newItems);
    }
  };

  // Cálculos
  const totalServiceHours = serviceHoursItems.reduce(
    (acc, item) => acc + (Number(item.hours) || 0),
    0
  );
  const totalServiceHoursCost = totalServiceHours * (Number(hourlyRate) || 0);
  const totalOtherCosts = otherCostItems.reduce(
    (acc, item) => acc + (Number(item.value) || 0),
    0
  );
  const unitCost = totalServiceHoursCost + totalOtherCosts;
  const profitAmount = (unitCost * (Number(profitMargin) || 0)) / 100;
  const finalPrice = unitCost + profitAmount;

  // Función para validar el formulario antes de guardar
  const validateForm = () => {
    const errors = [];

    // Validar nombre del cliente
    if (!clientName.trim()) {
      errors.push("El nombre del cliente es obligatorio");
    }

    // Validar nombre de la cotización
    if (!quotationName.trim()) {
      errors.push("El nombre de la cotización es obligatorio");
    }

    // Validar valor hora
    if (!hourlyRate || Number(hourlyRate) <= 0) {
      errors.push("El valor hora debe ser mayor a 0");
    }

    // Validar que haya al menos una tarea con horas
    const hasValidTasks = serviceHoursItems.some(
      (item) => item.name.trim() && Number(item.hours) > 0
    );
    if (!hasValidTasks) {
      errors.push("Debes agregar al menos una tarea con horas asignadas");
    }

    // Validar margen de ganancia
    if (profitMargin && Number(profitMargin) < 0) {
      errors.push("El margen de ganancia no puede ser negativo");
    }

    return errors;
  };
  const handleSaveQuotation = () => {
    // Validar formulario
    const errors = validateForm();

    if (errors.length > 0) {
      // Mostrar todos los errores
      setSaveError(errors.join(". "));
      // Scroll al top para que vea el error
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    // Si no hay errores, limpiar mensajes y mostrar popup de confirmación
    setSaveError("");
    setShowConfirmPopup(true);
  };
  const handleSaveQuotationConfirmed = async () => {
    setIsSaving(true);
    setSaveError("");

    try {
      const quotationData = {
        nombreCotizacion: quotationName,
        nombreCliente: clientName,
        hourlyRate: Number(hourlyRate) || 0,
        totalServiceHours: totalServiceHours,
        totalServiceHoursCost: totalServiceHoursCost,
        totalOtherCosts: totalOtherCosts,
        unitCost: unitCost,
        profitMargin: Number(profitMargin) || 0,
        profitAmount: profitAmount,
        finalPrice: finalPrice,
        serviceHoursItems: serviceHoursItems.map((item) => ({
          name: item.name,
          hours: Number(item.hours) || 0,
          calculatedValue:
            (Number(item.hours) || 0) * (Number(hourlyRate) || 0),
        })),
        otherCostItems: otherCostItems.map((item) => ({
          name: item.name,
          value: Number(item.value) || 0,
        })),
      };

      // Enviar al backend
      const response = await api.post("/cotizaciones", quotationData);

      if (response.data.estado) {
        // Guardar el ID para mostrar en el mensaje
        setSavedQuotationId(response.data.idCotizacion);

        // Mostrar popup de éxito
        setShowSuccessPopup(true);
      } else {
        throw new Error(
          response.data.mensaje || "Error al guardar la cotización"
        );
      }
    } catch (error) {
      console.error("Error guardando cotización:", error);
      setSaveError(
        error.response?.data?.mensaje ||
          error.message ||
          "Error al guardar la cotización. Inténtalo de nuevo."
      );
    } finally {
      setIsSaving(false);
      setShowConfirmPopup(false);
    }
  };

  const handleCancelSave = () => {
    setShowConfirmPopup(false);
  };

  // Función para redirigir a la lista de cotizaciones
  const goToQuotationsList = () => {
    navigate("/historial-cotizaciones");
  };

  // Función para crear una nueva cotización
  const createNewQuotation = () => {
    // Resetear formulario
    setClientName("");
    setQuotationName("");
    setServiceHoursItems([{ name: "", hours: "", value: "" }]);
    setOtherCostItems([{ name: "", value: "" }]);
    setProfitMargin("");
    setShowSuccessPopup(false);
    setSavedQuotationId(null);
  };

  return (
    <div className="font-poppins min-h-screen bg-fondoHome">
      <header className="md:ml-52 bg-fondoHome">
        <div className="max-w-screen mx-auto px-1 md:px-6">
          <BarraNav />
          <ContenedorUser />
        </div>
      </header>

      <div className="pt-20 md:pt-28 max-w-4xl mx-auto p-4 md:p-6">
        <h1 className="text-xl md:text-2xl font-bold mb-6">
          Cotizador de Servicios
        </h1>
        {/* Mostrar errores de validación */}
        {saveError && !showConfirmPopup && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            <div className="flex items-start">
              <svg
                className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
              <div>
                <p className="font-bold">
                  Por favor corrige los siguientes errores:
                </p>
                <p className="text-sm mt-1">{saveError}</p>
              </div>
            </div>
          </div>
        )}

        {/* Sección de Información General */}
        <div className="bg-white p-4 md:p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-lg md:text-xl font-semibold mb-4">
            Información General
          </h2>
          <div className="mb-4">
            <label htmlFor="clientName" className="block mb-2">
              Nombre del Cliente
            </label>
            <input
              type="text"
              id="clientName"
              placeholder="Nombre cliente o Empresa"
              className="w-full p-2 border rounded"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="quotationName" className="block mb-2">
              Nombre de la Cotización
            </label>
            <input
              type="text"
              id="quotationName"
              placeholder="Ej: Desarrollo Web E-commerce"
              className="w-full p-2 border rounded"
              value={quotationName}
              onChange={(e) => setQuotationName(e.target.value)}
            />
          </div>
        </div>

        {/* Sección de Horas Asignables al Servicio */}
        <div className="bg-white p-4 md:p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-lg md:text-xl font-semibold mb-4">
            Horas Asignables al Servicio
          </h2>
          <p className="text-sm text-gray-600 mb-4">
            Define las horas estimadas por cada tarea del servicio. Estas horas
            multiplican tu **Valor Hora** definido.
          </p>
          {serviceHoursItems.map((item, index) => (
            <div
              key={index}
              className="flex flex-col md:flex-row gap-2 md:gap-4 mb-4"
            >
              <input
                type="text"
                placeholder="Nombre de la tarea"
                className="flex-1 p-2 border rounded text-sm md:text-base"
                value={item.name}
                onChange={(e) =>
                  handleServiceHourItemChange(index, "name", e.target.value)
                }
              />
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder="Horas"
                  className="w-20 md:w-24 p-2 border rounded text-sm md:text-base"
                  value={item.hours}
                  onChange={(e) =>
                    handleServiceHourItemChange(index, "hours", e.target.value)
                  }
                />
                <span className="text-sm md:text-base">Horas</span>
              </div>
              {serviceHoursItems.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemoveServiceHourItem(index)}
                  className="bg-red-500 text-white px-3 py-2 md:py-0 rounded hover:bg-red-600 self-start md:self-center"
                >
                  ×
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={handleAddServiceHourItem}
            className="bg-fondoPao text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Agregar Tarea
          </button>
        </div>

        {/* Sección de Otros Costos */}
        <div className="bg-white p-4 md:p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-lg md:text-xl font-semibold mb-4">
            Otros Costos
          </h2>
          <p className="text-sm text-gray-600 mb-4">
            Ingresa cualquier otro gasto directo asociado al servicio (ej:
            licencias, materiales, transporte).
          </p>
          {otherCostItems.map((item, index) => (
            <div
              key={index}
              className="flex flex-col md:flex-row gap-2 md:gap-4 mb-4"
            >
              <input
                type="text"
                placeholder="Nombre del costo"
                className="flex-1 p-2 border rounded text-sm md:text-base"
                value={item.name}
                onChange={(e) =>
                  handleOtherCostItemChange(index, "name", e.target.value)
                }
              />
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder="Valor $"
                  className="w-24 md:w-32 p-2 border rounded text-sm md:text-base"
                  value={item.value}
                  onChange={(e) =>
                    handleOtherCostItemChange(index, "value", e.target.value)
                  }
                />
                <span className="text-sm md:text-base">$</span>
              </div>
              {otherCostItems.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemoveOtherCostItem(index)}
                  className="bg-red-500 text-white px-3 py-2 md:py-0 rounded hover:bg-red-600 self-start md:self-center"
                >
                  ×
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={handleAddOtherCostItem}
            className="bg-fondoPao text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Agregar Otro Costo
          </button>
        </div>

        {/* Sección de Cálculos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6">
          <div className="bg-white p-4 md:p-6 rounded-lg shadow-md">
            <h2 className="text-lg md:text-xl font-semibold mb-4">
              Tu Valor Hora
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block mb-2 font-medium">Valor Hora ($)</label>
                <input
                  type="number"
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={hourlyRate}
                  onChange={(e) => setHourlyRate(e.target.value)}
                  placeholder="Ingresa tu valor hora"
                  min="0"
                />
                {!!valorHora && (
                  <p className="text-sm text-blue-600 mt-1 flex items-center gap-1">
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Valor importado de la calculadora: $
                    {valorHora.toLocaleString("es-ES")}. Puedes modificarlo
                    aquí.
                  </p>
                )}
              </div>
              <div className="flex justify-between items-center bg-blue-50 p-4 rounded">
                <span className="font-bold">Total Horas Asignadas:</span>
                <span className="text-lg font-bold text-blue-700">
                  {formatNumber(totalServiceHours, false)} Horas
                </span>
              </div>
              <div className="flex justify-between items-center bg-blue-50 p-4 rounded">
                <span className="font-bold">Costo Total por Horas:</span>
                <span className="text-lg font-bold text-blue-700">
                  ${formatNumber(totalServiceHoursCost)}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 md:p-6 rounded-lg shadow-md">
            <h2 className="text-lg md:text-xl font-semibold mb-4">
              Resumen de Costos
            </h2>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span>Total Horas Asignables:</span>
                <span>${formatNumber(totalServiceHoursCost)}</span>
              </div>
              <div className="flex justify-between">
                <span>Total Otros Costos:</span>
                <span>${formatNumber(totalOtherCosts)}</span>
              </div>
              <div className="flex justify-between font-bold border-t pt-2">
                <span>Total Costo Directo:</span>
                <span>${formatNumber(unitCost)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Sección de Margen de Ganancia */}
        <div className="bg-white p-4 md:p-6 rounded-lg shadow-md">
          <h2 className="text-lg md:text-xl font-semibold mb-4">
            Margen de Ganancia
          </h2>
          <div className="flex flex-col md:flex-row gap-4 md:gap-6">
            <div className="flex-1">
              <label className="block mb-2">% de Ganancia</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  className="w-24 p-2 border rounded"
                  value={profitMargin}
                  onChange={(e) => setProfitMargin(e.target.value)}
                />
                <span>%</span>
              </div>
              <div className="flex justify-between items-center bg-yellow-50 p-4 rounded mt-4">
                <span className="font-bold">Monto de Ganancia:</span>
                <span className="text-lg font-bold text-yellow-700">
                  ${formatNumber(profitAmount)}
                </span>
              </div>
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-center bg-green-50 p-4 rounded">
                <span className="font-bold">Precio Final:</span>
                <span className="text-xl font-bold text-green-600">
                  ${formatNumber(finalPrice)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Botón de Guardar Cotización */}
        <div className="text-center mt-6 md:mt-8">
          <button
            type="button"
            onClick={handleSaveQuotation}
            className="bg-green-600 text-white px-6 py-3 md:px-8 md:py-3 rounded-lg shadow-lg text-base md:text-lg font-bold hover:bg-green-700 transition-colors duration-200 w-full md:w-auto"
          >
            Guardar Cotización
          </button>
        </div>
      </div>

      {/* Popup de Confirmación */}
      {showConfirmPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-4 md:p-6 rounded-lg shadow-xl max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Confirmar Guardado</h3>
            <p className="mb-6">
              ¿Estás seguro de que deseas finalizar y guardar esta cotización?
            </p>

            {saveError && (
              <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
                {saveError}
              </div>
            )}

            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button
                onClick={handleSaveQuotationConfirmed}
                disabled={isSaving}
                className={`bg-green-500 text-white px-6 py-2 rounded-md hover:bg-green-600 transition-colors ${
                  isSaving ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {isSaving ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Guardando...
                  </>
                ) : (
                  "Sí, guardar"
                )}
              </button>
              <button
                onClick={handleCancelSave}
                disabled={isSaving}
                className={`bg-red-500 text-white px-6 py-2 rounded-md hover:bg-red-600 transition-colors ${
                  isSaving ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                No, cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Popup de Éxito */}
      {showSuccessPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 md:p-8 rounded-lg shadow-xl max-w-md w-full text-center">
            <svg
              className="w-16 h-16 text-green-500 mx-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              ></path>
            </svg>
            <h3 className="text-xl font-bold mt-4 mb-2">
              ¡Cotización Guardada!
            </h3>
            <p className="mb-6">
              La cotización se ha guardado correctamente.
              {savedQuotationId && <span> ID: {savedQuotationId}</span>}
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button
                onClick={goToQuotationsList}
                className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition-colors"
              >
                Ver en Historial
              </button>
              <button
                onClick={createNewQuotation}
                className="bg-green-500 text-white px-6 py-2 rounded-md hover:bg-green-600 transition-colors"
              >
                Crear Nueva Cotización
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
