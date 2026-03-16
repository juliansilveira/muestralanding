import React, { useState } from "react";

const FormularioGastosFijos = ({ onNext }) => {
  // Lista de categorías
  const categorias = [
    "Alquiler",
    "Energia Eléctrica",
    "Agua / Gas",
    "Internet",
    "Celular",
    "Amortización",
    "Monotributo",
    "Otros Impuestos",
    "Tienda On line / Hosting / Soporte",
    "Honorarios Contador / Abogado",
    "Honorarios de Diseño",
    "Capacitación y Formación",
    "Otros Costos Fijos",
    "Fondo de Reserva",
  ];

  // Estado para almacenar los gastos
  const [gastos, setGastos] = useState(
    categorias.reduce((acc, categoria) => {
      acc[categoria] = 0;
      return acc;
    }, {}),
  );

  // Manejar el cambio de los inputs
  const handleChange = (categoria, value) => {
    setGastos({
      ...gastos,
      [categoria]: parseFloat(value) || 0,
    });
  };

  // Calcular el total de gastos
  const calcularTotal = () => {
    return Object.values(gastos).reduce((total, valor) => total + valor, 0);
  };

  // Enviar los datos al siguiente paso
  const handleSubmit = (e) => {
    e.preventDefault();
    onNext(gastos, calcularTotal());
  };

  return (
    <div className="font-poppins mx-auto bg-white p-4 sm:p-6 lg:p-8 rounded-lg shadow-md max-w-screen-sm md:max-w-2xl lg:max-w-4xl w-full">
      <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-4 sm:mb-6 text-gray-800 flex items-center">
        2. Carga Los Gastos Fijos Mensuales de tu Negocio
        {/* Ícono de información con tooltip */}
        <div className="relative group ml-2 inline-block">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5 text-gray-400 cursor-pointer"
            viewBox="0 0 20 20"
            fill="current-color"
          >
            <circle cx="10" cy="10" r="10" />
            <text
              x="10"
              y="14"
              textAnchor="middle"
              fontSize="12"
              fill="white"
              fontWeight="bold"
            >
              i
            </text>
          </svg>
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-64 p-2 text-xs text-white bg-pink-300 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
            Aquí registras todos tus gastos fijos mensuales de tu negocio.
            Ingresa cada monto y haz clic en "Siguiente" para calcular el total
            y avanzar al siguiente paso del flujo.
          </div>
        </div>
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {categorias.map((categoria) => (
            <div
              key={categoria}
              className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-4"
            >
              <label className="text-gray-700 text-sm sm:text-base lg:text-lg flex-1">
                {categoria}:
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={gastos[categoria]}
                onChange={(e) => handleChange(categoria, e.target.value)}
                className="w-full sm:w-40 p-2 sm:p-3 border rounded-md text-right focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
              />
            </div>
          ))}
        </div>

        <div className="pt-4 sm:pt-6 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="font-bold text-base sm:text-lg lg:text-xl text-gray-800 w-full text-right">
              Total: ${calcularTotal().toFixed(2)}
            </p>
            <button
              type="submit"
              className="w-full sm:w-auto bg-fondoPao hover:bg-blue-700 text-white py-2 sm:py-3 px-4 sm:px-8 rounded-lg 
                     transition-all duration-200 font-medium text-sm sm:text-base
                     focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Siguiente
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default FormularioGastosFijos;
