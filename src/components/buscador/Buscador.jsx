import React from "react";
import lupa from "../../assets/imgs/lupa.png";

export default function Buscador() {
  return (
    <div className="flex align-middle justify-center mt-3 ml-10">
      <div className="pt-0.5">
        <img src={lupa} className="w-9 h-9" />
      </div>
      <div>
        <input
          placeholder="Buscar en GestiónApp"
          className="h-10 w-60 pl-3 rounded-3xl"
        ></input>
      </div>
    </div>
  );
}
