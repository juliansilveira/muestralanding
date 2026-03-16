// src/components/HeaderBar/HeaderBarExtended.jsx
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import lupa from "../../assets/imgs/lupa.png";
import user from "../../assets/imgs/usuario.png";

export default function ContenedorUser({ 
  searchPlaceholder = "Buscar en GestiónApp",
  onSearchChange,
  showSearch = true,
  className = "",
  onMenuToggle // Para futura integración con menú hamburguesa
}) {
  const [searchValue, setSearchValue] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation();

  // Detectar cambios en el tamaño de pantalla
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchValue(value);
    onSearchChange?.(value);
  };

  const handleSearchFocus = () => {
    setIsSearchFocused(true);
    if (isMobile) {
      document.body.style.overflow = 'hidden';
    }
  };

  const handleSearchBlur = () => {
    setIsSearchFocused(false);
    document.body.style.overflow = 'unset';
  };

  const handleClearSearch = () => {
    setSearchValue('');
    onSearchChange?.('');
  };

  return (
    <header className={`w-full bg-fondoRosaClaro shadow-sm border-b border-gray-200 sticky top-0 z-30 ${className}`}>
      <div className="container mx-auto px-3 sm:px-4 lg:px-6">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Menú Hamburguesa (opcional para futuro) */}
          {isMobile && onMenuToggle && (
            <button 
              onClick={onMenuToggle}
              className="flex-shrink-0 mr-3 p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Abrir menú"
            >
              <div className="w-6 h-6 flex flex-col justify-between">
                <span className="w-full h-0.5 bg-gray-600 rounded"></span>
                <span className="w-full h-0.5 bg-gray-600 rounded"></span>
                <span className="w-full h-0.5 bg-gray-600 rounded"></span>
              </div>
            </button>
          )}

          {/* 🔍 BUSCADOR RESPONSIVE */}
          {showSearch && (
            <div className={`flex items-center transition-all duration-300 ${
              isMobile 
                ? `flex-grow mr-3 ${onMenuToggle ? 'max-w-[calc(100%-120px)]' : 'max-w-[calc(100%-60px)]'}` 
                : 'flex-grow max-w-2xl mr-6'
            }`}>
              <div className={`flex items-center w-full ${
                isSearchFocused && isMobile 
                  ? 'bg-white shadow-lg rounded-2xl px-3 border border-gray-200' 
                  : 'bg-gray-50 rounded-2xl px-3 hover:bg-gray-100'
              } transition-all duration-200`}>
                
                {/* Ícono de lupa */}
                <div className="flex-shrink-0">
                  <img 
                    src={lupa} 
                    className={`${
                      isMobile ? 'w-6 h-6' : 'w-7 h-7'
                    } transition-all duration-200 ${
                      isSearchFocused ? 'opacity-100' : 'opacity-60'
                    }`} 
                    alt="Buscar"
                  />
                </div>
                
                {/* Input de búsqueda */}
                <div className="flex-grow ml-2 sm:ml-3 relative">
                  <input
                    value={searchValue}
                    onChange={handleSearchChange}
                    onFocus={handleSearchFocus}
                    onBlur={handleSearchBlur}
                    placeholder={isMobile && !isSearchFocused ? "Buscar..." : searchPlaceholder}
                    className={`w-full bg-transparent focus:outline-none placeholder-gray-500 text-gray-800 font-medium ${
                      isMobile 
                        ? 'h-10 text-sm py-2' 
                        : 'h-11 text-base py-3'
                    } transition-all duration-200`}
                  />
                  
                  {/* Botón clear en móvil cuando hay texto */}
                  {isMobile && searchValue && (
                    <button
                      onClick={handleClearSearch}
                      className="absolute right-0 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 transition-colors"
                      aria-label="Limpiar búsqueda"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* 👤 PERFIL DE USUARIO */}
          <div className="flex-shrink-0 flex items-center">
            <Link
              to="/perfil"
              className="group inline-block transition-all duration-200 relative"
              aria-label="Ir al perfil de usuario"
            >
              <div className={`
                relative rounded-full
                ${isMobile 
                  ? 'bg-pink-500 shadow-lg p-1' 
                  : 'bg-pink-500 shadow-sm hover:shadow-md p-1 sm:p-1.5'
                }
                transition-all duration-200
                group-hover:scale-105
              `}>
                <img
                  className={`
                    rounded-full object-cover
                    ${isMobile ? 'w-8 h-8' : 'w-9 h-9 sm:w-10 sm:h-10'}
                    transition-all duration-200
                  `}
                  src={user}
                  alt="Perfil de usuario"
                  onError={(e) => {
                    e.target.style.backgroundColor = '#f0f0f0';
                    e.target.style.padding = '4px';
                  }}
                />
                
                {/* Indicador de estado en línea */}
                <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white shadow-sm"></div>
              </div>
              
              {/* Tooltip en desktop */}
              {!isMobile && (
                <div className="absolute top-full right-0 mt-2 w-32 py-1 bg-gray-800 text-white text-xs text-center rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                  Mi Perfil
                </div>
              )}
            </Link>
          </div>
        </div>
      </div>

      {/* Overlay en móvil cuando el buscador está activo */}
      {isSearchFocused && isMobile && (
        <>
          <div 
            className="fixed inset-0 bg-black bg-opacity-40 z-40 md:hidden"
            onClick={handleSearchBlur}
          ></div>
          
          {/* Panel de búsqueda expandido en móvil */}
          <div className="fixed top-16 left-0 right-0 bg-white shadow-xl z-50 md:hidden transform transition-transform duration-300">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center bg-gray-50 rounded-xl px-3 py-2">
                <img src={lupa} className="w-6 h-6 opacity-70 mr-2" alt="Buscar" />
                <input
                  value={searchValue}
                  onChange={handleSearchChange}
                  placeholder={searchPlaceholder}
                  className="flex-grow bg-transparent focus:outline-none text-lg"
                  autoFocus
                />
                {searchValue && (
                  <button
                    onClick={handleClearSearch}
                    className="p-1 text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
            
            {/* Aquí puedes agregar sugerencias de búsqueda recientes */}
            <div className="p-4">
              <p className="text-sm text-gray-500 text-center">
                Escribe para buscar en la aplicación
              </p>
            </div>
          </div>
        </>
      )}
    </header>
  );
}