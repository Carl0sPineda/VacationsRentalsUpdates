import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { GiShakingHands } from "react-icons/gi";
import { FaHandshake, FaHouseUser } from "react-icons/fa";
import { BsFillHouseAddFill, BsHouseCheckFill } from "react-icons/bs";
import ListingItem from "../components/ListingItem";
import Slider from "../components/Slider";
import { db } from "../firebase";
import banner from "../assets/banner.png";
import ejmcasa from "../assets/ejmcasa.jpg";
import servicio1 from "../assets/servicio-1.png";
import servicio2 from "../assets/servicio-2.png";

export default function Home() {
  //Offers
  const [offerListings, setOfferListings] = useState(null);
  const date = new Date(); // crea un objeto Date con la fecha actual
  const year = date.getFullYear(); // obtiene el año actual del objeto Date
  useEffect(() => {
    async function fetchListings() {
      try {
        //get reference
        const listingRef = collection(db, "listings");
        //create the query
        const q = query(
          listingRef,
          where("offer", "==", true),
          orderBy("timestamp", "desc"),
          limit(4)
        );
        //execute the query
        const querySnap = await getDocs(q);
        const listings = [];
        querySnap.forEach((doc) => {
          return listings.push({
            id: doc.id,
            data: doc.data(),
          });
        });
        setOfferListings(listings);
        // console.log(listings);
      } catch (error) {
        // console.log(error);
      }
    }
    fetchListings();
  }, []);

  //places for rent
  const [rentListings, setRentListings] = useState(null);
  useEffect(() => {
    async function fetchListings() {
      try {
        //get reference
        const listingRef = collection(db, "listings");
        //create the query
        const q = query(
          listingRef,
          where("type", "==", "rent"),
          orderBy("timestamp", "desc"),
          limit(4)
        );
        //execute the query
        const querySnap = await getDocs(q);
        const listings = [];
        querySnap.forEach((doc) => {
          return listings.push({
            id: doc.id,
            data: doc.data(),
          });
        });
        setRentListings(listings);
        // console.log(listings);
      } catch (error) {
        // console.log(error);
      }
    }
    fetchListings();
  }, []);

  //places for rent
  const [saleListings, setSaleListings] = useState(null);
  useEffect(() => {
    async function fetchListings() {
      try {
        //get reference
        const listingRef = collection(db, "listings");
        //create the query
        const q = query(
          listingRef,
          where("type", "==", "sale"),
          orderBy("timestamp", "desc"),
          limit(4)
        );
        //execute the query
        const querySnap = await getDocs(q);
        const listings = [];
        querySnap.forEach((doc) => {
          return listings.push({
            id: doc.id,
            data: doc.data(),
          });
        });
        setSaleListings(listings);
        // console.log(listings);
      } catch (error) {
        // console.log(error);
      }
    }
    fetchListings();
  }, []);

  return (
    <>
      {rentListings && rentListings.length > 0 && (
        <main>
          <section className="hero" id="home">
            <div className="container">
              <div className="hero-content">
                <p className="hero-subtitle">
                  <ion-icon name="home"></ion-icon>

                  <span>Alquiler De Propiedades</span>
                </p>

                <h2 className="h1 hero-title">
                  Encuentre Esa Propiedad Con Nosotros
                </h2>

                <p className="hero-text">
                  Ofrecemos un amplio catalogo de propiedades ubicadas por todo
                  el territorio de Guanacaste.
                </p>

                <button className="btn">Mas información</button>
              </div>

              <figure className="hero-banner">
                <img src={ejmcasa} alt="Modern house model" className="w-100" />
              </figure>
            </div>
          </section>
          <section className="property" id="property">
            <div className="container">
              <p className="section-subtitle">Propiedades</p>
              <h2 className="h2 section-title">Agregadas reciente</h2>

              <ul className="property-list has-scrollbar">
                {rentListings.map((listing) => (
                  <ListingItem
                    key={listing.id}
                    listing={listing.data}
                    id={listing.id}
                  />
                ))}
              </ul>
            </div>
          </section>

          <section className="service" id="service">
            <div className="container">
              <p className="section-subtitle">Nuestros Servicios</p>

              <h2 className="h2 section-title">Enfoque Principal</h2>

              <ul className="service-list">
                <li>
                  <div className="service-card">
                    <div className="card-icon">
                      <FaHandshake className="w-full h-[170px] text-[#078169]" />
                    </div>

                    <h3 className="h3 card-title">
                      <span>Renta de propiedades</span>
                    </h3>

                    <p className="card-text">
                      Nuestro catálogo tiene diversas propiedades para renta,
                      encuentra la ideal para ti.
                    </p>
                  </div>
                </li>
                <li>
                  <div className="service-card">
                    <div className="card-icon">
                      <FaHouseUser className="w-full h-[170px] text-[#078169]" />
                    </div>

                    <h3 className="h3 card-title">Atención rápida</h3>

                    <p className="card-text">
                      Una vez se pone en contacto con nosotros los trámites son
                      ágiles y confiables.
                    </p>
                  </div>
                </li>
              </ul>
            </div>
          </section>
          <section className="features">
            <div className="container">
              <p className="section-subtitle">Ofrecemos</p>

              <h2 className="h2 section-title">Servicios De Las Propiedades</h2>

              <ul className="features-list">
                <li className="features-card">
                  <div className="card-icon">
                    <ion-icon name="car-sport-outline"></ion-icon>
                  </div>

                  <h3 className="card-title">Parqueo</h3>

                  <div className="card-btn">
                    <ion-icon name="arrow-forward-outline"></ion-icon>
                  </div>
                </li>

                <li className="features-card">
                  <div className="card-icon">
                    <ion-icon name="water-outline"></ion-icon>
                  </div>

                  <h3 className="card-title">Piscina</h3>

                  <div className="card-btn">
                    <ion-icon name="arrow-forward-outline"></ion-icon>
                  </div>
                </li>

                <li className="features-card">
                  <div className="card-icon">
                    <ion-icon name="snow-outline"></ion-icon>
                  </div>

                  <h3 className="card-title">Aire Acondicionado</h3>

                  <div className="card-btn">
                    <ion-icon name="arrow-forward-outline"></ion-icon>
                  </div>
                </li>

                <li className="features-card">
                  <div className="card-icon">
                    <ion-icon name="wifi-outline"></ion-icon>
                  </div>

                  <h3 className="card-title">Wifi</h3>

                  <div className="card-btn">
                    <ion-icon name="arrow-forward-outline"></ion-icon>
                  </div>
                </li>

                <li className="features-card">
                  <div className="card-icon">
                    <ion-icon name="library-outline"></ion-icon>
                  </div>

                  <h3 className="card-title">Biblioteca</h3>

                  <div className="card-btn">
                    <ion-icon name="arrow-forward-outline"></ion-icon>
                  </div>
                </li>

                <li className="features-card">
                  <div className="card-icon">
                    <ion-icon name="bed-outline"></ion-icon>
                  </div>

                  <h3 className="card-title">Camas amplias</h3>

                  <div className="card-btn">
                    <ion-icon name="arrow-forward-outline"></ion-icon>
                  </div>

                  {/* </a> */}
                </li>
                <li className="features-card">
                  <div className="card-icon">
                    <ion-icon name="home-outline"></ion-icon>
                  </div>

                  <h3 className="card-title">Amplio espacio</h3>

                  <div className="card-btn">
                    <ion-icon name="arrow-forward-outline"></ion-icon>
                  </div>
                </li>

                <li className="features-card">
                  <div className="card-icon">
                    <ion-icon name="football-outline"></ion-icon>
                  </div>

                  <h3 className="card-title">Espacios de juego</h3>

                  <div className="card-btn">
                    <ion-icon name="arrow-forward-outline"></ion-icon>
                  </div>
                </li>
              </ul>
            </div>
          </section>
          <footer className="footer">
            <div className="footer-bottom">
              <div className="container">
                <p className="copyright ">
                  &copy; VACATIONS RENTALS COSTA RICA {year}. TODOS LOS DERECHOS
                  RESERVADOS
                </p>
              </div>
            </div>
          </footer>
        </main>
      )}
    </>
  );
}
