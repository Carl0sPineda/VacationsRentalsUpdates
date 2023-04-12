import Moment from "react-moment";
import {
  doc,
  getDoc,
  addDoc,
  collection,
  serverTimestamp,
  onSnapshot,
  orderBy,
  query
} from "firebase/firestore";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Spinner from "../components/Spinner";
import { db } from "../firebase";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, {
  EffectFade,
  Autoplay,
  Navigation,
  Pagination,
} from "swiper";
import { v4 as uuidv4 } from 'uuid'
import "swiper/css/bundle";
import {
  // FaShare,
  FaMapMarkerAlt,
  FaBed,
  FaBath,
  // FaParking,
  // FaChair,
  FaUserCircle
} from "react-icons/fa";
import { getAuth } from "firebase/auth";
import Contact from "../components/Contact";
import { MapContainer, Marker, Popup, TileLayer, LayersControl } from "react-leaflet";
import { toast } from "react-toastify";
import 'leaflet-fullscreen';
import "leaflet-fullscreen/dist/leaflet.fullscreen.css"; 

export default function Listing() {
  const auth = getAuth();
  const newId = uuidv4();
  const params = useParams();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState("")
  const [comments, setComments] = useState([])
  // const [shareLinkCopied, setShareLinkCopied] = useState(false);
  const [contactLandlord, setContactLandlord] = useState(false);
  const [expanded, setExpanded] = useState(false)
  const MAX_CHARACTERS = 200;
  const { BaseLayer } = LayersControl;

  SwiperCore.use([Autoplay, Navigation, Pagination]);

  useEffect(() => {
    async function fetchListing() {
      const docRef = doc(db, "listings", params.listingId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setListing(docSnap.data());
        setLoading(false);
      }
    }
    fetchListing();
  }, [params.listingId]);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(
        collection(db, "listings", params.listingId, "comments"),
        orderBy("timestamp", "desc")
      ),
      (snapshot) => {
        setComments(snapshot.docs);
      }
    );
  }, [db, params.listingId]);

  const sendComment = async (e) => {
    e.preventDefault("")

    const commentToSend = comment
    setComment("")
    try {
      await addDoc(collection(db, "listings", params.listingId, "comments"), {
        id: newId,
        comment: commentToSend,
        name: auth.currentUser.displayName,
        timestamp: serverTimestamp(),
      });
    } catch (error) {
      toast.error("Inicia sesión para realizar un comentario")
    }
    console.log(params.listingId)
  }

  if (loading) {
    return <Spinner />;
  }

  return (
    <main>

      {/* <div
        className="fixed top-[13%] right-[3%] z-10 bg-white cursor-pointer border-2 border-gray-400 rounded-full w-12 h-12 flex justify-center items-center"
        onClick={() => {
          navigator.clipboard.writeText(window.location.href);
          setShareLinkCopied(true);
          setTimeout(() => {
            setShareLinkCopied(false);
          }, 2000);
        }}
      >
        <FaShare className="text-lg text-slate-500" />
      </div>
      {shareLinkCopied && (
        <p className="fixed top-[23%] right-[5%] font-semibold border-2 border-gray-400 rounded-md bg-white z-10 p-2">
          Link Copied
        </p>
      )} */}
      <div className="m-4 flex flex-col md:flex-row max-w-7xl lg:mx-auto p-4 rounded-lg shadow-lg bg-white lg:space-x-3">

        <div className="w-full overflow-x-hidden mt-6 md:mt-0 md:ml-2">
          <Swiper
            slidesPerView={1}
            navigation
            pagination={{ type: "progressbar" }}
            effect="fade"
            modules={[EffectFade]}
          // autoplay={{ delay: 3000 }}
          >
            {listing.imgUrls.map((url, index) => (
              <SwiperSlide
                key={index}>
                <div
                  className="relative w-full overflow-hidden h-[400px] md:h-[400px]"
                  style={{
                    background: `url(${listing.imgUrls[index]}) center no-repeat`,
                    backgroundSize: "cover",
                  }}
                ></div>
              </SwiperSlide>
            ))}

          </Swiper>
          <p className="text-2xl font-bold mt-2 mb-3 text-slate-900">
            Tarifa ${listing.regularPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
            {/* Tarifa temporada alta ${listing.highPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}<br />
            Tarifa temporada premiun ${listing.premiunPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} */}
            {listing.type === "rent" ? " / noche" : ""}
          </p>
          <p className="flex items-center mt-6 mb-3 font-semibold">
            <FaMapMarkerAlt className="text-green-700 mr-1" />
            {listing.address}
          </p>
          <div className="flex justify-start items-center space-x-4 w-[75%]">
            <p className='bg-red-800 w-full max-w-[200px]
              rounded-md p-1 text-white text-center 
              font-semibold shadow-md'> {listing.type === "rent" ? "Se renta" : "Sale"} </p>
            {/* {listing.offer && (
              <p className="w-full max-w-[200px] bg-green-800 rounded-md p-1 text-white text-center font-semibold shadow-md">
                ${+listing.regularPrice - +listing.discountedPrice} discount
              </p>
            )} */}
          </div>
          <p className="mt-3 mb-3">
            <span className="font-semibold">Descripción:</span>
            {/* Utiliza el método slice para mostrar solo una cantidad limitada de caracteres */}
            {expanded ? listing.description : listing.description.length > MAX_CHARACTERS ? listing.description.slice(0, MAX_CHARACTERS) + "..." : listing.description}
            {/* Agrega un botón para mostrar el resto de la descripción */}
            {listing.description.length > MAX_CHARACTERS && !expanded && (
              <button className="text-blue-600" onClick={() => setExpanded(true)}>Ver más</button>
            )}
            {/* Agrega un botón para ocultar el resto de la descripción */}
            {expanded && (
              <button className="text-blue-600" onClick={() => setExpanded(false)}>Ver menos</button>
            )}
          </p>
          <ul className="flex items-center space-x-2 sm:space-x-10 text-sm font-semibold mb-6">
            <li className="flex items-center whitespace-nowrap">
              <FaBed className="text-lg mr-1" />
              {+listing.bedrooms > 1 ? `${listing.bedrooms} Habitaciones` : "1 Habitación"}
            </li>
            <li className="flex items-center whitespace-nowrap">
              <FaBath className="text-lg mr-1" />
              {+listing.bathroms > 1 ? `${listing.bathroms} Baños` : "1 Baño"}
            </li>
            {/* <li className="flex items-center whitespace-nowrap">
              <FaParking className="text-lg mr-1" />
              {listing.parking ? "Parking spot" : "No parking"}
            </li>
            <li className="flex items-center whitespace-nowrap">
              <FaChair className="text-lg mr-1" />
              {listing.furnished ? "Furnished" : "Not furnished"}
            </li> */}
          </ul>
          {listing.userRef !== auth.currentUser?.uid && !contactLandlord && (
            <div className="mt-6">
              <button
                onClick={() => setContactLandlord(true)}
                className="px-7 py-3 bg-slate-900 text-white font-medium text-sm uppercase rounded shadow-md hover:bg-slate-700 hover:shadow-lg focus:bg-slate-700 focus:shadow-lg w-full text-center transition duration-150 ease-in-out "
              >
                Contacto
              </button>
            </div>
          )}
          {contactLandlord && (
            <Contact userRef={listing.userRef} listing={listing} />
          )}

          <form className="flex items-center p-4">
            <input
              value={comment}
              onChange={(event) => setComment(event.target.value)}
              className="border-none flex-1 focus:ring-0"
              type="text"
              placeholder="Ingrese un comentario..."
            />
            <button
              type="submit"
              onClick={sendComment}
              disabled={!comment.trim()}
              className="text-blue-400 font-bold disabled:text-blue-200"
            >
              Enviar
            </button>
          </form>

          <div className="mx-5 max-h-80 overflow-y-scroll scrollbar-none">
            {comments.map((comment) => (
              <div key={comment.data().id} className="mb-4 p-2 bg-gray-100 rounded flex">
                <FaUserCircle className="h-7 text-black rounded-full object-cover" />
                <div className="flex-1 ml-2">
                  <p className="font-semibold">{comment.data().name}</p>
                  <p className="text-gray-600">
                    <Moment fromNow>{comment.data().timestamp?.toDate()}</Moment>
                  </p>
                  <p className="text-gray-700">{comment.data().comment}</p>
                </div>
              </div>
            ))}
          </div>

        </div>
        <div className="w-full h-[400px] md:h-[600px] z-10 overflow-x-hidden mt-6 md:mt-0 md:ml-2">
          <MapContainer
            center={[listing.geolocation.lat, listing.geolocation.lng]}
            zoom={15}
            // scrollWheelZoom={false}
            style={{ height: '100%', width: '100%' }}
            attributionControl={false}
            fullscreenControl={{
              position: 'topleft'
            }}>
              
            {/* <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            /> */}
            <LayersControl position="topright">
        <BaseLayer checked name="Por defecto">
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
        </BaseLayer>
        <BaseLayer name="Satellite">
          <TileLayer
            attribution="Tiles &copy; Esri"
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          />
        </BaseLayer>
      </LayersControl>
            <Marker
              position={[listing.geolocation.lat, listing.geolocation.lng]}
            >
              <Popup>
                {listing.address}
              </Popup>
            </Marker>
          </MapContainer>
        </div>
      </div>

    </main>
  );
}