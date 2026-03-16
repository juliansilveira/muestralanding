import { useState, useEffect } from "react";
import BarraNav from "../components/BarraNav";
import iconoFactura from "../assets/Iconos GestionaApp/Factura electronica.svg";
import iconoContactos from "../assets/Iconos GestionaApp/Contactos.svg";
import iconoInventario from "../assets/Iconos GestionaApp/Inventario.svg";
import iconoIngresos from "../assets/Iconos GestionaApp/Ingresos.svg";
import iconoEgresos from "../assets/Iconos GestionaApp/Gastos.svg";
import iconoDinero from "../assets/Iconos GestionaApp/Gestion del dinero.svg";
import ContenedorUser from "../components/contenedorUser/ContenedorUser";

export default function Home() {
  const [nombreUsuario, setNombreUsuario] = useState("Usuario");

  useEffect(() => {
    // Recupera el usuario registrado del localStorage
    const usuarioGuardado = localStorage.getItem("usuarioRegistrado");
    if (usuarioGuardado) {
      const usuario = JSON.parse(usuarioGuardado);
      setNombreUsuario(usuario.nombre || "Usuario");
    }
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-[16rem,1fr] m-1.5 font-poppins">
      {/* Barra de navegación */}
      <div className="w-full md:w-auto">
        <BarraNav />
      </div>

      {/* Contenedor principal */}
      <div className="flex-1 pt-3 md:ml-10 rounded-lg px-4 md:px-0">
        {/* Header */}
        <ContenedorUser />

        {/* Contenido principal */}
        <div className="w-full max-w-7xl mx-auto">
          {/* Sección de bienvenida */}
          <div className="text-center mb-8">
            <h1 className="text-2xl md:text-3xl font-bold mb-2">
              ¡Hola {nombreUsuario}!
            </h1>
            <p className="text-gray-600">Bienvenida a Gestión App</p>
          </div>

          {/* Tarjetas principales */}
          <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-8">
            {/* Tarjeta Meta Semanal */}
            <div className="bg-rosadoFuerte text-white rounded-xl p-6 h-48 flex flex-col justify-between">
              <p className="text-lg">Mi meta semanal</p>
              <p className="text-2xl font-bold">Foco y orden</p>
            </div>

            {/* Tarjetas de acción */}
            {[
              { icon: iconoFactura, title: "Crea", subtitle: "tu factura" },
              {
                icon: iconoContactos,
                title: "Gestiona",
                subtitle: "tus contactos",
              },
              {
                icon: iconoInventario,
                title: "Organiza",
                subtitle: "tu inventario",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-6 flex flex-col items-center justify-center gap-4 hover:shadow-lg transition-shadow"
              >
                <div className="bg-rosadoFuerte p-3 rounded-full">
                  <img src={item.icon} className="w-10 h-10" alt={item.title} />
                </div>
                <div className="text-center">
                  <p className="font-bold text-lg">{item.title}</p>
                  <p className="text-gray-600">{item.subtitle}</p>
                </div>
              </div>
            ))}

            {/* Menú lateral derecho */}
            <div className="md:hidden lg:flex flex-col gap-4">
              {["Mis metas", "Notas", "Contactos", "Agenda"].map(
                (item, index) => (
                  <div
                    key={index}
                    className="bg-gray-100 rounded-full px-4 py-2 w-fit hover:bg-gray-200 transition-colors"
                  >
                    <p className="text-gray-600 cursor-pointer">{item}</p>
                  </div>
                )
              )}
            </div>
          </div>

          {/* Sección Mi Negocio */}
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4">Mi negocio</h2>
            <div className="bg-fondoOscuro rounded-xl p-6 text-white">
              <div className="flex justify-between items-end h-32">
                <p className="text-lg">Total de ventas</p>
                <p className="text-3xl font-bold">$00.00</p>
              </div>
            </div>
          </div>

          {/* Métricas financieras */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { title: "Ingresos", icon: iconoIngresos, value: "$00.00" },
              { title: "Egresos", icon: iconoEgresos, value: "$00.00" },
              { title: "Inventario", icon: iconoInventario, value: "000" },
              {
                title: "Cuentas",
                icon: iconoDinero,
                subItems: ["por pagar", "por cobrar"],
              },
            ].map((item, index) => (
              <div
                key={index}
                className="bg-rosadoFuerte text-white rounded-xl p-4"
              >
                {item.subItems ? (
                  <div className="flex flex-col gap-4">
                    {item.subItems.map((subItem, subIndex) => (
                      <div
                        key={subIndex}
                        className="bg-rosadoFuerte rounded-lg p-3"
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <img
                            src={item.icon}
                            className="w-6 h-6"
                            alt={subItem}
                          />
                          <p className="text-gray-600 text-sm">
                            Cuentas {subItem}
                          </p>
                        </div>
                        <p className="font-bold text-gray-800">000</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-2 mb-4">
                      <img
                        src={item.icon}
                        className="w-6 h-6"
                        alt={item.title}
                      />
                      <p className="text-sm">{item.title}</p>
                    </div>
                    <p className="text-2xl font-bold">{item.value}</p>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
