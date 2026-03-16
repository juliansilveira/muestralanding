const ResumenActividades = ({ actividades, listaDeActividades }) => {
  const resumen = listaDeActividades.map((actividad) => {
    const totalHoras = actividades
      .filter((reg) => reg.actividad === actividad)
      .reduce((acc, curr) => acc + parseFloat(curr.tiempo), 0);

    return { actividad, totalHoras };
  });

  return (
    <div className="mt-6 font-poppins">
      <h4 className="text-lg font-semibold text-gray-800">Resumen de Horas</h4>
      <ul className="space-y-2">
        {resumen.map((item, index) => (
          <li
            key={index}
            className="flex justify-between border-b pb-2 text-gray-700"
          >
            <span>{item.actividad}</span>
            <span>{item.totalHoras.toFixed(2)} horas</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ResumenActividades;
