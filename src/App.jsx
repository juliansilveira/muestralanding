import "./App.css";
import Login from "./pages/Login";
import Landing from "./pages/Landing";
import Home from "./pages/Home";
import ContenedorGestorDeDinero from "../src/components/GestorDeDinero/ContenedorGestorDeDinero";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import ContenedorGestorTiempo from "./components/GestionDeTiempo/ContenedorGestorTiempo";
import ContenedorCalculadora from "./components/calculadora/ContenedorCalculadora";
import ContenedorCotizadorDeServicios from "./components/CotizadorDeServicios/ContenedorCotizadorDeServicios";
import Perfil from "./pages/Perfil";
import Registro from "./pages/Registro";
import GoogleCallback from "./pages/GoogleCallback";
import RecuperarClave from "./pages/RecuperarClave";
import { ValorHoraProvider } from "../src/components/context/ValorHoraContext";
import DetalleCotizacion from "./components/CotizadorDeServicios/DetalleCotizacion.jsx";
import ListaCotizaciones from "./components/CotizadorDeServicios/ListaCotizaciones.jsx";
import { AuthProvider, useAuth } from "./components/context/AuthContext";
import FormularioContableUnificado from "./components/calculadora/FormularioContableUnificado.jsx";
import Suscripcion from "./pages/Suscripcion.jsx";

// Componente para proteger rutas - CON CORRECCIONES PARA MANTENER SESIÓN
const ProtectedRoute = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

function App() {
  return (
    <ValorHoraProvider>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Rutas públicas */}
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/registro" element={<Registro />} />
            <Route path="/auth/google/callback" element={<GoogleCallback />} />
            <Route path="/recuperar-clave" element={<RecuperarClave />} />
            <Route
              path="/nuevacoti"
              element={<FormularioContableUnificado />}
            />

            {/* Rutas protegidas usando ProtectedRoute como layout */}
            <Route element={<ProtectedRoute />}>
              <Route path="/home" element={<Home />} />
              <Route path="/control" element={<ContenedorGestorDeDinero />} />
              <Route path="/actividades" element={<ContenedorGestorTiempo />} />
              <Route path="/perfil" element={<Perfil />} />
              <Route path="/suscripcion" element={<Suscripcion />} />

              {/* Ruta padre para la calculadora - Simplificada para coincidir con el estado interno */}
              <Route
                path="/valor-hora"
                element={<FormularioContableUnificado />}
              />

              <Route
                path="/historial-servicios"
                element={<ContenedorCotizadorDeServicios />}
              />
              <Route path="/cotizaciones/:id" element={<DetalleCotizacion />} />
              <Route
                path="/historial-cotizaciones"
                element={<ListaCotizaciones />}
              />
            </Route>

            {/* Ruta de fallback - debe estar al final */}
            <Route path="*" element={<h1>404 - Página no encontrada</h1>} />
          </Routes>
        </Router>
      </AuthProvider>
    </ValorHoraProvider>
  );
}

export default App;
