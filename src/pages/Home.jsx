import { collection, getDocs, limit, orderBy, query, where } from "firebase/firestore";
import { useState,useEffect } from "react";
import { Link } from "react-router-dom";
import ListingItem from "../components/ListingItem";
import Slider from "../components/Slider";
import { db } from "../firebase";
import banner from "../assets/banner.png"
import servicio1 from "../assets/servicio-1.png"
import servicio2 from "../assets/servicio-2.png"

export default function Home() {
    //Offers
    const [offerListings, setOfferListings] = useState(null)
    useEffect(()=>{
        async function fetchListings(){
            try {
                //get reference
                const listingRef = collection(db,'listings')
                //create the query
                const q = query(listingRef, where('offer','==',true), orderBy('timestamp','desc'),limit(4))
                //execute the query
                const querySnap = await getDocs(q)
                const listings = []
                querySnap.forEach((doc)=>{
                    return listings.push({
                        id: doc.id,
                        data: doc.data()
                    })
                })
                setOfferListings(listings)
                console.log(listings)
            } catch (error) {
                console.log(error);
            }
        }
        fetchListings()
    },[])

     //places for rent
     const [rentListings, setRentListings] = useState(null)
     useEffect(()=>{
         async function fetchListings(){
             try {
                 //get reference
                 const listingRef = collection(db,'listings')
                 //create the query
                 const q = query(listingRef, where('type','==','rent'), orderBy('timestamp','desc'),limit(4))
                 //execute the query
                 const querySnap = await getDocs(q)
                 const listings = []
                 querySnap.forEach((doc)=>{
                     return listings.push({
                         id: doc.id,
                         data: doc.data()
                     })
                 })
                 setRentListings(listings)
                 console.log(listings)
             } catch (error) {
                 console.log(error);
             }
         }
         fetchListings()
     },[])

      //places for rent
      const [saleListings, setSaleListings] = useState(null)
      useEffect(()=>{
          async function fetchListings(){
              try {
                  //get reference
                  const listingRef = collection(db,'listings')
                  //create the query
                  const q = query(listingRef, where('type','==','sale'), orderBy('timestamp','desc'),limit(4))
                  //execute the query
                  const querySnap = await getDocs(q)
                  const listings = []
                  querySnap.forEach((doc)=>{
                      return listings.push({
                          id: doc.id,
                          data: doc.data()
                      })
                  })
                  setSaleListings(listings)
                  console.log(listings)
              } catch (error) {
                  console.log(error);
              }
          }
          fetchListings()
      },[])

      return (
        <>
    {/* <div> */}
      {/* <Slider />
      <div className="max-w-6xl mx-auto pt-4 space-y-6">
        {offerListings && offerListings.length > 0 && (
          <div className="m-2 mb-6">
            <h2 className="px-3 text-2xl mt-6 font-semibold">Recent offers</h2>
            <Link to="/offers">
              <p className="px-3 text-sm text-blue-600 hover:text-blue-800 transition duration-150 ease-in-out">
                Show more offers
              </p>
            </Link>
            <ul className="sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 ">
              {offerListings.map((listing) => (
                <ListingItem
                  key={listing.id}
                  listing={listing.data}
                  id={listing.id}
                />
              ))}
            </ul>
          </div>
        )} */}
        {rentListings && rentListings.length > 0 && (       
  <main>

<section className="hero" id="home">
        <div className="container">

          <div className="hero-content">

            <p className="hero-subtitle">
              <ion-icon name="home"></ion-icon>

              <span>Alquiler De Propiedades</span>
            </p>

            <h2 className="h1 hero-title">Encuentre Esa Propiedad Con Nosotros</h2>

            <p className="hero-text">
              Ofrecemos un amplio catalogo de propiedades ubicadas por todo el territorio de Costa Rica.
            </p>

            <button className="btn">Mas información</button>

          </div>

          <figure className="hero-banner">
            <img src={banner} alt="Modern house model" className="w-100"/>
          </figure>

        </div>
      </section>
    <section className="property" id="property">
      <div className="container">
        <p className="section-subtitle">Propiedades</p>
        <h2 className="h2 section-title">Agregadas reciente</h2>
        {/* <Link to="/category/rent">
              <p className="px-3 text-sm text-blue-600 hover:text-blue-800 transition duration-150 ease-in-out mb-4">
                Ver mas
              </p>
            </Link> */}
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
                   <img src={servicio1} alt="Service icon"/> 
                </div>

                <h3 className="h3 card-title">
                  <span>Renta de propiedades</span>
                </h3>

                <p className="card-text">
                  Nuestro catalogo tiene diversas propiedades a la venta encuentra la ideal para ti.
                </p>

                {/* <a href="#" className="card-link"> */}
                  <span>Encuentre una propiedad</span>

                  <ion-icon name="arrow-forward-outline"></ion-icon>
                {/* </a> */}

              </div>
            </li>
            <li>
              <div className="service-card">

                <div className="card-icon">
                  <img src={servicio2} alt="Service icon"/>
                </div>

                <h3 className="h3 card-title">
                  <a href="#">Atención rapida</a>
                </h3>

                <p className="card-text">
                  Una vez se pone en contacto con nosotros los tramites son agiles y confiables.
                </p>

                {/* <a href="#" className="card-link"> */}
                  <span>Encuentre una propiedad</span>

                  <ion-icon name="arrow-forward-outline"></ion-icon>
                {/* </a> */}

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
              {/* <a href="#" className="features-card"> */}

                <div className="card-icon">
                  <ion-icon name="car-sport-outline"></ion-icon>
                </div>

                <h3 className="card-title">Parqueo</h3>

                <div className="card-btn">
                  <ion-icon name="arrow-forward-outline"></ion-icon>
                </div>

              {/* </a> */}
            </li>

            <li className="features-card">
              {/* <a href="#" > */}

                <div className="card-icon">
                  <ion-icon name="water-outline"></ion-icon>
                </div>

                <h3 className="card-title">Piscina</h3>

                <div className="card-btn">
                  <ion-icon name="arrow-forward-outline"></ion-icon>
                </div>

              {/* </a> */}
            </li>

            <li className="features-card">
              {/* <a href="#" className="features-card"> */}

                <div className="card-icon">
                  <ion-icon name="snow-outline"></ion-icon>
                </div>

                <h3 className="card-title">Aire Acondicionado</h3>

                <div className="card-btn">
                  <ion-icon name="arrow-forward-outline"></ion-icon>
                </div>

              {/* </a> */}
            </li>

            <li className="features-card"> 
              {/* <a href="#" className="features-card"> */}

                <div className="card-icon">
                  <ion-icon name="wifi-outline"></ion-icon>
                </div>

                <h3 className="card-title">Wifi</h3>

                <div className="card-btn">
                  <ion-icon name="arrow-forward-outline"></ion-icon>
                </div>

              {/* </a> */}
            </li>

            <li className="features-card">
              {/* <a href="#" className="features-card"> */}

                <div className="card-icon">
                  <ion-icon name="library-outline"></ion-icon>
                </div>

                <h3 className="card-title">Biblioteca</h3>

                <div className="card-btn">
                  <ion-icon name="arrow-forward-outline"></ion-icon>
                </div>

              {/* </a> */}
            </li>

            <li className="features-card">
              {/* <a href="#" className="features-card"> */}

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
              {/* <a href="#" className="features-card"> */}

                <div className="card-icon">
                  <ion-icon name="home-outline"></ion-icon>
                </div>

                <h3 className="card-title">Amplio espacio</h3>

                <div className="card-btn">
                  <ion-icon name="arrow-forward-outline"></ion-icon>
                </div>

              {/* </a> */}
            </li>

            <li className="features-card">
              {/* <a href="#" className="features-card"> */}

                <div className="card-icon">
                  <ion-icon name="football-outline"></ion-icon>
                </div>

                <h3 className="card-title">Espacios de juego</h3>

                <div className="card-btn">
                  <ion-icon name="arrow-forward-outline"></ion-icon>
                </div>

              {/* </a> */}
            </li>

          </ul>

        </div>
      </section>
      <footer className="footer">

<div className="footer-top">
  <div className="container">

    <div className="footer-brand">

      <a href="#" className="logo">
        <span>Vacations Rentals CR</span>
      </a>

      <p className="section-text">
        Informacion De Contacto
      </p>

      <ul className="contact-list">

        <li>
          <a href="#" className="contact-link">
            <ion-icon name="location-outline"></ion-icon>

            <address>Liberia, Guanacaste, Costa Rica</address>
          </a>
        </li>

        <li>
          <a href="tel:+0123456789" className="contact-link">
            <ion-icon name="call-outline"></ion-icon>

            <span>+0123-456789</span>
          </a>
        </li>

        <li>
          <a href="mailto:contact@homeverse.com" className="contact-link">
            <ion-icon name="mail-outline"></ion-icon>

            <span>vacationsreantals@gmail.com</span>
          </a>
        </li>

      </ul>

      <ul className="social-list">

        <li>
          <a href="#" className="social-link">
            <ion-icon name="logo-facebook"></ion-icon>
          </a>
        </li>

        <li>
          <a href="#" className="social-link">
            <ion-icon name="logo-twitter"></ion-icon>
          </a>
        </li>

        <li>
          <a href="#" className="social-link">
            <ion-icon name="logo-linkedin"></ion-icon>
          </a>
        </li>

        <li>
          <a href="#" className="social-link">
            <ion-icon name="logo-youtube"></ion-icon>
          </a>
        </li>

      </ul>

    </div>

    <div className="footer-link-box">

      <ul className="footer-list">

        <li>
          <p className="footer-list-title">Empresa</p>
        </li>

        <li>
          <a href="#" className="footer-link">Acerca de</a>
        </li>

        <li>
          <a href="#" className="footer-link">Novedades</a>
        </li>

        <li>
          <a href="#" className="footer-link">Todas las propiedades</a>
        </li>

        <li>
          <a href="#" className="footer-link">Mapa de Localizacion</a>
        </li>

        <li>
          <a href="#" className="footer-link"></a>
        </li>

        <li>
          <a href="#" className="footer-link">Contactanos</a>
        </li>

      </ul>

      <ul className="footer-list">

        <li>
          <p className="footer-list-title">Servicios</p>
        </li>

        <li>
          <a href="#" className="footer-link">Order tracking</a>
        </li>

        <li>
          <a href="#" className="footer-link">Lista de favoritos</a>
        </li>

        <li>
          <a href="#" className="footer-link">Login</a>
        </li>

        <li>
          <a href="#" className="footer-link">Mi cuenta</a>
        </li>

        <li>
          <a href="#" className="footer-link">Terminos & Condiciones</a>
        </li>

        <li>
          <a href="#" className="footer-link">Ofertas</a>
        </li>

      </ul>

      <ul className="footer-list">

        <li>
          <p className="footer-list-title">Atencion al cliente</p>
        </li>

        <li>
          <a href="#" className="footer-link">Login</a>
        </li>

        <li>
          <a href="#" className="footer-link">Mi cuenta</a>
        </li>

        <li>
          <a href="#" className="footer-link">Lista de favoritos</a>
        </li>

        <li>
          <a href="#" className="footer-link">Order tracking</a>
        </li>

        <li>
          <a href="#" className="footer-link">FAQ</a>
        </li>

        <li>
          <a href="#" className="footer-link">Contact us</a>
        </li>

      </ul>

    </div>

  </div>
</div>

<div className="footer-bottom">
  <div className="container">

    <p className="copyright">
      &copy; 2022 <a href="#">VRCR</a>. Todos los derechos reservados
    </p>

  </div>
</div>

</footer>
  </main>
)}
        {/* {saleListings && saleListings.length > 0 && (
          <div className="m-2 mb-6">
            <h2 className="px-3 text-2xl mt-6 font-semibold">Places for sale</h2>
            <Link to="/category/sale">
              <p className="px-3 text-sm text-blue-600 hover:text-blue-800 transition duration-150 ease-in-out">
                Show more places for sale
              </p>
            </Link>
            <ul className="sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 ">
              {saleListings.map((listing) => (
                <ListingItem
                  key={listing.id}
                  listing={listing.data}
                  id={listing.id}
                />
              ))}
            </ul>
          </div>
        )} */}
      {/* </div>
    </div> */}
    </>
      );
    }