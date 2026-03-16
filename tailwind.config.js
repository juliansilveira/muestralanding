/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "bg-login": "#0c2343",
        "cl-boton-login": "#ed8add",
        "rosa-claro": "#EDA1DD",
        fondoHome: "#fbedfa",
        fondoRosaClaro: "#fbedfa",
        rosadoFuerte: "#eb89db",
        fondoOscuro: "#0c2343",
        verdePastel: "#bfe3c0",
        verdeBoton: "#2a5c0b",
        fondoPao: "#2e90cc",
        colorbotonPao: "#e60e90",
      },
      fontFamily: {
        poppins: ["Poppins"],
      },
    },
  },
  plugins: [],
};
