import React from 'react'; // <--- Importa React de esta manera
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';

// En tu archivo principal (index.js o main.jsx)
import { AuthProvider } from './components/context/AuthContext';

// 1. Obtén el elemento DOM donde se montará tu aplicación
const container = document.getElementById('root');

// 2. Crea la raíz de tu aplicación React
const root = createRoot(container); // <--- Asegúrate de pasar el contenedor aquí

root.render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);
