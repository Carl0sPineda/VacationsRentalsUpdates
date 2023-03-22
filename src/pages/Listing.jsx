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
import { useState } from "react";
import { useEffect } from "react";
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
  FaShare,
  FaMapMarkerAlt,
  FaBed,
  FaBath,
  FaParking,
  FaChair,
  FaUserCircle
} from "react-icons/fa";
import { getAuth } from "firebase/auth";
import Contact from "../components/Contact";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import { toast } from "react-toastify";

export default function Listing() {
  const auth = getAuth();
  const newId = uuidv4();
  const params = useParams();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState("")
  const [comments, setComments] = useState([])
  const [shareLinkCopied, setShareLinkCopied] = useState(false);
  const [contactLandlord, setContactLandlord] = useState(false);
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
      toast.error("You need login in the webside for give a review")
    }
    console.log(params.listingId)
  }

  if (loading) {
    return <Spinner />;
  }

  return (
    <main>

      <div
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
      )}
      <div className="m-4 flex flex-col md:flex-row max-w-6xl lg:mx-auto p-4 rounded-lg shadow-lg bg-white lg:space-x-5">

        <div className="w-full  overflow-x-hidden mt-6 md:mt-0 md:ml-2">
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
                  className="relative w-full overflow-hidden h-[300px] md:h-[400px]"
                  style={{
                    background: `url(${listing.imgUrls[index]}) center no-repeat`,
                    backgroundSize: "cover",
                  }}
                ></div>
              </SwiperSlide>
            ))}

          </Swiper>
          <p className="text-2xl font-bold mb-3 text-blue-900">
            {listing.name} - ${" "}
            {listing.offer
              ? listing.discountedPrice
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              : listing.regularPrice
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
            {listing.type === "rent" ? " / month" : ""}
          </p>
          <p className="flex items-center mt-6 mb-3 font-semibold">
            <FaMapMarkerAlt className="text-green-700 mr-1" />
            {listing.address}
          </p>
          <div className="flex justify-start items-center space-x-4 w-[75%]">
            <p className='bg-red-800 w-full max-w-[200px]
              rounded-md p-1 text-white text-center 
              font-semibold shadow-md'> {listing.type === "rent" ? "Rent" : "Sale"} </p>
            {listing.offer && (
              <p className="w-full max-w-[200px] bg-green-800 rounded-md p-1 text-white text-center font-semibold shadow-md">
                ${+listing.regularPrice - +listing.discountedPrice} discount
              </p>
            )}
          </div>
          <p className="mt-3 mb-3">
            <span className="font-semibold">Description - </span>
            {listing.description}
          </p>
          <ul className="flex items-center space-x-2 sm:space-x-10 text-sm font-semibold mb-6">
            <li className="flex items-center whitespace-nowrap">
              <FaBed className="text-lg mr-1" />
              {+listing.bedrooms > 1 ? `${listing.bedrooms} Beds` : "1 Bed"}
            </li>
            <li className="flex items-center whitespace-nowrap">
              <FaBath className="text-lg mr-1" />
              {+listing.bathrooms > 1 ? `${listing.bathrooms} Baths` : "1 Bath"}
            </li>
            <li className="flex items-center whitespace-nowrap">
              <FaParking className="text-lg mr-1" />
              {listing.parking ? "Parking spot" : "No parking"}
            </li>
            <li className="flex items-center whitespace-nowrap">
              <FaChair className="text-lg mr-1" />
              {listing.furnished ? "Furnished" : "Not furnished"}
            </li>
          </ul>
          {listing.userRef !== auth.currentUser?.uid && !contactLandlord && (
            <div className="mt-6">
              <button
                onClick={() => setContactLandlord(true)}
                className="px-7 py-3 bg-blue-600 text-white font-medium text-sm uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg w-full text-center transition duration-150 ease-in-out "
              >
                Contact Landlord
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
              placeholder="Enter your comment..."
            />
            <button
              type="submit"
              onClick={sendComment}
              disabled={!comment.trim()}
              className="text-blue-400 font-bold disabled:text-blue-200"
            >
              Reviews
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
        <div className="w-full h-[200px] md:h-[600px] z-10 overflow-x-hidden mt-6 md:mt-0 md:ml-2">
          <MapContainer
            center={[listing.geolocation.lat, listing.geolocation.lng]}
            zoom={13}
            scrollWheelZoom={false}
            style={{ height: '100%', width: '100%' }}
            attributionControl={false}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
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