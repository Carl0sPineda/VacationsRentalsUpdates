import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { useState, useEffect } from "react";
import { FaHandshake, FaHouseUser } from "react-icons/fa";
import ListingItem from "../components/ListingItem";
import { db } from "../firebase";
import ejmcasa from "../assets/ejmcasa.jpg";
import Swal from "sweetalert2";
import Spinner from "../components/Spinner";
import Footer from "../components/Footer";

export default function Home() {
  const [loading, setLoading] = useState(true);

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
        setLoading(false);
        // console.log(listings);
      } catch (error) {
        // console.log(error);
      }
    }
    fetchListings();
  }, []);

  const handleClick = () => {
    Swal.fire({
      title: "<h2 class='text-slate-900 text-2xl'>Misión</h2>",
      html: "<p class='text-left hero-text'>Somos una empresa que se dedica a satisfacer la estadía de costarricenses y extranjeros en los mejores destinos turísticos de Costa Rica principalmente en la provincia de Guanacaste. Buscamos ser una empresa consolidada, enfocada a satisfacer las necesidades de los vacacionistas proveyendo el mejor servicio,calidad a nuestros clientes. </p>",
      confirmButtonText: "Cerrar",
      didOpen: () => {
        const confirmButton = Swal.getConfirmButton();
        confirmButton.style.backgroundColor = "#078169";
        confirmButton.style.color = "white";
      },
    });
  };

  if (loading) {
    return <Spinner />;
  }

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

                <button className="btn" onClick={handleClick}>
                  Mas información
                </button>
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
                </li>

                <li className="features-card">
                  <div className="card-icon">
                    <ion-icon name="water-outline"></ion-icon>
                  </div>

                  <h3 className="card-title">Piscina</h3>
                </li>

                <li className="features-card">
                  <div className="card-icon">
                    <ion-icon name="snow-outline"></ion-icon>
                  </div>

                  <h3 className="card-title">Aire Acondicionado</h3>
                </li>

                <li className="features-card">
                  <div className="card-icon">
                    <ion-icon name="wifi-outline"></ion-icon>
                  </div>

                  <h3 className="card-title">Wifi</h3>
                </li>

                <li className="features-card">
                  <div className="card-icon">
                    <ion-icon name="library-outline"></ion-icon>
                  </div>

                  <h3 className="card-title">Biblioteca</h3>
                </li>

                <li className="features-card">
                  <div className="card-icon">
                    <ion-icon name="bed-outline"></ion-icon>
                  </div>

                  <h3 className="card-title">Camas amplias</h3>
                </li>
                <li className="features-card">
                  <div className="card-icon">
                    <ion-icon name="home-outline"></ion-icon>
                  </div>

                  <h3 className="card-title">Amplio espacio</h3>
                </li>

                <li className="features-card">
                  <div className="card-icon">
                    <ion-icon name="football-outline"></ion-icon>
                  </div>

                  <h3 className="card-title">Espacios de juego</h3>
                </li>
              </ul>
            </div>
          </section>
          <Footer />
        </main>
      )}
    </>
  );
}
