import Footer from "../components/Footer";
import banner from "../assets/1.png";
import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <>
      <div className="min-w-screen min-h-screen bg-blue-100 flex items-center p-5 lg:p-20 overflow-hidden relative">
        <div className="flex-1 min-h-full min-w-full rounded-3xl bg-white shadow-xl p-10 lg:p-20 text-gray-800 relative md:flex items-center text-center md:text-left">
          <div className="w-full md:w-1/2">
            <div className="mb-10 lg:mb-20"></div>
            <div className="mb-10 md:mb-20 text-gray-600 font-light">
              <h1 className="font-black uppercase text-3xl lg:text-5xl text-yellow-500 mb-10">
                Error 404!
              </h1>
              <p>
                La página que estás buscando no está disponible. <br />
                Intente de nuevo o use el botón Regresar a continuación.
              </p>
            </div>
            <div
              className="mb-20 md:mb-0 text-center sm:text-left"
              onClick={() => navigate("/")}
            >
              <button className="text-lg bg-black font-light outline-none focus:outline-none transform transition-all hover:scale-110 text-white px-10 py-3 rounded hover:text-yellow-600 inline-block sm:inline mx-auto">
                Regresar
              </button>
            </div>
          </div>
          <div className="hidden sm:block w-full md:w-1/2 ">
            <img src={banner} alt="logo" />
          </div>
        </div>
        <div className="w-64 md:w-96 h-96 md:h-full bg-blue-200 bg-opacity-30 absolute -top-64 md:-top-96 right-20 md:right-32 rounded-full pointer-events-none -rotate-45 transform"></div>
        <div className="w-96 h-full bg-yellow-200 bg-opacity-20 absolute -bottom-96 right-64 rounded-full pointer-events-none -rotate-45 transform"></div>
      </div>
      <Footer />
    </>
  );
}
