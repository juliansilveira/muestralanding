import React from "react";
import user from "../../assets/imgs/usuario.png";
import { Link } from "react-router-dom";

export default function Usuario() {
  return (
    <div className="sm:pr-3 md:pr-4 lg:pr-5 pt-1 sm:pt-2 font-poppins">
      <Link
        to="/perfil"
        className="inline-block hover:opacity-90 transition-opacity"
      >
        <img
          className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-pink-500 p-1 sm:p-1.5 md:p-2 rounded-full cursor-pointer shadow-sm hover:shadow-md transition-all duration-200"
          src={user}
          alt="Perfil de usuario"
        />
      </Link>
    </div>
  );
}
