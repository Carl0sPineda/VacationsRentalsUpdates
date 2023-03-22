import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useEffect, useState } from 'react'
import { useLocation,useNavigate } from "react-router-dom";
import {BsFillHouseFill} from 'react-icons/bs'

export default function Header() {
    const [pageState, setPageState] = useState("Login")
    const location = useLocation()
    const navigate = useNavigate()
    const auth = getAuth()
    useEffect(()=>{
        onAuthStateChanged(auth, (user)=>{
            if(user){
                setPageState("Perfil")
            }else{
                setPageState("Login")
            }
        })
    },[auth])
    function pathMathRoute(route){
        if(route === location.pathname){
            return true
        }
    }
  return (
    <div className="bg-white border-b shadow-xl sticky top-0 z-40 ">
               <div className="header-top">
      <div className="container">

        <ul className="header-top-list">

          <li>
            <a href="mailto:vacationsreantals@gmail.com" className="header-top-link">
              <ion-icon name="mail-outline"></ion-icon>

              <span>vacationsreantals@gmail.com</span>
            </a>
          </li>

          <li>
            <a href="#" className="header-top-link">
              <ion-icon name="location-outline"></ion-icon>

              <address>Liberia, Guanacaste</address>
            </a>
          </li>

        </ul>

        <div className="wrapper">
          <ul className="header-top-social-list">

            <li>
              <a href="#" className="header-top-social-link">
                <ion-icon name="logo-facebook"></ion-icon>
              </a>
            </li>


            <li>
              <a href="#" className="header-top-social-link">
                <ion-icon name="logo-instagram"></ion-icon>
              </a>
            </li>
          </ul>

          <button className="header-top-btn">Contacto</button>
        </div>

      </div>
    </div>
    <header className="flex justify-between items-center px-0 max-w-6xl mx-auto">
        < div className='flex items-center text-left hover:scale-105'
         onClick={()=>navigate("/")} >
         {/* <img src="https://static.rdc.moveaws.com/images/logos/rdc-logo-default.svg" alt="logo" 
            className="h-5 cursor-pointer"
            onClick={()=>navigate("/")}
            /> */}
            <BsFillHouseFill className='ml-1 text-red-500  w-6 h-5'/>
             <h2 className='font-semibold text-lg cursor-pointer'>
             VacationsRentalsCR
          </h2>
        </div>
        <div>
            <ul className="flex space-x-10">
                <li className={`cursor-pointer py-3 text-sm font-semibold
                 text-gray-400 border-b-[3px] border-b-transparent hover:scale-105
                 ${pathMathRoute("/") && "text-black border-b-red-500"}`}
                 onClick={()=>navigate("/")}>Inicio</li>
                <li className={`cursor-pointer py-3 text-sm font-semibold
                 text-gray-400 border-b-[3px] border-b-transparent hover:scale-105
                 ${pathMathRoute("/properties") && "text-black border-b-red-500"}`}
                 onClick={()=>navigate("/properties")}>Propiedades</li>
                <li className={`cursor-pointer py-3 text-sm font-semibold
                 text-gray-400 border-b-[3px] border-b-transparent hover:scale-105
                 ${(pathMathRoute("/sign-in") || pathMathRoute("/profile")) && "text-black border-b-red-500"}`}
                 onClick={()=>navigate("/profile")}> {pageState}</li>
            </ul>
       </div>
    </header>
    </div>
  )
}
