import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AiFillPhone } from "react-icons/ai";
import logo from "../assets/1.png";

export default function Header() {
  const [pageState, setPageState] = useState("Login");
  const location = useLocation();
  const navigate = useNavigate();
  const auth = getAuth();
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setPageState("Perfil");
      } else {
        setPageState("Login");
      }
    });
  }, [auth]);
  function pathMathRoute(route) {
    if (route === location.pathname) {
      return true;
    }
  }
  return (
    <div className="bg-white border-b shadow-xl sticky top-0 z-40 ">
      <div className="header-top">
        <div className="container">
          <ul className="header-top-list">
            <li>
              <a
                href="mailto:vacationsreantals@gmail.com"
                className="header-top-link"
                target="_blank"
              >
                <ion-icon name="mail-outline"></ion-icon>
                <span>reservations@vacationsrentalscostarica.com</span>
              </a>
            </li>

            <li>
              <span className="header-top-link">
                <ion-icon name="location-outline"></ion-icon>
                <address>Liberia, Guanacaste</address>
              </span>
            </li>
          </ul>

          <div className="wrapper">
            <ul className="header-top-social-list">
              <li>
                <a
                  href="https://www.facebook.com/vacationrentalscr/?paipv=0&eav=AfaLzRmivYtEYnd9-KvNHdJF-zV_p9KWy_lYGrrgSFnmsANzxgomnLVY-QMf-dtfLjo&_rdr"
                  className="header-top-social-link"
                  target="_blank"
                >
                  <ion-icon name="logo-facebook"></ion-icon>
                </a>
              </li>

              <li>
                <a
                  href="https://www.instagram.com/vacationscostarica/?hl=es"
                  className="header-top-social-link"
                  target="_blank"
                >
                  <ion-icon name="logo-instagram"></ion-icon>
                </a>
              </li>
            </ul>

            <span className="header-top-btn">Contacto 7139 4438</span>
          </div>
        </div>
      </div>
      <header className="flex justify-between items-center px-0 max-w-6xl mx-auto">
        <div
          className="flex items-center text-left hover:scale-105"
          onClick={() => navigate("/")}
        >
          <img
            src={logo}
            alt="empresa"
            className="filter filter-red w-400 h-20 cursor-pointer"
          />
          <div className="coc">
            <h2 className="typewriter te hidden sm:block font-semibold text-xl cursor-pointer">
              Vacation Rentals
            </h2>
          </div>
        </div>
        <div>
          <ul className="flex space-x-10 mr-4">
            <li
              className={`cursor-pointer py-3 text-base font-semibold
                 text-gray-400 border-b-[3px] border-b-transparent hover:scale-105
                 ${pathMathRoute("/") && "text-black border-b-[#078169]"}`}
              onClick={() => navigate("/")}
            >
              Inicio
            </li>
            <li
              className={`cursor-pointer py-3 text-base font-semibold
                 text-gray-400 border-b-[3px]  border-b-transparent hover:scale-105
                 ${
                   pathMathRoute("/properties") &&
                   "text-black border-b-[#078169]"
                 }`}
              onClick={() => navigate("/properties")}
            >
              Propiedades
            </li>
            <li
              className={`cursor-pointer py-3 text-base font-semibold
                 text-gray-400 border-b-[3px] border-b-transparent hover:scale-105
                 ${
                   (pathMathRoute("/sign-in") || pathMathRoute("/profile")) &&
                   "text-black border-b-[#078169]"
                 }`}
              onClick={() => navigate("/profile")}
            >
              {" "}
              {pageState}
            </li>
          </ul>
        </div>
      </header>
    </div>
  );
}
