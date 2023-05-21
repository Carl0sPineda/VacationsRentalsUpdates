import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import Spinner from "../components/Spinner";
import { getAuth } from "firebase/auth";
import { v4 as uuidv4 } from "uuid";
import { serverTimestamp, doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useNavigate, useParams } from "react-router-dom";
import MapEdit from "../components/editMap";
import L from "leaflet";
import "leaflet-fullscreen/dist/leaflet.fullscreen.css";
import "leaflet/dist/leaflet.css";
import "leaflet-control-geocoder/dist/Control.Geocoder.css";
import "leaflet-control-geocoder";
import "leaflet-fullscreen";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, {
  EffectFade,
  Autoplay,
  Navigation,
  Pagination,
} from "swiper";
import Footer from "../components/Footer";

export default function EditListing() {
  const navigate = useNavigate();
  const auth = getAuth();
  const [geolocation, setGeolocation] = useState({
    lat: 10.36402678444531,
    lng: -85.3908877959475,
  });
  const [localizacionGuardada, setlocalizacionGuardada] = useState({
    lat: 10.36402678444531,
    lng: -85.3908877959475,
  });
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [listing, setListing] = useState(null);
  const params = useParams();
  let [selectedImage, setSelectedImage] = useState([]);
  const [editImages, setEditImages] = useState([]);
  const [listingLoaded, setListingLoaded] = useState(false);
  const [formData, setFormData] = useState({
    type: "rent",
    // name: "",
    idVisual: "",
    bedrooms: 1,
    bathroms: 1,
    // parking: false,
    // furnished: false,
    address: "",
    description: "",
    // offer: false,
    regularPrice: 0,
    highPrice: 0,
    premiunPrice: 0,
    // discountedPrice: 0,
    latitude: 0,
    longitude: 0,
    images: {},
    imgUrls: {},
  });

  const {
    type,
    // name,
    idVisual,
    bedrooms,
    bathroms,
    // parking,
    // furnished,
    address,
    description,
    // offer,
    regularPrice,
    highPrice,
    premiunPrice,
    // discountedPrice,
    latitude,
    longitude,
    images,
    imgUrls,
  } = formData;

  SwiperCore.use([Autoplay, Navigation, Pagination]);

  useEffect(() => {
    async function fetchListing() {
      const docRef = doc(db, "listings", params.listingId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        setListing(data);
        setFormData({ ...data });
        setlocalizacionGuardada({
          lat: data.geolocation.lat,
          lng: data.geolocation.lng,
        });
        setGeolocation({
          lat: data.geolocation.lat,
          lng: data.geolocation.lng,
        });
        // console.log(geolocation)
      } else {
        navigate("/");
        toast.error("Propiedad no existe");
      }
    }
    fetchListing();
  }, [navigate, params.listingId]);

  useEffect(() => {
    if (listing && listing.userRef !== auth.currentUser.uid) {
      toast.error("No puedes editar esto!");
      navigate("/");
    }
  }, [auth.currentUser.uid, listing, navigate]);

  function onChange(e) {
    let boolean = null;

    if (e.target.value === "true") {
      boolean = true;
    }
    if (e.target.value === "false") {
      boolean = false;
    }
    //files
    if (e.target.files) {
      //Used for preview the image before upload files[0]
      //   console.log(geolocation);
      let filesS = e.target.files;
      setSelectedImage(e.target.files);
      selectedImage = e.target.files;

      setFormData((prevState) => ({
        ...prevState,
        images: selectedImage,
      }));
    }
    //text/Boolean/Number
    if (!e.target.files) {
      setFormData((prevState) => ({
        ...prevState,
        [e.target.id]: boolean ?? e.target.value,
      }));
    }
  }
  function uploadMultipleFiles(e) {
    fileObj.push(setSelectedImage(e.target.files[0]));
    for (let i = 0; i < fileObj[0].length; i++) {
      fileArray.push(URL.createObjectURL(fileObj[0][i]));
    }
  }

  // This function will be triggered when the "Remove This Image" button is clicked
  const removeSelectedImage = () => {
    setSelectedImage();
  };

  async function onSubmit(e) {
    e.preventDefault();
    setLoading(true);

    if (images.length > 6) {
      setLoading(false);
      toast.error("Maximun 6 images are allowed");
      return;
    }

    async function storeImage(image) {
      return new Promise((resolve, reject) => {
        const storage = getStorage();
        const filename = `${auth.currentUser.uid}-${image.name}-${uuidv4()}`;
        const storageRef = ref(storage, filename);
        const uploadTask = uploadBytesResumable(storageRef, image);
        uploadTask.on(
          "state_changed",

          (snapshot) => {
            // Observe state change events such as progress, pause, and resume
            // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            //console.log('Upload is ' + progress + '% done');
            setProgress(progress);
            // switch (snapshot.state) {
            //     case 'paused':
            //         console.log('Upload is paused');
            //         break;
            //     case 'running':
            //         console.log('Upload is running');
            //         break;
            // }
          },
          (error) => {
            // Handle unsuccessful uploads
            reject(error);
          },
          () => {
            // Handle successful uploads on complete
            // For instance, get the download URL: https://firebasestorage.googleapis.com/...
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              resolve(downloadURL);
            });
          }
        );
      });
    }

    const imgUrls = await Promise.all(
      [...images].map((image) => storeImage(image))
    ).catch((error) => {
      setLoading(false);
      toast.error("Images not uploaded");
      return;
    });

    const formDataCopy = {
      ...formData,
      imgUrls,
      geolocation,
      timestamp: serverTimestamp(),
      userRef: auth.currentUser.uid,
    };

    delete formDataCopy.images;
    !formDataCopy.offer && delete formDataCopy.discountedPrice;
    delete formDataCopy.latitude;
    delete formDataCopy.longitude;
    // console.log("edit", formDataCopy);
    // console.log("images", imgUrls);
    const docRef = doc(db, "listings", params.listingId);
    await updateDoc(docRef, formDataCopy);
    setLoading(false);
    toast.success("Editada con exito!");
    navigate(`/category/${formDataCopy.type}/${docRef.id}`);
  }
  return (
    <>
      <main className="max-w-md px-2 mx-auto sm:max-w-lg md:max-w-xl lg:max-w-2xl xl:max-w-4xl">
        <h1 className="text-3xl text-center mt-6 font-bold">
          Formulario editar propiedades
        </h1>
        <form onSubmit={onSubmit}>
          <p className="text-lg mt-6 font-semibold">Dirección</p>
          <input
            type="text"
            id="address"
            value={address}
            onChange={onChange}
            placeholder="Ejm: Liberia, Guanacaste"
            maxLength="32"
            minLength="5"
            required
            className="w-full px-4 py-2 text-xl text-gray-700
                    bg-white border border-gray-300 rounded transition
                    duration-150 ease-in-out focus:text-gray-700
                    focus:bg-white focus:border-slate-600 mb-6"
          />

          <div>
            <p className="text-lg font-semibold">Código</p>
            <input
              type="text"
              id="idVisual"
              value={idVisual}
              onChange={onChange}
              required
              className="w-mid px-4 py-2 text-xl text-gray-700
                            bg-white border border-gray-300 rounded 
                            transition duration-150 ease-in-out
                            focus:text-gray-700 focus:bg-white 
                            focus:border-slate-600 text-center"
            />
          </div>

          <div className="flex space-x-6 mb-6 mt-5">
            <div>
              <p className="text-lg font-semibold">Camas</p>
              <input
                type="number"
                id="bedrooms"
                value={bedrooms}
                onChange={onChange}
                min="1"
                max="50"
                required
                className="w-full px-4 py-2 text-xl text-gray-700
                            bg-white border border-gray-300 rounded
                            transition duration-150 ease-in-out
                            focus:text-gray-700 focus:bg-white
                            focus:border-slate-600 text-center"
              />
            </div>

            <div>
              <p className="text-lg font-semibold">Baños</p>
              <input
                type="number"
                id="bathroms"
                value={bathroms}
                onChange={onChange}
                min="1"
                max="50"
                required
                className="w-full px-4 py-2 text-xl text-gray-700
                            bg-white border border-gray-300 rounded
                            transition duration-150 ease-in-out
                            focus:text-gray-700 focus:bg-white
                            focus:border-slate-600 text-center"
              />
            </div>
          </div>

          <p className="text-lg font-semibold">Descripción</p>
          <textarea
            type="text"
            id="description"
            value={description}
            onChange={onChange}
            required
            className="w-full h-[200px] px-4 py-2 text-xl text-gray-700
                    bg-white border border-gray-300 rounded transition
                    duration-150 ease-in-out focus:text-gray-700
                    focus:bg-white focus:border-slate-600 mb-6"
          />

          <div className="flex items-center mb-6">
            <div className="">
              <p className="text-lg font-semibold">Precio temporada baja</p>
              <div className="flex w-full justify-center items-center space-x-6">
                <input
                  type="number"
                  id="regularPrice"
                  value={regularPrice}
                  onChange={onChange}
                  min="50"
                  max="400000000"
                  required
                  className="w-full px-4
                                py-2 text-xl text-gray-700 bg-white border
                                border-gray-300 rounded transition duration-150
                                ease-in-out focus:text-gray-700 focus:bg-white
                                focus:border-slate-600 text-center"
                />
                {type === "rent" && (
                  <div className="">
                    <p
                      className="text-md w-full
                                    whitespace-nowrap"
                    >
                      $ / Noche
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center mb-6">
            <div className="">
              <p className="text-lg font-semibold">Precio temporada alta</p>
              <div className="flex w-full justify-center items-center space-x-6">
                <input
                  type="number"
                  id="highPrice"
                  value={highPrice}
                  onChange={onChange}
                  min="50"
                  max="400000000"
                  required
                  className="w-full px-4
                                py-2 text-xl text-gray-700 bg-white border
                                border-gray-300 rounded transition duration-150
                                ease-in-out focus:text-gray-700 focus:bg-white
                                focus:border-slate-600 text-center"
                />

                {type === "rent" && (
                  <div className="">
                    <p className="text-md w-full whitespace-nowrap">
                      $ / Noche
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center mb-6">
            <div className="">
              <p className="text-lg font-semibold">Precio temporada premiun</p>
              <div className="flex w-full justify-center items-center space-x-6">
                <input
                  type="number"
                  id="premiunPrice"
                  value={premiunPrice}
                  onChange={onChange}
                  min="50"
                  max="400000000"
                  required
                  className="w-full px-4
                                py-2 text-xl text-gray-700 bg-white border
                                border-gray-300 rounded transition duration-150
                                ease-in-out focus:text-gray-700 focus:bg-white
                                focus:border-slate-600 text-center"
                />

                {type === "rent" && (
                  <div className="">
                    <p className="text-md w-full whitespace-nowrap">
                      $ / Noche
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="mb-6">
            <p className="text-lg font-semibold">
              Ingrese las nuevas imagenes de la Propiedad
            </p>
            <p className="text-gray-600">La primera será la portada (max 6)</p>
            <input
              type="file"
              id="images"
              onChange={onChange}
              accept=".jpg,.png,.jpeg"
              multiple
              required
              className="w-full px-3 py-1.5 text-gray-700
                        bg-white border border-gray-300 rounded
                        transition duration-150 ease-in-out
                        focus:bg-white focus:border-slate-600"
            />
            <div
              className="form-group multi-preview md:w-[100%] lg:w-[94%] mt-3  mb-12 md:mb-6"
              style={{ display: "flex", flexWrap: "nowrap" }}
            >
              <ul className="has-scrollbar">
                {selectedImage &&
                  Array.from(selectedImage).map((image, index) => (
                    <img
                      className="rounded-2xl transition-transform duration-300 transform hover:scale-105 hover:shadow-lg"
                      key={index}
                      src={URL.createObjectURL(image)}
                      alt={`Image ${index}`}
                      style={{
                        maxWidth: "100%",
                        height: "220px",
                        marginRight: "10px",
                      }}
                    />
                  ))}
              </ul>
            </div>
          </div>

          <MapEdit
            geolocation={geolocation}
            setGeolocation={setGeolocation}
            localizacionGuardada={localizacionGuardada}
            //setFormData={setFormData}
          />
          {loading && (
            <div className="mt-1 mb-1">
              <span className="font-bold text-cyan-700 text-lg">
                Actualizando Datos... {progress}%
              </span>
              <progress
                className="bg-gray-300 w-full h-3 rounded-full overflow-hidden"
                value={progress}
                max="100"
              ></progress>
            </div>
          )}
          <button
            type="submit"
            className="mx-auto block mb-4 w-[300px] px-4 mt-4
            py-3 bg-green-600 text-white font-bold text-sm
            uppercase rounded shadow-md hover:bg-green-700
            hover:shadow-lg focus:bg-slate-700 focus:shadow-lg
            active:bg-green-800 active:shadow-lg transition
            duration-150 ease-in-out text-center"
          >
            Editar
          </button>
        </form>
      </main>
      <Footer />
    </>
  );
}
